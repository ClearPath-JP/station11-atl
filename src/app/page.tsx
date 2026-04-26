"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

/* ─── Palette ─────────────────────────────────────────────────── */
const c = {
  gold: "#C49E64",
  cream: "#F0EBE3",
  dark: "#0E0D0B",
  surface: "#16150F",
  surfaceLight: "#1C1B16",
  muted: "#807A6F",
  text: "#C5BFAD",
  border: "rgba(196,158,100,0.12)",
};

/* ─── Menu Data ──────────────────────────────────────────────── */
const BREAKFAST = [
  { name: "Fireman's Breakfast", price: 15, desc: "Scrambled eggs, cheese grits, bacon or sausage, sourdough" },
  { name: "Stir Fry Shrimp & Grits", price: 18, desc: "Wok seared shrimp, butter, basil, sweet corn" },
  { name: "Oxtail & Grits", price: 19, desc: "Thyme & scallion braised gravy, smash grits" },
  { name: "Oxtail Benedict", price: 18, desc: "English muffin, poached eggs, hollandaise" },
  { name: "Station 11 Pancakes", price: 14, desc: "House maple syrup, seasonal fruit" },
  { name: "Breakfast Bagel", price: 12, desc: "Cheese, bacon or sausage, cream cheese, scrambled eggs" },
];
const LUNCH = [
  { name: "Oxtail Sandwich", price: 18, desc: "Braised oxtail, gravy, sourdough — the signature", pop: true },
  { name: "Jerk Chicken", price: 17, desc: "Rice & peas, cabbage, plantain", pop: true },
  { name: "Herb Seared Salmon", price: 22, desc: "Coconut jasmine rice, seasonal vegetables" },
  { name: "S11 Burger", price: 16, desc: "Smash patty, cheddar, caramelized onion, special sauce" },
  { name: "Fried Chicken Sandwich", price: 16, desc: "Buttermilk, white sauce, cabbage, hot pepper" },
  { name: "Coconut Shrimp", price: 16, desc: "Sweet chili, pickled cabbage" },
  { name: "Fried Wings", price: 14, desc: "Jerk or honey garlic, pickled slaw" },
];
const WOK = [
  { name: "Oxtail Fried Rice", price: 17, desc: "Egg, green onion, braised oxtail, bok choy, crispy shallots" },
  { name: "Shrimp Lo Mein", price: 16, desc: "Wok-tossed noodles, vegetables, soy glaze" },
  { name: "Mongolian Beef", price: 17, desc: "Scallion, ginger, soy, steamed rice" },
];
const COFFEE = [
  { name: "Espresso", price: 4, desc: "Double shot" },
  { name: "Latte", price: 6, desc: "Espresso, steamed milk" },
  { name: "Cappuccino", price: 5, desc: "Espresso, foam" },
  { name: "Flat White", price: 6, desc: "Velvety microfoam" },
  { name: "Cinnamon Vanilla Latte", price: 6.5, desc: "House-made cinnamon syrup" },
  { name: "Cardamom Chai", price: 6.5, desc: "Spiced, steamed oat milk" },
  { name: "Matcha Milk Tea", price: 6, desc: "Ceremonial grade" },
  { name: "Chai Latte", price: 6, desc: "Traditional spice blend" },
];
const TABS = [
  { key: "breakfast", label: "Breakfast", sub: "Mon–Fri 8–11am", data: BREAKFAST },
  { key: "lunch", label: "Lunch", sub: "Mon–Fri 11am–3pm", data: LUNCH },
  { key: "wok", label: "Wok", sub: "Lunch service", data: WOK },
  { key: "coffee", label: "Coffee", sub: "All day · Gilly Brew Bar", data: COFFEE },
] as const;
const NAV = [
  { href: "#story", label: "Story" }, { href: "#plates", label: "Plates" },
  { href: "#menu", label: "Menu" }, { href: "#firehouse", label: "Firehouse" }, { href: "#visit", label: "Visit" },
];

