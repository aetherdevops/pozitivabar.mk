import { ArrowRight } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { SIGNATURE } from "@/content/menu";
import { currency, paths, type Lang } from "@/lib/i18n";
import { hasPhoto, Photo } from "../ui/Photo";
import { Sparkle } from "./Decor";
import { TiltCard } from "./TiltCard";

/** 70s-poster art for a cocktail: a low sun behind concentric arch bands in the drink's colours. */
function PosterArt({ hue, seed }: { hue: readonly [string, string, string]; seed: number }) {
  const bands = [150, 118, 86, 54];
  const colors = [hue[2], hue[1], hue[0], hue[2]];
  const sunX = 150 + (seed % 2 ? 34 : -30);
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="300" height="400" fill={hue[0]} />
      <rect width="300" height="400" fill={`url(#pz-sky-${seed})`} />
      <defs>
        <linearGradient id={`pz-sky-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle
        cx={sunX}
        cy="150"
        r="58"
        fill={hue[1]}
        className="origin-center transition-transform duration-700 group-hover/card:-translate-y-3"
      />
      {bands.map((r, k) => {
        const top = 400 - (r * 1.55 + 20);
        return (
          <path
            key={k}
            d={`M${150 - r} 400V${top + r}A${r} ${r} 0 0 1 ${150 + r} ${top + r}V400Z`}
            fill={colors[k]}
            className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover/card:-translate-y-2"
            style={{ transitionDelay: `${k * 50}ms` }}
          />
        );
      })}
    </svg>
  );
}

export function Signature({ lang }: { lang: Lang }) {
  const c = COPY[lang].signature;
  return (
    <section
      id="signature"
      aria-labelledby="signature-title"
      className="section-y cv-auto relative overflow-hidden pt-8 lg:pt-12"
    >
      <div className="container-pz">
        <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-kicker text-gold-ink">{c.kicker}</p>
            <h2 id="signature-title" className="text-h2 mt-4">
              {c.title}
            </h2>
            <p className="text-lede mt-4 text-ink-soft">{c.sub}</p>
          </div>
          <a href={`${paths.menu(lang)}#signature`} className="btn btn-ghost w-max">
            {c.link}
            <ArrowRight aria-hidden weight="bold" className="btn-arrow size-5" />
          </a>
        </div>
      </div>

      <ul className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:container-pz md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-5 [&::-webkit-scrollbar]:hidden">
        {SIGNATURE.map((d, i) => {
          const photo = `cocktail-${d.id}`;
          return (
            <li
              key={d.id}
              className="reveal w-[72vw] max-w-[19rem] shrink-0 snap-center md:w-auto md:max-w-none"
              style={{ "--d": i } as React.CSSProperties}
            >
              <TiltCard>
                <article className="group/card flex h-full flex-col">
                  <div className="arch-wrap">
                    <div className="arch relative aspect-[3/4] shadow-[var(--pz-shadow)]">
                      {hasPhoto(photo) ? (
                        <Photo
                          name={photo}
                          alt={d.name[lang]}
                          sizes="(min-width: 1280px) 14rem, (min-width: 768px) 30vw, 72vw"
                          imgClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                        />
                      ) : d.id === "drunk-monkey" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src="/video/drunk-monkey-poster.webp"
                          width={480}
                          height={480}
                          alt={c.monkeyAlt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                        />
                      ) : (
                        <PosterArt hue={d.hue!} seed={i} />
                      )}
                      <span className="absolute bottom-4 right-4 rounded-full bg-[#14271d]/85 px-3 py-1.5 font-display text-sm font-semibold text-[#f4ecdd] backdrop-blur-sm">
                        {d.price} {currency[lang]}
                      </span>
                      <Sparkle className="absolute left-5 top-[22%] size-4 text-white/80 transition-transform duration-700 group-hover/card:rotate-90" />
                    </div>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight">{d.name[lang]}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">{d.ingredients![lang]}</p>
                </article>
              </TiltCard>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
