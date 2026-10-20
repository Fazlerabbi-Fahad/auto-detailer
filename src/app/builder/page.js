import Builder from "./Builder";

export const metadata = {
  title: "Link builder",
  robots: { index: false, follow: false },
};

export default function BuilderPage() {
  return <Builder />;
}
