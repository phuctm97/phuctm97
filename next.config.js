/** @type {import('next').NextConfig} */
export default {
  compiler: { styledComponents: true },
  eslint: { dirs: ["."] },
  experimental: {
    serverComponentsExternalPackages: ["grammy"],
  },
};
