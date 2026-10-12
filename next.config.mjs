/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/itz-fizz-racing" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/itz-fizz-racing/" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
