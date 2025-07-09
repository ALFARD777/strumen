"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { Button } from "../ui/button";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      aria-label="Переключить тему"
      variant="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <IconSunFilled size={22} />
      ) : (
        <IconMoonFilled size={22} />
      )}
    </Button>
  );
};
