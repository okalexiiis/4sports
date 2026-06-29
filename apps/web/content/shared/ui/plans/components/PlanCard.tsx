"use client";

import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
/* ICONS */
import { Check, Plus } from "lucide-react";

interface PlanCardProps {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  unlocks?: string[];
  isPopular?: boolean;
  onSelect: () => void;
}

export function PlanCard({
  name,
  description,
  price,
  period = "/siempre",
  features,
  unlocks,
  isPopular = false,
  onSelect,
}: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-4xl border-2 bg-surface p-6 ${
        isPopular ? "border-primary" : "border-line"
      }`}
    >
      <div>
        {isPopular && (
          <span className="absolute right-8 top-0 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-text -translate-y-1/2">
            Popular
          </span>
        )}

        <p className="rounded-full text-3xl font-bold uppercase text-primary font-bebas mb-2">
          {name}
        </p>
        <p className="text-xs mb-4">{description}</p>

        <div className="border-b border-line pb-3 flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-black text-ink">{price}</span>
          <span className="text-xs font-semibold text-muted">{period}</span>
        </div>

        <ul className="space-y-2 text-xs mb-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="size-3 text-primary" />
              <span className="leading-tight text-muted">{feature}</span>
            </li>
          ))}
        </ul>

        {unlocks && unlocks.length > 0 && (
          <div className="my-6">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="size-3 text-muted" />
              <p className="text-xs uppercase text-muted">Desbloquea:</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {unlocks.map((unlock, idx) => (
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
        twClassName="w-full h-fit py-2 px-4 rounded-xl"
        disabled={false}
        disabledSpinner={false}
        type={isPopular ? "filled" : "ghost"}
        label="Escoger"
        spinFromText
      />
    </div>
  );
}
