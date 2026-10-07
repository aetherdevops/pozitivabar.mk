import "../globals.css";
import { fontVars } from "@/lib/fonts";
import { viewport as baseViewport } from "@/lib/seo";
import { THEME_SCRIPT } from "@/lib/themeScript";

export const viewport = baseViewport;

// Root layout for the English site (/en/, /en/menu/).
export default function EnLayout({ children }: LayoutProps<"/en">) {
  return (
    <html lang="en" data-theme="day" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
