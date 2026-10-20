import FitText from "./FitText";

export default function Footer({ biz }) {
  return (
    <footer className="border-t border-line pb-28 pt-16 lg:pb-12">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="label text-muted">Mobile detailing</span>
            <span>{biz.hasCity ? `${biz.cityState}. We come to you.` : "We come to you."}</span>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {biz.phone ? (
              <li>
                <a href={`tel:+1${biz.phone}`} className="font-mono inline-flex min-h-11 items-center hover:text-accent-text">
                  {biz.phoneDisplay}
                </a>
              </li>
            ) : null}
            {biz.ig ? (
              <li>
                <a
                  href={`https://instagram.com/${biz.ig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono inline-flex min-h-11 items-center hover:text-accent-text"
                >
                  @{biz.ig}
                </a>
              </li>
            ) : null}
            <li>
              <a href="#book" className="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-chrome">
                Book a detail
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-14 w-full" aria-hidden="true">
          <FitText
            mode="line"
            max={400}
            wrapBelow={44}
            min={28}
            style={{ fontSize: `calc((min(100vw, 1440px) - 2 * var(--page-x)) / ${(biz.name.length * 0.58).toFixed(2)})`, whiteSpace: "nowrap" }}
            className="font-display font-bold leading-[0.85] tracking-[-0.04em] text-chrome">
            {biz.name}
          </FitText>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-[0.875rem] text-muted sm:flex-row sm:justify-between">
          <p>&copy; 2026 {biz.name}</p>
          <p>Fully insured &middot; We bring water &amp; power</p>
        </div>
      </div>
    </footer>
  );
}
