import { MenuPage } from "@/components/menu/MenuPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "menu");

export default function Page() {
  return <MenuPage lang="en" />;
}
