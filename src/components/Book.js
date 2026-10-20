"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import brand from "@/brand.config";
import { useBooking } from "./BookingContext";
import { gsap, reveal, scrollToId, useMotionMode } from "@/lib/motion";

const STEPS = ["Your car", "When & where", "Your details"];
const STEP_FIELDS = [["size", "pkg"], ["date", "window", "address"], ["name", "phone", "email"]];

function nextDays(n = 14) {
  const out = [];
  const d = new Date();
  for (let i = 1; i <= n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    out.push({
      value: `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`,
      dow: x.toLocaleDateString("en-US", { weekday: "short" }),
      day: x.getDate(),
      mon: x.toLocaleDateString("en-US", { month: "short" }),
      full: x.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    });
  }
  return out;
}

const chip =
  "flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-line bg-asphalt px-4 py-3 transition-colors hover:border-muted peer-checked:border-accent peer-checked:bg-[color-mix(in_srgb,var(--accent)_12%,var(--asphalt))] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]";

function Err({ msg, id }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[0.875rem] text-[#FF9B9B]">
      {msg}
    </p>
  );
}

export default function Book({ biz }) {
  const { size: pkgSize, pick } = useBooking();
  const [step, setStep] = useState(0);
  const [days, setDays] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const root = useRef(null);
  const panel = useRef(null);
  const motion = useMotionMode();
  const first = useRef(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { size: brand.vehicleSizes[0].id, pkg: "full", addons: [], date: "", window: "", address: "", name: "", phone: "", email: "", notes: "", company: "" },
  });

  useEffect(() => setDays(nextDays(14)), []);

  // Follow the package section's vehicle toggle.
  useEffect(() => setValue("size", pkgSize), [pkgSize, setValue]);

  // "Book this" pre-selects package + size and returns to step 1.
  useEffect(() => {
    if (!pick) return;
    setValue("pkg", pick.pkg);
    setValue("size", pick.size);
    setStep(0);
    setStatus("idle");
  }, [pick, setValue]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => reveal("[data-head]", motion, { y: 30, stagger: 0.1 }), root);
    return () => ctx.revert();
  }, [motion.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Animated step transitions.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!motion.animate || !panel.current) return;
    const tw = gsap.fromTo(panel.current, { opacity: 0, x: motion.y(24) }, { opacity: 1, x: 0, duration: motion.d(0.45), ease: "power3.out" });
    return () => tw.kill();
  }, [step, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const v = watch();
  const pkg = brand.packages.find((p) => p.id === v.pkg);
  const addons = brand.addOns.filter((a) => (v.addons || []).includes(a.id));
  const base = pkg ? pkg.prices[v.size] || 0 : 0;
  const total = base + addons.reduce((s, a) => s + a.price, 0);
  const sizeLabel = brand.vehicleSizes.find((s) => s.id === v.size)?.label;

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (!ok) {
      panel.current?.querySelector("[aria-invalid='true']")?.focus();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    requestAnimationFrame(() => panel.current?.querySelector("legend, h3")?.focus());
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async (data) => {
    if (data.company) {
      setStatus("done"); // honeypot filled: quietly pretend
      return;
    }
    const payload = {
      business: biz.name,
      vehicle: sizeLabel,
      package: pkg?.name,
      addOns: addons.map((a) => a.name).join(", "),
      estimatedTotal: `$${total}`,
      date: data.date,
      timeWindow: data.window,
      address: data.address,
      name: data.name,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
    };
    setStatus("sending");
    try {
      if (brand.formEndpoint) {
        const res = await fetch(brand.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        console.log("[booking] No formEndpoint set in brand.config.js. Booking request:", payload);
        await new Promise((r) => setTimeout(r, 500));
      }
      setStatus("done");
      requestAnimationFrame(() => scrollToId("book"));
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const pickedDay = days.find((d) => d.value === v.date);

  return (
    <section id="book" ref={root} className="section border-t border-line" aria-labelledby="book-title">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p data-head className="label mb-4 text-muted">
            Book online
          </p>
          <h2 data-head id="book-title" className="h2 [overflow-wrap:anywhere]">
            Book <span className="text-accent-text">{biz.name}</span>
          </h2>
          <p data-head className="mt-5 max-w-[26rem] text-muted">
            Three quick steps. Nothing is charged now; we confirm your time by text.
          </p>
          {biz.phone || biz.ig ? (
            <ul data-head className="mt-10 flex flex-col gap-3 border-t border-line pt-6">
              {biz.phone ? (
                <li>
                  Prefer to text?{" "}
                  <a href={`sms:+1${biz.phone}`} className="font-mono text-accent-text underline decoration-1 underline-offset-4">
                    {biz.phoneDisplay}
                  </a>
                </li>
              ) : null}
              {biz.ig ? (
                <li>
                  Message us on Instagram{" "}
                  <a
                    href={`https://instagram.com/${biz.ig}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-accent-text underline decoration-1 underline-offset-4"
                  >
                    @{biz.ig}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>

        <div className="rounded-[1.5rem] border border-line bg-graphite">
          {status === "done" ? (
            <div ref={panel} className="flex flex-col items-start gap-5 p-6 sm:p-10" role="status" aria-live="polite">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink">
                <svg width="22" height="18" viewBox="0 0 22 18" aria-hidden="true">
                  <path d="M2 9l6 6L20 2" fill="none" stroke="currentColor" strokeWidth="2.4" />
                </svg>
              </span>
              <h3 className="font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.02em]">Request received.</h3>
              <p className="max-w-[30rem] text-muted">
                Thanks{v.name ? `, ${v.name.split(" ")[0]}` : ""}. {biz.name} will text you shortly to confirm
                {pickedDay ? ` ${pickedDay.full}` : " your time"}. Estimated total{" "}
                <span className="price">${total}</span>.
              </p>
              <button type="button" className="btn btn-ghost" onClick={() => { setStatus("idle"); setStep(0); }}>
                Book another car
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby="book-progress">
              <div className="flex items-center gap-3 border-b border-line px-6 py-5 sm:px-8" id="book-progress">
                <span className="sr-only">
                  Step {step + 1} of {STEPS.length}: {STEPS[step]}
                </span>
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 flex-col gap-2" aria-hidden="true">
                    <span className={`h-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-accent" : "bg-line"}`} />
                    <span className={`label hidden sm:block ${i === step ? "text-chrome" : "text-muted"}`}>
                      0{i + 1} {s}
                    </span>
                  </div>
                ))}
              </div>

              <div ref={panel} className="px-6 py-7 sm:px-8">
                {/* honeypot */}
                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label>
                    Company
                    <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
                  </label>
                </div>

                {step === 0 ? (
                  <div className="flex flex-col gap-8">
                    <fieldset>
                      <legend tabIndex={-1} className="label mb-3 text-muted outline-none">
                        Vehicle size
                      </legend>
                      <div className="grid grid-cols-3 gap-2">
                        {brand.vehicleSizes.map((s) => (
                          <label key={s.id}>
                            <input type="radio" value={s.id} className="peer sr-only" {...register("size", { required: "Choose a vehicle size" })} />
                            <span className={`${chip} justify-center text-center text-[0.9375rem] font-medium`}>{s.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="label mb-3 text-muted">Package</legend>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {brand.packages.map((p) => (
                          <label key={p.id}>
                            <input type="radio" value={p.id} className="peer sr-only" {...register("pkg", { required: "Choose a package" })} />
                            <span className={chip}>
                              <span className="flex flex-col">
                                <span className="font-medium">{p.name}</span>
                                <span className="label text-muted">{p.duration}</span>
                              </span>
                              <span className="price text-[1.125rem]">${p.prices[v.size]}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                      <Err msg={errors.pkg?.message} />
                    </fieldset>

                    <fieldset>
                      <legend className="label mb-3 text-muted">Add-ons (optional)</legend>
                      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                        {brand.addOns.map((a) => (
                          <label key={a.id}>
                            <input type="checkbox" value={a.id} className="peer sr-only" {...register("addons")} />
                            <span className={`${chip} text-[0.9375rem]`}>
                              {a.name}
                              <span className="price">+${a.price}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="flex flex-col gap-8">
                    <fieldset>
                      <legend tabIndex={-1} className="label mb-3 text-muted outline-none">
                        Preferred date
                      </legend>
                      <div className="no-scrollbar -mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-1 sm:-mx-8 sm:px-8" data-lenis-prevent-wheel="">
                        {days.map((d) => (
                          <label key={d.value} className="shrink-0 snap-start">
                            <input
                              type="radio"
                              value={d.value}
                              className="peer sr-only"
                              aria-label={d.full}
                              aria-invalid={errors.date ? "true" : "false"}
                              {...register("date", { required: "Pick a day" })}
                            />
                            <span className={`${chip} w-[4.5rem] flex-col !justify-center !gap-0.5 py-3 text-center`}>
                              <span className="label text-muted">{d.dow}</span>
                              <span className="font-display text-[1.5rem] font-bold leading-none">{d.day}</span>
                              <span className="label text-muted">{d.mon}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                      <Err msg={errors.date?.message} />
                    </fieldset>

                    <fieldset>
                      <legend className="label mb-3 text-muted">Time window</legend>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "Morning", sub: "8am – 12pm" },
                          { id: "Afternoon", sub: "12pm – 5pm" },
                        ].map((w) => (
                          <label key={w.id}>
                            <input
                              type="radio"
                              value={w.id}
                              className="peer sr-only"
                              aria-invalid={errors.window ? "true" : "false"}
                              {...register("window", { required: "Pick a time window" })}
                            />
                            <span className={`${chip} flex-col !items-start !gap-0`}>
                              <span className="font-medium">{w.id}</span>
                              <span className="label text-muted">{w.sub}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                      <Err msg={errors.window?.message} />
                    </fieldset>

                    <div>
                      <label htmlFor="address" className="label mb-3 block text-muted">
                        Service address
                      </label>
                      <input
                        id="address"
                        type="text"
                        autoComplete="street-address"
                        placeholder="Street, city"
                        aria-invalid={errors.address ? "true" : "false"}
                        aria-describedby={errors.address ? "address-err" : undefined}
                        className="min-h-12 w-full rounded-2xl border border-line bg-asphalt px-4 text-chrome placeholder:text-muted/80"
                        {...register("address", { required: "Where should we meet your car?", minLength: { value: 5, message: "Add a little more detail" } })}
                      />
                      <Err id="address-err" msg={errors.address?.message} />
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="flex flex-col gap-6">
                    <h3 tabIndex={-1} className="sr-only">
                      Your details
                    </h3>
                    <div>
                      <label htmlFor="name" className="label mb-3 block text-muted">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby={errors.name ? "name-err" : undefined}
                        className="min-h-12 w-full rounded-2xl border border-line bg-asphalt px-4 text-chrome"
                        {...register("name", { required: "Tell us your name" })}
                      />
                      <Err id="name-err" msg={errors.name?.message} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="label mb-3 block text-muted">
                        Mobile phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="(555) 555-0100"
                        aria-invalid={errors.phone ? "true" : "false"}
                        aria-describedby={errors.phone ? "phone-err" : undefined}
                        className="min-h-12 w-full rounded-2xl border border-line bg-asphalt px-4 font-mono text-chrome placeholder:text-muted/80"
                        {...register("phone", {
                          required: "We text to confirm, so we need a number",
                          validate: (val) => {
                            const d = val.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
                            return d.length === 10 || "Enter a 10-digit US number";
                          },
                        })}
                      />
                      <Err id="phone-err" msg={errors.phone?.message} />
                    </div>
                    <div>
                      <label htmlFor="email" className="label mb-3 block text-muted">
                        Email <span className="normal-case tracking-normal">(optional)</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-err" : undefined}
                        className="min-h-12 w-full rounded-2xl border border-line bg-asphalt px-4 text-chrome"
                        {...register("email", {
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "That email doesn't look right" },
                        })}
                      />
                      <Err id="email-err" msg={errors.email?.message} />
                    </div>
                    <div>
                      <label htmlFor="notes" className="label mb-3 block text-muted">
                        Notes <span className="normal-case tracking-normal">(optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        placeholder="Gate code, pet hair situation, anything we should know"
                        className="w-full rounded-2xl border border-line bg-asphalt px-4 py-3 text-chrome placeholder:text-muted/80"
                        {...register("notes", { maxLength: 1000 })}
                      />
                    </div>
                  </div>
                ) : null}

                {status === "error" ? (
                  <p role="alert" className="mt-6 rounded-2xl border border-[#FF9B9B]/40 p-4 text-[0.9375rem] text-[#FF9B9B]">
                    Something went wrong sending your request. Please try again{biz.phone ? ` or text ${biz.phoneDisplay}` : ""}.
                  </p>
                ) : null}
              </div>

              <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-b-[1.5rem] border-t border-line bg-graphite/95 px-6 py-5 backdrop-blur sm:px-8">
                <div aria-live="polite">
                  <span className="label block text-muted">Estimated total</span>
                  <span className="price text-[1.75rem] leading-none">${total}</span>
                </div>
                <div className="flex gap-2">
                  {step > 0 ? (
                    <button type="button" onClick={back} className="btn btn-ghost px-5">
                      Back
                    </button>
                  ) : null}
                  {step < STEPS.length - 1 ? (
                    <button type="button" onClick={next} className="btn btn-accent">
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-accent" disabled={status === "sending"}>
                      {status === "sending" ? "Sending…" : "Request booking"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
