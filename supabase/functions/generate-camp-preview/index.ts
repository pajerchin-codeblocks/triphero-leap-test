import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Preview webhook z triphero-leap: body = { action, sessionId, tripData }. n8n vráti { slug, ...previewData }.
// Nastav N8N_CAMP_PREVIEW_WEBHOOK_URL = https://n8n.codeblocks.sk/webhook/3b6f62b9-dc0c-4902-bfd7-956f0bb23021

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const webhookUrl = Deno.env.get('N8N_CAMP_PREVIEW_WEBHOOK_URL')
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: 'N8N_CAMP_PREVIEW_WEBHOOK_URL is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    console.log('[generate-camp-preview] Request:', JSON.stringify(body))

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[generate-camp-preview] Webhook error [${response.status}]:`, errorText)
      return new Response(
        JSON.stringify({ error: `Webhook call failed [${response.status}]`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('[generate-camp-preview] Response:', JSON.stringify(data))

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[generate-camp-preview] Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
