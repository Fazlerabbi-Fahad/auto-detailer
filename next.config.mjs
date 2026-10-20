/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ["image/avif", "image/webp"], qualities: [60, 75] },
  // Put <title>, robots and Open Graph tags in <head> for every user agent (no streamed metadata),
  // so link-preview crawlers and search engines always see noindex and the personalized title.
  htmlLimitedBots: /.*/,
  experimental: { inlineCss: true },
  outputFileTracingIncludes: { "/og": ["./src/fonts/*.ttf"] },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};
export default nextConfig;
