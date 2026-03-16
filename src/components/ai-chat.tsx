import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"

interface AIChatProps {
  tripData: Record<string, unknown>
  onBack: () => void
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

function parseResponse(data: unknown): string | null {
  let parsed = data
  if (Array.isArray(parsed) && parsed.length > 0) {
    parsed = parsed[0]
  }
  const obj = parsed as { output?: string; response?: string }
  return obj?.output ?? obj?.response ?? null
}

function extractPreviewData(data: unknown): { slug: string; previewData: unknown } | null {
  let parsed = data
  if (Array.isArray(parsed) && parsed.length > 0) {
    parsed = parsed[0]
  }
  const obj = parsed as Record<string, unknown>
  if (obj?.slug && typeof obj.slug === 'string') {
    return { slug: obj.slug, previewData: obj }
  }
  return null
}

async function savePreviewToDB(slug: string, previewData: unknown, trainerName: string) {
  try {
    const { error } = await supabase.functions.invoke("preview-access", {
      body: { action: "save", slug, previewData, trainerName },
    })
    if (error) {
      console.error("[TripHERO] Failed to save preview to DB:", error)
    } else {
      console.log("[TripHERO] Preview saved to DB:", slug)
    }
  } catch (err) {
    console.error("[TripHERO] Error saving preview:", err)
  }
}

export default function AIChat({ tripData, onBack }: AIChatProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewSlug, setPreviewSlug] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const trainerName = (tripData.trainerName as string) || ""

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      setIsLoading(true)
      try {
        const { data, error: fnError } = await supabase.functions.invoke("generate-camp-preview", {
          body: { message: "INIT", tripData, chatHistory: [] },
        })
        if (fnError) throw new Error(fnError.message)
        const content = parseResponse(data)
        if (content) {
          setChatHistory([{ role: "assistant", content }])
        } else {
          throw new Error("No message content in response")
        }

        // Check if response contains preview data with slug
        const preview = extractPreviewData(data)
        if (preview && trainerName) {
          setPreviewSlug(preview.slug)
          savePreviewToDB(preview.slug, preview.previewData, trainerName)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepodarilo sa načítať uvítaciu správu")
      } finally {
        setIsLoading(false)
      }
    }
    fetchWelcomeMessage()
  }, [tripData])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput("")
    setError(null)
    const newUserMessage: ChatMessage = { role: "user", content: userMessage }
    const updatedChatHistory = [...chatHistory, newUserMessage]
    setChatHistory(updatedChatHistory)
    setIsLoading(true)
    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-camp-preview", {
        body: { message: userMessage, tripData, chatHistory: updatedChatHistory },
      })
      if (fnError) throw new Error(fnError.message)
      const content = parseResponse(data)
      if (content) {
        setChatHistory((prev) => [...prev, { role: "assistant", content }])
      } else {
        throw new Error("No response from assistant")
      }

      // Check if response contains preview data with slug
      const preview = extractPreviewData(data)
      if (preview && trainerName) {
        setPreviewSlug(preview.slug)
        savePreviewToDB(preview.slug, preview.previewData, trainerName)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala chyba pri komunikácii")
    } finally {
      setIsLoading(false)
    }
  }

  const previewUrl = previewSlug ? `${window.location.origin}/preview/${previewSlug}` : null

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">AI Asistent - Doladenie campu</h1>
            <Button onClick={onBack} variant="outline" size="sm" className="gap-2 bg-transparent">
              ← Späť
            </Button>
          </div>

          <Card className="h-[600px] border-border flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 && isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatHistory.length > 0 && isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center">
                  <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm">{error}</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Položte otázku..."
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="sm"
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isLoading ? "..." : "✓ Poslať"}
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {previewUrl && (
              <Card className="border-2 border-accent">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">🔗 Odkaz na preview</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tréner sa prihlási svojím menom: <strong>{trainerName}</strong>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={previewUrl}
                      className="flex-1 px-3 py-2 text-xs border border-border rounded-lg bg-muted text-foreground"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => navigator.clipboard.writeText(previewUrl)}
                    >
                      Kopírovať
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Konfigurácia JSON</h3>
              <Card>
                <CardContent className="p-4 bg-card border-border overflow-x-auto max-h-[600px] overflow-y-auto">
                  <pre className="text-xs text-card-foreground font-mono whitespace-pre-wrap break-words">
                    {JSON.stringify(tripData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
