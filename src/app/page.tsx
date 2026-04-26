"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

/* ─── Palette — warm gold accent inspired by Amrit Palace ─────── */
const c = {
  gold: "#C49E64",
  cream: "#F0EBE3",
  dark: "#0E0D0B",
  surface: "#16150F",
  muted: "#807A6F",
  text: "#C5BFAD",
  border: "rgba(196,158,100,0.12)",
};

/* ─── Menu ────────────────────────────────────────────────────── */
const BREAKFAST = [
  { name: "Fireman's Breakfast", price: 15, desc: "Scrambled eggs, cheese grits, bacon or sausage, sourdough" },
  { name: "Stir Fry Shrimp & Grits", price: 18, desc: "Wok seared shrimp, butter, basil, sweet corn" },
  { name: "Oxtail & Grits", price: 19, desc: "Thyme & scallion braised gravy, smash grits" },
  { name: "Oxtail Benedict", price: 18, desc: "English muffin, poached eggs, hollandaise" },
  { name: "Station 11 Pancakes", price: 14, desc: "House maple syrup, seasonal fruit" },
  { name: "Breakfast Bagel", price: 12, desc: "Cheese, bacon or sausage, cream cheese, scrambled eggs" },
];

const LUNCH = [
  { name: "Oxtail Sandwich", price: 18, desc: "Braised oxtail, gravy, sourdough — the signature", featured: true },
  { name: "Jerk Chicken", price: 17, desc: "Rice & peas, cabbage, plantain", featured: true },
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
  { name: "Espresso", price: 4 }, { name: "Latte", price: 6 },
  { name: "Cappuccino", price: 5 }, { name: "Flat White", price: 6 },
  { name: "Cinnamon Vanilla Latte", price: 6.5 }, { name: "Cardamom Chai", price: 6.5 },
  { name: "Matcha Milk Tea", price: 6 }, { name: "Chai Latte", price: 6 },
];

const TABS = [
  { key: "breakfast", label: "Breakfast", sub: "Mon–Fri 8–11am", data: BREAKFAST },
  { key: "lunch", label: "Lunch & Plates", sub: "Mon–Fri 11am–3pm", data: LUNCH },
  { key: "wok", label: "From the Wok", sub: "Lunch service", data: WOK },
  { key: "coffee", label: "Coffee & Tea", sub: "All day · Gilly Brew Bar", data: COFFEE },
] as const;

const NAV = [
  { href: "#story", label: "Story" }, { href: "#signature", label: "Signature" },
  { href: "#menu", label: "Menu" }, { href: "#firehouse", label: "Firehouse" }, { href: "#visit", label: "Visit" },
];

