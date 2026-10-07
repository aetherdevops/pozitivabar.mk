import { InstagramLogo } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import type { Lang } from "@/lib/i18n";
import { LoopVideo } from "../ui/LoopVideo";
import { Photo } from "../ui/Photo";

export function Wall({ lang }: { lang: Lang }) {
  const c = COPY[lang].wall;
  return (
    <section aria-labelledby="wall-title" className="section-y cv-auto relative overflow-hidden">
      <div className="container-pz grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="reveal relative mx-auto w-full max-w-[28rem] lg:col-span-5 lg:mx-0">
          <div className="arch-wrap">
            <div className="arch relative aspect-[2/3] bg-sunk shadow-[var(--pz-shadow)]">
              <Photo
                name="wall-mural"
                alt={c.alt}
                sizes="(min-width: 1024px) 28rem, 90vw"
                imgClassName="absolute inset-0 h-full w-full object-cover object-[30%_50%]"
              />
            </div>
          </div>
          <figure className="absolute -bottom-8 -right-2 w-36 sm:-right-10 sm:w-44">
            <div className="relative aspect-square overflow-hidden rounded-full shadow-[var(--pz-shadow)] ring-4 ring-bg">
              <LoopVideo
                src="/video/walkthrough.mp4"
                poster="/video/walkthrough-poster.webp"
                width={480}
                height={600}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-2 text-center font-serif text-base italic text-ink-soft">{c.peek}</figcaption>
          </figure>
        </div>

        <div className="reveal lg:col-span-6 lg:col-start-7" style={{ "--d": 1 } as React.CSSProperties}>
          <p className="text-kicker text-gold-ink">{c.kicker}</p>
          <h2 id="wall-title" className="text-h1 mt-4">
            {c.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{c.body}</p>
          <a href={SITE.instagram} target="_blank" rel="noopener" className="btn btn-ghost mt-9">
            <InstagramLogo aria-hidden weight="bold" className="size-5" />
            {c.cta}
            <span className="sr-only">{COPY[lang].a11y.newTab}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
