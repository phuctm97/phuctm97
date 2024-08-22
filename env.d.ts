declare namespace NodeJS {
  interface ProcessEnv {
    LEMON_SQUEEZY_STORE_ID: string;
    LEMON_SQUEEZY_ONE_TIME_VARIANT_ID: string;
    LEMON_SQUEEZY_API_KEY: string;
    LEMON_SQUEEZY_WEBHOOK_SIGNING_SECRET: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_GROUP_ID: string;
    TELEGRAM_WEBHOOK_SECRET_TOKEN: string;
    TELEGRAM_BOT_ID: string;
  }
}
