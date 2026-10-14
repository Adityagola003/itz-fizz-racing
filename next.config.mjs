/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

// GitHub Actions automatically provides GITHUB_REPOSITORY (e.g. "username/itz-fizz-racing")
let repoBasePath = "";
if (process.env.GITHUB_REPOSITORY) {
  const repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
  repoBasePath = repoName.endsWith(".github.io") ? "" : `/${repoName}`;
} else if (isProd) {
  repoBasePath = "/itz-fizz-racing";
}

const nextConfig = {
  output: "export",
  basePath: repoBasePath,
  assetPrefix: repoBasePath ? `${repoBasePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  devIndicators: false, // removes the floating "N" Next.js dev overlay
};

export default nextConfig;
