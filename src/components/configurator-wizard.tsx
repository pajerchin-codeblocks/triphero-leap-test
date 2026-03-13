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
  const [stepperFloating, setStepperFloating] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const stepperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
      if (!configuration.meals) errors.push("meals");
      if (!configuration.selectedFlight && !configuration.flight) errors.push("flight");
    } else if (step === 3) {
      if (!configuration.trainerName || configuration.trainerName.trim() === "") errors.push("trainerName");
      if (!configuration.trainerExperience || configuration.trainerExperience.trim() === "")
        errors.push("trainerExperience");
      if (!configuration.trainerSpecialization || configuration.trainerSpecialization.trim() === "")
        errors.push("trainerSpecialization");
    } else if (step === 4) {
      if (!configuration.dailyProgram || configuration.dailyProgram.trim() === "") errors.push("dailyProgram");
    }
    return errors;
  };

  const sendStep1DataToWebhook = async () => {
    try {
      const webhookData = {
        destination: destinationToCountryCode[configuration.destination] || configuration.destination,
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

      const result = data as { data?: unknown; flights?: Array<{ month: string; minPrice: number }>; price?: number };
      const raw = result?.data !== undefined ? result.data : result;

      if (
        Array.isArray(raw) &&
        raw.length > 0 &&
        raw[0] &&
        typeof raw[0] === "object" &&
        "month" in (raw[0] as object) &&
        "minPrice" in (raw[0] as object)
      ) {
        setFlightPricesByMonth(raw as Array<{ month: string; minPrice: number }>);
      } else if (
        Array.isArray(raw) &&
        raw[0] &&
        typeof raw[0] === "object" &&
        raw[0] !== null &&
        "flights" in (raw[0] as object)
      ) {
        const flights = (raw[0] as { flights: Array<{ month: string; minPrice: number }> }).flights;
        setFlightPricesByMonth(flights);
      } else if (result?.price !== undefined) {
        setFlightPricesByMonth([{ month: "default", minPrice: result.price as number }]);
      } else if (Array.isArray(data) && data.length > 0) {
        setFlightPricesByMonth(data as Array<{ month: string; minPrice: number }>);
      } else if (result?.flights) {
        setFlightPricesByMonth(result.flights);
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
    const transferCost = configuration.transfer ? transferPrice : 0;

    const getMinParticipants = (participantStr: string) => {
      const match = participantStr?.match(/(\d+)/);
      return match ? Number.parseInt(match[1]) : 8;
    };

    const participants = getMinParticipants(configuration.participants);

    if (configuration.hotel && configuration.destination) {
      const destination = configuration.destination as keyof typeof hotelsByDestination;
      const hotels = hotelsByDestination[destination] || [];
      const selectedHotel = hotels.find((h) => h.id === configuration.hotel);
      if (selectedHotel) {
        const duration = Number.parseInt(configuration.duration) || 7;
        hotelPerNight = selectedHotel.pricePerNight * duration;
      }
    }

    if (configuration.selectedFlight?.price) {
      flightPrice = configuration.selectedFlight.price;
    } else if (configuration.flight && configuration.destination) {
      const destination = configuration.destination as keyof typeof flightsPricing;
      flightPrice = flightsPricing[destination]?.[configuration.flight] || 0;
    }

    if (configuration.meals) {
      const duration = Number.parseInt(configuration.duration) || 7;
      const pricePerDay = mealsPricing[configuration.meals] || 0;
      mealsPrice = pricePerDay * duration;
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
      <div className="py-8 px-4 pt-4">
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
                      className={`flex-1 h-1 mx-4 rounded-full transition-colors ${
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

            {/* Summary sidebar */}
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
                            {hotelsByDestination[configuration.destination as keyof typeof hotelsByDestination]?.find(
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
          </div>
        </div>
      </div>
    </div>
  );
}
