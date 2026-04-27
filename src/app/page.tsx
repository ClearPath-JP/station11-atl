"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

/* ─── Palette — warm cafe, layered shades ────────────────────── */
const c = {
  bg: "#F0ECE0",
  bgWarm: "#EBE5D5",      /* slightly deeper cream */
  bgDeep: "#E4DDCC",      /* warmer still */
  text: "#2C2A25",
  textMuted: "#6B6560",
  accent: "#9B2C2C",
  warm: "#C8A97E",
  surface: "#E8E2D4",
  surfaceDark: "#2C2A25",
  border: "#D6CFC2",
  borderLight: "#E4DED2",
};

/* ─── Menu Data ──────────────────────────────────────────────── */
const BREAKFAST = [
  { n: "Fireman's Breakfast", p: 15, d: "Scrambled eggs, cheese grits, bacon or sausage, sourdough" },
  { n: "Stir Fry Shrimp & Grits", p: 18, d: "Wok seared shrimp, butter, basil, sweet corn" },
  { n: "Oxtail & Grits", p: 19, d: "Thyme & scallion braised gravy, smash grits" },
  { n: "Oxtail Benedict", p: 18, d: "English muffin, poached eggs, hollandaise" },
  { n: "Station 11 Pancakes", p: 14, d: "House maple syrup, seasonal fruit" },
  { n: "Breakfast Bagel", p: 12, d: "Cheese, bacon or sausage, cream cheese, scrambled eggs" },
];
const LUNCH = [
  { n: "Oxtail Sandwich", p: 18, d: "Braised oxtail, gravy, sourdough — the signature", f: true },
  { n: "Jerk Chicken", p: 17, d: "Rice & peas, cabbage, plantain", f: true },
  { n: "Herb Seared Salmon", p: 22, d: "Coconut jasmine rice, seasonal vegetables" },
  { n: "S11 Burger", p: 16, d: "Smash patty, cheddar, caramelized onion, special sauce" },
  { n: "Fried Chicken Sandwich", p: 16, d: "Buttermilk, white sauce, cabbage, hot pepper" },
  { n: "Coconut Shrimp", p: 16, d: "Sweet chili, pickled cabbage" },
  { n: "Fried Wings", p: 14, d: "Jerk or honey garlic, pickled slaw" },
];
const WOK = [
  { n: "Oxtail Fried Rice", p: 17, d: "Egg, green onion, braised oxtail, bok choy, crispy shallots" },
  { n: "Shrimp Lo Mein", p: 16, d: "Wok-tossed noodles, vegetables, soy glaze" },
  { n: "Mongolian Beef", p: 17, d: "Scallion, ginger, soy, steamed rice" },
];
const COFFEE = [
  { n: "Espresso", p: 4, d: "Double shot" },
  { n: "Latte", p: 6, d: "Espresso, steamed milk" },
  { n: "Cappuccino", p: 5, d: "Espresso, foam" },
  { n: "Flat White", p: 6, d: "Velvety microfoam" },
  { n: "Cinnamon Vanilla Latte", p: 6.5, d: "House-made cinnamon syrup" },
  { n: "Cardamom Chai", p: 6.5, d: "Spiced, steamed oat milk" },
  { n: "Matcha Milk Tea", p: 6, d: "Ceremonial grade" },
  { n: "Chai Latte", p: 6, d: "Traditional spice blend" },
];
type MI = { n: string; p: number; d: string; f?: boolean };
const TABS = [
  { key: "breakfast", label: "Breakfast", sub: "Mon–Fri, 8–11 am", items: BREAKFAST },
  { key: "lunch", label: "Lunch & Plates", sub: "Mon–Fri, 11 am – 3 pm", items: LUNCH },
  { key: "wok", label: "From the Wok", sub: "Lunch service", items: WOK },
  { key: "coffee", label: "Coffee & Tea", sub: "All day — Gilly Brew Bar", items: COFFEE },
] as const;

const NAV = [
  { href: "#story", label: "Our Story" }, { href: "#menu", label: "Menu" },
  { href: "#firehouse", label: "The Firehouse" }, { href: "#visit", label: "Visit" },
];

/* ─── Primitives ─────────────────────────────────────────────── */
function R({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }} className={className}>{children}</motion.div>;
}

