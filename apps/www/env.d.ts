declare namespace NodeJS {
  export interface ProcessEnv {
    AWS_DEFAULT_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    S3_ARCHIVE_BUCKET_NAME: string;
  }
}
