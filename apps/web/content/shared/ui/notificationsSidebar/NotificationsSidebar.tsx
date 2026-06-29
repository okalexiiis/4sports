/* ICONS */
import { ChevronsRight } from "lucide-react";

/* STORES */
import { useNotificationsSidebarStore } from "./stores/notificationsSidebarStore";

export function NotificationsSidebar() {
  const { toggleNotificationsSidebar, expanded } =
    useNotificationsSidebarStore();
  return (
    <>
      <div
        className={`flex flex-col z-80 transition-all bg-background duration-300 justify-between h-dvh border-l border-l-line absolute w-64 ${expanded ? "right-0" : "-right-64"}`}
      >
        <div className="w-full h-full flex flex-col p-4">
          <div className={`flex items-center mb-16 justify-between`}>
            <p className="font-bebas text-xl text-ink">Notificaciones</p>

            <button
              onClick={toggleNotificationsSidebar}
              className={`p-1 hover:bg-surface hover:border-line border-transparent border rounded transition-all duration-300 cursor-pointer`}
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>

          <p className="text-sm">No se encontraron notificaciones nuevas</p>
        </div>
      </div>

      <div
        onClick={toggleNotificationsSidebar}
        className={`absolute w-full top-0 left-0 h-screen transition-all duration-300 z-70 ${
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
    </>
  );
}
