"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ─── Colors ──────────────────────────────────────────────────── */
const RED = "#CC0000";
const CREAM = "#F5F0EB";
const DARK = "#0F0F0F";
const MUTED = "#8A8580";
const SURFACE = "#1A1A1A";

/* ─── Menu Data (from actual Station 11 menu) ────────────────── */
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
  { key: "breakfast", label: "Breakfast", data: BREAKFAST },
  { key: "lunch", label: "Lunch", data: LUNCH },
  { key: "wok", label: "Wok", data: WOK },
  { key: "coffee", label: "Coffee", data: COFFEE },
] as const;

const HOURS = [
  { day: "Monday — Friday", time: "8 am — 3 pm" },
  { day: "Saturday — Sunday", time: "8 am — 4 pm", note: "Brunch" },
];

const NAV_LINKS = [
  { href: "#story", label: "Our Story" },
  { href: "#menu", label: "Menu" },
  { href: "#space", label: "The Firehouse" },
  { href: "#visit", label: "Visit" },
  { href: "https://resy.com/cities/atlanta-ga/venues/station-11", label: "Reserve", external: true },
];

/* ─── Components ─────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{ scaleX, transformOrigin: "0%" }} className="fixed top-16 left-0 right-0 h-[2px] z-50">
      <div className="w-full h-full" style={{ background: RED }} />
    </motion.div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-full h-[1.5px] origin-center" style={{ background: CREAM }} transition={{ duration: 0.3 }} />
      <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block w-full h-[1.5px]" style={{ background: CREAM }} transition={{ duration: 0.2 }} />
      <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-full h-[1.5px] origin-center" style={{ background: CREAM }} transition={{ duration: 0.3 }} />
    </div>
  );
}

function MenuItem({ item, index }: { item: { name: string; price: number; desc?: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
      className="group"
    >
      <div className="flex items-baseline justify-between gap-4 py-4 border-b border-white/10 transition-colors duration-300 group-hover:border-[#CC0000]/40">
        <div className="flex-1 min-w-0">
          <h3 className="text-[clamp(15px,1.3vw,18px)] font-medium text-[#F5F0EB] tracking-[-0.01em]">
            {item.name}
          </h3>
          {item.desc && (
            <p className="text-[clamp(12px,0.9vw,14px)] text-[#8A8580] mt-1 leading-relaxed">{item.desc}</p>
          )}
        </div>
        <span className="text-[clamp(14px,1.1vw,17px)] font-light text-[#8A8580] tabular-nums shrink-0">${item.price}</span>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function Station11Page() {
  const [menuTab, setMenuTab] = useState<string>("breakfast");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [mobileMenuOpen]);

  const activeTab = MENU_TABS.find((t) => t.key === menuTab) ?? MENU_TABS[0];

  return (
    <div className="min-h-screen relative" style={{ background: DARK, color: CREAM }}>
      <ScrollProgress />

      {/* ─── Nav ──────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-white/5"
        style={{ background: "rgba(15,15,15,0.85)" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-[24px] tracking-[0.05em]" style={{ color: RED }}>
            S11
          </a>

          <div className="hidden md:flex items-center gap-8 text-[13px] text-[#8A8580]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`transition-colors duration-300 ${link.label === "Reserve" ? "px-4 py-2 rounded-full border text-[#F5F0EB] hover:bg-[#CC0000] hover:border-[#CC0000]" : "hover:text-[#F5F0EB]"}`}
                style={link.label === "Reserve" ? { borderColor: RED, color: RED } : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button onClick={() => setMobileMenuOpen((v) => !v)} className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Toggle menu">
            <HamburgerIcon open={mobileMenuOpen} />
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-b border-white/5"
              style={{ background: "rgba(15,15,15,0.95)" }}
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} onClick={() => setMobileMenuOpen(false)} className="py-3 text-[16px] text-[#F5F0EB] border-b border-white/5 last:border-0">
                    {link.label}
                  </a>
                ))}
                <a href="tel:+14703198392" className="mt-2 py-3 text-[16px] font-medium" style={{ color: RED }}>
                  Call (470) 319-8392
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} id="top" className="relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${RED}15 0%, transparent 70%)` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${DARK} 0%, transparent 30%, transparent 70%, ${DARK} 100%)` }} />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative text-center px-6 max-w-[900px]">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full flex items-center justify-center" style={{ background: RED }}>
              <span className="font-display text-[40px] sm:text-[54px] text-white tracking-[0.05em] leading-none">S11</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[11px] sm:text-[13px] tracking-[0.3em] uppercase mb-6"
            style={{ color: MUTED }}
          >
            Station &bull; Eleven
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(48px,12vw,120px)] leading-[0.95] tracking-[0.02em] mb-6"
          >
            WHERE EAST
            <br />
            MEETS{" "}
            <span style={{ color: RED }}>WEST INDIES</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-[clamp(15px,1.4vw,20px)] font-light leading-[1.6] max-w-[550px] mx-auto"
            style={{ color: `${CREAM}B0` }}
          >
            Caribbean-Asian fusion in a historic 1907 firehouse.
            Brunch, lunch &amp; coffee — Midtown Atlanta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <a
              href="https://resy.com/cities/atlanta-ga/venues/station-11"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 sm:py-3 rounded-full text-[14px] font-medium text-white transition-all duration-300 hover:scale-105 min-h-[48px] inline-flex items-center"
              style={{ background: RED }}
            >
              Reserve a Table
            </a>
            <a
              href="#menu"
              className="px-8 py-4 sm:py-3 rounded-full text-[14px] font-medium border transition-all duration-300 hover:bg-white/5 min-h-[48px] inline-flex items-center"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: CREAM }}
            >
              View Menu
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── Story ────────────────────────────────────────── */}
      <section id="story" className="relative px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 10vw, 160px)", paddingBottom: "clamp(80px, 10vw, 160px)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">
            <div>
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] uppercase mb-8" style={{ color: RED }}>Our Story</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(36px,5vw,72px)] leading-[0.95] tracking-[0.02em]">
                  WOK MEETS
                  <br />
                  <span style={{ color: RED }}>GRILL</span>
                </h2>
              </Reveal>
            </div>

            <div className="space-y-6">
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8]" style={{ color: `${CREAM}B0` }}>
                  In our kitchen, jerk traditions blend with Asian precision.
                  Dumplings are filled with braised oxtail. Rice is kissed with
                  coconut and served alongside wok-fired shrimp. Every dish is
                  both familiar and surprising — a new expression of heritage
                  and innovation.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8]" style={{ color: `${CREAM}B0` }}>
                  Station 11 sits inside a 1907 firehouse on North Avenue —
                  one of Midtown&apos;s oldest standing buildings, now on the
                  National Register of Historic Places. The original millwork
                  is still here. The arched windows. The bones of a building
                  that was made to serve the community. We&apos;re just continuing
                  the tradition.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8]" style={{ color: `${CREAM}B0` }}>
                  Coffee by Gilly Brew Bar. Music that moves between jazz,
                  Amapiano, and deep house. A speakeasy coming soon in the
                  basement. This is Station 11.
                </p>
              </Reveal>

              <Reveal delay={0.5}>
                <div className="flex flex-wrap gap-2 mt-8">
                  {["Caribbean-Asian fusion", "Historic firehouse", "Resy Top 25", "5.0 on Resy", "Private events"].map((tag) => (
                    <span key={tag} className="px-3 sm:px-4 py-2 text-[11px] sm:text-[12px] font-medium tracking-[0.05em] rounded-full border" style={{ borderColor: "rgba(255,255,255,0.1)", color: MUTED }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quote ────────────────────────────────────────── */}
      <section className="relative px-6 sm:px-10" style={{ paddingTop: "clamp(48px, 8vw, 100px)", paddingBottom: "clamp(48px, 8vw, 100px)", background: SURFACE }}>
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal>
            <blockquote className="text-[clamp(20px,3vw,38px)] font-light leading-[1.3] tracking-[-0.02em]" style={{ color: CREAM }}>
              &ldquo;Come for a coffee date and stay for a meal
              within its historic space.&rdquo;
            </blockquote>
            <p className="text-[13px] mt-6 tracking-[0.1em] uppercase" style={{ color: RED }}>
              — Resy, Top 25 Atlanta
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Menu ─────────────────────────────────────────── */}
      <section id="menu" className="relative px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 10vw, 160px)", paddingBottom: "clamp(80px, 10vw, 160px)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-24">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] uppercase mb-8" style={{ color: RED }}>Menu</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(36px,5vw,72px)] leading-[0.95] tracking-[0.02em] mb-4">
                  WHAT&apos;S
                  <br />
                  <span style={{ color: RED }}>COOKING</span>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-[clamp(14px,1.1vw,16px)] font-light leading-[1.7] mb-8 max-w-[360px]" style={{ color: MUTED }}>
                  Caribbean soul meets Asian fire. From oxtail benedicts at
                  breakfast to wok-tossed lo mein at lunch — nothing here
                  is ordinary.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-2">
                  {MENU_TABS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setMenuTab(key)}
                      className="px-5 py-3 text-[14px] sm:text-[13px] font-medium rounded-full transition-all duration-300 min-h-[48px] sm:min-h-0 sm:py-2.5"
                      style={{
                        background: menuTab === key ? RED : "transparent",
                        color: menuTab === key ? "white" : MUTED,
                        border: menuTab === key ? `1px solid ${RED}` : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </Reveal>
            </div>

            <div>
              <motion.div key={menuTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                {activeTab.data.map((item, i) => (
                  <MenuItem key={item.name} item={item} index={i} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The Firehouse ────────────────────────────────── */}
      <section id="space" className="relative overflow-hidden" style={{ background: SURFACE, paddingTop: "clamp(80px, 10vw, 160px)", paddingBottom: "clamp(80px, 10vw, 160px)" }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            {/* Photo */}
            <Reveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img src="/images/exterior.jpg" alt="Station 11 — historic 1907 firehouse on North Avenue, Midtown Atlanta" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] uppercase mb-8" style={{ color: RED }}>The Firehouse</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(36px,5vw,72px)] leading-[0.95] tracking-[0.02em] mb-6">
                  BUILT IN
                  <br />
                  <span style={{ color: RED }}>1907</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] mb-8" style={{ color: `${CREAM}B0` }}>
                  Fire Station No. 11 has stood on North Avenue for over a
                  century. Listed on the National Register of Historic Places,
                  the 3,300-square-foot space still holds its original arched
                  windows, rich millwork, and the kind of bones that can&apos;t
                  be replicated. We kept the history and added the flavor.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[clamp(15px,1.3vw,18px)] font-light leading-[1.8] mb-10" style={{ color: `${CREAM}B0` }}>
                  Inside: exposed brick, bold murals, marble-top tables,
                  sage velvet banquettes, and natural light that pours through
                  tall paned windows. The music moves from jazz to Amapiano
                  depending on the hour. And yes — there&apos;s a speakeasy
                  coming in the basement.
                </p>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {[
                    { label: "Built", value: "1907" },
                    { label: "Style", value: "Art + History" },
                    { label: "Coming Soon", value: "Speakeasy" },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-[12px] uppercase tracking-[0.15em] mb-1" style={{ color: MUTED }}>{f.label}</p>
                      <p className="text-[clamp(16px,1.3vw,20px)] font-medium">{f.value}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Visit ────────────────────────────────────────── */}
      <section id="visit" className="relative px-6 sm:px-10" style={{ paddingTop: "clamp(80px, 10vw, 160px)", paddingBottom: "clamp(80px, 10vw, 160px)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
            <div>
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.3em] uppercase mb-8" style={{ color: RED }}>Visit</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(36px,5vw,72px)] leading-[0.95] tracking-[0.02em] mb-4">
                  PULL UP
                  <br />
                  <span style={{ color: RED }}>MIDTOWN</span>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-[clamp(14px,1.1vw,16px)] font-light leading-[1.7] mb-8 max-w-[420px]" style={{ color: MUTED }}>
                  Walk-ins welcome. Reservations on Resy. Come hungry,
                  leave full, tell a friend.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3" style={{ color: MUTED }}>Address</p>
                    <a href="https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" target="_blank" rel="noopener noreferrer" className="text-[clamp(15px,1.3vw,18px)] font-light leading-relaxed transition-colors duration-300" style={{ color: CREAM }}>
                      30 North Ave NE
                      <br />
                      Atlanta, GA 30308
                    </a>
                    <p className="text-[13px] mt-1" style={{ color: MUTED }}>Midtown — historic firehouse</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3" style={{ color: MUTED }}>Hours</p>
                    {HOURS.map((h) => (
                      <div key={h.day} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between max-w-[400px] py-3 border-b border-white/10">
                        <span className="text-[15px] font-medium">{h.day}</span>
                        <div className="flex items-baseline gap-3 mt-1 sm:mt-0">
                          <span className="text-[15px] font-light" style={{ color: MUTED }}>{h.time}</span>
                          {h.note && <span className="text-[11px] font-medium tracking-[0.05em]" style={{ color: RED }}>{h.note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href="https://resy.com/cities/atlanta-ga/venues/station-11"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-4 sm:py-3 rounded-full text-white text-[14px] font-medium transition-all duration-300 hover:scale-105 min-h-[48px]"
                      style={{ background: RED }}
                    >
                      Reserve on Resy
                    </a>
                    <a href="tel:+14703198392" className="inline-flex items-center justify-center px-6 py-4 sm:py-3 rounded-full border text-[14px] font-medium transition-all duration-300 hover:bg-white/5 min-h-[48px]" style={{ borderColor: "rgba(255,255,255,0.15)", color: CREAM }}>
                      Call (470) 319-8392
                    </a>
                    <a href="https://maps.google.com/?q=30+North+Ave+NE+Atlanta+GA+30308" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-4 sm:py-3 rounded-full border text-[14px] font-medium transition-all duration-300 hover:bg-white/5 min-h-[48px]" style={{ borderColor: "rgba(255,255,255,0.15)", color: CREAM }}>
                      Directions
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden" style={{ background: SURFACE }}>
                <iframe
                  title="Station 11 location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.8!2d-84.3847!3d33.7715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045e7dcc2c1d%3A0x1!2s30+North+Ave+NE%2C+Atlanta%2C+GA+30308!5e0!3m2!1sen!2sus!4v1"
                  className="absolute inset-0 w-full h-full border-0 opacity-60"
                  style={{ filter: "invert(0.9) hue-rotate(180deg) saturate(0.3)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="px-6 sm:px-10 py-12 sm:py-16 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-8 mb-10">
            <div>
              <p className="font-display text-[clamp(36px,5vw,60px)] leading-[1] tracking-[0.02em]">
                STATION <span style={{ color: RED }}>11</span>
              </p>
              <p className="text-[14px] mt-3" style={{ color: MUTED }}>
                Caribbean-Asian Fusion &bull; Midtown Atlanta
              </p>
            </div>
            <a
              href="https://resy.com/cities/atlanta-ga/venues/station-11"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full text-[14px] font-medium text-white transition-all duration-300 hover:scale-105 min-h-[48px] inline-flex items-center"
              style={{ background: RED }}
            >
              Reserve a Table
            </a>
          </div>

          <div className="h-[1px] bg-white/5 mb-8" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[13px]" style={{ color: `${CREAM}40` }}>
              30 North Ave NE, Atlanta, GA 30308
            </p>
            <div className="flex items-center gap-8 sm:gap-6 text-[14px] sm:text-[13px] py-2" style={{ color: `${CREAM}40` }}>
              <a href="https://www.instagram.com/station11atl/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 min-h-[44px] flex items-center">
                Instagram
              </a>
              <a href="https://resy.com/cities/atlanta-ga/venues/station-11" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 min-h-[44px] flex items-center">
                Resy
              </a>
              <a href="tel:+14703198392" className="hover:text-white transition-colors duration-300 min-h-[44px] flex items-center">
                (470) 319-8392
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
