"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { gustBy } from "@/components/botanica/engine";
import { Particles } from "@/components/botanica/Particles";
import { cn } from "@/lib/cn";
import { Mashrabiya } from "./Ornaments";

type Slide = {
  id: string;
  image: string;
  alt: string;
  /** object-position for the arch crop */
  focus: string;
  words: [string, string];
  /** Arabic watermark behind the arch (verified common words only). */
  arabic: string;
  title: string;
  house: string;
  callouts: [{ label: string; text: string }, { label: string; text: string }];
  href: string;
  cta: string;
  glow: string;
  petals?: boolean;
};

/* Photography: Unsplash (see public/images/stock/CREDITS.txt). Copy is placeholder for EYTE to confirm. */
const SLIDES: Slide[] = [
  {
    id: "velvet",
    image: "/images/stock/card-black-roses.webp",
    alt: "A black perfume bottle resting among black roses",
    focus: "50% 70%",
    words: ["Velvet", "Bloom"],
    arabic: "ورد",
    title: "The rose edit",
    house: "Florals",
    callouts: [
      { label: "Rose · Peony", text: "Petals wrapped in silk" },
      { label: "Soft musk", text: "A close, powdery finish" },
    ],
    href: "/families/floral",
    cta: "Shop florals",
    glow: "#5c5c5c",
    petals: true,
  },
  {
    id: "smoke",
    image: "/images/stock/hero-royal-smoke.webp",
    alt: "A golden perfume bottle wreathed in incense smoke over charcoal",
    focus: "52% 46%",
    words: ["Royal", "Smoke"],
    arabic: "عود",
    title: "The oud edit",
    house: "Woods & Oud",
    callouts: [
      { label: "Oud · Incense", text: "Burns slow, lasts long" },
      { label: "Bakhoor", text: "The scent of a majlis" },
    ],
    href: "/families/woody",
    cta: "Shop woods & oud",
    glow: "#6B4A33",
  },
  {
    id: "gold",
    image: "/images/stock/hero-golden-satin.webp",
    alt: "A golden perfume bottle resting on draped champagne satin",
    focus: "50% 50%",
    words: ["Liquid", "Gold"],
    arabic: "عطر",
    title: "Arabian treasures",
    house: "Middle Eastern",
    callouts: [
      { label: "Saffron · Amber", text: "Rich, golden and bold" },
      { label: "Long lasting", text: "From dusk until dawn" },
    ],
    href: "/shop?collection=middle-eastern",
    cta: "Shop Middle Eastern",
    glow: "#B08A3A",
  },
  {
    id: "qahwa",
    image: "/images/stock/hero-qahwa-nights.webp",
    alt: "A tall amber-brown perfume bottle and its reflection on warm light",
    focus: "50% 40%",
    words: ["Qahwa", "Nights"],
    arabic: "قهوة",
    title: "The gourmand edit",
    house: "Vanilla & Gourmand",
    callouts: [
      { label: "Coffee · Cardamom", text: "Roasted and spiced" },
      { label: "Vanilla · Tonka", text: "A warm, addictive trail" },
    ],
    href: "/families/gourmand",
    cta: "Shop gourmand",
    glow: "#7A4A2A",
  },
];

const DURATION = 6500;

