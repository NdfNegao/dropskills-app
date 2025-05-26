"use client";

import { useState } from "react";
import { Eye, Bookmark } from "lucide-react";
import { useSavedProducts } from "@/context/SavedProductsContext";

const FORMATS = [
  'Book',
  'Video',
  'Audio',
  'Prompt Pack',
  'Template',
  'Notion Template',
  'Checklist',
  'Toolstack',
  'Workbook',
  'Guide',
];

const TAGS = [
  'Digital Marketing',
  'Business & Entrepreneurship',
  'Content Marketing',
  'Personal Development',
  'Branding',
  'Mindset',
  'Social Media Marketing',
  'Startups',
  'Voice',
  'Prompt',
  'Pack',
  'Checklist',
  'Guide',
  'Book',
  'Audio',
  'Video',
  'Template',
  'Notion Template',
  'Toolstack',
  'Workbook',
];

const PRODUCTS_DATA = [
  {
    id: "1",
    title: 'Brand Voice Unlocked',
    image: '/mock/brand-voice-unlocked.jpg',
    format: 'Audio',
    tags: ['Voice', 'Audio', 'Branding', 'Digital Marketing'],
  },
  {
    id: "2",
    title: 'Build a Voice that Connect',
    image: '/mock/build-voice-connect.jpg',
    format: 'Book',
    tags: ['Voice', 'Book', 'Content Marketing', 'Branding'],
  },
  {
    id: "3",
    title: 'Brand Voice Architect',
    image: '/mock/brand-voice-architect.jpg',
    format: 'Prompt Pack',
    tags: ['Prompt', 'Pack', 'Branding', 'Business & Entrepreneurship'],
  },
  {
    id: "4",
    title: 'The Cross-Channel Voice Adaptation System',
    image: '/mock/cross-channel-voice.jpg',
    format: 'Guide',
    tags: ['Voice', 'Guide', 'Startups', 'Digital Marketing'],
  },
  {
    id: "5",
    title: 'Cross-Platform Brand Voice Consistency',
    image: '/mock/cross-platform-consistency.jpg',
    format: 'Checklist',
    tags: ['Checklist', 'Voice', 'Social Media Marketing', 'Content Marketing'],
  },
  {
    id: "6",
    title: 'The 7-Step Brand Voice System',
    image: '/mock/7-step-brand-voice.jpg',
    format: 'Guide',
    tags: ['Voice', 'Guide', 'Personal Development', 'Mindset'],
  },
];

export default function ProductGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const { savedProducts, toggleBookmark } = useSavedProducts();

  const filtered = PRODUCTS_DATA.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFormat = !selectedFormats.length || selectedFormats.includes(p.format);
    const matchTag = !selectedTags.length || p.tags.some((t) => selectedTags.includes(t));
    return matchSearch && matchFormat && matchTag;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <select
          className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        >
          <option value="">Rechercher un produit...</option>
        </select>
        <select
          className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
          value={selectedFormats.join(',')}
          onChange={(e) => setSelectedFormats(e.target.value.split(','))}
        >
          <option value="">Filtrer par format</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select
          className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
          value={selectedTags.join(',')}
          onChange={(e) => setSelectedTags(e.target.value.split(','))}
        >
          <option value="">Filtrer par tags</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-[#111111] rounded-xl p-4 flex flex-col shadow-md border border-[#232323] relative">
            <button
              onClick={() => toggleBookmark(p.id)}
              className="absolute top-4 right-4 bg-[#18181b] border border-[#232323] text-white p-2 rounded-full hover:bg-[#232323] transition-colors z-10"
            >
              <Bookmark className={`w-4 h-4 ${savedProducts.includes(p.id) ? 'fill-white' : ''}`} />
            </button>
            
            <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <img src={p.image} alt={p.title} className="object-contain h-full w-full" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2 truncate">{p.title}</h3>
            <div className="flex-1" />
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-white text-[#111111] py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Ouvrir</button>
              <button className="bg-[#18181b] border border-[#232323] text-white px-3 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">Aucun produit trouvé.</div>
        )}
      </div>
    </div>
  );
}

export { PRODUCTS_DATA as PRODUCTS }; 