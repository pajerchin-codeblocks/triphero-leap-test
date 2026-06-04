// GTM dataLayer helpers for tracking the multi-step form.

type UserPayload = {
  email: string | null
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  street: string | null
  city: string | null
  postal_code: string | null
  country: string | null
}

declare global {
  interface Window {
    dataLayer?: any[]
  }
}

const buildUser = (email?: string | null): UserPayload => ({
  email: email && email.trim() ? email.trim() : null,
  first_name: null,
  last_name: null,
  phone_number: null,
  street: null,
  city: null,
  postal_code: null,
  country: null,
})

const push = (payload: Record<string, any>) => {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
}

export const pushFormStart = (formName: string, email?: string | null) => {
  push({ event: "form_start", form_name: formName, user: buildUser(email) })
}

export const pushFormSubmit = (formName: string, email?: string | null) => {
  push({ event: "form_submit", form_name: formName, user: buildUser(email) })
}

export const pushGenerateLead = (email?: string | null) => {
  push({
    event: "generate_lead",
    lead_source: "Začať plánovať trip",
    user: buildUser(email),
  })
}
