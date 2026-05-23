"use client";
// src/providers/ThemeProvider.tsx
// Feature 6: Dark/Light Mode via next-themes

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"        // adds/removes "dark" class on <html>
      defaultTheme="dark"      // default to dark (streetwear brand)
      enableSystem={false}     // don't follow OS preference
      storageKey="osa-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
