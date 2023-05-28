declare namespace NodeJS {
  export interface ProcessEnv {
    APP_AWS_REGION: string;
    APP_AWS_ACCESS_KEY_ID: string;
    APP_AWS_SECRET_ACCESS_KEY: string;
    S3_ARCHIVE_BUCKET_NAME: string;
  }
}
