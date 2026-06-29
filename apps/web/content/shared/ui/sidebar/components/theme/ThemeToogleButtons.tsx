"use client";

/* HOOKS */
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/* ICONS */
import { Sun, Moon } from "lucide-react";

export function ThemeToggleButtons() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const changeTheme = () => {
      setMounted(true);
    };

    changeTheme();
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`flex w-full h-fit transition-all duration-300`}
    >
      <button
        onClick={resolvedTheme === "dark" ? () => setTheme("light") : () => {}}
        className={`p-2 border border-line text-body cursor-pointer w-full flex justify-center rounded-l-xl ${resolvedTheme === "light" && "bg-surface text-primary"}`}
      >
        <Sun className="size-4" />
      </button>
      <button
        onClick={resolvedTheme === "light" ? () => setTheme("dark") : () => {}}
        className={`p-2 border-y border-r border-line text-body cursor-pointer w-full flex justify-center rounded-r-xl ${resolvedTheme === "dark" && "bg-surface text-primary"}`}
      >
        <Moon className="size-4" />
      </button>
    </div>
  );
}
