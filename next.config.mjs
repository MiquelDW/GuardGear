/** @type {import('next').NextConfig} */
const nextConfig = {
  // use this configuration to whitelist images from external sources in your app
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
