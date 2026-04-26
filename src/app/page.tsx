"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ─── Theme ───────────────────────────────────────────────────── */
const c = {
  red: "#CC0000",
  cream: "#F5F0EB",
  dark: "#0F0F0F",
  surface: "#161616",
  muted: "#7A7570",
  text: "#C8C3BE",
};

/* ─── Menu Data ──────────────────────────────────────────────── */
const COFFEE = [
  { name: "Espresso", price: 4 },
  { name: "Latte", price: 6 },
  { name: "Cappuccino", price: 5 },
  { name: "Flat White", price: 6 },
  { name: "Chai Latte", price: 6 },
  { name: "Cinnamon Vanilla Latte", price: 6.5 },
  { name: "Cardamom Chai", price: 6.5 },
  { name: "Matcha Milk Tea", price: 6 },
];

const BREAKFAST = [
  { name: "Fireman's Breakfast", price: 15, desc: "Scrambled eggs, cheese grits, bacon or sausage, sourdough" },
  { name: "Station 11 Pancakes", price: 14, desc: "House maple syrup, seasonal fruit" },
  { name: "Stir Fry Shrimp & Grits", price: 18, desc: "Wok seared shrimp, butter, basil, sweet corn" },
  { name: "Oxtail & Grits", price: 19, desc: "Thyme & scallion braised gravy, smash grits" },
  { name: "Breakfast Bagel", price: 12, desc: "Cheese, bacon or sausage, cream cheese, scrambled eggs" },
  { name: "Oxtail Benedict", price: 18, desc: "English muffin, poached eggs, hollandaise" },
];

const LUNCH = [
  { name: "Fried Wings", price: 14, desc: "Jerk or honey garlic, pickled slaw" },
  { name: "Coconut Shrimp", price: 16, desc: "Sweet chili, pickled cabbage" },
  { name: "S11 Burger", price: 16, desc: "Smash patty, cheddar, caramelized onion, special sauce" },
  { name: "Fried Chicken Sandwich", price: 16, desc: "Buttermilk, white sauce, cabbage, hot pepper" },
  { name: "Oxtail Sandwich", price: 18, desc: "Braised oxtail, gravy, sourdough — the signature" },
  { name: "Jerk Chicken", price: 17, desc: "Rice & peas, cabbage, plantain" },
  { name: "Herb Seared Salmon", price: 22, desc: "Coconut jasmine rice, seasonal vegetables" },
];

const WOK = [
  { name: "Shrimp Lo Mein", price: 16, desc: "Wok-tossed noodles, vegetables, soy glaze" },
  { name: "Oxtail Fried Rice", price: 17, desc: "Egg, green onion, braised oxtail, bok choy, crispy shallots" },
  { name: "Mongolian Beef", price: 17, desc: "Scallion, ginger, soy, steamed rice" },
];

const MENU_TABS = [
  { key: "breakfast", label: "Breakfast", time: "Mon — Fri, 8 — 11 am", data: BREAKFAST },
  { key: "lunch", label: "Lunch", time: "Mon — Fri, 11 am — 3 pm", data: LUNCH },
  { key: "wok", label: "From the Wok", time: "Available at lunch", data: WOK },
  { key: "coffee", label: "Coffee & Tea", time: "All day", data: COFFEE },
] as const;

const HOURS = [
  { day: "Monday — Friday", time: "8 am — 3 pm" },
  { day: "Saturday — Sunday", time: "8 am — 4 pm", note: "Brunch" },
];

const NAV_LINKS = [
  { href: "#story", label: "Our Story" },
  { href: "#menu", label: "Menu" },
  { href: "#firehouse", label: "The Firehouse" },
  { href: "#visit", label: "Visit" },
];

