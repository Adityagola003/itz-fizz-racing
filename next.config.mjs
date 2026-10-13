/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/itz-fizz-racing" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/itz-fizz-racing/" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  devIndicators: false, // removes the floating "N" Next.js dev overlay
};

export default nextConfig;
