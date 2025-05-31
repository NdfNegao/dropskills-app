"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function ThemeClientProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
} 