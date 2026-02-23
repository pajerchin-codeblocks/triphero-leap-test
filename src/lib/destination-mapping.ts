// Mapping medzi názvami destinácií v UI a kódmi krajín pre webhook
export const destinationToCountryCode: Record<string, string> = {
  Turecko: "TR",
  Grécko: "GR",
  Egypt: "EG",
  Portugalsko: "PT",
  Bali: "ID",
  Španielsko: "ES",
  Taliansko: "IT",
  Francúzsko: "FR",
  Maroko: "MA",
  Thajsko: "TH",
  Vietnam: "VN",
  Mexiko: "MX",
  Kostarika: "CR",
  Austrália: "AU",
  Japonsko: "JP",
}

export const countryCodeToDestination: Record<string, string> = Object.fromEntries(
  Object.entries(destinationToCountryCode).map(([key, value]) => [value, key])
)

const monthNameToNumber: Record<string, number> = {
  Január: 1,
  Február: 2,
  Marec: 3,
  Apríl: 4,
  Máj: 5,
  Jún: 6,
  Júl: 7,
  August: 8,
  September: 9,
  Október: 10,
  November: 11,
  December: 12,
}

export function convertMonthsToWebhookFormat(monthNames: string[]): Array<{ code: string; checked: boolean }> {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  return monthNames.map((monthName) => {
    const monthNumber = monthNameToNumber[monthName]
    const year = monthNumber < currentMonth ? currentYear + 1 : currentYear
    const code = `${year}-${String(monthNumber).padStart(2, "0")}`
    return { code, checked: true }
  })
}
