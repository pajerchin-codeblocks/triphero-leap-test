// Hotel database with specific properties for each destination
export const hotelsByDestination: Record<string, Array<{
  id: string;
  name: string;
  stars: number;
  image: string;
  pricePerNight: number;
  description: string;
}>> = {
  Turecko: [
    { id: "t1", name: "Marina Resort Bodrum", stars: 5, image: "/luxury-beach-resort-in-bodrum-turkey-with-palm-tre.jpg", pricePerNight: 150, description: "Luxusný waterfront resort s private pláží" },
    { id: "t2", name: "Cappadocia Dreams", stars: 4, image: "/boutique-cave-hotel-in-cappadocia-with-unique-arch.jpg", pricePerNight: 95, description: "Jedinečný cave hotel s historickým šarmom" },
    { id: "t3", name: "Aegean Wellness Center", stars: 4, image: "/luxury-resort-pool-area-aerial.jpg", pricePerNight: 120, description: "Wellness & fitness focused resort" },
  ],
  Grécko: [
    { id: "g1", name: "Santorini Blue Paradise", stars: 5, image: "/luxury-white-and-blue-hotel-in-santorini-greece-su.jpg", pricePerNight: 180, description: "Ikonický hotel s výhľadom na kalderу" },
    { id: "g2", name: "Athenian Fit Hotel", stars: 4, image: "/modern-fitness-hotel-in-athens-greece-city-center.jpg", pricePerNight: 110, description: "Fitness-focused boutique hotel v centre" },
    { id: "g3", name: "Crete Beach Club", stars: 3, image: "/beach-resort-hotel-in-crete-greece.jpg", pricePerNight: 75, description: "Priateľský pláž resort pre skupiny" },
  ],
  Egypt: [
    { id: "e1", name: "Red Sea Luxury Resort", stars: 5, image: "/all-inclusive-beach-resort-red-sea-egypt.jpg", pricePerNight: 140, description: "All-inclusive resort s water sports" },
    { id: "e2", name: "Cairo Wellness Hotel", stars: 4, image: "/modern-wellness-hotel-cairo-egypt.jpg", pricePerNight: 85, description: "Wellness centrum blízko pyramíd" },
    { id: "e3", name: "Budget Beach Escape", stars: 3, image: "/budget-friendly-beach-hotel-egypt.jpg", pricePerNight: 60, description: "Ekonomický beach hotel pre skupiny" },
  ],
  Portugalsko: [
    { id: "p1", name: "Lisbon Luxury Fitness", stars: 5, image: "/luxury-modern-hotel-lisbon-portugal-city-view.jpg", pricePerNight: 165, description: "Premium fitness & yoga retreat" },
    { id: "p2", name: "Algarve Yoga Retreat", stars: 4, image: "/luxury-resort-beach-view.jpg", pricePerNight: 105, description: "Špecializovaný yoga & wellness center" },
    { id: "p3", name: "Porto Group Resort", stars: 3, image: "/group-friendly-hotel-porto-portugal.jpg", pricePerNight: 70, description: "Skupinový hotel s meeting facilities" },
  ],
  Bali: [
    { id: "b1", name: "Ubud Luxury Retreat", stars: 5, image: "/luxury-resort-ubud-bali-rice-fields-yoga.jpg", pricePerNight: 130, description: "Premium yoga & wellness na Bali" },
    { id: "b2", name: "Bali Beach Club", stars: 4, image: "/beach-club-resort-bali-indonesia.jpg", pricePerNight: 95, description: "Beachfront resort so sockom activities" },
    { id: "b3", name: "Bali Community House", stars: 3, image: "/community-hostel-bali-indonesia-budget-friendly.jpg", pricePerNight: 55, description: "Komunálny priestor pre skupiny" },
  ],
  Španielsko: [
    { id: "s1", name: "Barcelona Fitness Loft", stars: 5, image: "/luxury-Barcelona-hotel-with-city-views.jpg", pricePerNight: 160, description: "Premium fitness hotel na Paseo de Gracia" },
    { id: "s2", name: "Gothic Quarter Retreat", stars: 4, image: "/boutique-Gothic-Quarter-Barcelona-Spain.jpg", pricePerNight: 100, description: "Boutique hotel v historickom centre" },
  ],
  Taliansko: [
    { id: "i1", name: "Venice Luxury Palace", stars: 5, image: "/Venice-luxury-waterfront-hotel-Italy.jpg", pricePerNight: 200, description: "Exkluzívny hotel na kanáles" },
    { id: "i2", name: "Rome Fitness Center", stars: 4, image: "/modern-fitness-Rome-hotel-Italy.jpg", pricePerNight: 120, description: "Moderný fitness hotel blízko Colosea" },
  ],
  Francúzsko: [
    { id: "f1", name: "Paris Wellness Boutique", stars: 5, image: "/Paris-luxury-boutique-hotel-France.jpg", pricePerNight: 180, description: "Luxusný wellness hotel v centre Paríža" },
    { id: "f2", name: "Provence Yoga Retreat", stars: 4, image: "/Provence-wellness-retreat-France.jpg", pricePerNight: 110, description: "Yoga centrum v Provence" },
  ],
  Maroko: [
    { id: "m1", name: "Marrakech Riad Luxury", stars: 5, image: "/Marrakech-riad-luxury-Morocco.jpg", pricePerNight: 140, description: "Tradiční riad s wellness" },
    { id: "m2", name: "Agadir Beach Club", stars: 4, image: "/Agadir-beach-resort-Morocco.jpg", pricePerNight: 90, description: "Beach resort na Atlantiku" },
  ],
  Thajsko: [
    { id: "th1", name: "Bangkok Fitness Haven", stars: 5, image: "/Bangkok-fitness-hotel-Thailand.jpg", pricePerNight: 125, description: "Moderný fitness hotel v centre" },
    { id: "th2", name: "Phuket Wellness Resort", stars: 4, image: "/Phuket-wellness-resort-Thailand.jpg", pricePerNight: 100, description: "Wellness resort na pláži" },
  ],
  Vietnam: [
    { id: "v1", name: "Hanoi Yoga Retreat", stars: 4, image: "/Hanoi-yoga-retreat-Vietnam.jpg", pricePerNight: 85, description: "Yoga centrum v starom meste" },
    { id: "v2", name: "Ho Chi Minh Wellness", stars: 4, image: "/Ho-Chi-Minh-wellness-hotel-Vietnam.jpg", pricePerNight: 90, description: "Wellness hotel v centre" },
  ],
  Mexiko: [
    { id: "mx1", name: "Mexico City Luxury", stars: 5, image: "/Mexico-City-luxury-hotel-Mexico.jpg", pricePerNight: 150, description: "Luxusný hotel v srdci mesta" },
    { id: "mx2", name: "Cancun Beach Paradise", stars: 4, image: "/Cancun-beach-resort-Mexico.jpg", pricePerNight: 110, description: "All-inclusive beach resort" },
  ],
  Kostarika: [
    { id: "cr1", name: "San Jose Eco Lodge", stars: 4, image: "/San-Jose-eco-lodge-Costa-Rica.jpg", pricePerNight: 95, description: "Eco-friendly wellness lodge" },
    { id: "cr2", name: "Manuel Antonio Beach", stars: 4, image: "/Manuel-Antonio-beach-hotel-Costa-Rica.jpg", pricePerNight: 100, description: "Beach hotel s wildlife" },
  ],
  Austrália: [
    { id: "au1", name: "Sydney Harbour Fitness", stars: 5, image: "/Sydney-harbour-luxury-fitness-hotel-Australia.jpg", pricePerNight: 220, description: "Luxusný fitness hotel pri Sydney Harbour" },
    { id: "au2", name: "Gold Coast Beach Resort", stars: 4, image: "/Gold-Coast-beach-resort-Australia.jpg", pricePerNight: 150, description: "Beach resort s wellness programami" },
    { id: "au3", name: "Melbourne Wellness Hub", stars: 4, image: "/Melbourne-wellness-hub-Australia.jpg", pricePerNight: 130, description: "Moderné wellness centrum v centre" },
  ],
  Japonsko: [
    { id: "jp1", name: "Tokyo Zen Retreat", stars: 5, image: "/Tokyo-zen-wellness-retreat-Japan.jpg", pricePerNight: 200, description: "Zen wellness retreat v srdci Tokya" },
    { id: "jp2", name: "Kyoto Traditional Ryokan", stars: 5, image: "/Kyoto-traditional-ryokan-wellness-Japan.jpg", pricePerNight: 180, description: "Tradičný ryokan s wellness" },
    { id: "jp3", name: "Osaka Fitness Hotel", stars: 4, image: "/Osaka-fitness-hotel-Japan.jpg", pricePerNight: 140, description: "Moderný fitness hotel v Osake" },
  ],
}

