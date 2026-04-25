import { useEffect, useState } from "react"
import { Plane, Hotel, MapPin, Sparkles, Camera, Users } from "lucide-react"

const steps = [
  { icon: MapPin, label: "Vyberáme najlepšie miesta…" },
  { icon: Hotel, label: "Pripravujeme detaily ubytovania…" },
  { icon: Plane, label: "Plánujeme tvoju cestu…" },
  { icon: Camera, label: "Vyberáme fotky destinácie…" },
  { icon: Users, label: "Skladáme program pre účastníkov…" },
  { icon: Sparkles, label: "Pridávame finálny lesk…" },
]

export function PreviewLoadingOverlay() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length)
    }, 1800)
    return () => clearInterval(id)
  }, [])

  const ActiveIcon = steps[stepIndex].icon

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-border bg-card shadow-xl px-8 py-10 text-center">
        {/* Animated orbit */}
        <div className="relative mx-auto mb-8 h-28 w-28">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 rounded-full bg-accent/10 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-accent/15" />

          {/* Spinning gradient ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, hsl(var(--accent)) 0%, hsl(var(--accent)/0.1) 60%, hsl(var(--accent)) 100%)",
              animation: "spin 2.2s linear infinite",
              mask: "radial-gradient(circle, transparent 56%, black 58%)",
              WebkitMask: "radial-gradient(circle, transparent 56%, black 58%)",
            }}
          />

          {/* Center icon with swap animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              key={stepIndex}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg animate-scale-in"
            >
              <ActiveIcon className="h-7 w-7" />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          Generujeme tvoj preview
        </h3>
        <p
          key={`label-${stepIndex}`}
          className="text-sm text-muted-foreground min-h-[1.25rem] animate-fade-in"
        >
          {steps[stepIndex].label}
        </p>

        {/* Indeterminate progress bar */}
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full w-1/3 rounded-full bg-accent"
            style={{ animation: "preview-progress 1.6s ease-in-out infinite" }}
          />
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Trvá to obvykle 10–20 sekúnd. Ďakujeme za trpezlivosť ✨
        </p>
      </div>

      <style>{`
        @keyframes preview-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  )
}

export default PreviewLoadingOverlay
