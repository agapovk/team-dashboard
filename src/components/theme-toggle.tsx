"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Иконки через CSS (.dark) → нет hydration-mismatch, не нужен mounted-флаг.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      aria-label="Переключить тему"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      <SunIcon className="size-5 scale-100 transition-transform dark:scale-0" />
      <MoonIcon className="absolute size-5 scale-0 transition-transform dark:scale-100" />
      <span className="sr-only">Переключить тему</span>
    </Button>
  );
}
