import type { Construct } from "constructs";

import { CfnOutput, CfnResource, RemovalPolicy } from "aws-cdk-lib";

export function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}.`);
  return value;
}

export type CfnResourceClass = typeof CfnResource.prototype.constructor & {
  readonly CFN_RESOURCE_TYPE_NAME: string;
};

export function is<T extends CfnResourceClass>(
  construct: Construct,
  resourceClass: T
): boolean {
  if (CfnResource.isCfnResource(construct))
    return construct.cfnResourceType === resourceClass.CFN_RESOURCE_TYPE_NAME;
  const resource = construct.node.tryFindChild("Resource");
  return (
    !!resource &&
    CfnResource.isCfnResource(resource) &&
    resource.cfnResourceType === resourceClass.CFN_RESOURCE_TYPE_NAME
  );
}

export function outputs(
  scope: Construct,
  records: Record<string, string>
): void {
  for (const name in records)
    new CfnOutput(scope, name, { value: records[name] ?? "" });
}

export function batchApplyRemovalPolicy(
  removalPolicy: RemovalPolicy,
  ...constructs: Construct[]
): void {
  for (const construct of constructs)
    if (CfnResource.isCfnResource(construct))
      construct.applyRemovalPolicy(removalPolicy);
    else {
      const resource = construct.node.tryFindChild("Resource");
      if (resource && CfnResource.isCfnResource(resource))
        resource.applyRemovalPolicy(removalPolicy);
    }
}

export function destroyOnRemoval(...constructs: Construct[]): void {
  batchApplyRemovalPolicy(RemovalPolicy.DESTROY, ...constructs);
}

export function retainOnRemoval(...constructs: Construct[]): void {
  batchApplyRemovalPolicy(RemovalPolicy.RETAIN, ...constructs);
}

export function snapshotOnRemoval(...constructs: Construct[]): void {
  batchApplyRemovalPolicy(RemovalPolicy.SNAPSHOT, ...constructs);
}
