import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function normalizeAccessCode(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .trim()
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const body = await req.json()
    const { action } = body

    if (action === 'save') {
      const { slug, previewData, trainerName } = body
      if (!slug || !previewData || !trainerName) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: slug, previewData, trainerName' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const accessCode = normalizeAccessCode(trainerName)

      const { data, error } = await supabase
        .from('camp_previews')
        .upsert(
          { slug, preview_data: previewData, access_code: accessCode, trainer_name: trainerName },
          { onConflict: 'slug' }
        )
        .select('id, slug')
        .single()

      if (error) {
        console.error('[preview-access] Save error:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, slug: data.slug, id: data.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify') {
      const { slug, accessCode } = body
      if (!slug || !accessCode) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: slug, accessCode' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const normalizedCode = normalizeAccessCode(accessCode)

      const { data, error } = await supabase
        .from('camp_previews')
        .select('preview_data, trainer_name')
        .eq('slug', slug)
        .eq('access_code', normalizedCode)
        .single()

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'Nesprávne meno alebo neplatný odkaz' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, previewData: data.preview_data, trainerName: data.trainer_name }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "save" or "verify".' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[preview-access] Error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
