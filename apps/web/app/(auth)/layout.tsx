"use client";

/* COMPONENTS */
import { ThemeToggle } from "@/content/shared/ui/themeToogle/ThemeToogle";
import Link from "next/link";
import Image from "next/image";

/* ICONS */
import { House } from "lucide-react";

/* IMAGES */
import balls1 from "@/content/auth/images/balls1.jpg";

/* NAVIGATION */
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isInLoginRegister = pathname === "/login" || pathname === "/register";

  return (
    <main className="flex overflow-hidden min-h-dvh">
      {isInLoginRegister && (
        <Link
          className="absolute z-50 p-2 border rounded-full left-6 top-6 text-body border-line bg-surface"
          href={"/"}
        >
          <House className="size-4" />
        </Link>
      )}

      <div
        className={`max-h-dvh h-dvh w-full overflow-x-hidden flex ${pathname === "/organizer-plans" ? "overflow-y-hidden" : "overflow-y-auto"}`}
      >
        <div
          className={`h-full md:block hidden transition-all duration-1000 ${pathname === "/organizer-plans" ? "w-0" : "w-full"}`}
        >
          <Image
            src={balls1}
            alt="Cancha de fútbol"
            quality={70}
            preload
            className={`object-cover object-left h-full transition-all duration-1000 ${pathname === "/organizer-plans" ? "w-0" : "w-full"}`}
          />
        </div>

        <div
          className={`h-full w-full flex md:px-10 px-6 transition-all duration-1000 ${isInLoginRegister ? "lg:w-1/3 lg:max-w-1/3 lg:min-w-1/3 md:w-1/2 md:max-w-1/2 md:min-w-1/2 items-center" : pathname === "/onboarding" ? "md:max-w-3/4 md:min-w-3/4 md:w-3/4 lg:w-1/2 lg:max-w-1/2 lg:min-w-1/2 py-10 md:py-0 md:items-center" : "py-10 md:py-0 md:items-center md:max-w-full md:min-w-full md:w-full"}`}
        >
          <div
            className={`w-full ${pathname === "/onboarding" && "min-h-0 h-full md:h-fit"}`}
          >
            {children}
          </div>
        </div>
      </div>

      <ThemeToggle />
    </main>
  );
}
