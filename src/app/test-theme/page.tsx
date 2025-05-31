"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function TestThemePage() {
  const { theme, setTheme } = useTheme();
  const [glitch, setGlitch] = useState(false);

  const handleChange = (value: "dark" | "light") => {
    if (theme !== value) {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 600); // Durée de l'effet
      setTimeout(() => setTheme(value), 200); // Décalage pour l'effet
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 relative ${glitch ? "glitch-effect" : ""}`}>
      <h1 className="text-3xl font-bold mb-8">Test du switch de thème</h1>
      <div className="flex gap-8 items-center">
        <RadioTheme
          checked={theme === "dark"}
          onClick={() => handleChange("dark")}
          icon={<Moon className="w-6 h-6" />}
          label="Sombre"
        />
        <RadioTheme
          checked={theme === "light"}
          onClick={() => handleChange("light")}
          icon={<Sun className="w-6 h-6" />}
          label="Clair"
        />
      </div>
      <p className="mt-10 text-gray-400 text-center max-w-md">
        Change de mode pour voir l'effet "glitch" façon Spider-Man !<br/>
        (L'effet s'applique à tout l'écran lors du switch)
      </p>
      <style jsx global>{`
        .glitch-effect {
          animation: glitchy 0.6s cubic-bezier(.25,.46,.45,.94) both;
        }
        @keyframes glitchy {
          0% {
            filter: none;
            transform: none;
          }
          10% {
            filter: contrast(1.2) brightness(1.1) hue-rotate(10deg);
            transform: skewX(-2deg) scale(1.01);
          }
          20% {
            filter: contrast(1.5) brightness(1.2) hue-rotate(-10deg);
            transform: skewX(2deg) scale(1.02);
          }
          30% {
            filter: contrast(1.2) brightness(1.1) hue-rotate(5deg);
            transform: skewX(-1deg) scale(1.01);
          }
          40% {
            filter: contrast(1.5) brightness(1.2) hue-rotate(-5deg);
            transform: skewX(1deg) scale(1.02);
          }
          50% {
            filter: contrast(1.2) brightness(1.1) hue-rotate(0deg);
            transform: none;
          }
          60% {
            filter: contrast(1.5) brightness(1.2) hue-rotate(0deg);
            transform: skewX(2deg) scale(1.01);
          }
          70% {
            filter: contrast(1.2) brightness(1.1) hue-rotate(-10deg);
            transform: skewX(-2deg) scale(1.02);
          }
          80% {
            filter: contrast(1.5) brightness(1.2) hue-rotate(10deg);
            transform: skewX(1deg) scale(1.01);
          }
          90% {
            filter: none;
            transform: none;
          }
          100% {
            filter: none;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

function RadioTheme({ checked, onClick, icon, label }: { checked: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-300 shadow-lg
        ${checked ? "border-[#ff0033] bg-[#ff0033]/10 scale-105" : "border-gray-700 bg-[#111111] hover:border-[#ff0033] hover:bg-[#ff0033]/5"}
        focus:outline-none focus:ring-2 focus:ring-[#ff0033]`}
      aria-pressed={checked}
    >
      <span className={`text-2xl ${checked ? "text-[#ff0033]" : "text-gray-400"}`}>{icon}</span>
      <span className={`font-semibold ${checked ? "text-[#ff0033]" : "text-gray-300"}`}>{label}</span>
    </button>
  );
} 