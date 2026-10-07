import { COPY } from "@/content/copy";
import type { Lang } from "@/lib/i18n";
import { barSchema, faqSchema, graph, webPageSchema, websiteSchema } from "@/lib/schema";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Faq } from "./home/Faq";
import { Gallery } from "./home/Gallery";
import { Hero } from "./home/Hero";
import { Loyalty } from "./home/Loyalty";
import { Marquee } from "./home/Marquee";
import { Shifts } from "./home/Shifts";
import { Signature } from "./home/Signature";
import { Visit } from "./home/Visit";
import { Wall } from "./home/Wall";
import { Words } from "./home/Words";
import { JsonLd } from "./JsonLd";
import { RevealObserver } from "./ui/RevealObserver";

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <Header lang={lang} page="home" />
      <main id="main">
        <Hero lang={lang} />
        <Marquee items={COPY[lang].marquee} />
        <Shifts lang={lang} />
        <Signature lang={lang} />
        <Loyalty lang={lang} />
        <Wall lang={lang} />
        <Words lang={lang} />
        <Gallery lang={lang} />
        <Visit lang={lang} />
        <Faq lang={lang} />
      </main>
      <Footer lang={lang} page="home" />
      <RevealObserver />
      <JsonLd data={graph(barSchema(lang), websiteSchema(), webPageSchema(lang, "home"), faqSchema(lang))} />
    </>
  );
}
