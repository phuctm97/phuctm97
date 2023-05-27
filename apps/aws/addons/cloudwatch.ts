import type { IFunction } from "aws-cdk-lib/aws-lambda";

import { ConcreteWidget } from "aws-cdk-lib/aws-cloudwatch";

export const billingServiceNames = {
  AmazonCognito: "Cognito",
  AWSQueueService: "SQS",
  AmazonDynamoDB: "DynamoDB",
  AmazonS3: "S3",
  AmazonCloudFront: "CloudFront",
  AmazonSNS: "SNS",
  AWSLambda: "Lambda",
  AmazonStates: "Step Functions",
  awskms: "KMS",
  AmazonWorkDocs: "WorkDocs",
  AmazonWorkSpaces: "WorkSpaces",
  AWSSystemsManager: "Systems Manager",
  AWSServiceCatalog: "Service Catalog",
  AmazonCloudWatch: "CloudWatch",
  AWSDataTransfer: "Data Transfer",
};

export interface CustomWidgetProps {
  readonly title?: string;
  readonly width: number;
  readonly height: number;
  readonly function: IFunction;
  readonly params?: Record<string, unknown>;
  readonly updateOn?: {
    refresh?: boolean;
    resize?: boolean;
    timeRange?: boolean;
  };
}

export class CustomWidget extends ConcreteWidget {
  private readonly title?: string;
  private readonly endpoint: string;
  private readonly params: CustomWidgetProps["params"];
  private readonly updateOn: CustomWidgetProps["updateOn"];

  constructor(props: CustomWidgetProps) {
    super(props.width, props.height);
    this.title = props.title;
    this.endpoint = props.function.functionArn;
    this.params = props.params;
    this.updateOn = props.updateOn;
  }

  public toJson(): object[] {
    return [
      {
        type: "custom",
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y,
        properties: {
          title: this.title,
          endpoint: this.endpoint,
          params: this.params,
          updateOn: this.updateOn,
        },
      },
    ];
  }
}
