import { PlanCard } from "../types/planCard";

export const plans: Omit<PlanCard, "onSelect">[] = [
  {
    name: "Free",
    description: "Todo lo necesario para comenzar",
    price: "GRATIS",
    period: "/siempre",
    features: [
      "1 torneo",
      "8 equipos por torneo",
      "Modo Express de los marcadores",
    ],
  },
  {
    name: "Starter",
    description: "¿Deseas alcanzar tu potencial?",
    price: "$299 MXN",
    period: "/mes",
    features: ["3 torneos simultáneos", "Hasta 24 equipos por torneo"],
    unlocks: ["Nuevos formatos", "Finanzas"],
  },
  {
    name: "Pro",
    description: "Para veteranos y amantes del deporte",
    price: "$599 MXN",
    period: "/mes",
    isPopular: true,
    features: ["Torneos e inscripciones ilimitadas"],
    unlocks: [
      "Nuevos formatos",
      "Archivo histórico",
      "Motor de validación",
      "Pagos dentro de la app",
    ],
  },
  {
    name: "Elite",
    description: "Para empresas grandes",
    price: "$999 MXN",
    period: "/mes",
    features: ["Todas las funcionalidades del plan Pro"],
    unlocks: ["Modo scout (stats de rendimiento)", "Soporte dedicado"],
  },
];
