"use client";

/* COMPONENTS */
import { Plans } from "@/content/shared/ui/plans/Plans";

/* NAVIGATION */
import { useRouter } from "next/navigation";

export function PlansContent() {
  const router = useRouter();

  const onSelectArray: (() => void)[] = [
    () => {
      router.push("/login");
    },
    () => {
      router.push("/login");
    },
    () => {
      router.push("/login");
    },
    () => {
      router.push("/login");
    },
  ];

  return (
    <div className="w-full bg-background py-32 min-h-dvh flex items-center px-16">
      <Plans wantWait={false} onSelectArray={onSelectArray} />
    </div>
  );
}
