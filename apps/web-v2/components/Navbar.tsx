"use client";
import { useState, useEffect, useCallback, type MouseEvent } from "react";
// import { useRouter } from "next/navigation"; // Import `useRouter` for programmatic navigation
import { motion, useAnimation } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'SaaS', href: '#saas' },
  { label: 'Experience', href: '#experience' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const controls = useAnimation();
  const navOffset = 88; // fixed header height for scroll positioning
//   const router = useRouter(); // Initialize the useRouter hook for navigation

  // Scroll-based header state only (no section detection to avoid jank)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section detection (smoother than scroll loops)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.35,
        rootMargin: "-10% 0px -50% 0px",
      }
    );

    navItems.forEach(({ label }) => {
      const el = document.getElementById(label.toLowerCase());
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (sectionId: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const target = document.getElementById(sectionId);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top, behavior: 'smooth' });
        setActiveSection(sectionId);
        setMenuOpen(false);
      }
    },
    [navOffset]
  );

  // Add animation when scrolled
  useEffect(() => {
    controls.start({
      opacity: scrolled ? 1 : 0.9,
      scale: scrolled ? 1 : 0.95,
      transition: { duration: 0.5 },
    });
  }, [scrolled, controls]);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-black/75 py-3 shadow-lg shadow-cyan-500/10 backdrop-blur-md border-b border-cyan-500/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-2xl font-black tracking-tight text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-slate-400 bg-clip-text text-transparent">
              Adnan
            </span>
          </motion.a>
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                  activeSection === item.label.toLowerCase()
                    ? 'text-white bg-white/5 border border-cyan-500/30 shadow-cyan-500/20 shadow-lg'
                    : 'text-slate-300 hover:text-white'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={handleNavClick(item.label.toLowerCase())}
              >
                {item.label}
                {activeSection === item.label.toLowerCase() && (
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-cyan-400 to-purple-500"
                    layoutId="navbar-underline"
                  />
                )}
              </motion.a>
            ))}
          </nav>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#contact"
            className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/20 hover:text-white transition-colors"
          >
            Build your MVP
          </a>
        </div>
          {/* Mobile Navigation Toggle */}
          <button 
            type="button"
            className="text-white focus:outline-none md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="size-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <title>{menuOpen ? "Close menu" : "Open menu"}</title>
              {menuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <motion.div 
          className="bg-black/90 shadow-xl md:hidden border-t border-cyan-500/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto p-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`py-2 text-sm font-medium transition-colors ${
                    activeSection === item.label.toLowerCase() 
                      ? 'text-cyan-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={handleNavClick(item.label.toLowerCase())}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-center text-sm font-semibold text-cyan-100 hover:bg-cyan-500/20"
                onClick={handleNavClick('contact')}
              >
                Build your MVP
              </a>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
}