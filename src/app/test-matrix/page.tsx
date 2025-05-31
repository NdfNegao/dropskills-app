"use client";
import React, { useState } from "react";
import MatrixOverlay from "@/components/MatrixOverlay";

export default function TestMatrixPage() {
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative">
      <h1 className="text-3xl font-bold mb-8">Test Effet Matrix</h1>
      <button
        onClick={handleGenerate}
        className="px-8 py-4 rounded-lg bg-[#00ff66] text-black font-bold text-xl shadow-lg hover:bg-[#00cc55] transition-all duration-200"
        disabled={loading}
      >
        {loading ? "Génération en cours..." : "Générer un document IA"}
      </button>
      <p className="mt-10 text-gray-400 text-center max-w-md">
        Clique sur le bouton pour voir l'effet Matrix façon "génération IA".<br/>
        (L'overlay s'affiche pendant 2 secondes)
      </p>
      <MatrixOverlay visible={loading} />
    </div>
  );
} 