import Site from "@/components/Site";
import { getProspect } from "@/lib/personalize";
import { buildMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildMetadata(getProspect(slug));
}

export default async function ProspectPage({ params }) {
  const { slug } = await params;
  // Unknown slugs fall back to the defaults instead of a 404.
  return <Site biz={getProspect(slug)} />;
}
