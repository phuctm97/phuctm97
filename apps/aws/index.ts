import type { AppProps, StackProps } from "aws-cdk-lib";

import { App, Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

import * as addons from "./addons";

class MyStack extends Stack {
  constructor(app: App, id: string, props?: StackProps) {
    super(app, id, props);

    const archiveBucket = new s3.Bucket(this, "ArchiveBucket");

    const vercelUser = new iam.User(this, "VercelUser");
    archiveBucket.grantReadWrite(vercelUser, "blog/*");

    addons.cfn.outputs(this, {
      ArchiveBucketName: archiveBucket.bucketName,
    });

    addons.cfn.destroyOnRemoval(
      ...this.node.children.filter(
        (child) => !addons.cfn.is(child, lambda.CfnFunction)
      )
    );
  }
}

class MyApp extends App {
  constructor(props?: AppProps) {
    super(props);

    new MyStack(this, "Phuctm97", { description: "https://phuctm97.com" });
  }
}

new MyApp();