/** Word sized so it spans roughly half the viewport, whatever its length. */
function wordStyle(word: string): CSSProperties {
  return { "--k": (word.length * 0.7).toFixed(2) } as CSSProperties;
}

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[index];

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
      gustBy(0.6, 1);
    }, DURATION);
    return () => window.clearTimeout(id);
  }, [index, paused]);

  const go = (i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
    gustBy(0.6, i > index ? 1 : -1);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured perfumes"
      className="relative isolate min-h-[720px] overflow-hidden"
      style={{ height: "100svh" }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Dusk backdrop: a glow per slide, cross-faded */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#121212_0%,#0a0a0a_55%,#1b100c_100%)]" />
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={cn("absolute inset-0 transition-opacity duration-[1400ms]", i === index ? "opacity-100" : "opacity-0")}
          style={{ background: `radial-gradient(60% 55% at 50% 42%, ${s.glow}66, transparent 72%)` }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(80%_70%_at_50%_100%,rgb(90_56_34/0.55),transparent_70%)]" />
      <Mashrabiya id="hero-lattice" className="text-gold opacity-60" />
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[18vh] w-full" aria-hidden="true">
        <path d="M0 150C180 96 300 130 460 110S760 60 900 92s300 70 540 22V220H0Z" fill="#1e1009" opacity="0.7" />
        <path d="M0 180c200-40 360-12 560-34s420-50 600-18 200 30 280 20V220H0Z" fill="#160b07" />
      </svg>

      <Particles family="night-air" density={1} className="pointer-events-none absolute inset-0 h-full w-full" />
      {slide.petals && <Particles key="petals" family="floral" density={0.45} className="pointer-events-none absolute inset-0 h-full w-full" />}

      {/* Arabic calligraphy accent */}
      <p
        key={`ar-${slide.id}`}
        className="arabic gold-text intro-fade pointer-events-none absolute right-6 top-[19%] z-10 select-none whitespace-nowrap text-[18vw] leading-none opacity-60 md:right-auto md:left-[8%] md:top-[67%] md:text-[8vw]"
        style={{ animationDelay: "0.4s" }}
        aria-hidden="true"
        lang="ar"
        dir="rtl"
      >
        {slide.arabic}
      </p>

      {/* The arch: real campaign photography */}
      <div className="absolute left-1/2 top-[47%] z-10 w-[min(66vw,400px)] -translate-x-1/2 -translate-y-1/2 md:top-[50%] md:w-[min(31vw,440px)]">
        <div className="absolute -inset-3 rounded-t-full border border-gold/45" aria-hidden="true" />
        <div className="absolute -inset-6 rounded-t-full border border-gold/15" aria-hidden="true" />
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-paper-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
          {SLIDES.map((s, i) => (
            <div key={s.id} className={cn("absolute inset-0 transition-opacity duration-[1200ms]", i === index ? "opacity-100" : "opacity-0")}>
              <Image
                src={s.image}
                alt={i === index ? s.alt : ""}
                fill
                sizes="(min-width: 768px) 460px, 70vw"
                priority={i === 0}
                className={cn("object-cover", i === index && "animate-ken-burns")}
                style={{ objectPosition: s.focus }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_10/0.55),transparent_35%)]" aria-hidden="true" />
        </div>

        {/* Callouts (desktop) */}
        <div key={`ca-${slide.id}`} className="intro-fade absolute left-full top-[20%] hidden w-64 items-start gap-3 lg:flex" style={{ animationDelay: "0.5s" }}>
          <span className="mt-[7px] h-px w-14 shrink-0 bg-gold/50" />
          <span className="mt-[3px] h-2.5 w-2.5 shrink-0 rounded-full bg-gold-2 shadow-[0_0_0_5px_rgb(233_210_156/0.15)]" />
          <span>
            <span className="eyebrow block text-gold-2">{slide.callouts[0].label}</span>
            <span className="mt-1 block text-[13px] text-ink-2">{slide.callouts[0].text}</span>
          </span>
        </div>
        <div key={`cb-${slide.id}`} className="intro-fade absolute right-full top-[64%] hidden w-64 flex-row-reverse items-start gap-3 text-right lg:flex" style={{ animationDelay: "0.7s" }}>
          <span className="mt-[7px] h-px w-14 shrink-0 bg-gold/50" />
          <span className="mt-[3px] h-2.5 w-2.5 shrink-0 rounded-full bg-gold-2 shadow-[0_0_0_5px_rgb(233_210_156/0.15)]" />
          <span>
            <span className="eyebrow block text-gold-2">{slide.callouts[1].label}</span>
            <span className="mt-1 block text-[13px] text-ink-2">{slide.callouts[1].text}</span>
          </span>
        </div>
      </div>

      {/* Words wrapped around the bottle */}
      <h1 className="pointer-events-none absolute inset-0 z-20">
        <span className="sr-only">
          {slide.words.join(" ")}: {slide.title}, {slide.house}
        </span>
        <span
          key={`w1-${slide.id}`}
          aria-hidden="true"
          className="display intro-rise absolute left-5 top-[15%] text-[min(15vw,calc(88vw/var(--k)))] text-ink drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)] md:left-[4%] md:top-[17%] md:text-[min(10.5vw,calc(52vw/var(--k)))]"
          style={wordStyle(slide.words[0])}
        >
          {slide.words[0]}
        </span>
        <span
          key={`w2-${slide.id}`}
          aria-hidden="true"
          className="display intro-rise absolute bottom-[22%] right-5 text-[min(15vw,calc(88vw/var(--k)))] text-ink drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)] md:bottom-auto md:right-[4%] md:top-[56%] md:text-[min(10.5vw,calc(52vw/var(--k)))]"
          style={{ ...wordStyle(slide.words[1]), animationDelay: "0.15s" }}
        >
          {slide.words[1]}
        </span>
      </h1>

      {/* Controls. Fixed columns and a fixed-width button keep the arrows and progress still between slides. */}
      <div className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 px-5 pb-6 md:grid-cols-[minmax(0,1fr)_auto_auto] md:px-10 md:pb-9 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:px-28">
        <div aria-live="polite" className="min-w-0">
          <p className="eyebrow text-gold-2">
            {String(index + 1).padStart(2, "0")} <span className="text-mute">/ {String(SLIDES.length).padStart(2, "0")}</span>
          </p>
          <p className="display mt-2 truncate text-3xl md:text-4xl">{slide.title}</p>
          <p className="eyebrow mt-1 text-mute">{slide.house}</p>
        </div>

        <div className="hidden items-center gap-2 md:flex" role="tablist" aria-label="Choose slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${s.title} slide`}
              onClick={() => go(i)}
              className="group relative h-6 w-14 cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-ink/25" />
              <span
                key={i === index ? `p-${index}` : undefined}
                className="absolute left-0 top-1/2 h-px bg-gold-2"
                style={
                  i === index
                    ? { width: "100%", animation: paused ? "none" : `fill-bar ${DURATION}ms linear both` }
                    : { width: i < index ? "100%" : "0%" }
                }
              />
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold/40 transition-colors hover:bg-gold/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M15 5 8 12l7 7" />
            </svg>
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold/40 transition-colors hover:bg-gold/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
          <Link href={slide.href} className="btn btn-ink ml-2 hidden w-[15.5rem] sm:inline-flex">
            {slide.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
