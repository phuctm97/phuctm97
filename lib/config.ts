export function getCurrentURL(path = "/"): URL {
  return new URL(
    path,
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" &&
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
        : "http://localhost:43815",
  );
}
