import { MenuPage } from "@/components/menu/MenuPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("mk", "menu");

export default function Page() {
  return <MenuPage lang="mk" />;
}
