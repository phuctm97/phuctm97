import { IdentityPool } from "@aws-cdk/aws-cognito-identitypool-alpha";
import { FederatedPrincipal } from "aws-cdk-lib/aws-iam";

// @ts-expect-error Override default grant principal to add session tags
// • How to use Cognito's attributes for access controls: https://docs.aws.amazon.com/cognito/latest/developerguide/using-attributes-for-access-control-policy-example.html
// • Where to find default implementation: https://github.com/aws/aws-cdk/blob/main/packages/@aws-cdk/aws-cognito-identitypool/lib/identitypool.ts
IdentityPool.prototype.configureDefaultGrantPrincipal = function (
  type: string
) {
  const principal = new FederatedPrincipal(
    "cognito-identity.amazonaws.com",
    {
      StringEquals: {
        "cognito-identity.amazonaws.com:aud": this.identityPoolId,
      },
      "ForAnyValue:StringLike": {
        "cognito-identity.amazonaws.com:amr": type,
      },
    },
    "sts:AssumeRoleWithWebIdentity"
  );
  return type === "authenticated" ? principal.withSessionTags() : principal;
};

export * from "@aws-cdk/aws-cognito-identitypool-alpha";
