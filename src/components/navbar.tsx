import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import logoColor from "@/assets/logo-color.png"

const navLinks = [
  { label: "Tripy", href: "https://new.triphero.sk/trips", isPill: true },
  { label: "Lídri", href: "https://new.triphero.sk/leaders" },
  { label: "O nás", href: "https://new.triphero.sk/o-nas" },
  { label: "Kontakt", href: "https://new.triphero.sk/kontakt" },
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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-soft border-b border-border/50 h-16 md:h-20"
      >
        <div className="container px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <a href="https://new.triphero.sk" className="hover:opacity-80 transition-opacity flex-shrink-0 flex items-center">
            <img src={logoColor} alt="TripHERO" className="h-8 md:h-10 w-auto transition-all duration-300" />
          </a>

          {/* Desktop nav - centered links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 ${
                  link.isPill
                    ? "bg-primary/10 text-primary font-bold px-3 py-1 rounded-full"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="hero" size="sm" asChild>
              <a href="https://new.triphero.sk/trips">Vytvoriť camp</a>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 transition-colors text-foreground"
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
                  className="text-2xl font-semibold transition-colors text-foreground"
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
