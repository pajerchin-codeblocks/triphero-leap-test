import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import logoColor from "@/assets/logo-color.png"

const navLinks = [
  { label: "Tripy", href: "https://bright-trip-studio.lovable.app/trips", isPill: true },
  { label: "Lídri", href: "https://bright-trip-studio.lovable.app/leaders" },
  { label: "O nás", href: "https://bright-trip-studio.lovable.app/o-nas" },
  { label: "Kontakt", href: "https://bright-trip-studio.lovable.app/kontakt" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-30 h-16 md:h-20"
        style={{
          background: "hsla(220, 20%, 98%, 0.95)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px -4px hsla(220, 25%, 15%, 0.08)",
          borderBottom: "1px solid hsla(220, 15%, 90%, 0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <a href="https://bright-trip-studio.lovable.app" className="hover:opacity-80 transition-opacity flex-shrink-0">
            <img src={logoColor} alt="TripHERO" className="h-8 md:h-10" />
          </a>

          {/* Desktop nav - centered links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.isPill
                    ? "font-bold px-3 py-1 rounded-full"
                    : "hover:opacity-80"
                }`}
                style={
                  link.isPill
                    ? { background: "hsla(234, 85%, 63%, 0.1)", color: "hsl(234, 85%, 63%)" }
                    : { color: "hsl(220, 25%, 15%)" }
                }
                onMouseEnter={(e) => {
                  if (!link.isPill) e.currentTarget.style.color = "hsl(234, 85%, 63%)"
                }}
                onMouseLeave={(e) => {
                  if (!link.isPill) e.currentTarget.style.color = "hsl(220, 25%, 15%)"
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Spacer to balance layout */}
          <div className="hidden md:block flex-shrink-0 w-[1px]" />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 transition-colors"
            style={{ color: "hsl(220, 25%, 15%)" }}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-semibold transition-colors"
                  style={{ color: "hsl(220, 25%, 15%)" }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
