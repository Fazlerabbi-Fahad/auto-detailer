import { headers } from "next/headers";
import { toQuery } from "./personalize";

async function baseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3001";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return new URL(`${proto}://${host}`);
}

export function pageTitle(biz) {
  return biz.hasCity ? `${biz.name} | Mobile Detailing in ${biz.cityState}` : `${biz.name} | Mobile Detailing`;
}

export async function buildMetadata(biz) {
  const title = pageTitle(biz);
  const where = biz.hasCity ? biz.cityState : "your area";
  const description = `${biz.name} brings showroom-quality car detailing to your driveway in ${where}. See packages and prices, then book in under a minute.`;
  const q = toQuery(biz);
  const og = `/og${q ? `?${q}` : ""}`;
  return {
    metadataBase: await baseUrl(),
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: biz.name,
      images: [{ url: og, width: 1200, height: 630, alt: `${biz.name}, mobile detailing in ${where}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}