export type Hotel = (typeof hotelsByDestination)[keyof typeof hotelsByDestination][number]

export const extraServicesPricing: Record<string, number> = {
  Wellness: 25,
  Výlet: 40,
  "Meeting room": 20,
  "Foto/video balík": 60,
  "Extra event": 80,
}

export const mealsPricing: Record<string, number> = {
  Raňajky: 15,
  Polpenzia: 35,
  "Plná penzia": 50,
  "All inclusive": 65,
}

export const transferPrice = 15

export const flightsPricing: Record<string, Record<string, number>> = {
  Turecko: { "Ryanair - Letisko": 150, "Lufthansa - Direct": 280, "Wizz Air - Economy": 120 },
  Grécko: { "Ryanair - Letisko": 160, "Olympic Air - Direct": 320, "Wizz Air - Economy": 140 },
  Egypt: { "Ryanair - Letisko": 180, "EgyptAir - Direct": 350, "Cheap Flights": 130 },
  Portugalsko: { "TAP Air - Direct": 200, "Ryanair - Letisko": 140, "Wizz Air - Economy": 120 },
  Bali: { "Emirates - Bangkok": 450, "AirAsia - Multi-stop": 280, "Garuda - Direct": 520 },
  Španielsko: { "Ryanair - Letisko": 170, "Iberia - Direct": 300, "Wizz Air - Economy": 130 },
  Taliansko: { "Ryanair - Letisko": 180, "Alitalia - Direct": 330, "Wizz Air - Economy": 150 },
  Francúzsko: { "Ryanair - Letisko": 170, "Air France - Direct": 310, "Wizz Air - Economy": 140 },
  Maroko: { "Ryanair - Letisko": 160, "Royal Air Maroc": 280, "Budget Flights": 110 },
  Thajsko: { "AirAsia - Bangkok": 420, "Thai Airways": 600, "Multi-stop Budget": 320 },
  Vietnam: { "Vietjet - Ho Chi Minh": 380, "Vietnam Airlines": 550, "Multi-stop Budget": 280 },
  Mexiko: { "Ryanair - Madrid": 500, "Interjet": 450, "Budget Carrier": 320 },
  Kostarika: { "Iberia - Madrid": 700, "TACA - Hub": 650, "Budget Alliance": 450 },
  Austrália: { "Qantas - Sydney": 1200, "Emirates - Multi-stop": 950, "Budget Carrier": 800 },
  Japonsko: { "JAL - Direct Tokyo": 900, "ANA - Direct": 950, "Multi-stop Budget": 650 },
}
