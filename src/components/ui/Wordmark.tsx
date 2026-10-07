// The ПОЗИТИВА wordmark, traced from the logo by scripts/build-images.mjs. Rendered as a CSS mask over
// currentColor: recolours with the theme, and the SVG file is cached instead of inlined in every page.
export function Wordmark({ className, withBar = false }: { className?: string; withBar?: boolean }) {
  return (
    <span aria-hidden="true" className={className}>
      <span className="block aspect-[1110/210] bg-current [mask:url(/img/wordmark.svg)_center/contain_no-repeat]" />
      {withBar && (
        <span className="mx-auto mt-[4%] block aspect-[660/70] w-[60%] bg-current [mask:url(/img/wordmark-bar.svg)_center/contain_no-repeat]" />
      )}
    </span>
  );
}
