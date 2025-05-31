"use client";
import { Bot, Plus, Zap, Activity } from 'lucide-react';

export default function AdminOutilsIA() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Bot className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Gestion des outils IA</h1>
        <a href="/admin/outils-ia/nouveau" className="ml-auto bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
          <Plus className="w-5 h-5" /> Nouvel outil
        </a>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Total outils</h3>
          <p className="text-3xl font-bold text-blue-400">15</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Outils actifs</h3>
          <p className="text-3xl font-bold text-green-400">12</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Utilisations/jour</h3>
          <p className="text-3xl font-bold text-purple-400">2.4k</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">API Calls</h3>
          <p className="text-3xl font-bold text-yellow-400">45.2k</p>
        </div>
      </div>

      {/* Tableau des outils */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Liste des outils IA</h2>
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-[#232323]">
              <th className="py-2 px-4 text-left">Nom de l'outil</th>
              <th className="py-2 px-4 text-left">Catégorie</th>
              <th className="py-2 px-4 text-left">Modèle IA</th>
              <th className="py-2 px-4 text-left">Utilisations</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#232323]">
              <td className="py-2 px-4">Générateur de Code</td>
              <td className="py-2 px-4">Développement</td>
              <td className="py-2 px-4">GPT-4</td>
              <td className="py-2 px-4">1.2k</td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-green-400">
                  <Activity className="w-4 h-4" /> Actif
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex gap-2">
                  <button className="text-blue-400 hover:underline">Modifier</button>
                  <button className="text-red-400 hover:underline">Désactiver</button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Assistant Marketing</td>
              <td className="py-2 px-4">Marketing</td>
              <td className="py-2 px-4">Claude-3</td>
              <td className="py-2 px-4">856</td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-green-400">
                  <Activity className="w-4 h-4" /> Actif
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex gap-2">
                  <button className="text-blue-400 hover:underline">Modifier</button>
                  <button className="text-red-400 hover:underline">Désactiver</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Outils populaires */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Outils les plus utilisés
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg">
            <span className="text-gray-300">Générateur de Code</span>
            <span className="text-yellow-400 font-semibold">1.2k utilisations</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg">
            <span className="text-gray-300">Assistant Marketing</span>
            <span className="text-yellow-400 font-semibold">856 utilisations</span>
          </div>
        </div>
      </div>

      {/* Message en construction */}
      <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold mb-2">Section en construction</p>
        <p>La gestion avancée des outils IA arrive bientôt !</p>
      </div>
    </div>
  );
} 