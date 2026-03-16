import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Step1 webhook z triphero-leap: POST body sa posiela na n8n.
// Nastav N8N_FLIGHT_PRICES_WEBHOOK_URL = https://n8n.codeblocks.sk/webhook/73b1e138-9659-4bde-9731-1031b26668fb

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const webhookUrl = Deno.env.get('N8N_FLIGHT_PRICES_WEBHOOK_URL')
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: 'N8N_FLIGHT_PRICES_WEBHOOK_URL is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    console.log('[fetch-flight-prices] Request:', JSON.stringify(body))

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[fetch-flight-prices] Webhook error [${response.status}]:`, errorText)
      return new Response(
        JSON.stringify({ error: `Webhook call failed [${response.status}]`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const responseText = await response.text()
    console.log('[fetch-flight-prices] Response text:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      console.error('[fetch-flight-prices] Non-JSON response:', responseText)
      data = []
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[fetch-flight-prices] Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
