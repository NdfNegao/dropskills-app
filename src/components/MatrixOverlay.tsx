import React, { useEffect, useRef } from "react";

interface MatrixOverlayProps {
  visible: boolean;
}

export default function MatrixOverlay({ visible }: MatrixOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 18;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#00ff66";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      pointerEvents: "none",
      background: "rgba(0,0,0,0.92)",
      transition: "opacity 0.3s",
    }}>
      <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh", display: "block" }} />
    </div>
  );
} 