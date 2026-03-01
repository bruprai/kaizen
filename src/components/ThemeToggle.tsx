import { useCallback, useEffect, useState } from "react";
import type { Theme } from "../constants";
import { MoonIcon, SunIcon, SystemIcon } from "./Icons";

export const ThemeToggle = () => {
  const getInitalTheme = useCallback((): Theme => {
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
    ) {
      return storedTheme;
    }
    return "system";
  }, []);
  const [theme, setTheme] = useState<Theme>(getInitalTheme);

  useEffect(() => {
    const applyTheme = (currentTheme: Theme) => {
      if (currentTheme === "system") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", currentTheme);
      }
      localStorage.setItem("theme", theme);
    };
    applyTheme(theme);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    mq.addEventListener("change", handleSystemThemeChange);
    return () => {
      mq.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "dark") return "light";
      if (prevTheme === "light") return "system";
      return "dark";
    });
  };
  const renderIcon = () => {
    if (theme === "light") return <MoonIcon />;
    if (theme === "dark") return <SunIcon />;
    return <SystemIcon />;
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      {renderIcon()}
    </button>
  );
};
