export type PaymentsType = {
  id: number;
  total: number;
  plan: "free" | "starter" | "pro" | "elite";
  date: string;
};