/* ─── Primitives ─────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }} className={className}>{children}</motion.div>
  );
}

function SplitHeadline({ top, bottom, className = "" }: { top: string; bottom: string; className?: string }) {
  return (
    <h2 className={`font-display leading-[0.92] tracking-[0.02em] ${className}`}>
      <motion.span className="block" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>{top}</motion.span>
      <motion.span className="block" style={{ color: c.gold }} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}>{bottom}</motion.span>
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
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOp = useTransform(heroProgress, [0, 0.7], [1, 0]);

  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => { if (!navOpen) return; const cl = () => setNavOpen(false); window.addEventListener("scroll", cl, { passive: true }); return () => window.removeEventListener("scroll", cl); }, [navOpen]);

  const active = TABS.find((t) => t.key === tab) ?? TABS[1];

  return (
    <div className="min-h-screen" style={{ background: c.dark }}>

      {/* Progress */}
      <motion.div style={{ scaleX: progressX, transformOrigin: "0%" }} className="fixed top-16 left-0 right-0 h-[2px] z-50">
        <div className="w-full h-full" style={{ background: c.gold }} />
      </motion.div>

      {/* ── Nav ─────────────────────────────────────────── */}
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-lg border-b" style={{ background: "rgba(14,13,11,0.88)", borderColor: c.border }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <span className="font-display text-[20px] tracking-[0.08em]" style={{ color: c.gold }}>STATION</span>
            <span className="w-[3px] h-[3px] rounded-full" style={{ background: c.gold }} />
            <span className="font-display text-[20px] tracking-[0.08em]" style={{ color: c.cream }}>ELEVEN</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-[13px]" style={{ color: c.muted }}>
            {NAV.map((l) => <a key={l.label} href={l.href} className="hover:text-[#F0EBE3] transition-colors duration-300">{l.label}</a>)}
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
              className="ml-2 px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 hover:brightness-110" style={{ background: c.gold, color: c.dark }}>Reserve</a>
          </div>
          <button onClick={() => setNavOpen((v) => !v)} className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menu">
            <Hamburger open={navOpen} />
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-b" style={{ background: "rgba(14,13,11,0.95)", borderColor: c.border }}>
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV.map((l) => <a key={l.label} href={l.href} onClick={() => setNavOpen(false)} className="py-3 text-[16px] border-b last:border-0" style={{ color: c.cream, borderColor: c.border }}>{l.label}</a>)}
                <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
                  className="mt-3 py-3.5 text-center rounded-full text-[15px] font-medium" style={{ background: c.gold, color: c.dark }}>Reserve a Table</a>
                <a href="tel:+14703198392" className="py-3 text-center text-[15px]" style={{ color: c.gold }}>(470) 319-8392</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero — full viewport, centered ──────────────── */}
      <section ref={heroRef} id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Background: subtle warm radial */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 35%, rgba(196,158,100,0.06) 0%, transparent 60%)` }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c.dark} 0%, transparent 30%, transparent 80%, ${c.dark} 100%)` }} />

        <motion.div style={{ opacity: heroOp }} className="relative text-center px-6 max-w-[1000px]">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="text-[11px] sm:text-[12px] tracking-[0.4em] uppercase mb-10" style={{ color: c.muted }}>
            Midtown Atlanta &bull; Est. in a 1907 Firehouse
          </motion.p>

          <motion.h1 className="font-serif italic text-[clamp(40px,8vw,90px)] leading-[1.05] tracking-[-0.02em] mb-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            Where East Meets
            <br />
            <span style={{ color: c.gold }}>West Indies</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
            className="text-[clamp(15px,1.4vw,19px)] font-light leading-[1.7] max-w-[520px] mx-auto" style={{ color: c.text }}>
            Caribbean-Asian fusion cuisine. Jerk traditions meet Asian
            precision in a historic firehouse where every dish tells
            two stories at once.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 sm:py-3.5 rounded-full text-[14px] font-medium transition-all duration-300 hover:brightness-110 min-h-[48px] inline-flex items-center"
              style={{ background: c.gold, color: c.dark }}>
              Reserve a Table
            </a>
            <a href="#menu" className="px-8 py-4 sm:py-3.5 rounded-full text-[14px] font-medium border transition-all duration-300 hover:bg-white/5 min-h-[48px] inline-flex items-center"
              style={{ borderColor: c.border, color: c.cream }}>
              View Menu
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-10 bg-gradient-to-b from-[#C49E64]/40 to-transparent" />
        </motion.div>
      </section>

      {/* ── Story — full-width editorial ─────────────────── */}
      <section id="story" className="px-6 sm:px-10" style={{ paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(60px,8vw,120px)" }}>
        <div className="max-w-[1000px] mx-auto text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.35em] uppercase mb-10" style={{ color: c.gold }}>Our Story</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-serif italic text-[clamp(24px,3.5vw,44px)] leading-[1.35] tracking-[-0.01em]" style={{ color: c.cream }}>
              In our kitchen, wok meets grill. Dumplings are filled
              with braised oxtail. Rice is kissed with coconut. Every
              dish is both familiar and surprising — a celebration of
              the harmony that emerges when East meets West Indies.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-[clamp(14px,1.1vw,16px)] font-light leading-[1.8] mt-10 max-w-[600px] mx-auto" style={{ color: c.muted }}>
              Coffee by Gilly Brew Bar. Music that moves between jazz,
              Amapiano, and deep house. A speakeasy coming in the basement.
              This is Station 11.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="line-fade mx-auto max-w-[50%]" />

      {/* ── Signature — full-bleed photo + text overlay ──── */}
      <section id="signature" className="relative" style={{ paddingTop: "clamp(80px,10vw,160px)", paddingBottom: "clamp(80px,10vw,160px)" }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-center">
            {/* Photo */}
            <Reveal>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img src="/images/jerk-chicken.jpg" alt="Jerk chicken with rice & peas, plantain, cabbage on marble table" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display text-[clamp(24px,3vw,40px)] tracking-[0.03em] text-white">JERK CHICKEN</p>
                  <p className="text-[14px] text-white/60 mt-1">Rice &amp; peas &middot; cabbage &middot; plantain</p>
                </div>
              </div>
            </Reveal>

            {/* Text */}
            <div>
              <Reveal>
                <p className="text-[11px] tracking-[0.35em] uppercase mb-8" style={{ color: c.gold }}>Signature Plates</p>
              </Reveal>
              <Reveal delay={0.1}>
                <SplitHeadline top="CARIBBEAN" bottom="SOUL" className="text-[clamp(48px,7vw,90px)] mb-8" />
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85] mb-8" style={{ color: c.text }}>
                  Our oxtail is braised until it falls apart. The jerk chicken
                  is marinated for 24 hours. Shrimp is wok-fired to order.
                  Nothing sits, nothing waits — every plate is made with the
                  kind of care that takes time but never feels rushed.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="space-y-4">
                  {[
                    { name: "Oxtail Sandwich", note: "Our #1 — braised oxtail, gravy, sourdough", price: "$18" },
                    { name: "Oxtail & Grits", note: "Thyme & scallion braised gravy", price: "$19" },
                    { name: "Oxtail Fried Rice", note: "Wok-tossed, bok choy, crispy shallots", price: "$17" },
                  ].map((d) => (
                    <div key={d.name} className="flex items-baseline justify-between py-3 border-b" style={{ borderColor: c.border }}>
                      <div>
                        <p className="text-[15px] font-medium" style={{ color: c.cream }}>{d.name}</p>
                        <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>{d.note}</p>
                      </div>
                      <span className="text-[15px] font-light tabular-nums" style={{ color: c.gold }}>{d.price}</span>
                    </div>
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
            <p className="font-serif italic text-[clamp(20px,3vw,36px)] leading-[1.4]" style={{ color: c.cream }}>
              &ldquo;Come for a coffee date and stay for a meal
              within its historic space.&rdquo;
            </p>
            <p className="text-[12px] mt-8 tracking-[0.25em] uppercase font-medium" style={{ color: c.gold }}>Resy &bull; Top 25 Atlanta &bull; 5.0 Stars</p>
          </Reveal>
        </div>
      </section>

      {/* ── Menu ─────────────────────────────────────────── */}
      <section id="menu" className="px-6 sm:px-10" style={{ paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(80px,10vw,160px)" }}>
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <p className="text-[11px] tracking-[0.35em] uppercase text-center mb-6" style={{ color: c.gold }}>Menu</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif italic text-[clamp(36px,5vw,64px)] leading-[1.05] tracking-[-0.01em] text-center mb-4" style={{ color: c.cream }}>
              Every dish tells <span style={{ color: c.gold }}>a story</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[clamp(14px,1vw,16px)] font-light text-center max-w-[460px] mx-auto mb-12" style={{ color: c.muted }}>
              Caribbean soul meets Asian fire — from oxtail benedicts at
              breakfast to wok-tossed lo mein at lunch.
            </p>
          </Reveal>

          {/* Tabs — pill style */}
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setTab(key)}
                  className="px-5 py-3 text-[14px] sm:text-[13px] font-medium rounded-full transition-all duration-300 min-h-[48px] sm:min-h-0 sm:py-2.5"
                  style={{ background: tab === key ? c.gold : "transparent", color: tab === key ? c.dark : c.muted, border: `1px solid ${tab === key ? c.gold : c.border}` }}>
                  {label}
                </button>
              ))}
            </div>
          </Reveal>
          <p className="text-[12px] text-center mb-10 tracking-[0.1em]" style={{ color: c.muted }}>{active.sub}</p>

          {/* Items */}
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {active.data.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.45, delay: i * 0.04 }}
                className="py-5 border-b transition-colors duration-300 hover:border-[#C49E64]/30" style={{ borderColor: c.border }}>
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-[clamp(15px,1.2vw,18px)] font-medium" style={{ color: c.cream }}>
                        {item.name}
                        {(item as { featured?: boolean }).featured && <span className="ml-2 text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full" style={{ background: `${c.gold}20`, color: c.gold }}>Popular</span>}
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

          {/* Full menu image */}
          <Reveal delay={0.1}>
            <div className="mt-16 rounded-2xl overflow-hidden border" style={{ borderColor: c.border }}>
              <img src="/images/menu.png" alt="Station 11 full menu" className="w-full h-auto" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Firehouse — full width dark section ──────────── */}
      <section id="firehouse" style={{ background: c.surface, paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(100px,14vw,200px)" }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <Reveal><p className="text-[11px] tracking-[0.35em] uppercase mb-8" style={{ color: c.gold }}>The Firehouse</p></Reveal>
              <Reveal delay={0.1}>
                <SplitHeadline top="A CENTURY OF" bottom="HISTORY" className="text-[clamp(40px,6vw,80px)] mb-8" />
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85] mb-6" style={{ color: c.text }}>
                  Fire Station No. 11 has stood on North Avenue for over a
                  century. Listed on the National Register of Historic Places,
                  the 3,300-square-foot space still holds its original arched
                  windows, rich millwork, and exposed brick. We kept the
                  history and added the flavor.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85] mb-12" style={{ color: c.text }}>
                  Bold murals, marble-top tables, sage velvet banquettes. The
                  soundtrack shifts from jazz to Amapiano as the day moves.
                  And soon — a speakeasy in the basement.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="flex gap-10">
                  {[{ n: "1907", l: "Year built" }, { n: "3,300 ft²", l: "Historic space" }, { n: "5.0★", l: "On Resy" }].map((s) => (
                    <div key={s.l}>
                      <p className="font-display text-[clamp(24px,2.5vw,36px)] tracking-[0.02em]" style={{ color: c.gold }}>{s.n}</p>
                      <p className="text-[12px] mt-1" style={{ color: c.muted }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="order-1 lg:order-2">
              <div className="relative aspect-[3/4] sm:aspect-[4/3] rounded-3xl overflow-hidden">
                <img src="/images/exterior.jpg" alt="Station 11 — 1907 firehouse, Midtown Atlanta" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Visit ────────────────────────────────────────── */}
      <section id="visit" className="px-6 sm:px-10" style={{ paddingTop: "clamp(100px,14vw,200px)", paddingBottom: "clamp(100px,14vw,200px)" }}>
        <div className="max-w-[1000px] mx-auto">
          <Reveal><p className="text-[11px] tracking-[0.35em] uppercase text-center mb-6" style={{ color: c.gold }}>Visit</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif italic text-[clamp(36px,5vw,64px)] leading-[1.05] text-center mb-4" style={{ color: c.cream }}>
              Come <span style={{ color: c.gold }}>hungry</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-center text-[clamp(14px,1vw,16px)] font-light max-w-[400px] mx-auto mb-14" style={{ color: c.muted }}>
              Walk-ins welcome. Reservations on Resy. Come hungry, leave full, tell a friend.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center mb-14">
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: c.gold }}>Address</p>
                <a href="https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" target="_blank" rel="noopener noreferrer"
                  className="text-[15px] font-light leading-relaxed hover:opacity-70 transition-opacity" style={{ color: c.cream }}>
                  30 North Ave NE<br />Atlanta, GA 30308
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: c.gold }}>Hours</p>
                <p className="text-[15px] font-light" style={{ color: c.cream }}>Mon–Fri 8am–3pm</p>
                <p className="text-[15px] font-light" style={{ color: c.cream }}>Sat–Sun 8am–4pm <span className="text-[11px] ml-1" style={{ color: c.gold }}>Brunch</span></p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: c.gold }}>Contact</p>
                <a href="tel:+14703198392" className="text-[15px] font-light hover:opacity-70 transition-opacity" style={{ color: c.cream }}>(470) 319-8392</a>
                <p className="text-[13px] mt-1" style={{ color: c.muted }}>@station11atl</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 sm:py-3.5 rounded-full text-[14px] font-medium transition-all duration-300 hover:brightness-110 min-h-[48px] inline-flex items-center justify-center"
                style={{ background: c.gold, color: c.dark }}>Reserve on Resy</a>
              <a href="tel:+14703198392" className="px-8 py-4 sm:py-3.5 rounded-full border text-[14px] font-medium transition-all hover:bg-white/5 min-h-[48px] inline-flex items-center justify-center"
                style={{ borderColor: c.border, color: c.cream }}>Call Us</a>
              <a href="https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 sm:py-3.5 rounded-full border text-[14px] font-medium transition-all hover:bg-white/5 min-h-[48px] inline-flex items-center justify-center"
                style={{ borderColor: c.border, color: c.cream }}>Directions</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="px-6 sm:px-10 py-14 border-t" style={{ borderColor: c.border }}>
        <div className="max-w-[1000px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-[28px] tracking-[0.06em]"><span style={{ color: c.gold }}>STATION</span> <span style={{ color: c.cream }}>11</span></p>
            <p className="text-[13px] mt-2" style={{ color: c.muted }}>Caribbean-Asian Fusion &bull; Midtown Atlanta</p>
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
