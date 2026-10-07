import "../globals.css";
import { fontVars } from "@/lib/fonts";
import { viewport as baseViewport } from "@/lib/seo";
import { THEME_SCRIPT } from "@/lib/themeScript";

export const viewport = baseViewport;

// Root layout for the Macedonian site (/, /menu/). The English site has its own root layout in app/en.
export default function MkLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mk" data-theme="day" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
