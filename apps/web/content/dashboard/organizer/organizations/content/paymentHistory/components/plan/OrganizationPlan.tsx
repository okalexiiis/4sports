"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* ICONS */
import { Check, Plus } from "lucide-react";

export function OrganizationPlan({ onSelect }: { onSelect: () => void }) {
  const plan = {
    name: "Starter",
    description: "¿Deseas alcanzar tu potencial?",
    price: "$299 MXN",
    period: "/mes",
    features: ["3 torneos simultáneos", "Hasta 24 equipos por torneo"],
    unlocks: ["Nuevos formatos", "Finanzas"],
  };

  return (
    <div className="w-full md:w-1/3 md:min-w-1/3 rounded-2xl border border-line flex flex-col">
      <div className="p-6 border-b border-line">
        <p className="text-xl font-extralight text-ink">Plan actual</p>
      </div>

      <div className="flex flex-col justify-between flex-1 p-6">
        <div>
          <p className="rounded-full text-3xl font-bold uppercase text-primary font-bebas mb-2">
            {plan.name}
          </p>
          <p className="text-xs mb-4">{plan.description}</p>

          <div className="border-b border-line pb-3 flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-black text-ink">{plan.price}</span>
            <span className="text-xs font-semibold text-muted">
              {plan.period}
            </span>
          </div>

          <ul className="space-y-2 text-xs mb-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="size-3 text-primary" />
                <span className="leading-tight text-muted">{feature}</span>
              </li>
            ))}
          </ul>

          {plan.unlocks && plan.unlocks.length > 0 && (
            <div className="my-6">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="size-3 text-muted" />
                <p className="text-xs uppercase text-muted">Desbloquea:</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {plan.unlocks.map((unlock, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-surface-hover border border-line px-2 py-1 text-xs font-medium text-body"
                  >
                    {unlock}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <DinamicButton
          action={onSelect}
          twClassName="py-1 text-sm"
          disabled={false}
          disabledSpinner={false}
          type={"filled"}
          label="Cambiar plan"
          spinFromText
        />
      </div>
    </div>
  );
}
