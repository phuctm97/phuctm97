import type { PolicyStatement } from "aws-cdk-lib/aws-iam";
import type { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import type { MetricFilter, MetricFilterProps } from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";

import { Policy } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { pascalCase } from "pascal-case";
import path from "path";

export type FunctionType = "FUNCTION" | "HANDLER";

export type FunctionProps = Pick<
  NodejsFunctionProps,
  "timeout" | "memorySize"
> &
  Pick<
    NonNullable<NodejsFunctionProps["bundling"]>,
    "externalModules" | "nodeModules"
  > & { type?: FunctionType };

export class Function extends NodejsFunction {
  static resolveName(name: string, type: FunctionType): string {
    return `${pascalCase(name)}${type === "HANDLER" ? "Handler" : "Function"}`;
  }

  static resolvePath(
    name: string,
    type: FunctionType,
    ...pathSegments: string[]
  ): string {
    return path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      type === "HANDLER" ? "handlers" : "functions",
      name,
      ...pathSegments
    );
  }

  private inlinePolicy: Policy | undefined;

  constructor(
    scope: Construct,
    name: string,
    { type = "FUNCTION", externalModules, nodeModules, ...props }: FunctionProps
  ) {
    super(scope, Function.resolveName(name, type), {
      ...props,
      runtime: Runtime.NODEJS_18_X,
      entry: Function.resolvePath(name, type, "index.ts"),
      bundling: {
        tsconfig: Function.resolvePath(name, type, "tsconfig.json"),
        minify: true,
        sourceMap: true,
        sourcesContent: false,
        externalModules,
        nodeModules,
      },
      logRetention: RetentionDays.ONE_WEEK,
    });
    this.addEnvironment("NODE_OPTIONS", "--enable-source-maps");
  }

  addToInlinePolicy(...statements: PolicyStatement[]): void {
    // Avoid CDK circular reference issue https://github.com/aws/aws-cdk/issues/7016
    if (!this.role) throw new Error("Couldn't attach inline policy.");
    if (!this.inlinePolicy) {
      this.inlinePolicy = new Policy(this, "Policy", { statements });
      this.role.attachInlinePolicy(this.inlinePolicy);
    } else this.inlinePolicy.addStatements(...statements);
  }

  addMetricFilter(
    name: string,
    props: Omit<MetricFilterProps, "metricName" | "logGroup">
  ): MetricFilter {
    return this.logGroup.addMetricFilter(`${pascalCase(name)}MetricFilter`, {
      metricName: `${this.functionName}${name}`,
      ...props,
    });
  }
}

export function functions<T extends string>(
  scope: Construct,
  records: Record<T, FunctionProps>,
  type?: FunctionType
): Record<T, Function> {
  return Object.fromEntries(
    Object.entries(records).map(([name, props]) => [
      name,
      new Function(scope, name, { type, ...(props as FunctionProps) }),
    ])
  ) as Record<T, Function>;
}

export function handlers<T extends string>(
  scope: Construct,
  records: Record<T, FunctionProps>
): Record<T, Function> {
  return functions(scope, records, "HANDLER");
}