/* ─── Logo SVG ────────────────────────────────────────────────── */
function Logo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="50" fill="#CC0000" />
      <text x="50" y="58" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="38" fontWeight="400" fill="white" letterSpacing="2">S11</text>
    </svg>
  );
}

/* ─── Primitives ─────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }} className={className}>{children}</motion.div>;
}

function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={`rounded-2xl border p-6 sm:p-8 transition-colors duration-500 hover:border-[#C49E64]/30 ${className}`}
      style={{ borderColor: c.border, background: c.surfaceLight }}
    >{children}</motion.div>
  );
}

function SplitH({ top, bottom, className = "" }: { top: string; bottom: string; className?: string }) {
  return (
    <h2 className={`font-display leading-[0.92] tracking-[0.02em] ${className}`}>
      <motion.span className="block" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>{top}</motion.span>
      <motion.span className="block" style={{ color: c.gold }} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}>{bottom}</motion.span>
    </h2>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span animate={open ? { rotate: 45, y: 8 } : {}} className="block w-full h-[1.5px] origin-center" style={{ background: c.cream }} transition={{ duration: 0.3 }} />
      <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block w-full h-[1.5px]" style={{ background: c.cream }} transition={{ duration: 0.2 }} />
      <motion.span animate={open ? { rotate: -45, y: -8 } : {}} className="block w-full h-[1.5px] origin-center" style={{ background: c.cream }} transition={{ duration: 0.3 }} />
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function Page() {
  const [tab, setTab] = useState<string>("lunch");
  const [navOpen, setNavOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: hp } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOp = useTransform(hp, [0, 0.7], [1, 0]);
  const heroScale = useTransform(hp, [0, 1], [1, 1.08]);
  const { scrollYProgress } = useScroll();
  const px = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => { if (!navOpen) return; const cl = () => setNavOpen(false); window.addEventListener("scroll", cl, { passive: true }); return () => window.removeEventListener("scroll", cl); }, [navOpen]);
  const active = TABS.find((t) => t.key === tab) ?? TABS[1];

  return (
    <div className="min-h-screen" style={{ background: c.dark }}>
      {/* Progress */}
      <motion.div style={{ scaleX: px, transformOrigin: "0%" }} className="fixed top-16 left-0 right-0 h-[2px] z-50"><div className="w-full h-full" style={{ background: c.gold }} /></motion.div>

      {/* ── Nav ─────────────────────────────────────────── */}
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="fixed top-0 inset-x-0 z-50 backdrop-blur-lg border-b" style={{ background: "rgba(14,13,11,0.88)", borderColor: c.border }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <Logo size={32} />
            <span className="text-[13px] tracking-[0.2em] uppercase hidden sm:block" style={{ color: c.muted }}>Station Eleven</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-[13px]" style={{ color: c.muted }}>
            {NAV.map((l) => <a key={l.label} href={l.href} className="hover:text-[#F0EBE3] transition-colors duration-300">{l.label}</a>)}
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="ml-2 px-5 py-2 rounded-full text-[13px] font-medium transition-all hover:brightness-110" style={{ background: c.gold, color: c.dark }}>Reserve</a>
          </div>
          <button onClick={() => setNavOpen((v) => !v)} className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menu"><Hamburger open={navOpen} /></button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="md:hidden overflow-hidden border-b" style={{ background: "rgba(14,13,11,0.95)", borderColor: c.border }}>
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV.map((l) => <a key={l.label} href={l.href} onClick={() => setNavOpen(false)} className="py-3 text-[16px] border-b last:border-0" style={{ color: c.cream, borderColor: c.border }}>{l.label}</a>)}
                <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="mt-3 py-3.5 text-center rounded-full text-[15px] font-medium" style={{ background: c.gold, color: c.dark }}>Reserve a Table</a>
                <a href="tel:+14703198392" className="py-3 text-center text-[15px]" style={{ color: c.gold }}>(470) 319-8392</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section ref={heroRef} id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img src="/images/exterior.jpg" alt="Station 11 historic firehouse" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,13,11,0.88) 0%, rgba(14,13,11,0.55) 35%, rgba(14,13,11,0.65) 65%, rgba(14,13,11,0.95) 100%)" }} />
        </motion.div>

        <motion.div style={{ opacity: heroOp }} className="relative text-center px-6 max-w-[1000px]">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="mb-8">
            <Logo size={80} className="mx-auto sm:w-[100px] sm:h-[100px]" />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="text-[11px] sm:text-[12px] tracking-[0.4em] uppercase mb-8" style={{ color: `${c.gold}AA` }}>
            Station &bull; Eleven &bull; Midtown Atlanta
          </motion.p>
          <motion.h1 className="font-serif italic text-[clamp(36px,7.5vw,88px)] leading-[1.08] tracking-[-0.02em] mb-6 text-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            Where East Meets<br /><span style={{ color: c.gold }}>West Indies</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="text-[clamp(15px,1.4vw,19px)] font-light leading-[1.7] max-w-[520px] mx-auto text-white/70">
            Caribbean-Asian fusion in a historic 1907 firehouse. Jerk traditions meet Asian precision — every dish tells two stories.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="px-8 py-4 sm:py-3.5 rounded-full text-[14px] font-medium transition-all hover:brightness-110 hover:scale-105 min-h-[48px] inline-flex items-center" style={{ background: c.gold, color: c.dark }}>Reserve a Table</a>
            <a href="#menu" className="px-8 py-4 sm:py-3.5 rounded-full text-[14px] font-medium border border-white/20 text-white transition-all hover:bg-white/10 min-h-[48px] inline-flex items-center">View Menu</a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="w-[1px] h-10 bg-gradient-to-b from-[#C49E64]/50 to-transparent" />
        </motion.div>
      </section>

      {/* ── Ticker ──────────────────────────────────────── */}
      <div className="overflow-hidden py-3.5" style={{ background: c.gold }}>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: c.dark }}>
              Caribbean-Asian Fusion &bull; Brunch &bull; Lunch &bull; Coffee by Gilly Brew Bar &bull; Private Events &bull; Resy Top 25 &bull; 5.0 Stars &bull; Est. 1907 &bull;&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Story ───────────────────────────────────────── */}
      <section id="story" className="px-6 sm:px-10" style={{ paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(60px,8vw,120px)" }}>
        <div className="max-w-[1000px] mx-auto text-center">
          <Reveal><p className="text-[11px] tracking-[0.35em] uppercase mb-10" style={{ color: c.gold }}>Our Story</p></Reveal>
          <Reveal delay={0.1}>
            <p className="font-serif italic text-[clamp(22px,3.2vw,42px)] leading-[1.35] tracking-[-0.01em]" style={{ color: c.cream }}>
              In our kitchen, wok meets grill. Dumplings are filled
              with braised oxtail. Rice is kissed with coconut. Every
              dish is both familiar and surprising — a celebration of
              the harmony that emerges when East meets West Indies.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Feature Cards ───────────────────────────────── */}
      <section className="px-6 sm:px-10 pb-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card delay={0}>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: c.gold }}>Coffee</p>
            <p className="text-[clamp(18px,1.5vw,22px)] font-medium mb-2" style={{ color: c.cream }}>Gilly Brew Bar</p>
            <p className="text-[14px] leading-[1.7]" style={{ color: c.muted }}>Single-origin beans from Stone Mountain. Espresso, lattes, chai, and matcha — pulled fresh all day.</p>
          </Card>
          <Card delay={0.1}>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: c.gold }}>Music</p>
            <p className="text-[clamp(18px,1.5vw,22px)] font-medium mb-2" style={{ color: c.cream }}>Jazz &bull; Amapiano &bull; House</p>
            <p className="text-[14px] leading-[1.7]" style={{ color: c.muted }}>The soundtrack shifts with the day. Morning jazz eases into soulful Amapiano and deep house by afternoon.</p>
          </Card>
          <Card delay={0.2}>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: c.gold }}>Events</p>
            <p className="text-[clamp(18px,1.5vw,22px)] font-medium mb-2" style={{ color: c.cream }}>Private Bookings</p>
            <p className="text-[14px] leading-[1.7]" style={{ color: c.muted }}>The firehouse is yours. Birthdays, launches, brunches — we host it all. Inquire for availability.</p>
          </Card>
        </div>
      </section>

      {/* ── Signature Plates ─────────────────────────────── */}
      <section id="plates" className="px-6 sm:px-10" style={{ paddingTop: "clamp(80px,10vw,160px)", paddingBottom: "clamp(80px,10vw,160px)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img src="/images/jerk-chicken.jpg" alt="Jerk chicken with rice & peas, plantain, cabbage" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display text-[clamp(22px,3vw,36px)] tracking-[0.03em] text-white">JERK CHICKEN</p>
                  <p className="text-[14px] text-white/60 mt-1">Rice &amp; peas &middot; cabbage &middot; plantain &middot; $17</p>
                </div>
              </div>
            </motion.div>

            <div>
              <Reveal><p className="text-[11px] tracking-[0.35em] uppercase mb-8" style={{ color: c.gold }}>Signature Plates</p></Reveal>
              <Reveal delay={0.1}><SplitH top="CARIBBEAN" bottom="SOUL" className="text-[clamp(44px,6vw,80px)] mb-8" /></Reveal>
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85] mb-8" style={{ color: c.text }}>
                  Our oxtail is braised until it falls apart. The jerk chicken is marinated for 24 hours. Shrimp is wok-fired to order. Nothing sits, nothing waits — every plate is made with care that takes time but never feels rushed.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="space-y-0">
                  {[
                    { name: "Oxtail Sandwich", note: "The #1 — braised oxtail, gravy, sourdough", price: "$18" },
                    { name: "Oxtail & Grits", note: "Thyme & scallion braised gravy", price: "$19" },
                    { name: "Oxtail Fried Rice", note: "Wok-tossed, bok choy, crispy shallots", price: "$17" },
                  ].map((d) => (
                    <motion.div key={d.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                      className="flex items-baseline justify-between py-4 border-b" style={{ borderColor: c.border }}>
                      <div>
                        <p className="text-[15px] font-medium" style={{ color: c.cream }}>{d.name}</p>
                        <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>{d.note}</p>
                      </div>
                      <span className="text-[15px] font-light tabular-nums" style={{ color: c.gold }}>{d.price}</span>
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote ────────────────────────────────────────── */}
      <section style={{ background: c.surface, paddingTop: "clamp(60px,8vw,120px)", paddingBottom: "clamp(60px,8vw,120px)" }}>
        <div className="max-w-[800px] mx-auto text-center px-6">
          <Reveal>
            <Logo size={40} className="mx-auto mb-8" />
            <p className="font-serif italic text-[clamp(20px,3vw,36px)] leading-[1.4]" style={{ color: c.cream }}>
              &ldquo;Come for a coffee date and stay for a meal within its historic space.&rdquo;
            </p>
            <p className="text-[12px] mt-8 tracking-[0.25em] uppercase font-medium" style={{ color: c.gold }}>Resy &bull; Top 25 Atlanta &bull; 5.0 Stars</p>
          </Reveal>
        </div>
      </section>

      {/* ── Menu ─────────────────────────────────────────── */}
      <section id="menu" className="px-6 sm:px-10" style={{ paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(80px,10vw,160px)" }}>
        <div className="max-w-[900px] mx-auto">
          <Reveal><p className="text-[11px] tracking-[0.35em] uppercase text-center mb-6" style={{ color: c.gold }}>Menu</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif italic text-[clamp(34px,5vw,60px)] leading-[1.05] text-center mb-4" style={{ color: c.cream }}>
              Every dish tells <span style={{ color: c.gold }}>a story</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[clamp(14px,1vw,16px)] font-light text-center max-w-[460px] mx-auto mb-12" style={{ color: c.muted }}>
              Caribbean soul meets Asian fire — from oxtail benedicts at breakfast to wok-tossed lo mein at lunch.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setTab(key)} className="px-5 py-3 text-[14px] sm:text-[13px] font-medium rounded-full transition-all duration-300 min-h-[48px] sm:min-h-0 sm:py-2.5"
                  style={{ background: tab === key ? c.gold : "transparent", color: tab === key ? c.dark : c.muted, border: `1px solid ${tab === key ? c.gold : c.border}` }}>
                  {label}
                </button>
              ))}
            </div>
          </Reveal>
          <p className="text-[12px] text-center mb-10 tracking-[0.1em]" style={{ color: c.muted }}>{active.sub}</p>

          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {active.data.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.45, delay: i * 0.04 }}
                className="py-5 border-b transition-colors duration-300 hover:border-[#C49E64]/30" style={{ borderColor: c.border }}>
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-[clamp(15px,1.2vw,18px)] font-medium" style={{ color: c.cream }}>
                        {item.name}
                        {(item as { pop?: boolean }).pop && <span className="ml-2 text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full" style={{ background: `${c.gold}20`, color: c.gold }}>Popular</span>}
                      </h3>
                      <div className="flex-1 border-b border-dotted hidden sm:block" style={{ borderColor: c.border }} />
                      <span className="text-[clamp(14px,1.1vw,17px)] font-light tabular-nums hidden sm:block" style={{ color: c.muted }}>${item.price}</span>
                    </div>
                    {"desc" in item && item.desc && <p className="text-[clamp(12px,0.9vw,14px)] mt-1.5 leading-relaxed" style={{ color: c.muted }}>{item.desc as string}</p>}
                  </div>
                  <span className="text-[15px] font-light tabular-nums sm:hidden" style={{ color: c.muted }}>${item.price}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <Reveal delay={0.1}>
            <div className="mt-16 rounded-2xl overflow-hidden border" style={{ borderColor: c.border }}>
              <img src="/images/menu.png" alt="Full menu" className="w-full h-auto" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Firehouse ────────────────────────────────────── */}
      <section id="firehouse" style={{ background: c.surface, paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(100px,14vw,200px)" }}>
        <div className="max-w-[1000px] mx-auto px-6 sm:px-10 text-center">
          <Reveal><p className="text-[11px] tracking-[0.35em] uppercase mb-8" style={{ color: c.gold }}>The Firehouse</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif italic text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6" style={{ color: c.cream }}>
              A century of <span style={{ color: c.gold }}>history</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85] max-w-[640px] mx-auto mb-12" style={{ color: c.text }}>
              Fire Station No. 11 has stood on North Avenue for over a century. Listed on the National Register of Historic Places, the 3,300-square-foot space still holds its original arched windows, rich millwork, and exposed brick. Bold murals cover the walls. Marble-top tables sit beside sage velvet banquettes. We kept the history and added the flavor.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <Card delay={0}>
              <p className="font-display text-[clamp(32px,3.5vw,48px)] tracking-[0.02em]" style={{ color: c.gold }}>1907</p>
              <p className="text-[13px] mt-2" style={{ color: c.muted }}>Year built &middot; National Register of Historic Places</p>
            </Card>
            <Card delay={0.1}>
              <p className="font-display text-[clamp(32px,3.5vw,48px)] tracking-[0.02em]" style={{ color: c.gold }}>3,300</p>
              <p className="text-[13px] mt-2" style={{ color: c.muted }}>Square feet of original millwork, arched windows, exposed brick</p>
            </Card>
            <Card delay={0.2}>
              <p className="font-display text-[clamp(32px,3.5vw,48px)] tracking-[0.02em]" style={{ color: c.gold }}>Soon</p>
              <p className="text-[13px] mt-2" style={{ color: c.muted }}>A speakeasy is coming to the basement. Stay tuned.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Visit ────────────────────────────────────────── */}
      <section id="visit" className="px-6 sm:px-10" style={{ paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(100px,14vw,200px)" }}>
        <div className="max-w-[1000px] mx-auto text-center">
          <Reveal><p className="text-[11px] tracking-[0.35em] uppercase mb-6" style={{ color: c.gold }}>Visit</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif italic text-[clamp(34px,5vw,60px)] leading-[1.05] mb-4" style={{ color: c.cream }}>Come <span style={{ color: c.gold }}>hungry</span></h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[clamp(14px,1vw,16px)] font-light max-w-[400px] mx-auto mb-14" style={{ color: c.muted }}>Walk-ins welcome. Reservations on Resy. Come hungry, leave full, tell a friend.</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-14">
              {[
                { label: "Address", main: "30 North Ave NE", sub: "Atlanta, GA 30308", href: "https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" },
                { label: "Hours", main: "Mon–Fri 8am–3pm", sub: "Sat–Sun 8am–4pm (Brunch)" },
                { label: "Contact", main: "(470) 319-8392", sub: "@station11atl", href: "tel:+14703198392" },
              ].map((b) => (
                <Card key={b.label} delay={0.1} className="text-center">
                  <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: c.gold }}>{b.label}</p>
                  {b.href ? (
                    <a href={b.href} target={b.href.startsWith("http") ? "_blank" : undefined} rel={b.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-[16px] font-medium hover:opacity-70 transition-opacity" style={{ color: c.cream }}>{b.main}</a>
                  ) : (
                    <p className="text-[16px] font-medium" style={{ color: c.cream }}>{b.main}</p>
                  )}
                  <p className="text-[13px] mt-1" style={{ color: c.muted }}>{b.sub}</p>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="px-8 py-4 sm:py-3.5 rounded-full text-[14px] font-medium transition-all hover:brightness-110 hover:scale-105 min-h-[48px] inline-flex items-center justify-center" style={{ background: c.gold, color: c.dark }}>Reserve on Resy</a>
              <a href="tel:+14703198392" className="px-8 py-4 sm:py-3.5 rounded-full border text-[14px] font-medium transition-all hover:bg-white/5 min-h-[48px] inline-flex items-center justify-center" style={{ borderColor: c.border, color: c.cream }}>Call Us</a>
              <a href="https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" target="_blank" rel="noopener noreferrer" className="px-8 py-4 sm:py-3.5 rounded-full border text-[14px] font-medium transition-all hover:bg-white/5 min-h-[48px] inline-flex items-center justify-center" style={{ borderColor: c.border, color: c.cream }}>Directions</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="px-6 sm:px-10 py-14 border-t" style={{ borderColor: c.border }}>
        <div className="max-w-[1000px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <Logo size={36} />
            <div>
              <p className="text-[14px] font-medium" style={{ color: c.cream }}>Station Eleven</p>
              <p className="text-[12px]" style={{ color: c.muted }}>Caribbean-Asian Fusion &bull; Midtown ATL</p>
            </div>
          </div>
          <div className="flex items-center gap-8 text-[13px] py-2" style={{ color: c.muted }}>
            <a href="https://www.instagram.com/station11atl/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0EBE3] transition-colors min-h-[44px] flex items-center">Instagram</a>
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0EBE3] transition-colors min-h-[44px] flex items-center">Resy</a>
            <a href="tel:+14703198392" className="hover:text-[#F0EBE3] transition-colors min-h-[44px] flex items-center">(470) 319-8392</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
