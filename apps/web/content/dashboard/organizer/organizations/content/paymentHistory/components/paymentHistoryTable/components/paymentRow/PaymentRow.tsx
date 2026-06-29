/* COMPONENTS */
import { DinamicRow } from "@/content/shared/ui/dinamicTable/components/dinamicRow/DinamicRow";
import { DinamicTd } from "@/content/shared/ui/dinamicTable/components/dinamicTd/DinamicTd";

/* TYPES */
import { formatDate } from "@/content/shared/utils/formatDate";
import { PaymentsType } from "../../types/paymentsType";

export function PaymentRow({
  payment,
  twBgColor,
}: {
  payment: PaymentsType;
  twBgColor: string;
}) {
  const getPlan = (plan: "free" | "starter" | "pro" | "elite") => {
    switch (plan) {
      case "free":
        return "Free";

      case "starter":
        return "Starter";

      case "pro":
        return "Pro";

      case "elite":
        return "Elite";
    }
  };

  return (
    <DinamicRow twBgColor={twBgColor}>
      <DinamicTd twClassName="text-nowrap">
        <p>{payment.total}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{getPlan(payment.plan)}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{formatDate(payment.date)}</p>
      </DinamicTd>
    </DinamicRow>
  );
}
