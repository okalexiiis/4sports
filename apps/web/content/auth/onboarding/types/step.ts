/* TYPES */
import { OnboardingForm } from "@/content/auth/onboarding/types/onboardingForm";

export type Step = {
  title: string;
  description?: string;
  fields: (keyof OnboardingForm)[];
  component: React.ReactNode;
};
