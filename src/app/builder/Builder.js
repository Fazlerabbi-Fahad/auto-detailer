"use client";

import { useEffect, useMemo, useState } from "react";
import brand from "@/brand.config";
import { getBusiness, slugify, toQuery } from "@/lib/personalize";

const field = "min-h-12 w-full rounded-xl border border-line bg-asphalt px-4 text-chrome placeholder:text-muted/80";

export default function Builder() {
  const [f, setF] = useState({ name: "", city: "", state: "", phone: "", ig: "", accent: `#${brand.defaults.accent}` });
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState("");
  const [ogKey, setOgKey] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const biz = useMemo(() => getBusiness({ ...f, accent: f.accent.replace("#", "") }), [f]);
  const q = toQuery(biz);
  const url = `${origin}/${q ? `?${q}` : ""}`;
  const slug = slugify(biz.name === brand.defaults.name ? "" : biz.name) || "";
  const shortUrl = slug ? `${origin}/p/${slug}` : "";
  const fields = { name: biz.name, city: biz.hasCity ? biz.city : "", state: biz.state, phone: biz.phone, ig: biz.ig, accent: biz.accent };
  const entry = slug
    ? `  ${JSON.stringify(slug)}: { ${Object.entries(fields)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join(", ")} },`
    : "";

  // Debounce the OG preview so it doesn't re-render on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setOgKey(q), 500);
    return () => clearTimeout(t);
  }, [q]);

  const copy = async (text, what) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(""), 1600);
    } catch {
      setCopied("Copy failed, select and copy manually");
    }
  };

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  return (
    <main id="main" className="wrap py-14">
      <p className="label text-muted">Internal tool, not indexed</p>
      <h1 className="h2 mt-3">Link builder</h1>
      <p className="mt-3 max-w-[40rem] text-muted">
        Fill in a prospect&rsquo;s details. Values are sanitized exactly like the live page, so what you see in the URL is what they&rsquo;ll see.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <form className="grid content-start gap-5 self-start" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="b-name" className="label mb-2 block text-muted">
              Business name
            </label>
            <input id="b-name" className={field} value={f.name} onChange={set("name")} placeholder="Elite Auto Spa" maxLength={80} />
          </div>
          <div className="grid grid-cols-[1fr_7rem] gap-3">
            <div>
              <label htmlFor="b-city" className="label mb-2 block text-muted">
                City
              </label>
              <input id="b-city" className={field} value={f.city} onChange={set("city")} placeholder="Dallas" />
            </div>
            <div>
              <label htmlFor="b-state" className="label mb-2 block text-muted">
                State
              </label>
              <input id="b-state" className={`${field} uppercase`} value={f.state} onChange={set("state")} placeholder="TX" maxLength={2} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="b-phone" className="label mb-2 block text-muted">
                Phone
              </label>
              <input id="b-phone" className={`${field} font-mono`} value={f.phone} onChange={set("phone")} placeholder="214 555 0142" inputMode="tel" />
            </div>
            <div>
              <label htmlFor="b-ig" className="label mb-2 block text-muted">
                Instagram handle
              </label>
              <input id="b-ig" className={`${field} font-mono`} value={f.ig} onChange={set("ig")} placeholder="eliteautospa" />
            </div>
          </div>
          <div>
            <label htmlFor="b-accent" className="label mb-2 block text-muted">
              Accent color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="b-accent"
                type="color"
                value={`#${biz.accent}`}
                onChange={set("accent")}
                className="h-12 w-16 cursor-pointer rounded-xl border border-line bg-asphalt p-1"
              />
              <input
                aria-label="Accent hex value"
                className={`${field} font-mono`}
                value={f.accent}
                onChange={set("accent")}
                maxLength={7}
              />
            </div>
          </div>
          <ul className="label grid gap-1 text-muted">
            <li>Phone: {biz.phone ? biz.phoneDisplay : "none (phone links hidden)"}</li>
            <li>State: {biz.state || "none"}</li>
            <li>Instagram: {biz.ig ? `@${biz.ig}` : "none (link hidden)"}</li>
          </ul>
        </form>

        <div className="flex min-w-0 flex-col gap-6">
          <section aria-labelledby="out-url" className="rounded-2xl border border-line bg-graphite p-5">
            <h2 id="out-url" className="label text-muted">
              Personalized link
            </h2>
            <output className="mt-3 block break-all font-mono text-[0.875rem] text-chrome">{url}</output>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-accent" onClick={() => copy(url, "Link copied")}>
                Copy link
              </button>
              <a className="btn btn-ghost" href={url} target="_blank" rel="noopener noreferrer">
                Open
              </a>
              <span aria-live="polite" className="label self-center text-muted">
                {copied}
              </span>
            </div>
          </section>

          <section aria-labelledby="out-og" className="rounded-2xl border border-line bg-graphite p-5">
            <h2 id="out-og" className="label text-muted">
              Link preview (Open Graph image)
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={ogKey}
              src={`/og${ogKey ? `?${ogKey}` : ""}`}
              alt={`Link preview image for ${biz.name}`}
              width={1200}
              height={630}
              className="mt-3 h-auto w-full rounded-xl border border-line"
            />
          </section>

          <section aria-labelledby="out-slug" className="rounded-2xl border border-line bg-graphite p-5">
            <h2 id="out-slug" className="label text-muted">
              Short link entry for src/data/prospects.js
            </h2>
            {slug ? (
              <>
                <p className="mt-3 font-mono text-[0.875rem] text-chrome">{shortUrl}</p>
                <pre className="mt-3 overflow-x-auto rounded-xl bg-asphalt p-4 font-mono text-[0.8125rem] text-chrome">{entry}</pre>
                <button type="button" className="btn btn-ghost mt-4" onClick={() => copy(entry, "Entry copied")}>
                  Copy entry
                </button>
              </>
            ) : (
              <p className="mt-3 text-muted">Enter a business name to get a slug.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
