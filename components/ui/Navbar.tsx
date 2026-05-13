"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { ThistleLogo } from './ThistleLogo';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useFeasibility } from '../feasibility/FeasibilityContext';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: "Feasibility Package", path: "/feasibility-package" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "About", path: "/about" },
];

export const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openModal } = useFeasibility();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
        <div className="max-w-[1360px] w-full mx-auto grid grid-cols-3 items-center relative z-50">
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
          <div className="hidden lg:flex items-center justify-center gap-fl-6 text-fluid-sm font-medium text-white/80">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`transition-colors hover:text-white ${pathname.startsWith(link.path) ? 'text-white' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: CTA + Mobile Toggle */}
          <div className="flex items-center justify-end gap-4">
            <div className="hidden lg:block">
              <Button
                size="sm"
                variant="primary"
                icon={<ArrowUpRight size={16} />}
                className="!bg-white !text-thistle-black !border-white hover:!bg-thistle-pink hover:!text-thistle-black hover:!border-thistle-pink"
                onClick={openModal}
              >
                Start Feasibility
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-white transition-colors"
              aria-label="Toggle menu"
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
            className="fixed inset-0 z-40 bg-thistle-white pt-24 pb-8 px-6 lg:hidden flex flex-col overflow-y-auto"
          >
            <div className="flex flex-col flex-1">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-3 px-3 rounded-lg text-lg font-medium border-b border-thistle-black/5 last:border-b-0 ${pathname.startsWith(link.path) ? 'text-thistle-green' : 'text-thistle-black'}`}
                  >
                    {link.label}
                  </Link>
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
                  openModal();
                }}
              >
                Start Feasibility
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
