

## Wire Up AI Chat (Skip Preview)

The user wants to skip the preview feature entirely. Instead, the summary page's main CTA should launch the AI Chat directly.

### Changes

#### 1. `src/pages/Index.tsx`
- Add `"chat"` to the Step type: `"wizard" | "summary" | "chat"`
- Render `AIChat` when `currentStep === "chat"`
- Build `tripData` object matching the webhook spec (destination as UI name, months as string array, hotel object, trainer fields, etc.)
- Pass `onBack={() => setCurrentStep("summary")}` to AIChat

#### 2. `src/components/summary-page.tsx`
- Remove the entire `handleProceedToChat` function (preview generation logic)
- Remove `useNavigate`, `supabase` import, `isSubmitting` state
- Change the main CTA button to simply call `onChat()` — rename label to e.g. "Pokračovať na AI Chat"
- Keep `onChat` prop, remove preview-related code

#### 3. `src/components/ai-chat.tsx`
- Remove `webhookUrl` prop — use `supabase.functions.invoke("generate-camp-preview")` instead of direct `fetch`
- Both INIT and message sends go through the edge function with payload `{ message, tripData, chatHistory }`
- Parse response the same way (handle array, `output` or `response` key)

#### 4. `supabase/functions/generate-camp-preview/index.ts`
- Already proxies to the n8n webhook — no changes needed since the same webhook URL handles both preview and chat payloads

### Summary of flow after changes

```text
Wizard → Summary → AI Chat
                     ↑ uses edge function → n8n webhook
                     ↑ tripData built from configuration state
```

