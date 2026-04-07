"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const ThemeSwitch = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      aria-label="Переключить тему"
      variant="icon"
      className={cn("size-auto min-w-0 h-auto p-0 m-0 rounded-none shadow-none", className)}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <IconSun size={22} /> : <IconMoon size={22} />}
    </Button>
  );
};
