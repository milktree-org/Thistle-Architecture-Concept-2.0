"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './Button';
import { ThistleLogo } from './ThistleLogo';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react';

interface NavChild {
  /** Stable id used to look up the CMS label. Never shown, never changes. */
  key: string;
  label: string;
  path: string;
  /** Opens in a new tab. Used for sister products outside this site. */
  external?: boolean;
}

interface NavItem {
  /** Stable id used to look up the CMS label. Never shown, never changes. */
  key: string;
  label: string;
  path: string;
  children?: NavChild[];
}

const navLinks: NavItem[] = [
  { key: "feasibility-package", label: "Feasibility Package", path: "/feasibility-package" },
  // Pricing sits second, next to the package it prices. Ed's brief is explicit
  // that the site should not feel like "contact us for a quote", which only
  // works if the fee is reachable from anywhere.
  { key: "pricing", label: "Pricing", path: "/pricing" },
  {
    key: "our-work",
    label: "Our Work",
    // The hub, which is what the label says (item 95). The two listings are the
    // children.
    path: "/case-studies",
    children: [
      { key: "our-work.feasibility", label: "Feasibility Studies", path: "/case-studies/feasibility-studies" },
      { key: "our-work.completed", label: "Projects", path: "/case-studies/completed-projects" },
    ],
  },
  {
    // Ed's August 2026 final brief: the label is "Expertise", the /conversions/
    // URLs stay put (moving them needs a deliberate 301 plan that has not been
    // made). The parent link now goes to a genuine Expertise overview instead
    // of dropping straight into Commercial-to-Residential, per the brief:
    // "make it a simple Expertise overview rather than effectively dropping
    // users straight into Commercial-to-Residential."
    key: "expertise",
    label: "Expertise",
    path: "/conversions",
    children: [
      { key: "expertise.c2r", label: "Commercial to Residential", path: "/conversions/commercial-to-residential" },
      { key: "expertise.hmo", label: "HMO", path: "/conversions/hmo" },
      { key: "expertise.coliving", label: "Co-Living & Large HMO", path: "/conversions/co-living-large-hmo" },
      { key: "expertise.mixed", label: "Mixed-Use Commercial", path: "/conversions/mixed-use-commercial" },
      // Not a conversion, so not under /conversions/. See conversionPath().
      { key: "expertise.highend", label: "High-End Residential", path: "/expertise/high-end-residential" },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    path: "/tools/class-ma-checker",
    children: [
      { key: "tools.classma", label: "Class MA Checker", path: "/tools/class-ma-checker" },
      { key: "tools.gdv", label: "Apartment GDV Calculator", path: "/tools/gdv-calculator" },
      { key: "tools.hmocalc", label: "HMO Valuation Calculator", path: "/tools/hmo-calculator" },
      // Ed's video feedback 2026-07-08: "in tools also get HMO Checker in there".
      { key: "tools.hmochecker", label: "HMO Checker ↗", path: "https://hmochecker.co.uk", external: true },
    ],
  },
  { key: "about", label: "About", path: "/about" },
  { key: "blog", label: "Blog", path: "/blog" },
  { key: "contact", label: "Contact", path: "/contact" },
];

interface NavbarProps {
  /**
   * CMS label overrides, keyed by the stable `key` on each nav entry. Absent
   * keys keep the label defined in code, so the menu still renders correctly
   * before the CMS has any content for it.
   */
  labels?: Record<string, { label: string; field?: string }>;
  ctaLabel?: string;
  tina?: { ctaLabel?: string };
}

export const Navbar: React.FC<NavbarProps> = ({ labels, ctaLabel, tina }) => {
  // Resolve a nav entry to the text and CMS marker it should render with.
  const nav = (entry: { key: string; label: string }) => {
    const o = labels?.[entry.key];
    return { text: o?.label || entry.label, field: o?.field };
  };
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Set while the menu is closing and the page is being put back where it was.
  // That restore moves the scroll position in one jump, which is indistinguishable
  // from a fast downward scroll and would otherwise retract the bar the instant
  // the menu closes. Consumed by the next scroll event, so it suppresses exactly
  // the one change it was set for.
  const restoringScroll = useRef(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // The close button lives inside this bar, so retracting it while the mobile
    // menu is open leaves no way out of the menu. Never hide while it is open.
    if (isMobileMenuOpen) {
      setHidden(false);
      return;
    }
    setScrolled(latest > 50);
    if (restoringScroll.current) {
      restoringScroll.current = false;
      return;
    }
    const previous = scrollY.getPrevious() || 0;
    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Lock background scroll while the mobile menu is open.
  //
  // overflow:hidden on body is ignored by iOS Safari, so the page used to keep
  // scrolling behind the open menu. Pinning the body with position:fixed is the
  // approach that actually holds there, at the cost of having to carry the
  // scroll offset by hand: fixing the body drops the page to the top, so the
  // offset goes on as a negative top and is restored on the way out.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const { scrollY: y } = window;
    const { body } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      // Jump straight back, with no smooth-scroll easing from globals.css.
      // Flag it first so the resulting scroll event is not mistaken for the
      // user scrolling down, which would hide the bar as the menu closes.
      if (y > 0) restoringScroll.current = true;
      const html = document.documentElement;
      const behaviour = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, y);
      html.style.scrollBehavior = behaviour;
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center px-fl-margin bg-thistle-black transition-all duration-300 ${scrolled ? 'py-3 shadow-md shadow-thistle-black/20' : 'py-5'}`}
      >
        <div className="max-w-[1360px] w-full mx-auto grid grid-cols-[auto_1fr_auto] lg:gap-4 xl:gap-fl-6 items-center relative z-50">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <ThistleLogo
                variant="full"
                color="light"
                className="h-11 w-auto transition-all duration-300"
              />
            </Link>
          </div>

          {/* Centre: Nav Links */}
          <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-fl-6 text-xs xl:text-fluid-sm font-medium text-white/80">
            {navLinks.map((link) => {
              if (link.children) {
                const active = pathname === link.path || link.children.some((ch) => pathname.startsWith(ch.path));
                return (
                  <div key={link.path} className="relative group">
                    <Link
                      href={link.path}
                      className={`inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-white ${active ? 'text-white' : ''}`}
                    >
                      <span data-tina-field={nav(link).field}>{nav(link).text}</span>
                      <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                    </Link>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block">
                      <div className="bg-thistle-black border border-white/10 rounded-xl py-2 min-w-[260px] shadow-lg shadow-black/30">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            {...(child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className={`block px-fl-4 py-fl-3 text-sm transition-colors hover:bg-white/[0.05] hover:text-white ${pathname === child.path ? 'text-white' : 'text-white/70'}`}
                          >
                            <span data-tina-field={nav(child).field}>{nav(child).text}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`whitespace-nowrap transition-colors hover:text-white ${pathname.startsWith(link.path) ? 'text-white' : ''}`}
                >
                  <span data-tina-field={nav(link).field}>{nav(link).text}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: CTA + Mobile Toggle */}
          <div className="flex items-center justify-end gap-4">
            <div className="hidden lg:block">
              <Button
                size="sm"
                variant="primary"
                icon={<ArrowUpRight size={16} />}
                className="!bg-white !text-thistle-black !border-white hover:!bg-thistle-pink hover:!text-thistle-black hover:!border-thistle-pink"
                onClick={() => router.push('/pricing#calculator')}
              >
                <span data-tina-field={tina?.ctaLabel}>{ctaLabel || 'Get Your Fixed Fee'}</span>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              // p-3 rather than p-2 so the hit area clears the 44px minimum.
              className="lg:hidden p-3 -mr-3 text-white transition-colors"
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-thistle-white pt-24 pb-8 px-6 lg:hidden flex flex-col overflow-y-auto overscroll-contain"
          >
            <div className="flex flex-col flex-1">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <div key={link.path} className="border-b border-thistle-black/5 last:border-b-0">
                    <Link
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-3 px-3 rounded-lg text-lg font-medium ${pathname.startsWith(link.path) || (link.children && link.children.some((ch) => pathname.startsWith(ch.path))) ? 'text-thistle-green' : 'text-thistle-black'}`}
                    >
                      <span data-tina-field={nav(link).field}>{nav(link).text}</span>
                    </Link>
                    {link.children && (
                      <div className="flex flex-col pl-fl-5 pb-fl-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            {...(child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            onClick={() => setIsMobileMenuOpen(false)}
                            // min-h-[44px] with the text centred: these sat at
                            // 36px, under the 44px touch minimum.
                            className={`flex items-center min-h-[44px] py-2 text-sm ${pathname === child.path ? 'text-thistle-green' : 'text-thistle-black/70'}`}
                          >
                            <span data-tina-field={nav(child).field}>{nav(child).text}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <Button
                size="lg"
                variant="primary"
                className="w-full justify-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/pricing#calculator');
                }}
              >
                <span data-tina-field={tina?.ctaLabel}>{ctaLabel || 'Get Your Fixed Fee'}</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