/* ─── Animated components ────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >{children}</motion.div>
  );
}

/* Amrit Palace style: each word fades up independently */
function WordReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.06 }}
          className="mr-[0.3em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{ scaleX, transformOrigin: "0%" }} className="fixed top-16 left-0 right-0 h-[2px] z-50">
      <div className="w-full h-full" style={{ background: c.red }} />
    </motion.div>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-full h-[1.5px] origin-center" style={{ background: c.cream }} transition={{ duration: 0.3 }} />
      <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block w-full h-[1.5px]" style={{ background: c.cream }} transition={{ duration: 0.2 }} />
      <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-full h-[1.5px] origin-center" style={{ background: c.cream }} transition={{ duration: 0.3 }} />
    </div>
  );
}

function MenuItem({ item, i }: { item: { name: string; price: number; desc?: string }; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
      className="group py-5 border-b border-white/[0.06] hover:border-[#CC0000]/30 transition-colors duration-300"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="text-[clamp(15px,1.2vw,18px)] font-medium tracking-[-0.01em]" style={{ color: c.cream }}>{item.name}</h3>
            <div className="flex-1 border-b border-dotted border-white/[0.08] translate-y-[-4px] hidden sm:block" />
            <span className="text-[clamp(14px,1.1vw,17px)] font-light tabular-nums" style={{ color: c.muted }}>${item.price}</span>
          </div>
          {item.desc && <p className="text-[clamp(12px,0.9vw,14px)] mt-1.5 leading-relaxed" style={{ color: c.muted }}>{item.desc}</p>}
        </div>
        {/* Price on mobile when dotted line is hidden */}
        <span className="text-[15px] font-light tabular-nums sm:hidden" style={{ color: c.muted }}>${item.price}</span>
      </div>
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <Reveal><p className="text-[11px] font-medium tracking-[0.3em] uppercase mb-6" style={{ color: c.red }}>{children}</p></Reveal>;
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function Station11Page() {
  const [tab, setTab] = useState<string>("breakfast");
  const [navOpen, setNavOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    if (!navOpen) return;
    const cl = () => setNavOpen(false);
    window.addEventListener("scroll", cl, { passive: true });
    return () => window.removeEventListener("scroll", cl);
  }, [navOpen]);

  const active = MENU_TABS.find((t) => t.key === tab) ?? MENU_TABS[0];

  return (
    <div className="min-h-screen relative" style={{ background: c.dark, color: c.cream }}>
      <ScrollProgress />

      {/* ── Nav ─────────────────────────────────────────── */}
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-white/5" style={{ background: "rgba(15,15,15,0.85)" }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-[22px] tracking-[0.06em]" style={{ color: c.red }}>STATION 11</a>
          <div className="hidden md:flex items-center gap-8 text-[13px]" style={{ color: c.muted }}>
            {NAV_LINKS.map((l) => <a key={l.label} href={l.href} className="hover:text-[#F5F0EB] transition-colors duration-300">{l.label}</a>)}
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="ml-2 px-5 py-2 rounded-full text-[13px] font-medium text-white transition-all duration-300 hover:scale-105" style={{ background: c.red }}>Reserve</a>
          </div>
          <button onClick={() => setNavOpen((v) => !v)} className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menu">
            <Hamburger open={navOpen} />
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="md:hidden overflow-hidden border-b border-white/5" style={{ background: "rgba(15,15,15,0.95)" }}>
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((l) => <a key={l.label} href={l.href} onClick={() => setNavOpen(false)} className="py-3 text-[16px] border-b border-white/5 last:border-0" style={{ color: c.cream }}>{l.label}</a>)}
                <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="mt-3 py-3 text-center rounded-full text-[15px] font-medium text-white" style={{ background: c.red }}>Reserve a Table</a>
                <a href="tel:+14703198392" className="py-3 text-center text-[15px]" style={{ color: c.red }}>(470) 319-8392</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section ref={heroRef} id="top" className="relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${c.red}12 0%, transparent 65%)` }} />
        </motion.div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c.dark} 0%, transparent 25%, transparent 75%, ${c.dark} 100%)` }} />

        <motion.div style={{ opacity: heroOp }} className="relative text-center px-6 max-w-[1000px]">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="mb-10">
            <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-full flex items-center justify-center" style={{ background: c.red }}>
              <span className="font-display text-[34px] sm:text-[46px] text-white tracking-[0.05em] leading-none">S11</span>
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[11px] sm:text-[12px] tracking-[0.35em] uppercase mb-8" style={{ color: c.muted }}>
            Station &bull; Eleven &bull; Midtown Atlanta
          </motion.p>

          <h1 className="font-display text-[clamp(44px,11vw,130px)] leading-[0.92] tracking-[0.02em] mb-8">
            <WordReveal text="WHERE EAST" delay={0.4} />
            <br />
            <WordReveal text="MEETS" delay={0.55} />
            {" "}
            <WordReveal text="WEST INDIES" delay={0.6} className="[&>span]:text-[#CC0000]" />
          </h1>

          <Reveal delay={0.8}>
            <p className="text-[clamp(15px,1.4vw,20px)] font-light leading-[1.65] max-w-[560px] mx-auto" style={{ color: c.text }}>
              Caribbean-Asian fusion in a historic 1907 firehouse.
              Where jerk traditions meet Asian precision and every
              dish tells two stories at once.
            </p>
          </Reveal>

          <Reveal delay={1}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="px-8 py-4 sm:py-3.5 rounded-full text-[14px] font-medium text-white transition-all duration-300 hover:scale-105 min-h-[48px] inline-flex items-center" style={{ background: c.red }}>
                Reserve a Table
              </a>
              <a href="#menu" className="px-8 py-4 sm:py-3.5 rounded-full text-[14px] font-medium border border-white/15 transition-all duration-300 hover:bg-white/5 min-h-[48px] inline-flex items-center" style={{ color: c.cream }}>
                View Menu
              </a>
            </div>
          </Reveal>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ── Story ───────────────────────────────────────── */}
      <section id="story" className="px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 12vw, 180px)", paddingBottom: "clamp(80px, 12vw, 180px)" }}>
        <div className="max-w-[1100px] mx-auto">
          <Label>Our Story</Label>
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(38px,6vw,80px)] leading-[0.92] tracking-[0.02em] mb-12">
              IN OUR KITCHEN,{" "}
              <span style={{ color: c.red }}>WOK MEETS GRILL</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <Reveal delay={0.2}>
              <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85]" style={{ color: c.text }}>
                Jerk traditions blend with Asian precision. Dumplings are
                filled with braised oxtail. Rice is kissed with coconut and
                served alongside wok-fired shrimp. Every dish is both familiar
                and surprising — a new expression of heritage and innovation.
              </p>
            </Reveal>
            <div className="space-y-6">
              <Reveal delay={0.3}>
                <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85]" style={{ color: c.text }}>
                  Station 11 sits inside a 1907 firehouse on North Avenue —
                  one of Midtown&apos;s oldest standing buildings, now on the
                  National Register of Historic Places. Coffee by Gilly Brew Bar.
                  Music that moves between jazz, Amapiano, and deep house.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85]" style={{ color: c.text }}>
                  A speakeasy is coming in the basement. This is Station 11.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.5}>
            <div className="flex flex-wrap gap-3 mt-12">
              {["Caribbean-Asian Fusion", "Historic 1907 Firehouse", "Resy Top 25", "5.0 Stars", "Private Events", "Speakeasy Coming Soon"].map((t) => (
                <span key={t} className="px-4 py-2 text-[11px] font-medium tracking-[0.08em] uppercase rounded-full border border-white/[0.08]" style={{ color: c.muted }}>{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Quote ────────────────────────────────────────── */}
      <div className="line-fade mx-auto max-w-[60%]" />
      <section className="px-6 sm:px-10" style={{ paddingTop: "clamp(60px, 8vw, 120px)", paddingBottom: "clamp(60px, 8vw, 120px)" }}>
        <div className="max-w-[800px] mx-auto text-center">
          <Reveal>
            <p className="text-[clamp(22px,3.2vw,42px)] font-light leading-[1.35] tracking-[-0.015em] italic" style={{ color: c.cream }}>
              &ldquo;Come for a coffee date and stay for a meal
              within its historic space.&rdquo;
            </p>
            <p className="text-[12px] mt-8 tracking-[0.2em] uppercase font-medium" style={{ color: c.red }}>Resy &bull; Top 25 Atlanta</p>
          </Reveal>
        </div>
      </section>
      <div className="line-fade mx-auto max-w-[60%]" />

      {/* ── Menu ─────────────────────────────────────────── */}
      <section id="menu" className="px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 12vw, 180px)", paddingBottom: "clamp(80px, 12vw, 180px)" }}>
        <div className="max-w-[1100px] mx-auto">
          <Label>Menu</Label>
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(38px,6vw,80px)] leading-[0.92] tracking-[0.02em] mb-4">
              WHAT&apos;S <span style={{ color: c.red }}>COOKING</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[clamp(14px,1.1vw,16px)] font-light leading-[1.7] mb-10 max-w-[480px]" style={{ color: c.muted }}>
              From oxtail benedicts at breakfast to wok-tossed lo mein at
              lunch. Caribbean soul meets Asian fire — nothing here is ordinary.
            </p>
          </Reveal>

          {/* Tabs */}
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2 mb-12">
              {MENU_TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setTab(key)}
                  className="px-5 py-3 text-[14px] sm:text-[13px] font-medium rounded-full transition-all duration-300 min-h-[48px] sm:min-h-0 sm:py-2.5"
                  style={{ background: tab === key ? c.red : "transparent", color: tab === key ? "white" : c.muted, border: tab === key ? `1px solid ${c.red}` : "1px solid rgba(255,255,255,0.08)" }}>
                  {label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Tab time note */}
          <p className="text-[12px] mb-6 tracking-[0.1em] uppercase" style={{ color: c.muted }}>{active.time}</p>

          {/* Items — Amrit Palace style dotted line between name and price */}
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {active.data.map((item, i) => <MenuItem key={item.name} item={item} i={i} />)}
          </motion.div>

          {/* Full menu image */}
          <Reveal delay={0.2}>
            <div className="mt-16 rounded-2xl overflow-hidden border border-white/[0.06]">
              <img src="/images/menu.png" alt="Station 11 full menu" className="w-full h-auto" />
            </div>
            <p className="text-[12px] mt-3 text-center" style={{ color: c.muted }}>Full menu — prices and items may change seasonally</p>
          </Reveal>
        </div>
      </section>

      {/* ── Firehouse ────────────────────────────────────── */}
      <section id="firehouse" className="relative overflow-hidden" style={{ background: c.surface, paddingTop: "clamp(80px, 12vw, 180px)", paddingBottom: "clamp(80px, 12vw, 180px)" }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            <Reveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img src="/images/exterior.jpg" alt="Station 11 — 1907 firehouse, 30 North Ave NE, Midtown Atlanta" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="px-3 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase rounded-full bg-black/50 backdrop-blur-sm text-white/80">Est. 1907</span>
                </div>
              </div>
            </Reveal>

            <div>
              <Label>The Firehouse</Label>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(36px,5vw,72px)] leading-[0.92] tracking-[0.02em] mb-8">
                  A CENTURY OF <span style={{ color: c.red }}>HISTORY</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85] mb-6" style={{ color: c.text }}>
                  Fire Station No. 11 has stood on North Avenue for over a
                  century. Listed on the National Register of Historic Places,
                  the 3,300-square-foot space still holds its original arched
                  windows, rich millwork, and the kind of bones that can&apos;t
                  be replicated.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-[1.85] mb-10" style={{ color: c.text }}>
                  Exposed brick, bold murals, marble-top tables, sage velvet
                  banquettes, and natural light through tall paned windows.
                  The soundtrack shifts from jazz to Amapiano as the day moves.
                  And soon — a speakeasy in the basement.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="grid grid-cols-3 gap-6">
                  {[{ n: "1907", l: "Year built" }, { n: "3,300", l: "Square feet" }, { n: "5.0", l: "Resy stars" }].map((s) => (
                    <div key={s.l}>
                      <p className="font-display text-[clamp(28px,3vw,44px)] tracking-[0.02em]" style={{ color: c.red }}>{s.n}</p>
                      <p className="text-[12px] mt-1" style={{ color: c.muted }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visit ────────────────────────────────────────── */}
      <section id="visit" className="px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 12vw, 180px)", paddingBottom: "clamp(80px, 12vw, 180px)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
            <div>
              <Label>Visit</Label>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(36px,5vw,72px)] leading-[0.92] tracking-[0.02em] mb-4">
                  COME <span style={{ color: c.red }}>HUNGRY</span>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-[clamp(14px,1.1vw,16px)] font-light leading-[1.7] mb-10 max-w-[400px]" style={{ color: c.muted }}>
                  Walk-ins welcome. Reservations on Resy.
                  Come hungry, leave full, tell a friend.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3" style={{ color: c.muted }}>Address</p>
                    <a href="https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" target="_blank" rel="noopener noreferrer" className="text-[clamp(15px,1.2vw,18px)] font-light leading-relaxed hover:opacity-70 transition-opacity" style={{ color: c.cream }}>
                      30 North Ave NE<br />Atlanta, GA 30308
                    </a>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3" style={{ color: c.muted }}>Hours</p>
                    {HOURS.map((h) => (
                      <div key={h.day} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between max-w-[380px] py-3 border-b border-white/[0.06]">
                        <span className="text-[15px] font-medium">{h.day}</span>
                        <div className="flex items-baseline gap-3 mt-1 sm:mt-0">
                          <span className="text-[15px] font-light" style={{ color: c.muted }}>{h.time}</span>
                          {h.note && <span className="text-[11px] font-medium tracking-[0.05em]" style={{ color: c.red }}>{h.note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-4 sm:py-3 rounded-full text-white text-[14px] font-medium transition-all duration-300 hover:scale-105 min-h-[48px]" style={{ background: c.red }}>Reserve on Resy</a>
                    <a href="tel:+14703198392" className="inline-flex items-center justify-center px-6 py-4 sm:py-3 rounded-full border border-white/10 text-[14px] font-medium transition-all duration-300 hover:bg-white/5 min-h-[48px]" style={{ color: c.cream }}>Call (470) 319-8392</a>
                    <a href="https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-4 sm:py-3 rounded-full border border-white/10 text-[14px] font-medium transition-all duration-300 hover:bg-white/5 min-h-[48px]" style={{ color: c.cream }}>Directions</a>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden" style={{ background: c.surface }}>
                <iframe title="Station 11" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.8!2d-84.3847!3d33.7715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045e7dcc2c1d%3A0x1!2s30+North+Ave+NE%2C+Atlanta%2C+GA+30308!5e0!3m2!1sen!2sus!4v1" className="absolute inset-0 w-full h-full border-0 opacity-50" style={{ filter: "invert(0.92) hue-rotate(180deg) saturate(0.2)" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="px-6 sm:px-10 py-12 sm:py-16 border-t border-white/5">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-display text-[clamp(32px,4vw,56px)] leading-[1] tracking-[0.02em]">STATION <span style={{ color: c.red }}>11</span></p>
              <p className="text-[14px] mt-3" style={{ color: c.muted }}>Caribbean-Asian Fusion &bull; Midtown Atlanta</p>
            </div>
            <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full text-[14px] font-medium text-white hover:scale-105 transition-all min-h-[48px] inline-flex items-center" style={{ background: c.red }}>Reserve a Table</a>
          </div>
          <div className="h-[1px] bg-white/5 mb-8" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[13px]" style={{ color: "rgba(245,240,235,0.25)" }}>30 North Ave NE, Atlanta, GA 30308</p>
            <div className="flex items-center gap-8 sm:gap-6 text-[14px] sm:text-[13px] py-2" style={{ color: "rgba(245,240,235,0.25)" }}>
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
