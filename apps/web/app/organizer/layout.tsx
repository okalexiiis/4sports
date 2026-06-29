"use client";

/* COMPONENTS */
import { Sidebar } from "@/content/shared/ui/sidebar/Sidebar";
import { NotificationsSidebar } from "@/content/shared/ui/notificationsSidebar/NotificationsSidebar";
import { Modal } from '@/content/shared/ui/modal/Modal'

/* DATA */
import { organizerSidebarLinks } from "@/content/shared/ui/sidebar/data/organizerSidebarLinks";

/* LIBS */
import { motion } from "framer-motion";

/* STORES */
import { useSidebarStore } from "@/content/shared/ui/sidebar/stores/SidebarStore";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { expanded } = useSidebarStore();

  return (
    <motion.main
      className="flex min-h-dvh overflow-y-hidden overflow-x-hidden relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Sidebar links={organizerSidebarLinks} />
      <Modal />
      <div
        className={`flex flex-col h-dvh w-full transition-all duration-300 ${
          expanded
            ? "lg:left-64 lg:w-[calc(100%-16rem)]"
            : "lg:left-16 lg:w-[calc(100%-4rem)] z-40"
        }`}
      >
        {children}
      </div>
      <NotificationsSidebar />
    </motion.main>
  );
}
