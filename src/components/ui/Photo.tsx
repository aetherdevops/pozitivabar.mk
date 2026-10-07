import images from "@/content/images.json";

export type PhotoName = keyof typeof images;

export const hasPhoto = (name: string): name is PhotoName => name in images;

type Props = {
  name: PhotoName;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
};

/** AVIF/WebP responsive image built by scripts/build-images.mjs, with an inline blurred placeholder. */
export function Photo({ name, alt, sizes, className, imgClassName, eager }: Props) {
  const m = images[name];
  const set = (ext: string) => m.widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <img
        src={`/img/${name}-${m.widths[m.widths.length - 1]}.webp`}
        srcSet={set("webp")}
        sizes={sizes}
        width={m.width}
        height={m.height}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
        className={imgClassName}
        style={{ backgroundImage: `url(${m.blur})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
    </picture>
  );
}
