import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Step1Basic from "./wizard-steps/step1-basic";
import Step2Accommodation from "./wizard-steps/step2-accommodation";
import Step3Business from "./wizard-steps/step3-business";
import Step4TrainerInfo from "./wizard-steps/step4-trainer-info";
import Step5Program from "./wizard-steps/step5-program";
import WizardNavigation from "./wizard-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { hotelsByDestination, transferPrice, flightsPricing, mealsPricing } from "@/lib/hotels-database";
import { Check, ChevronUp, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { destinationToCountryCode, convertMonthsToWebhookFormat } from "@/lib/destination-mapping";
import { supabase } from "@/integrations/supabase/client";
import { WebhookHotel, micros, MealKey, mealPriceKeys } from "@/lib/webhook-types";

interface ConfiguratorWizardProps {
  configuration: any;
  onConfigurationChange: (updates: any) => void;
  onComplete: () => void;
}

export default function ConfiguratorWizard({
  configuration,
  onConfigurationChange,
  onComplete,
}: ConfiguratorWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [flightPricesByMonth, setFlightPricesByMonth] = useState<Array<{ month: string; minPrice: number }>>([]);
  const [webhookHotels, setWebhookHotels] = useState<WebhookHotel[]>([]);
  const [stepperFloating, setStepperFloating] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const stepperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Destinations from webhook
  const [availableDestinations, setAvailableDestinations] = useState<Array<{ id: string; label: string; image: string }>>([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);

  // Fallback destinations if webhook fails
  const fallbackDestinations = [
    { id: "Turecko", label: "Turecko", image: "/destinations/turkey.jpg" },
    { id: "Grécko", label: "Grécko", image: "/destinations/greece.jpg" },
    { id: "Egypt", label: "Egypt", image: "/destinations/egypt.jpg" },
    { id: "Portugalsko", label: "Portugalsko", image: "/destinations/portugal.jpg" },
    { id: "Bali", label: "Bali", image: "/destinations/bali.jpg" },
  ];

  // Country code to Slovak name mapping for webhook response
  const countryCodeToName: Record<string, string> = {
    TR: "Turecko", GR: "Grécko", EG: "Egypt", PT: "Portugalsko", ID: "Bali",
    ES: "Španielsko", IT: "Taliansko", FR: "Francúzsko", MA: "Maroko",
    TH: "Thajsko", VN: "Vietnam", MX: "Mexiko", CR: "Kostarika",
    AU: "Austrália", JP: "Japonsko",
  };

  const countryCodeToImage: Record<string, string> = {
    TR: "/destinations/turkey.jpg", GR: "/destinations/greece.jpg", EG: "/destinations/egypt.jpg",
    PT: "/destinations/portugal.jpg", ID: "/destinations/bali.jpg", ES: "/destinations/spanish.jpg",
    IT: "/destinations/italy.jpg", FR: "/destinations/france.jpg", MA: "/destinations/morocco.jpg",
    TH: "/destinations/thailand.jpg", VN: "/destinations/vietnam.jpg", MX: "/destinations/mexico.jpg",
    CR: "/destinations/costarica.jpg", AU: "/destinations/australia.jpg", JP: "/destinations/japan.jpg",
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("fetch-destinations", { body: {} });
        if (error) {
          console.error("[TripHERO] Destinations webhook error:", error);
          setAvailableDestinations(fallbackDestinations);
          return;
        }

        console.log("[TripHERO] Destinations response:", data);

        // Parse response — flexible to handle different formats
        const raw = Array.isArray(data) ? data : data?.destinations ? data.destinations : data?.data ? data.data : [];
        const items = Array.isArray(raw) ? raw : [];

        if (items.length === 0) {
          setAvailableDestinations(fallbackDestinations);
          return;
        }

        const mapped = items.map((item: any) => {
          // Support {id, name, image}, {code, name}, {countryCode, label}, etc.
          const code = item.code || item.countryCode || item.id || "";
          const name = item.name || item.label || item.destinationName || countryCodeToName[code] || code;
          const image = item.image || countryCodeToImage[code] || `/destinations/${name.toLowerCase()}.jpg`;
          const id = countryCodeToName[code] || name;
          return { id, label: id, image };
        });

        setAvailableDestinations(mapped.length > 0 ? mapped : fallbackDestinations);
      } catch (err) {
        console.error("[TripHERO] Failed to fetch destinations:", err);
        setAvailableDestinations(fallbackDestinations);
      } finally {
        setDestinationsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    const onScroll = () => setStepperFloating(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const steps = [
    { title: "Základné parametre", component: Step1Basic },
    { title: "Ubytovanie & služby", component: Step2Accommodation },
    { title: "Biznis nastavenia", component: Step3Business },
    { title: "O trénerovi", component: Step4TrainerInfo },
    { title: "Program dňa", component: Step5Program },
  ];

  const CurrentStep = steps[currentStep].component;

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    if (step === 0) {
      if (!configuration.destination) errors.push("destination");
      if (!configuration.months || configuration.months.length === 0) errors.push("months");
      if (!configuration.duration) errors.push("duration");
      if (!configuration.campType || configuration.campType.trim() === "") errors.push("campType");
    } else if (step === 1) {
      if (!configuration.hotel) errors.push("hotel");
      // Only require meals if the selected hotel has any meal option
      const wh = webhookHotels.find((h) => h.id === configuration.hotel);
      const hasMealOptions = wh ? (wh.bb || wh.hb || wh.fb || wh.ai) : true;
      if (hasMealOptions && !configuration.meals) errors.push("meals");
      // Only require flight if flight data is available
      // Flight selection is optional — don't block progression
    } else if (step === 3) {
      if (!configuration.trainerName || configuration.trainerName.trim() === "") errors.push("trainerName");
      if (!configuration.trainerExperience || configuration.trainerExperience.trim() === "")
        errors.push("trainerExperience");
      if (!configuration.trainerSpecialization || configuration.trainerSpecialization.trim() === "")
        errors.push("trainerSpecialization");
    } else if (step === 4) {
      // No required fields in step 5
    }
    return errors;
  };

  const sendStep1DataToWebhook = async () => {
    try {
      const webhookData = {
        destination: destinationToCountryCode[configuration.destination] || configuration.destination,
        destinationName: configuration.destination,
        months: convertMonthsToWebhookFormat(configuration.months || []),
        duration: Number.parseInt(configuration.duration) || 0,
        participants: configuration.participants || "",
        campType: configuration.campType || "",
      };
      console.log("[TripHERO] Sending step 1 data to webhook:", webhookData);

      const { data, error } = await supabase.functions.invoke("fetch-flight-prices", {
        body: webhookData,
      });

      if (error) {
        console.error("[TripHERO] Flight prices webhook error:", error);
        return;
      }

      console.log("[TripHERO] Step 1 data sent successfully:", data);

      // Parse response — could be array wrapper or direct object
      const result = data as any;
      const raw = Array.isArray(result) ? result[0] : result?.data !== undefined ? result.data : result;
      const payload = Array.isArray(raw) ? raw[0] : raw;

      // Extract hotels
      if (payload?.hotels && Array.isArray(payload.hotels)) {
        console.log("[TripHERO] Webhook hotels received:", payload.hotels.length);
        setWebhookHotels(payload.hotels as WebhookHotel[]);
      }

      // Extract flights
      if (payload?.flights && Array.isArray(payload.flights)) {
        setFlightPricesByMonth(payload.flights as Array<{ month: string; minPrice: number }>);
      } else if (Array.isArray(raw) && raw.length > 0 && raw[0]?.month !== undefined) {
        setFlightPricesByMonth(raw as Array<{ month: string; minPrice: number }>);
      } else if (result?.price !== undefined) {
        setFlightPricesByMonth([{ month: "default", minPrice: result.price as number }]);
      }
    } catch (error) {
      console.error("[TripHERO] Error sending step 1 data:", error);
    }
  };

  const handleNext = async () => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      const errorObj: Record<string, boolean> = {};
      errors.forEach((field) => (errorObj[field] = true));
      setValidationErrors(errorObj);
      return;
    }
    setValidationErrors({});

    if (currentStep === 0) {
      await sendStep1DataToWebhook();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Store calculated price before completing
      onConfigurationChange({ estimatedPrice: calculateEstimatedPrice() });
      onComplete();
    }
  };

  const handlePrevious = () => {
    setValidationErrors({});
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = async (index: number) => {
    if (index === currentStep) return;
    if (index < currentStep) {
      setValidationErrors({});
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Validate all steps between current and target
      for (let s = currentStep; s < index; s++) {
        const errors = validateStep(s);
        if (errors.length > 0) {
          const errorObj: Record<string, boolean> = {};
          errors.forEach((field) => (errorObj[field] = true));
          setValidationErrors(errorObj);
          if (s !== currentStep) setCurrentStep(s);
          return;
        }
      }
      setValidationErrors({});
      if (currentStep === 0) await sendStep1DataToWebhook();
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calculateEstimatedPrice = () => {
    const INSTAGYM_COMMISSION = 250;
    const trainerReward = configuration.trainerReward ?? 50;

    let hotelPerNight = 0;
    let flightPrice = 0;
    let mealsPrice = 0;
    let transferCost = 0;

    const getMinParticipants = (participantStr: string) => {
      const match = participantStr?.match(/(\d+)/);
      return match ? Number.parseInt(match[1]) : 8;
    };

    const participants = getMinParticipants(configuration.participants);
    const duration = Number.parseInt(configuration.duration) || 7;

    if (configuration.hotel) {
      // Try webhook hotels first
      const wh = webhookHotels.find((h) => h.id === configuration.hotel);
      if (wh) {
        hotelPerNight = wh.price * duration;
      } else if (configuration.destination) {
        const destination = configuration.destination as keyof typeof hotelsByDestination;
        const hotels = hotelsByDestination[destination] || [];
        const selectedHotel = hotels.find((h) => h.id === configuration.hotel);
        if (selectedHotel) hotelPerNight = selectedHotel.pricePerNight * duration;
      }
    }

    if (configuration.selectedFlight?.price) {
      flightPrice = configuration.selectedFlight.price;
    } else if (configuration.flight && configuration.destination) {
      const destination = configuration.destination as keyof typeof flightsPricing;
      flightPrice = flightsPricing[destination]?.[configuration.flight] || 0;
    }

    if (configuration.meals && configuration.hotel) {
      const wh = webhookHotels.find((h) => h.id === configuration.hotel);
      if (wh) {
        // Find meal price from webhook hotel
        const mealKeys: MealKey[] = ["bb", "hb", "fb", "ai"];
        const mealLabelsMap: Record<string, MealKey> = { "Raňajky": "bb", "Polpenzia": "hb", "Plná penzia": "fb", "All inclusive": "ai" };
        const mk = mealLabelsMap[configuration.meals];
        if (mk) {
          const pricePerDay = micros(wh[mealPriceKeys[mk]]);
          mealsPrice = pricePerDay * duration;
        }
      } else {
        const pricePerDay = mealsPricing[configuration.meals] || 0;
        mealsPrice = pricePerDay * duration;
      }
    }

    if (configuration.transfer) {
      const wh = webhookHotels.find((h) => h.id === configuration.hotel);
      transferCost = wh?.transferPrice ? micros(wh.transferPrice) : transferPrice;
    }

    const hotelCostPerPerson = hotelPerNight / 2;
    const baseCostPerPerson = hotelCostPerPerson + flightPrice + mealsPrice + transferCost;
    const trainerCostsPerPerson = baseCostPerPerson / participants;
    const pricePerPerson = INSTAGYM_COMMISSION + trainerReward + baseCostPerPerson + trainerCostsPerPerson;

    return Math.round(Math.max(pricePerPerson, 0));
  };

  const calculateEarningsRange = () => {
    const trainerReward = configuration.trainerReward ?? 50;
    const participantStr = configuration.participants || "8-12";
    const match = participantStr.match(/(\d+)\s*[–—-]\s*(\d+)/);
    if (match) {
      const minP = Number.parseInt(match[1]);
      const maxP = Number.parseInt(match[2]);
      return { min: minP * trainerReward, max: maxP * trainerReward, total: ((minP + maxP) / 2) * trainerReward };
    }
    const singleMatch = participantStr.match(/(\d+)/);
    if (singleMatch) {
      const p = Number.parseInt(singleMatch[1]);
      return { min: p * trainerReward, max: p * trainerReward, total: p * trainerReward };
    }
    return { min: 0, max: 0, total: 0 };
  };

  const estimatedPricePerPerson = calculateEstimatedPrice();
  const earningsRange = calculateEarningsRange();

  const hasSummaryData = !!(
    configuration.destination ||
    (configuration.months && configuration.months.length > 0) ||
    configuration.duration ||
    configuration.participants ||
    configuration.campType ||
    configuration.hotel ||
    configuration.meals
  );

  return (
    <div className="min-h-screen bg-background">
      <div className={`py-8 px-4 pt-4 ${isMobile && hasSummaryData ? "pb-20" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {/* Stepper + Nav buttons */}
          <div ref={stepperRef} className={`sticky top-0 z-40 rounded-2xl p-4 flex items-center justify-between mb-8 transition-all duration-300 ${
            stepperFloating ? "bg-background shadow-soft" : "bg-muted/40 backdrop-blur-sm"
          }`}>
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`gap-2 rounded-xl shrink-0 gradient-wizard-btn font-semibold transition-all hidden md:flex ${
                currentStep === 0 ? "invisible" : ""
              }`}
            >
              ← Späť
            </Button>
            <div className="flex items-center flex-1 md:mx-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => handleStepClick(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all cursor-pointer hover:scale-110 ${
                      index === currentStep
                        ? "gradient-brand text-primary-foreground shadow-glow"
                        : index < currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </button>
                  <span
                    onClick={() => handleStepClick(index)}
                    className={`ml-3 text-sm font-medium hidden md:inline cursor-pointer whitespace-nowrap ${
                      index === currentStep
                        ? "text-foreground font-semibold"
                        : index < currentStep
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 md:mx-4 rounded-full transition-colors ${
                        index < currentStep ? "gradient-brand" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={handleNext}
              className="gap-2 rounded-xl shrink-0 gradient-wizard-btn font-semibold transition-all hidden md:flex"
            >
              {currentStep === steps.length - 1 ? "Pokračovať" : "Ďalej"} →
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === 1 ? (
                <Step2Accommodation
                  configuration={configuration}
                  onConfigurationChange={onConfigurationChange}
                  validationErrors={validationErrors}
                  flightPricesByMonth={flightPricesByMonth}
                  webhookHotels={webhookHotels}
                />
              ) : (
                <CurrentStep
                  configuration={configuration}
                  onConfigurationChange={onConfigurationChange}
                  validationErrors={validationErrors}
                />
              )}

              {/* Bottom navigation buttons */}
              <div className="mt-12 flex gap-4 justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`gap-2 rounded-xl gradient-wizard-btn font-semibold transition-all ${
                    currentStep === 0 ? "invisible" : ""
                  }`}
                >
                  ← Späť
                </Button>
                <Button
                  onClick={handleNext}
                  className="gap-2 rounded-xl gradient-wizard-btn font-semibold transition-all"
                >
                  {currentStep === steps.length - 1 ? "Pokračovať" : "Ďalej"} →
                </Button>
              </div>
            </div>

            {/* Summary sidebar — desktop only */}
            {!isMobile && (
              <div className="lg:col-span-1">
                {hasSummaryData && (
                  <div className="sticky mt-[6rem]" style={{ top: "4.5rem" }}>
                    <div className="rounded-2xl p-[2px] shadow-soft overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(234, 85%, 63%), hsl(156, 83%, 64%))' }}>
                    <div className="rounded-[14px] overflow-hidden bg-card text-card-foreground">
                      <CardContent className="px-4 py-4 space-y-2">
                        <h3 className="text-base font-semibold mb-2">Súhrn</h3>
                        {configuration.destination && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">Destinácia</span>
                            <span className="text-sm font-medium">{configuration.destination}</span>
                          </div>
                        )}
                        {configuration.months && configuration.months.length > 0 && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">Termíny</span>
                            <span className="text-sm font-medium text-right max-w-[60%]">
                              {configuration.months.join(", ")}
                            </span>
                          </div>
                        )}
                        {configuration.duration && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">Trvanie</span>
                            <span className="text-sm font-medium">{configuration.duration}</span>
                          </div>
                        )}
                        {configuration.participants && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">Účastníci</span>
                            <span className="text-sm font-medium">{configuration.participants}</span>
                          </div>
                        )}
                        {configuration.campType && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">Typ campu</span>
                            <span className="text-sm font-medium">{configuration.campType}</span>
                          </div>
                        )}
                        {configuration.hotel && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">Hotel</span>
                            <span className="text-sm font-medium text-right max-w-[60%]">
                              {webhookHotels.find((h) => h.id === configuration.hotel)?.title ||
                                hotelsByDestination[configuration.destination as keyof typeof hotelsByDestination]?.find(
                                (h) => h.id === configuration.hotel,
                              )?.name || "Nevybratý"}
                            </span>
                          </div>
                        )}
                        {configuration.meals && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">Strava</span>
                            <span className="text-sm font-medium">{configuration.meals}</span>
                          </div>
                        )}
                        {currentStep >= 2 && (
                          <div className="pt-2 border-t border-border space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs text-muted-foreground">Odmena / účastník</span>
                              <span className="text-sm font-semibold">{configuration.trainerReward ?? 50} €</span>
                            </div>
                            {earningsRange.min > 0 && (
                              <div className="flex justify-between items-baseline">
                                <span className="text-xs text-muted-foreground">Rozsah zárobku</span>
                                <span className="text-sm font-semibold text-accent">
                                  {earningsRange.min} – {earningsRange.max} €
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      {configuration.hotel && currentStep > 0 && (
                        <div className="px-4 py-3 border-t border-border bg-muted/30">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground">Cena za osobu</span>
                            <span className="text-xl font-bold text-accent">~ {estimatedPricePerPerson} €</span>
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile floating summary bar */}
      {isMobile && hasSummaryData && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg">
          {/* Collapsed bar — always visible */}
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Súhrn</span>
              {mobileSummaryOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            {configuration.hotel && currentStep > 0 ? (
              <span className="text-lg font-bold text-accent">~ {estimatedPricePerPerson} €</span>
            ) : (
              <span className="text-xs text-muted-foreground">Krok {currentStep + 1} z {steps.length}</span>
            )}
          </button>

          {/* Expanded details */}
          {mobileSummaryOpen && (
            <div className="px-4 pb-4 space-y-2 border-t border-border max-h-[50vh] overflow-y-auto">
              <div className="pt-3 space-y-2">
                {configuration.destination && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Destinácia</span>
                    <span className="text-sm font-medium">{configuration.destination}</span>
                  </div>
                )}
                {configuration.months && configuration.months.length > 0 && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Termíny</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">
                      {configuration.months.join(", ")}
                    </span>
                  </div>
                )}
                {configuration.duration && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Trvanie</span>
                    <span className="text-sm font-medium">{configuration.duration}</span>
                  </div>
                )}
                {configuration.participants && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Účastníci</span>
                    <span className="text-sm font-medium">{configuration.participants}</span>
                  </div>
                )}
                {configuration.campType && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Typ campu</span>
                    <span className="text-sm font-medium">{configuration.campType}</span>
                  </div>
                )}
                {configuration.hotel && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Hotel</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">
                      {webhookHotels.find((h) => h.id === configuration.hotel)?.title ||
                        hotelsByDestination[configuration.destination as keyof typeof hotelsByDestination]?.find(
                        (h) => h.id === configuration.hotel,
                      )?.name || "Nevybratý"}
                    </span>
                  </div>
                )}
                {configuration.meals && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Strava</span>
                    <span className="text-sm font-medium">{configuration.meals}</span>
                  </div>
                )}
                {currentStep >= 2 && (
                  <div className="pt-2 border-t border-border space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-muted-foreground">Odmena / účastník</span>
                      <span className="text-sm font-semibold">{configuration.trainerReward ?? 50} €</span>
                    </div>
                    {earningsRange.min > 0 && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-muted-foreground">Rozsah zárobku</span>
                        <span className="text-sm font-semibold text-accent">
                          {earningsRange.min} – {earningsRange.max} €
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
