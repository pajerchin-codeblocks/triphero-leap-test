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

function generateSlug(destination: string, trainerName: string): string {
  const base = `${destination}-${trainerName}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  const suffix = Math.random().toString(36).substring(2, 6)
  return `${base}-${suffix}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { configuration } = await req.json()
    if (!configuration || !configuration.trainerName) {
      return new Response(
        JSON.stringify({ error: 'Missing configuration or trainer name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const slug = generateSlug(configuration.destination || 'camp', configuration.trainerName)

    // Mock data defaults based on campType
    const campTypeDefaults: Record<string, { specialization: string; program: string }> = {
      'Fit camp': {
        specialization: 'Funkčný tréning, HIIT a kondičné cvičenia',
        program: 'Ranný funkčný tréning, HIIT session, kondičné cvičenia, stretching a regenerácia',
      },
      'Yoga retreat': {
        specialization: 'Joga, meditácia a dychové cvičenia',
        program: 'Ranná meditácia, vinyasa joga, dychové cvičenia, večerná restoratívna joga',
      },
      'Lifestyle': {
        specialization: 'Wellness, výživa a zdravý životný štýl',
        program: 'Ranný tréning, wellness workshop, výživové poradenstvo, relaxačné aktivity',
      },
      'Komunitný pobyt': {
        specialization: 'Skupinové aktivity a team building',
        program: 'Skupinový tréning, team building aktivity, spoločné výlety a večerný program',
      },
    }

    const defaults = campTypeDefaults[configuration.campType] || {
      specialization: 'Fitness a wellness',
      program: 'Ranný tréning, hlavný tréningový blok, popoludňajšie aktivity a večerná regenerácia',
    }

    const trainerExperience = configuration.trainerExperience || '5+ rokov'
    const trainerSpecialization = configuration.trainerSpecialization || defaults.specialization
    const trainerCertificates = configuration.trainerCertificates || 'Certifikovaný osobný tréner'
    const trainerBio = configuration.trainerBio || `${configuration.trainerName} je skúsený tréner so zameraním na ${trainerSpecialization.toLowerCase()}. Pomáha klientom dosahovať ich fitness ciele v inšpiratívnom prostredí.`
    const dailyProgram = configuration.dailyProgram || defaults.program
    const pricePerPerson = configuration.estimatedPrice || 599

    const prompt = `Si expertný copywriter pre fitness a wellness retreat campy. Vytvor kompletný konverzný landing page obsah v slovenčine na základe týchto údajov:

Destinácia: ${configuration.destination || 'neuvedená'}
Termín: ${configuration.months?.join(', ') || configuration.month || 'neuvedený'}
Trvanie: ${configuration.duration || 'neuvedené'}
Počet účastníkov: ${configuration.participants || 'neuvedený'}
Typ campu: ${configuration.campType || 'neuvedený'}
Strava: ${configuration.meals || 'neuvedená'}
Transfer: ${configuration.transfer ? 'Áno' : 'Nie'}
Extra služby: ${(configuration.extras || []).join(', ') || 'žiadne'}
Špeciálne aktivity: ${(configuration.specialActivities || []).join(', ') || 'žiadne'}
Budget na osobu: ${pricePerPerson}€
Hotel: ${configuration.hotelTitle || 'neuvedený'}
Lokalita hotela: ${configuration.hotelLocation || 'neuvedená'}

Tréner:
- Meno: ${configuration.trainerName}
- Skúsenosti: ${trainerExperience}
- Špecializácia: ${trainerSpecialization}
- Certifikáty: ${trainerCertificates}
- Bio/Príbeh: ${trainerBio}

Program campu (ak je zadaný): ${dailyProgram}

Vráť VÝHRADNE platný JSON objekt (bez markdown, bez komentárov) s touto presnou štruktúrou:
{
  "hero": {
    "headline": "emotívny headline max 10 slov",
    "subheadline": "popis max 20 slov",
    "visualDescription": "popis vizuálu pre hero obrázok",
    "cta": "text CTA tlačidla"
  },
  "storyHook": {
    "opening": "úvodná veta príbehu, 2-3 vety",
    "problem": "problém ktorý camp rieši, 2-3 vety",
    "solution": "riešenie ktoré camp ponúka, 2-3 vety"
  },
  "trainerProfile": {
    "name": "${configuration.trainerName}",
    "bio": "profesionálny bio 3-4 vety",
    "credentials": ["certifikát1", "certifikát2", "certifikát3"],
    "headline": "krátky headline trénera",
    "specialization": "špecializácia",
    "experience": "roky skúseností",
    "philosophy": "filozofia tréningu 1-2 vety"
  },
  "dayTimeline": [
    {"time": "07:00", "activity": "popis aktivity"},
    {"time": "08:00", "activity": "popis aktivity"},
    {"time": "10:00", "activity": "popis aktivity"},
    {"time": "12:00", "activity": "popis aktivity"},
    {"time": "14:00", "activity": "popis aktivity"},
    {"time": "16:00", "activity": "popis aktivity"},
    {"time": "18:00", "activity": "popis aktivity"},
    {"time": "20:00", "activity": "popis aktivity"}
  ],
  "transformation": {
    "headline": "transformačný headline",
    "emotionalImpact": "emocionálny dopad 2-3 vety",
    "physicalBenefits": ["benefit1", "benefit2", "benefit3", "benefit4"],
    "mentalBenefits": ["benefit1", "benefit2", "benefit3", "benefit4"]
  },
  "luxuryExperience": {
    "headline": "headline pre luxury sekciu",
    "description": "popis luxury zážitku 2-3 vety",
    "amenities": ["amenita1", "amenita2", "amenita3", "amenita4", "amenita5", "amenita6"],
    "hotelName": "názov hotela ak je známy"
  },
  "whatMakesItSpecial": {
    "headline": "čo robí tento camp výnimočným",
    "uniquePoints": ["bod1", "bod2", "bod3"],
    "groupDynamics": "popis skupinovej dynamiky",
    "exclusivity": "popis exkluzivity"
  },
  "investmentBreakdown": {
    "headline": "investícia do seba",
    "pricePerPerson": "od ${configuration.budgetPerPerson || 600}€",
    "priceFrame": "cena za osobu / ${configuration.duration || '7 dní'}",
    "whatYouGet": ["položka1", "položka2", "položka3", "položka4", "položka5"],
    "notIncluded": ["položka1", "položka2"],
    "paymentOptions": "možnosti platby"
  },
  "urgency": {
    "scarcity": "správa o obmedzenej kapacite",
    "deadline": "deadline na prihlásenie",
    "earlyBird": "early bird ponuka alebo null",
    "finalCta": "finálne CTA"
  },
  "practicalInfo": {
    "targetAudience": "pre koho je camp určený",
    "fitnessLevel": "požadovaná fitness úroveň",
    "whatToBring": ["vec1", "vec2", "vec3", "vec4"],
    "faq": [
      {"q": "otázka1", "a": "odpoveď1"},
      {"q": "otázka2", "a": "odpoveď2"},
      {"q": "otázka3", "a": "odpoveď3"}
    ]
  },
  "closingStory": {
    "narrative": "záverečný príbeh 2-3 vety",
    "finalCta": "finálna výzva k akcii"
  }
}`

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'Si expertný copywriter. Vracaj VÝHRADNE čistý JSON bez markdown formátovania, bez ```json blokov, bez komentárov. Píš v slovenčine.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error('[generate-camp-preview] AI error:', errorText)
      return new Response(
        JSON.stringify({ error: 'AI generation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const aiResult = await aiResponse.json()
    const rawContent = aiResult.choices?.[0]?.message?.content || ''

    // Clean markdown formatting if present
    let cleanContent = rawContent.trim()
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    let previewData: any
    try {
      previewData = JSON.parse(cleanContent)
    } catch (e) {
      console.error('[generate-camp-preview] JSON parse error:', cleanContent.substring(0, 500))
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add metadata + hotel images from webhook
    const fullPreviewData = {
      success: true,
      sessionId: crypto.randomUUID(),
      slug,
      ...previewData,
      hotelImages: {
        hero: configuration.hotelImage || '',
        title: configuration.hotelTitle || '',
        location: configuration.hotelLocation || '',
      },
    }

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const accessCode = normalizeAccessCode(configuration.trainerName)

    const { error: saveError } = await supabase
      .from('camp_previews')
      .upsert(
        {
          slug,
          preview_data: fullPreviewData,
          access_code: accessCode,
          trainer_name: configuration.trainerName,
        },
        { onConflict: 'slug' }
      )

    if (saveError) {
      console.error('[generate-camp-preview] Save error:', saveError)
      return new Response(
        JSON.stringify({ error: 'Failed to save preview' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, slug, trainerName: configuration.trainerName }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[generate-camp-preview] Error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
