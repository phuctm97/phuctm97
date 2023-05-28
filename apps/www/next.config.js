/** @type {import('next').NextConfig} */
const config = {
  eslint: { ignoreDuringBuilds: true },
  redirects: () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "blog.phuctm97.com" }],
      destination: "https://www.phuctm97.com/blog/:path*",
      permanent: true,
    },
  ],
};

module.exports = config;
