"use client";

/* COMPONENTS */
import { ThemeToggleButtons } from "@/content/shared/ui/sidebar/components/theme/ThemeToogleButtons";
import Image from "next/image";

/* HOOKS */
import { useState, useEffect } from "react";

/* IMAGES */
import user1 from "./images/user1.jpg";

/* ICONS */
import {
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  UserRound,
  ChevronsUpDown,
} from "lucide-react";
import { FourSportsIcon } from "@/content/shared/icons/fourSports/FourSportsIcon";

/* NAVIGATION */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/* STORES */
import { useSidebarStore } from "@/content/shared/ui/sidebar/stores/SidebarStore";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useNotificationsSidebarStore } from "@/content/shared/ui/notificationsSidebar/stores/notificationsSidebarStore";

/* TYPES */
import { LinkSidebar } from "@/content/shared/ui/sidebar/types/LinkSidebar";

/* LIBS */
import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function Sidebar({ links }: { links: LinkSidebar[] }) {
  const router = useRouter();
  const pathname = usePathname();

  const { expanded, toggleSidebar } = useSidebarStore();
  const { setAnnouncement } = useAnnouncement();
  const { toggleNotificationsSidebar } = useNotificationsSidebarStore();

  const [mounted, setMounted] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const [user] = useState({
    name: "Julián López",
    email: "julian@gmail.com",
  });

  const linkClasses = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`);

    return `${isActive ? "text-primary bg-surface border border-line" : "hover:bg-surface/70 border border-transparent text-ink"}`;
  };

  const handleSignOut = async () => {
    try {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Sesión cerrada correctamente",
      });
      router.push("/login");
    } catch (error) {
      console.log("Error: ", error);

      setAnnouncement({
        isActivated: true,
        announceType: "error",
        message:
          "Ocurrió un error al cerrar sesión, intente nuevamente más tarde",
      });
    }
  };

  useEffect(() => {
    const changeTheme = () => {
      setMounted(true);
    };

    changeTheme();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const update = () => setIsMobile(media.matches);

    update();

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <aside
        className={`flex flex-col z-60 transition-all bg-background duration-300 justify-between h-dvh border-r border-r-line absolute lg:static ${expanded ? "w-64 left-0" : "lg:w-18 w-64 -left-64"}`}
      >
        <div className="w-full h-full flex flex-col p-4">
          <div
            className={`flex items-center mb-16 relative ${expanded ? "justify-end" : "lg:justify-center justify-end"}`}
          >
            <div
              className={`transition-all duration-300 pointer-events-none absolute ${expanded ? "w-24 lg:opacity-100 left-0" : "left-0 w-24 lg:w-0 lg:opacity-0 lg:-left-64"}`}
            >
              <FourSportsIcon />
            </div>
            <button
              onClick={toggleSidebar}
              className={`p-1 hover:bg-surface hover:border-line border-transparent border rounded transition-all duration-300 cursor-pointer`}
            >
              {expanded ? (
                <ChevronsLeft className="size-4" />
              ) : (
                <ChevronsRight className="size-4" />
              )}
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full overflow-y-auto flex flex-col gap-2 items-center w-full overflow-x-hidden max-h-full"
          >
            <Tooltip.Provider delayDuration={100}>
              {links.map((link) => (
                <Tooltip.Root
                  key={link.href}
                  open={!expanded ? openTooltip === link.href : false}
                  onOpenChange={(open) => {
                    if (!expanded) {
                      setOpenTooltip(open ? link.href : null);
                    }
                  }}
                >
                  <Tooltip.Trigger asChild>
                    {link.label === "Notificaciones" ? (
                      <button
                        onClick={toggleNotificationsSidebar}
                        className={`px-[0.70rem] py-2 rounded-xl flex relative group transition-all items-center duration-300 w-full cursor-pointer hover:bg-surface/70 border border-transparent text-ink ${expanded ? "gap-6" : "lg:gap-0 gap-6"} `}
                      >
                        <link.icon className="size-4 min-w-4 min-h-4" />

                        <span
                          className={`transition-all duration-300 text-sm text-left ${
                            expanded
                              ? "w-full opacity-100"
                              : "lg:w-0 w-fit lg:opacity-0 opacity-100 pointer-events-none"
                          }`}
                        >
                          {link.label}
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className={`px-[0.70rem] py-2 rounded-xl flex relative group transition-all items-center duration-300 w-full ${expanded ? "gap-6" : "lg:gap-0 gap-6"} ${linkClasses(
                          link.href,
                        )}`}
                      >
                        <link.icon className="size-4 min-w-4 min-h-4" />

                        <span
                          className={`transition-all duration-300 text-sm ${
                            expanded
                              ? "w-full opacity-100"
                              : "lg:w-0 w-fit lg:opacity-0 opacity-100 pointer-events-none"
                          }`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    )}
                  </Tooltip.Trigger>

                  {!expanded && (
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={25}
                        className="z-70 rounded-full bg-background px-3 py-1 text-sm font-medium text-ink border border-line"
                      >
                        {link.label}
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  )}
                </Tooltip.Root>
              ))}
            </Tooltip.Provider>
          </motion.div>
        </div>

        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center p-4 overflow-hidden w-full gap-4 hover:bg-surface transition-all duration-300 cursor-pointer outline-none border-t border-t-line">
              <div
                className={`rounded-full w-10 h-10 min-w-10 min-h-10 flex justify-center items-center bg-surface border relative ${pathname === "/organizer/profile" ? "border-primary" : "border-line"}`}
              >
                {/* <UserRound className="size-4" /> */}
                <Image
                  alt="Banner"
                  src={user1}
                  quality={70}
                  fill
                  loading="eager"
                  className="rounded-full object-cover object-center"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col text-left">
                <span className="font-semibold truncate text-sm">
                  {user.name}
                </span>

                <span className="text-xs text-neutral-400 truncate">
                  {user.email}
                </span>
              </div>

              <div className="shrink-0">
                <ChevronsUpDown className="size-4 min-w-4 min-h-4" />
              </div>
            </button>
          </DropdownMenu.Trigger>

          <AnimatePresence>
            {open && (
              <DropdownMenu.Portal forceMount>
                <DropdownMenu.Content
                  sideOffset={12}
                  align="end"
                  avoidCollisions
                  side={isMobile ? "bottom" : "right"}
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: -12 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="z-100 min-w-56 rounded-2xl border border-line p-2 shadow-md bg-background"
                  >
                    <DropdownMenu.Item
                      onClick={() => router.push("/organizer/profile")}
                      className={`flex items-center gap-3 rounded-xl p-2 text-sm outline-none cursor-pointer mb-2 transition-colors duration-300 border ${pathname === "/organizer/profile" ? "bg-surface/70 border-line text-primary" : "hover:bg-surface border-transparent text-body"}`}
                    >
                      <UserRound className="size-4" />
                      Ver perfil
                    </DropdownMenu.Item>

                    <ThemeToggleButtons />

                    <DropdownMenu.Separator className="my-2 h-px bg-line" />

                    <DropdownMenu.Item
                      onClick={handleSignOut}
                      className="flex items-center gap-3 rounded-xl p-2 text-sm text-danger outline-none cursor-pointer hover:bg-red-500/10 transition-colors duration-300"
                    >
                      <LogOut className="size-4" />
                      Cerrar sesión
                    </DropdownMenu.Item>
                  </motion.div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            )}
          </AnimatePresence>
        </DropdownMenu.Root>
      </aside>
      <div
        onClick={toggleSidebar}
        className={`absolute w-full top-0 left-0 bg-black/50 h-screen transition-all duration-300 z-50 lg:hidden lg:pointer-events-none ${
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
    </>
  );
}
