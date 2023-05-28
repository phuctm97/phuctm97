/** @type {import('next').NextConfig} */
const config = {
  eslint: { ignoreDuringBuilds: true },
  rewrites: () => ({
    beforeFiles: [
      {
        has: [{ type: "host", value: "blog.phuctm97.com" }],
        source: "/:path*",
        destination: "/blog/:path*",
      },
    ],
  }),
};

module.exports = config;
