import { Button } from "@/components/ui/button"

interface SiteNavigationProps {
  onStartPlanning?: () => void
  showBackButton?: boolean
  onBackClick?: () => void
}

export default function SiteNavigation({ onStartPlanning, showBackButton, onBackClick }: SiteNavigationProps) {
  const handleLogoClick = () => {
    window.location.href = "/"
  }

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${sectionId}`
    } else {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={handleLogoClick} className="hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold text-foreground">
            Trip<span className="text-accent">HERO</span>
          </span>
        </button>

        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollToSection("benefits")}
            className="hidden md:block text-foreground/70 hover:text-foreground transition-colors font-medium"
          >
            Prečo TripHERO
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="hidden md:block text-foreground/70 hover:text-foreground transition-colors font-medium"
          >
            Ako to funguje
          </button>
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={onStartPlanning || handleLogoClick}
          >
            Začať plánovať
          </Button>
        </div>
      </div>
    </nav>
  )
}
