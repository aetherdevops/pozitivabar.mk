import { HomePage } from "@/components/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("mk", "home");

export default function Page() {
  return <HomePage lang="mk" />;
}
