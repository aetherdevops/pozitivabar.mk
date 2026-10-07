import { COPY, fill } from "@/content/copy";
import type { Lang } from "@/lib/i18n";
import { Photo, type PhotoName } from "../ui/Photo";
import { Rail } from "./Rail";

const SHOTS: { name: PhotoName; tilt: number; tall?: boolean }[] = [
  { name: "opening-2", tilt: -2.5 },
  { name: "opening-5", tilt: 1.8, tall: true },
  { name: "opening-1", tilt: -1.2 },
  { name: "opening-8", tilt: 2.4 },
  { name: "opening-3", tilt: -1.8 },
  { name: "opening-7", tilt: 1.4 },
  { name: "opening-4", tilt: -2.2 },
  { name: "opening-6", tilt: 1.6 },
];

export function Gallery({ lang }: { lang: Lang }) {
  const c = COPY[lang].gallery;
  return (
    <section aria-labelledby="gallery-title" className="section-y cv-auto overflow-hidden">
      <div className="container-pz">
        <div className="reveal max-w-3xl">
          <p className="text-kicker text-gold-ink">{c.kicker}</p>
          <h2 id="gallery-title" className="text-h2 mt-4">
            {c.title}
          </h2>
          <p className="mt-4 text-lg text-ink-soft">{c.sub}</p>
        </div>
      </div>
      <div className="mt-10">
        <Rail prev={c.prev} next={c.next}>
          {SHOTS.map((s, i) => (
            <figure
              key={s.name}
              className="shrink-0 snap-center rounded-md bg-surface p-2.5 pb-3 shadow-[var(--pz-shadow)] transition-transform duration-500 ease-[var(--ease-spring)] [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)_translateY(-6px)]"
              style={{ "--tilt": `${s.tilt}deg` } as React.CSSProperties}
            >
              <Photo
                name={s.name}
                alt={fill(c.alt, { n: i + 1 })}
                sizes={s.tall ? "(min-width: 768px) 15rem, 50vw" : "(min-width: 768px) 26rem, 78vw"}
                imgClassName={`block rounded-sm object-cover ${s.tall ? "h-[17rem] w-[12.75rem] sm:h-[20rem] sm:w-[15rem]" : "h-[17rem] w-[25.5rem] max-w-[78vw] sm:h-[20rem] sm:w-[30rem]"}`}
              />
            </figure>
          ))}
        </Rail>
      </div>
    </section>
  );
}
