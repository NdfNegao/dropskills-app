import React, { useEffect, useRef } from "react";

interface DollarConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const EMOJI = "💸";
const CONFETTI_COUNT = 18;

export default function DollarConfetti({ trigger, onComplete }: DollarConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger && containerRef.current) {
      // Nettoyer les anciens confettis
      containerRef.current.innerHTML = "";
      for (let i = 0; i < CONFETTI_COUNT; i++) {
        const el = document.createElement("span");
        el.textContent = EMOJI;
        el.style.position = "absolute";
        el.style.left = `${50 + (Math.random() - 0.5) * 60}%`;
        el.style.top = `50%`;
        el.style.fontSize = `${24 + Math.random() * 12}px`;
        el.style.opacity = "0.85";
        el.style.pointerEvents = "none";
        el.style.transform = `translate(-50%, -50%) scale(${0.8 + Math.random() * 0.6})`;
        el.style.transition = "none";
        // Animation
        const x = (Math.random() - 0.5) * 180;
        const y = -80 - Math.random() * 120;
        const rotate = (Math.random() - 0.5) * 360;
        setTimeout(() => {
          el.style.transition = "transform 1s cubic-bezier(.22,1,.36,1), opacity 1s";
          el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(1.1)`;
          el.style.opacity = "0";
        }, 10);
        containerRef.current.appendChild(el);
      }
      // Nettoyer après l'animation
      setTimeout(() => {
        if (containerRef.current) containerRef.current.innerHTML = "";
        if (onComplete) onComplete();
      }, 1200);
    }
  }, [trigger, onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 30,
      }}
    />
  );
} 