"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-11 h-6 bg-muted rounded-full"></div>
        <Label>Auto Mode</Label>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-switch"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="cursor-pointer"
      />
      <Label htmlFor="theme-switch" className="cursor-pointer">
        {theme === "system" ? `Auto (${resolvedTheme})` : "Dark Mode"}
      </Label>
    </div>
  );
}
