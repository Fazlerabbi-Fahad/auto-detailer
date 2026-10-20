import Site from "@/components/Site";
import { getBusiness } from "@/lib/personalize";
import { buildMetadata } from "@/lib/meta";

export async function generateMetadata({ searchParams }) {
  return buildMetadata(getBusiness(await searchParams));
}

export default async function Page({ searchParams }) {
  return <Site biz={getBusiness(await searchParams)} />;
}
