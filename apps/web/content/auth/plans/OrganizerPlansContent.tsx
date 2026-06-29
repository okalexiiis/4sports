"use client";

/* COMPONENTS */
import { Plans } from "@/content/shared/ui/plans/Plans";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

export function OrganizerPlansContent() {
  const router = useRouter();
  const { setAnnouncement } = useAnnouncement();

  const onSelectArray: (() => void)[] = [
    () => {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Pago guardado correctamente",
      });
      router.push("/organizer/home");
    },
    () => {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Pago guardado correctamente",
      });
      router.push("/organizer/home");
    },
    () => {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Pago guardado correctamente",
      });
      router.push("/organizer/home");
    },
    () => {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Pago guardado correctamente",
      });
      router.push("/organizer/home");
    },
  ];

  return <Plans wantWait onSelectArray={onSelectArray} />;
}
