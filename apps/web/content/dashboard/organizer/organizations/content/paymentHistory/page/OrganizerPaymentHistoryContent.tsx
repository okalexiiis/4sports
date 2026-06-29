"use client";

/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import { OrganizationPlan } from "../components/plan/OrganizationPlan";
import { OrganizationPaymentHistoryTable } from "../components/paymentHistoryTable/OrganizationPaymentHistoryTable";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { Plans } from "@/content/shared/ui/plans/Plans";

/* HOOKS */
import { useState } from "react";

/* ICONS */
import { ArrowLeft } from "lucide-react";

/* LIBS */
import { AnimatePresence, motion } from "framer-motion";

export function OrganizerPaymentHistoryContent() {
  const [position, setPosition] = useState<"panel" | "plans">("panel");

  const onSelectArray: (() => void)[] = [
    () => setPosition("plans"),
    () => setPosition("plans"),
    () => setPosition("plans"),
    () => setPosition("plans"),
  ];

  return (
    <SectionContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={position ? "panel" : "plans"}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="p-6 h-full gap-6 flex flex-col relative"
        >
          {position === "panel" ? (
            <div className="flex gap-6 flex-1 min-h-0 flex-col md:flex-row">
              <OrganizationPlan onSelect={() => setPosition("plans")} />
              <OrganizationPaymentHistoryTable />
            </div>
          ) : (
            <>
              <DinamicButton
                action={() => setPosition("panel")}
                type="unfilled"
                label="Regresar"
                twClassName="w-fit py-1 text-sm absolute top-6 left-6"
                icon={
                  <ArrowLeft className="size-4 min-h-4 min-w-4 text-primary" />
                }
              />
              <Plans wantWait={false} onSelectArray={onSelectArray} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </SectionContainer>
  );
}
