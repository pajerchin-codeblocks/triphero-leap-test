import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function normalizeAccessCode(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function generateSlug(destination: string, trainerName: string): string {
  const base = `${destination}-${trainerName}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { configuration } = await req.json();
    if (!configuration || !configuration.trainerName) {
      return new Response(JSON.stringify({ error: "Missing configuration or trainer name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const slug = generateSlug(configuration.destination || "trip", configuration.trainerName);

    // Mock data defaults based on tripType
    const tripTypeDefaults: Record<string, { specialization: string; program: string }> = {
      Poznávací: {
        specialization: "Kultúrne zážitky, historické pamiatky a lokálna gastronómia",
        program: "Ranný program, prehliadka pamätihodností, lokálna kuchyňa, večerný program",
      },
      Mindfulness: {
        specialization: "Meditácia, dychové cvičenia a mindfulness praktiky",
        program: "Ranná meditácia, mindfulness workshop, dychové cvičenia, večerná relaxácia",
      },
      Joga: {
        specialization: "Joga, meditácia a dychové cvičenia",
        program: "Ranná meditácia, vinyasa joga, dychové cvičenia, večerná restoratívna joga",
      },
      Fitcamp: {
        specialization: "Funkčný tréning, HIIT a kondičné cvičenia",
        program: "Ranný funkčný tréning, HIIT session, kondičné cvičenia, stretching a regenerácia",
      },
    };

    const defaults = tripTypeDefaults[configuration.campType] || {
      specialization: "Fitness a wellness",
      program: "Ranný tréning, hlavný tréningový blok, popoludňajšie aktivity a večerná regenerácia",
    };

    const flightSelected = !!configuration.selectedFlight?.price;
    const flightPrice = configuration.selectedFlight?.price;
    const flightMonth = configuration.selectedFlight?.month;
    const flightInfo = flightSelected
      ? `Spiatočná letenka${flightMonth && flightMonth !== "default" ? ` (${flightMonth})` : ""}${flightPrice ? ` — približne ${flightPrice}€` : ""} — ZAHRNUTÁ V CENE`
      : "Letenka NIE JE zahrnutá v cene (účastník si rieši sám)";

    const transferSelected = !!configuration.transfer;
    const mealsSelected = !!configuration.meals;
    const extrasList: string[] = Array.isArray(configuration.extras) ? configuration.extras : [];
    const specialActivitiesRaw = Array.isArray(configuration.specialActivities)
      ? configuration.specialActivities.join(", ")
      : (configuration.specialActivities || "");

    const trainerExpProvided = !!configuration.trainerExperience;
    const trainerSpecProvided = !!configuration.trainerSpecialization;
    const trainerCertProvided = !!configuration.trainerCertificates;
    const trainerBioProvided = !!configuration.trainerBio;
    const programProvided = !!configuration.dailyProgram;
    const hotelDescProvided = !!configuration.hotelDescription;
    const specialActivitiesProvided = !!specialActivitiesRaw;

    const trainerExperience = configuration.trainerExperience || "";
    const trainerSpecialization = configuration.trainerSpecialization || defaults.specialization;
    const trainerCertificates = configuration.trainerCertificates || "";
    const trainerBio = configuration.trainerBio || "";
    const dailyProgram = configuration.dailyProgram || "";
    const pricePerPerson = configuration.estimatedPrice || 599;

    const prompt = `Si expertný copywriter pre fitness, wellness a retreat tripy. Tvoja JEDINÁ úloha je preformulovať a marketingovo vylepšiť údaje, ktoré tréner zadal — do gramaticky správnej, emotívnej a marketingovo zaujímavej slovenčiny.

ABSOLÚTNE PRAVIDLÁ (STRICT NO-HALLUCINATION MODE):
1. NIKDY nevymýšľaj konkrétne fakty, ktoré nie sú vo vstupných dátach. Zakázané vymýšľať: certifikáty, hotelové vybavenie (bazén, spa, fitness, pláž, reštaurácia...), programové sloty, špecifické aktivity, mená klientov, počty úspechov, miesta pôsobenia, konkrétne čísla a metriky.
2. Polia označené (ZADANÉ) — preformuluj marketingovo, ale ZACHOVAJ význam, počet položiek, časy, mená a fakty. Nepridávaj nič navyše.
3. Polia označené (NEZADANÉ):
   - Pre štruktúrované polia (dayTimeline, credentials, amenities, uniquePoints, whatToBring) → vráť PRÁZDNE pole [].
   - Pre textové polia (philosophy, description, exclusivity) → vráť PRÁZDNY string "".
   - Pre bio, targetAudience, fitnessLevel, groupDynamics → môžeš napísať VŠEOBECNÝ neutrálny marketingový text iba na základe destinácie, typu tripu a počtu účastníkov. ŽIADNE konkrétne fakty.
4. hero, storyHook, transformation, closingStory → môžeš písať voľne emotívny copywriting, ALE BEZ konkrétnych vymyslených faktov (žiadne mená, čísla, miesta, certifikáty, špecifické aktivity).
5. Letenka: ak je ZAHRNUTÁ V CENE, MUSÍ byť vo "whatYouGet" a NESMIE byť v "notIncluded". Ak NIE JE zahrnutá, MUSÍ byť v "notIncluded" a NESMIE byť vo "whatYouGet".
6. dayTimeline: ak je program ZADANÝ, parsuj sloty z textu, použi PRESNE rovnaký počet a časy. Marketingovo prepíš len popis aktivity (formuláciu) — nie samotnú aktivitu.
7. amenities: použi VÝHRADNE to, čo je v popise hotela. Ak v popise nie sú konkrétne amenity, vráť [].
8. whatYouGet a notIncluded: drž sa LEN toho, čo tréner zaškrtol/zadal. Nepridávaj "welcome drink", "darček", "uvítací kokteil", "wellness procedury" atď. ak to nie je vo vstupe.
9. faq: max 3 otázky, len o veciach ktoré sú v dátach (cena, termín, strava, letenka, hotel, počet účastníkov). Žiadne vymyslené otázky.

VSTUPNÉ DÁTA:

Destinácia: ${configuration.destination || "neuvedená"}
Termín: ${configuration.months?.join(", ") || configuration.month || "neuvedený"}
Trvanie: ${configuration.duration || "neuvedené"}
Počet účastníkov: ${configuration.participants || "neuvedený"}
Typ tripu: ${configuration.campType || "neuvedený"}
Strava: ${mealsSelected ? configuration.meals : "NEZADANÁ"}
Transfer: ${transferSelected ? "Áno (zahrnutý)" : "Nie (nezahrnutý)"}
Letenka: ${flightInfo}
Extra služby: ${extrasList.length > 0 ? extrasList.join(", ") : "žiadne"}
Špeciálne aktivity: ${specialActivitiesProvided ? specialActivitiesRaw + " (ZADANÉ — preformuluj, nepridávaj ďalšie)" : "NEZADANÉ — nevymýšľaj žiadne"}
Budget na osobu: ${pricePerPerson}€

Hotel:
- Názov: ${configuration.hotelTitle || "neuvedený"}
- Popis: ${hotelDescProvided ? configuration.hotelDescription + " (ZADANÉ — z popisu vyber konkrétne amenity)" : "NEZADANÝ — amenities nechaj prázdne []"}
- Lokalita: ${configuration.hotelLocation || "neuvedená"}
- Trieda: ${configuration.hotelStars || "neuvedená"} hviezdičiek

Tréner:
- Meno: ${configuration.trainerName}
- Skúsenosti: ${trainerExperience || "NEZADANÉ"} ${trainerExpProvided ? "(ZADANÉ — použi presne)" : "(NEZADANÉ — nevymýšľaj počet rokov)"}
- Špecializácia: ${trainerSpecialization} ${trainerSpecProvided ? "(ZADANÉ — použi presne)" : "(NEZADANÉ — odvodené od typu tripu)"}
- Certifikáty: ${trainerCertificates || "NEZADANÉ"} ${trainerCertProvided ? "(ZADANÉ — použi PRESNE tie, nepridávaj)" : "(NEZADANÉ — credentials = [], NEVYMÝŠĽAJ)"}
- Bio/Príbeh: ${trainerBio || "NEZADANÉ"} ${trainerBioProvided ? "(ZADANÉ — preformuluj marketingovo, ale zachovaj fakty)" : "(NEZADANÉ — napíš všeobecný neutrálny bio bez vymyslených úspechov a klientov; philosophy nechaj \"\")"}

Program tripu: ${dailyProgram || "NEZADANÝ"} ${programProvided ? "(ZADANÝ — použi PRESNE tie sloty a časy. Marketingovo prepíš len popisy aktivít, zachovaj význam.)" : "(NEZADANÝ — dayTimeline = [], NEVYMÝŠĽAJ sloty)"}

Vráť VÝHRADNE platný JSON objekt (bez markdown, bez komentárov) s touto presnou štruktúrou (rešpektuj pravidlá pre prázdne polia):
{
  "hero": {
    "headline": "emotívny headline max 10 slov",
    "subheadline": "popis max 20 slov",
    "visualDescription": "popis vizuálu pre hero obrázok",
    "cta": "text CTA tlačidla"
  },
  "storyHook": {
    "opening": "úvodná veta príbehu, 2-3 vety (bez vymyslených faktov)",
    "problem": "problém ktorý trip rieši, 2-3 vety",
    "solution": "riešenie ktoré trip ponúka, 2-3 vety"
  },
  "trainerProfile": {
    "name": "${configuration.trainerName}",
    "bio": "ak ZADANÉ — preformuluj. Ak NEZADANÉ — všeobecný neutrálny bio bez vymyslených úspechov.",
    "credentials": "pole — ak ZADANÉ použi presne, ak NEZADANÉ vráť []",
    "headline": "krátky headline trénera",
    "specialization": "presne to, čo bolo zadané (alebo odvodené od typu tripu)",
    "experience": "presne to, čo bolo zadané, alebo prázdny string",
    "philosophy": "ak trainerBio NEZADANÉ → \"\". Inak krátka filozofia 1-2 vety odvodená z bio."
  },
  "dayTimeline": "pole {time, activity} — ak program ZADANÝ použi PRESNE tie sloty, ak NEZADANÝ vráť []",
  "transformation": {
    "headline": "transformačný headline",
    "emotionalImpact": "emocionálny dopad 2-3 vety (bez konkrétnych čísel)",
    "physicalBenefits": ["všeobecné benefity podľa typu tripu, max 4"],
    "mentalBenefits": ["všeobecné benefity podľa typu tripu, max 4"]
  },
  "luxuryExperience": {
    "headline": "headline pre sekciu o ubytovaní",
    "description": "ak hotelDescription ZADANÉ — preformuluj. Ak NEZADANÉ → \"\"",
    "amenities": "pole — len konkrétne amenity z popisu hotela. Ak nič → []",
    "hotelName": "${configuration.hotelTitle || ""}"
  },
  "whatMakesItSpecial": {
    "headline": "čo robí tento trip výnimočným",
    "uniquePoints": "pole — len body odvodené z reálne zadaných údajov (typ tripu, špeciálne aktivity, extras). Ak nič → []",
    "groupDynamics": "krátky text odvodený od počtu účastníkov",
    "exclusivity": "ak nie je dôvod (prémiový hotel/malá skupina) → \"\""
  },
  "investmentBreakdown": {
    "headline": "investícia do seba",
    "pricePerPerson": "od ${pricePerPerson}€",
    "priceFrame": "cena za osobu / ${configuration.duration || "7 dní"}",
    "whatYouGet": "pole — len položky odvodené zo zaškrtnutých vstupov (ubytovanie, strava, transfer, letenka, extras, špeciálne aktivity, tréning). Marketingovo preformuluj.",
    "notIncluded": "pole — len položky, ktoré tréner NEZAŠKRTOL (napr. letenka/transfer/strava ak nie sú zahrnuté). Bez vymyslených položiek.",
    "paymentOptions": "stručná veta o možnostiach platby"
  },
  "practicalInfo": {
    "targetAudience": "krátko, odvodené od typu tripu a počtu účastníkov",
    "fitnessLevel": "krátko, odvodené od typu tripu (bez konkrétnych metrík)",
    "whatToBring": "pole — všeobecný neutrálny zoznam podľa typu tripu (max 5 položiek). Ak typ tripu nie je jasný → []",
    "faq": [
      {"q": "otázka len o reálnych údajoch", "a": "odpoveď"},
      {"q": "otázka len o reálnych údajoch", "a": "odpoveď"},
      {"q": "otázka len o reálnych údajoch", "a": "odpoveď"}
    ]
  },
  "closingStory": {
    "narrative": "záverečný príbeh 2-3 vety (bez vymyslených faktov)",
    "finalCta": "finálna výzva k akcii"
  }
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Si expertný copywriter. Vracaj VÝHRADNE čistý JSON bez markdown formátovania, bez ```json blokov, bez komentárov. Píš v slovenčine.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("[generate-camp-preview] AI error:", errorText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content || "";

    // Clean markdown formatting if present
    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    let previewData: any;
    try {
      previewData = JSON.parse(cleanContent);
    } catch (e) {
      console.error("[generate-camp-preview] JSON parse error:", cleanContent.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Safety net: enforce flight in correct list regardless of AI output
    const ib = previewData?.investmentBreakdown;
    if (ib) {
      const flightRegex = /letenk|flight/i;
      ib.whatYouGet = (ib.whatYouGet || []).filter((x: string) => flightSelected || !flightRegex.test(x));
      ib.notIncluded = (ib.notIncluded || []).filter((x: string) => !flightSelected || !flightRegex.test(x));
      if (flightSelected && !ib.whatYouGet.some((x: string) => flightRegex.test(x))) {
        ib.whatYouGet.unshift(`Spiatočná letenka${flightMonth && flightMonth !== "default" ? ` (${flightMonth})` : ""}`);
      }
      if (!flightSelected && !ib.notIncluded.some((x: string) => flightRegex.test(x))) {
        ib.notIncluded.unshift("Spiatočná letenka");
      }
    }

    // Add metadata + hotel images from webhook
    const fullPreviewData = {
      success: true,
      sessionId: crypto.randomUUID(),
      slug,
      ...previewData,
      hotelImages: {
        hero: configuration.hotelImage || "",
        title: configuration.hotelTitle || "",
        location: configuration.hotelLocation || "",
        description: configuration.hotelDescription || "",
        stars: configuration.hotelStars || 0,
        pricePerNight: configuration.hotelPrice || 0,
      },
    };

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const accessCode = normalizeAccessCode(configuration.trainerName);

    const { error: saveError } = await supabase.from("camp_previews").upsert(
      {
        slug,
        preview_data: fullPreviewData,
        access_code: accessCode,
        trainer_name: configuration.trainerName,
      },
      { onConflict: "slug" },
    );

    if (saveError) {
      console.error("[generate-camp-preview] Save error:", saveError);
      return new Response(JSON.stringify({ error: "Failed to save preview" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, slug, trainerName: configuration.trainerName }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[generate-camp-preview] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
