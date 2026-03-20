import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const webhookUrl = Deno.env.get('N8N_DESTINATIONS_WEBHOOK_URL')
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: 'N8N_DESTINATIONS_WEBHOOK_URL is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[fetch-destinations] Calling webhook:', webhookUrl)

    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[fetch-destinations] Webhook error [${response.status}]:`, errorText)
      return new Response(
        JSON.stringify({ error: `Webhook call failed [${response.status}]`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('[fetch-destinations] Response:', JSON.stringify(data))

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[fetch-destinations] Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