function CardAnim({ children, className = "", delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  return <motion.div initial={{ opacity: 0, y: 36, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }} className={className} style={style}>{children}</motion.div>;
}

/* Animated line that draws itself on scroll */
function AnimLine({ width = "40%", color = c.border, className = "" }: { width?: string; color?: string; className?: string }) {
  return (
    <div className={`mx-auto overflow-hidden ${className}`} style={{ maxWidth: width }}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-[1px] origin-left"
        style={{ background: color }}
      />
    </div>
  );
}

/* Word-by-word reveal for key headlines */
function WordPop({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.08 }}
          className="mr-[0.28em] inline-block"
        >{word}</motion.span>
      ))}
    </span>
  );
}

/* Decorative dot pattern for warmth */
function WarmDots({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
      className={`pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(${c.border} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    />
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span animate={open ? { rotate: 45, y: 8 } : {}} className="block w-full h-[1.5px] origin-center" style={{ background: c.text }} transition={{ duration: 0.3 }} />
      <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block w-full h-[1.5px]" style={{ background: c.text }} transition={{ duration: 0.2 }} />
      <motion.span animate={open ? { rotate: -45, y: -8 } : {}} className="block w-full h-[1.5px] origin-center" style={{ background: c.text }} transition={{ duration: 0.3 }} />
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function Page() {
  const [tab, setTab] = useState<string>("lunch");
  const [navOpen, setNavOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: hp } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOp = useTransform(hp, [0, 0.8], [1, 0]);
  const heroImgScale = useTransform(hp, [0, 1], [1, 1.1]);
  const { scrollYProgress } = useScroll();
  const px = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => { if (!navOpen) return; const cl = () => setNavOpen(false); window.addEventListener("scroll", cl, { passive: true }); return () => window.removeEventListener("scroll", cl); }, [navOpen]);
  const active = TABS.find((t) => t.key === tab) ?? TABS[1];

  return (
    <div className="min-h-screen" style={{ background: c.bg, color: c.text }}>
      {/* Progress */}
      <motion.div style={{ scaleX: px, transformOrigin: "0%" }} className="fixed top-[68px] left-0 right-0 h-[2px] z-50"><div className="w-full h-full" style={{ background: c.accent }} /></motion.div>

      {/* ── Nav ─────────────────────────────────────────── */}
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b" style={{ background: `${c.bg}E6`, borderColor: c.borderLight }}>
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 h-[68px] flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5">
            <img src="/images/logo-black.png" alt="Station Eleven" className="h-10 object-contain" />
          </a>
          <div className="hidden md:flex items-center gap-8 text-[13px]" style={{ color: c.textMuted }}>
            {NAV.map((l) => <a key={l.label} href={l.href} className="hover:text-[#2C2A25] transition-colors duration-300">{l.label}</a>)}
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
              className="ml-2 px-5 py-2.5 text-[13px] font-medium transition-all hover:opacity-80" style={{ background: c.surfaceDark, color: c.bg, borderRadius: "4px" }}>Book a Table</a>
          </div>
          <button onClick={() => setNavOpen((v) => !v)} className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menu"><Burger open={navOpen} /></button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-b" style={{ background: c.bg, borderColor: c.borderLight }}>
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV.map((l) => <a key={l.label} href={l.href} onClick={() => setNavOpen(false)} className="py-3 text-[16px] border-b last:border-0" style={{ color: c.text, borderColor: c.borderLight }}>{l.label}</a>)}
                <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
                  className="mt-3 py-3.5 text-center text-[15px] font-medium" style={{ background: c.surfaceDark, color: c.bg, borderRadius: "4px" }}>Book a Table</a>
                <a href="tel:+14703198392" className="py-3 text-center text-[15px] font-medium" style={{ color: c.accent }}>(470) 319-8392</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero — Dishoom style: full photo + text box ──── */}
      <section ref={heroRef} id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroImgScale }}>
          <img src="/images/exterior.jpg" alt="Station 11 — 1907 firehouse, Midtown Atlanta" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(44,42,37,0.3) 0%, rgba(44,42,37,0.15) 40%, rgba(44,42,37,0.4) 100%)" }} />
        </motion.div>

        <motion.div style={{ opacity: heroOp }} className="relative mx-6 max-w-[600px] w-full">
          {/* Dishoom-style bordered text box on photo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-8 sm:px-12 py-12 sm:py-16 border-2"
            style={{ background: `${c.bg}E8`, borderColor: c.border }}
          >
            <img src="/images/logo-black.png" alt="Station Eleven" className="h-14 sm:h-16 mx-auto mb-6 object-contain" />
            <p className="text-[11px] tracking-[0.35em] uppercase mb-6" style={{ color: c.textMuted }}>
              Midtown Atlanta &bull; Est. 1907
            </p>
            <p className="font-serif italic text-[clamp(20px,3vw,30px)] leading-[1.4] mb-8" style={{ color: c.text }}>
              A Caribbean-Asian cafe in a historic firehouse. Come for coffee, stay for the oxtail. By the end, we hope you&apos;ll feel like family.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
                className="px-7 py-3 text-[13px] font-medium tracking-[0.05em] uppercase transition-all hover:opacity-80 min-h-[48px] inline-flex items-center"
                style={{ background: c.surfaceDark, color: c.bg }}>Book a Table</a>
              <a href="#menu" className="px-7 py-3 text-[13px] font-medium tracking-[0.05em] uppercase border transition-all hover:bg-[#2C2A25]/5 min-h-[48px] inline-flex items-center"
                style={{ borderColor: c.text, color: c.text }}>View Menu</a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Ticker ──────────────────────────────────────── */}
      <div className="overflow-hidden py-3" style={{ background: c.surfaceDark }}>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[11px] font-medium tracking-[0.2em] uppercase" style={{ color: `${c.bg}90` }}>
              Caribbean-Asian Cafe &bull; Breakfast &bull; Brunch &bull; Lunch &bull; Coffee by Gilly Brew Bar &bull; Private Events &bull; Resy Top 25 &bull; 5.0 Stars &bull; Walk-ins Welcome &bull;&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Story ───────────────────────────────────────── */}
      <section id="story" className="relative px-6 sm:px-10" style={{ paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(60px,8vw,120px)" }}>
        <WarmDots className="absolute top-24 left-0 w-20 h-48 opacity-25 hidden lg:block" />
        <WarmDots className="absolute bottom-12 right-0 w-20 h-48 opacity-25 hidden lg:block" />
        <div className="max-w-[700px] mx-auto text-center relative">
          <R><p className="text-[11px] tracking-[0.35em] uppercase mb-4" style={{ color: c.accent }}>Our Story</p></R>
          <AnimLine width="60px" color={c.accent} className="mb-10" />
          <h2 className="font-serif italic text-[clamp(28px,4vw,48px)] leading-[1.25] mb-8" style={{ color: c.text }}>
            <WordPop text="Where wok meets grill," delay={0} />
            <br />
            <WordPop text="and jerk traditions" delay={0.3} />
            {" "}<span style={{ color: c.accent }}><WordPop text="meet Asian precision." delay={0.5} /></span>
          </h2>
          <R delay={0.6}>
            <p className="text-[clamp(15px,1.2vw,17px)] leading-[1.85]" style={{ color: c.textMuted }}>
              Dumplings filled with braised oxtail. Rice kissed with coconut.
              Every dish is both familiar and surprising — a celebration of
              the harmony that emerges when East meets West Indies. This is
              Station 11, and all are welcome.
            </p>
          </R>
          <AnimLine width="30%" className="mt-12" />
        </div>
      </section>

      {/* ── Signature — photo + text, Dishoom alternating style ─── */}
      <section className="px-6 sm:px-10" style={{ paddingBottom: "clamp(60px,8vw,120px)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Photo */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src="/images/jerk-chicken.jpg" alt="Jerk chicken with rice & peas, plantain, cabbage on marble" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Text */}
            <div className="lg:pl-4">
              <R><p className="text-[11px] tracking-[0.35em] uppercase mb-6" style={{ color: c.accent }}>Signature Plates</p></R>
              <R delay={0.1}>
                <h3 className="font-serif italic text-[clamp(26px,3vw,40px)] leading-[1.2] mb-6">Caribbean soul, made with care.</h3>
              </R>
              <R delay={0.2}>
                <p className="text-[clamp(14px,1.1vw,16px)] leading-[1.85] mb-8" style={{ color: c.textMuted }}>
                  Our oxtail is braised until it falls apart. The jerk chicken marinates for 24 hours. Nothing sits, nothing waits — every plate comes out with the kind of care that takes time but never feels rushed.
                </p>
              </R>
              <R delay={0.3}>
                <div>
                  {[
                    { n: "Oxtail Sandwich", d: "The #1 — braised oxtail, gravy, sourdough", p: "$18" },
                    { n: "Jerk Chicken", d: "Rice & peas, cabbage, plantain", p: "$17" },
                    { n: "Oxtail Fried Rice", d: "Wok-tossed, bok choy, crispy shallots", p: "$17" },
                  ].map((item) => (
                    <div key={item.n} className="flex items-baseline justify-between py-3.5 border-b" style={{ borderColor: c.border }}>
                      <div>
                        <p className="text-[15px] font-medium">{item.n}</p>
                        <p className="text-[13px] mt-0.5" style={{ color: c.textMuted }}>{item.d}</p>
                      </div>
                      <span className="text-[15px] tabular-nums" style={{ color: c.accent }}>{item.p}</span>
                    </div>
                  ))}
                </div>
              </R>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards — on warmer shade ─────────────── */}
      <section className="relative" style={{ background: c.bgWarm, paddingTop: "clamp(60px,8vw,100px)", paddingBottom: "clamp(60px,8vw,100px)" }}>
        <AnimLine width="50%" className="absolute top-0 left-1/2 -translate-x-1/2" />
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Coffee", title: "Gilly Brew Bar", desc: "Single-origin from Stone Mountain. Espresso, lattes, chai, matcha — pulled fresh, all day long." },
            { label: "Soundtrack", title: "Jazz to Amapiano", desc: "Morning jazz eases into soulful Amapiano and deep house by afternoon. The vibe shifts with the light." },
            { label: "Private Events", title: "The Firehouse is Yours", desc: "Birthdays, launches, brunches — we host it all in 3,300 square feet of historic character." },
          ].map((card, i) => (
            <CardAnim key={card.label} delay={i * 0.1} className="p-6 sm:p-8 border" style={{ borderColor: c.border, background: c.bg, borderRadius: "2px" }}>
              <p className="text-[11px] tracking-[0.25em] uppercase mb-3" style={{ color: c.accent }}>{card.label}</p>
              <p className="text-[clamp(18px,1.5vw,22px)] font-serif italic mb-3">{card.title}</p>
              <p className="text-[14px] leading-[1.75]" style={{ color: c.textMuted }}>{card.desc}</p>
            </CardAnim>
          ))}
        </div>
      </section>

      {/* ── Quote ────────────────────────────────────────── */}
      <section className="relative px-6 sm:px-10" style={{ paddingTop: "clamp(70px,10vw,140px)", paddingBottom: "clamp(70px,10vw,140px)", background: c.bgDeep }}>
        <WarmDots className="absolute top-0 right-8 w-16 h-32 opacity-20 hidden lg:block" />
        <div className="max-w-[650px] mx-auto text-center relative">
          <AnimLine width="40px" color={c.accent} className="mb-10" />
          <R>
            <p className="font-serif italic text-[clamp(22px,3vw,38px)] leading-[1.35] mb-8" style={{ color: c.text }}>
              <WordPop text="&ldquo;Come for a coffee date and stay for a meal within its historic space.&rdquo;" delay={0} />
            </p>
          </R>
          <R delay={0.4}>
            <p className="text-[12px] tracking-[0.2em] uppercase font-medium" style={{ color: c.accent }}>Resy &middot; Top 25 Atlanta &middot; 5.0 Stars</p>
          </R>
          <AnimLine width="40px" color={c.accent} className="mt-10" />
        </div>
      </section>

      {/* ── Menu ─────────────────────────────────────────── */}
      <section id="menu" className="relative" style={{ background: c.bgWarm, paddingTop: "clamp(80px,10vw,160px)", paddingBottom: "clamp(80px,10vw,160px)" }}>
        <AnimLine width="50%" className="absolute top-0 left-1/2 -translate-x-1/2" />
        <div className="max-w-[800px] mx-auto px-6 sm:px-10">
          <R><p className="text-[11px] tracking-[0.35em] uppercase text-center mb-4" style={{ color: c.accent }}>Menu</p></R>
          <AnimLine width="40px" color={c.accent} className="mb-8" />
          <R delay={0.1}><h2 className="font-serif italic text-[clamp(28px,4vw,48px)] leading-[1.2] text-center mb-4"><WordPop text="Every dish tells a story." delay={0} /></h2></R>
          <R delay={0.15}><p className="text-center text-[clamp(14px,1vw,16px)] max-w-[440px] mx-auto mb-10" style={{ color: c.textMuted }}>Caribbean soul meets Asian fire — from oxtail benedicts at breakfast to wok-tossed lo mein at lunch.</p></R>

          <R delay={0.2}>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setTab(key)} className="px-5 py-3 text-[13px] font-medium transition-all duration-300 min-h-[48px] sm:min-h-0 sm:py-2.5"
                  style={{ background: tab === key ? c.surfaceDark : "transparent", color: tab === key ? c.bg : c.textMuted, border: `1px solid ${tab === key ? c.surfaceDark : c.border}`, borderRadius: "2px" }}>
                  {label}
                </button>
              ))}
            </div>
          </R>
          <p className="text-[12px] text-center mb-8 tracking-[0.08em]" style={{ color: c.textMuted }}>{active.sub}</p>

          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {(active.items as readonly MI[]).map((item, i) => (
              <motion.div key={item.n} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.45, delay: i * 0.04 }}
                className="py-4 border-b transition-colors duration-300 hover:border-[#9B2C2C]/30" style={{ borderColor: c.border }}>
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-[clamp(15px,1.2vw,17px)] font-medium">
                        {item.n}
                        {item.f && <span className="ml-2 text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 border" style={{ color: c.accent, borderColor: c.accent, borderRadius: "2px" }}>Popular</span>}
                      </h3>
                      <div className="flex-1 border-b border-dotted hidden sm:block" style={{ borderColor: c.border }} />
                      <span className="text-[15px] tabular-nums hidden sm:block" style={{ color: c.textMuted }}>${item.p}</span>
                    </div>
                    <p className="text-[13px] mt-1 leading-relaxed" style={{ color: c.textMuted }}>{item.d}</p>
                  </div>
                  <span className="text-[15px] tabular-nums sm:hidden" style={{ color: c.textMuted }}>${item.p}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <R delay={0.1}>
            <div className="mt-14 overflow-hidden border" style={{ borderColor: c.border, borderRadius: "2px" }}>
              <img src="/images/menu.png" alt="Full Station 11 menu" className="w-full h-auto" />
            </div>
            <p className="text-[12px] text-center mt-3" style={{ color: c.textMuted }}>Prices and items may change seasonally</p>
          </R>
        </div>
      </section>

      {/* ── Firehouse ────────────────────────────────────── */}
      <section id="firehouse" className="relative px-6 sm:px-10" style={{ paddingTop: "clamp(80px,12vw,160px)", paddingBottom: "clamp(80px,12vw,160px)" }}>
        <WarmDots className="absolute top-20 left-4 w-16 h-40 opacity-20 hidden lg:block" />
        <div className="max-w-[700px] mx-auto text-center">
          <R><p className="text-[11px] tracking-[0.35em] uppercase mb-4" style={{ color: c.accent }}>The Firehouse</p></R>
          <AnimLine width="60px" color={c.accent} className="mb-10" />
          <R delay={0.1}><h2 className="font-serif italic text-[clamp(28px,4vw,48px)] leading-[1.2] mb-8"><WordPop text="A century of history, a new chapter of flavor." delay={0} /></h2></R>
          <R delay={0.2}>
            <p className="text-[clamp(15px,1.2vw,17px)] leading-[1.85] mb-10" style={{ color: c.textMuted }}>
              Fire Station No. 11 has stood on North Avenue since 1907. Listed on the National Register of Historic Places, the 3,300-square-foot space still holds its original arched windows, rich millwork, and exposed brick. Bold murals cover the walls. Marble-top tables sit beside sage velvet banquettes. We kept every bone of this building and added the soul.
            </p>
          </R>
        </div>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { val: "1907", desc: "Year built — National Register of Historic Places" },
            { val: "3,300 ft²", desc: "Of original millwork, arched windows, exposed brick" },
            { val: "Coming Soon", desc: "A speakeasy in the basement. Stay tuned." },
          ].map((s, i) => (
            <CardAnim key={s.val} delay={i * 0.1} className="text-center p-6 sm:p-8 border" style={{ borderColor: c.border, background: c.surface, borderRadius: "2px" }}>
              <p className="font-serif italic text-[clamp(24px,2.5vw,36px)] mb-2" style={{ color: c.accent }}>{s.val}</p>
              <p className="text-[13px] leading-[1.6]" style={{ color: c.textMuted }}>{s.desc}</p>
            </CardAnim>
          ))}
        </div>
      </section>

      {/* ── Visit ────────────────────────────────────────── */}
      <section id="visit" className="relative" style={{ background: c.bgDeep, paddingTop: "clamp(80px,10vw,160px)", paddingBottom: "clamp(80px,10vw,160px)" }}>
        <AnimLine width="50%" className="absolute top-0 left-1/2 -translate-x-1/2" />
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 text-center">
          <R><p className="text-[11px] tracking-[0.35em] uppercase mb-4" style={{ color: c.accent }}>Visit Us</p></R>
          <AnimLine width="40px" color={c.accent} className="mb-8" />
          <R delay={0.1}><h2 className="font-serif italic text-[clamp(28px,4vw,48px)] leading-[1.2] mb-4"><WordPop text="From the firehouse, with love." delay={0} /></h2></R>
          <R delay={0.15}><p className="text-[clamp(14px,1vw,16px)] max-w-[400px] mx-auto mb-12" style={{ color: c.textMuted }}>Walk-ins welcome. Reservations on Resy. Come hungry, leave full, tell a friend.</p></R>

          <R delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {[
                { label: "Address", main: "30 North Ave NE", sub: "Atlanta, GA 30308 · Midtown", href: "https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" },
                { label: "Hours", main: "Mon–Fri 8am–3pm", sub: "Sat–Sun 8am–4pm · Brunch" },
                { label: "Call Ahead", main: "(470) 319-8392", sub: "@station11atl", href: "tel:+14703198392" },
              ].map((b, i) => (
                <CardAnim key={b.label} delay={i * 0.1} className="p-6 border" style={{ borderColor: c.border, background: c.bg, borderRadius: "2px" }}>
                  <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: c.accent }}>{b.label}</p>
                  {b.href ? <a href={b.href} target={b.href.startsWith("http") ? "_blank" : undefined} rel={b.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-[16px] font-medium hover:opacity-70 transition-opacity">{b.main}</a> : <p className="text-[16px] font-medium">{b.main}</p>}
                  <p className="text-[13px] mt-1" style={{ color: c.textMuted }}>{b.sub}</p>
                </CardAnim>
              ))}
            </div>
          </R>

          <R delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
                className="px-7 py-4 sm:py-3 text-[13px] font-medium tracking-[0.05em] uppercase transition-all hover:opacity-80 min-h-[48px] inline-flex items-center justify-center"
                style={{ background: c.surfaceDark, color: c.bg, borderRadius: "2px" }}>Book a Table</a>
              <a href="tel:+14703198392" className="px-7 py-4 sm:py-3 text-[13px] font-medium tracking-[0.05em] uppercase border transition-all hover:bg-[#2C2A25]/5 min-h-[48px] inline-flex items-center justify-center"
                style={{ borderColor: c.text, color: c.text, borderRadius: "2px" }}>Call Us</a>
              <a href="https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" target="_blank" rel="noopener noreferrer"
                className="px-7 py-4 sm:py-3 text-[13px] font-medium tracking-[0.05em] uppercase border transition-all hover:bg-[#2C2A25]/5 min-h-[48px] inline-flex items-center justify-center"
                style={{ borderColor: c.text, color: c.text, borderRadius: "2px" }}>Get Directions</a>
            </div>
          </R>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="px-6 sm:px-10 py-12 border-t" style={{ borderColor: c.border, background: c.surfaceDark }}>
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img src="/images/logo-black.png" alt="Station Eleven" className="h-10 object-contain invert" />
              <div>
                <p className="text-[14px] font-medium" style={{ color: c.bg }}>Station Eleven</p>
                <p className="text-[12px]" style={{ color: `${c.bg}60` }}>Caribbean-Asian Cafe &middot; Midtown Atlanta</p>
              </div>
            </div>
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
              className="px-6 py-2.5 text-[13px] font-medium tracking-[0.05em] uppercase border transition-all hover:bg-white/5 min-h-[44px] inline-flex items-center"
              style={{ borderColor: `${c.bg}30`, color: c.bg, borderRadius: "2px" }}>Book a Table</a>
          </div>
          <div className="h-[1px] mb-6" style={{ background: `${c.bg}10` }} />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]" style={{ color: `${c.bg}40` }}>
            <p>30 North Ave NE, Atlanta, GA 30308</p>
            <div className="flex items-center gap-8 py-2">
              <a href="https://www.instagram.com/station11atl/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors min-h-[44px] flex items-center">Instagram</a>
              <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors min-h-[44px] flex items-center">Resy</a>
              <a href="tel:+14703198392" className="hover:text-white transition-colors min-h-[44px] flex items-center">(470) 319-8392</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
