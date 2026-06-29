export type PlanCard = {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  unlocks?: string[];
  isPopular?: boolean;
  onSelect: () => void;
};
