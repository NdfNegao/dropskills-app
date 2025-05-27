import { Book, Home, Star, Users, Settings, Heart, ArrowUpRight } from "lucide-react";

const packs = [
  {
    title: "YouTube Accelerator",
    image: "/mockup-youtube.png",
    desc: "Lance ta chaîne YouTube en 6 jours avec templates et scripts IA.",
  },
  {
    title: "Interview Success Blueprint",
    image: "/mockup-interview.png",
    desc: "Prépare et réussis tes entretiens. Guide + scripts.",
  },
  {
    title: "Multi-Bucket Savings System",
    image: "/mockup-buckets.png",
    desc: "Automatise ton épargne et maîtrise ton budget.",
  },
  {
    title: "Ad Funnel Blueprint Strategies",
    image: "/mockup-funnel.png",
    desc: "Blueprints publicitaires pour scaler tes ventes.",
  },
  {
    title: "Keep Them Coming Back",
    image: "/mockup-loyalty.png",
    desc: "Boost fidélité client & rétention.",
  },
  {
    title: "Headline Framework",
    image: "/mockup-headline.png",
    desc: "Frameworks de titres à fort taux de clic.",
  },
];

export default function DropskillsEntrepediaUI() {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between py-6 px-4 min-h-screen sticky top-0">
        <div>
          <div className="flex items-center mb-10 pl-1">
            <span className="text-2xl font-black tracking-tight text-sky-500">DROPSKILLS</span>
          </div>
          <nav className="flex flex-col gap-1 mb-4">
            <SidebarItem icon={<Home size={18} />} label="Home" active />
            <SidebarItem icon={<Star size={18} />} label="Populaires" />
            <SidebarItem icon={<Book size={18} />} label="Requests" />
            <SidebarItem icon={<Users size={18} />} label="Samples" />
            <SidebarItem icon={<Heart size={18} />} label="Saved" />
            <SidebarItem icon={<ArrowUpRight size={18} />} label="Tools" />
          </nav>
          <div className="my-6">
            <button className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-2 px-3 w-full rounded-lg font-semibold text-sm shadow hover:scale-[1.02] transition">Unlock Full Library</button>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs mt-8">
          <div className="w-8 h-8 bg-sky-500/10 rounded-full flex items-center justify-center font-bold text-sky-500">C</div>
          <div>
            <div className="font-medium text-white">cyril.iriebi@gmail.com</div>
            <div className="text-neutral-400">Pro</div>
          </div>
          <Settings size={16} className="ml-auto text-neutral-400 hover:text-sky-500 cursor-pointer" />
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-12 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
          <h1 className="text-3xl font-bold tracking-tight flex-1">Trending Resources</h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search resources..."
              className="flex-1 px-4 py-2 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-neutral-900 text-white"
            />
            <button className="bg-sky-500 text-white rounded-xl px-4 py-2 font-semibold shadow hover:bg-sky-600">Preview Samples</button>
          </div>
        </header>
        {/* Trending Resources Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packs.map((pack, i) => (
              <div
                key={i}
                className="bg-neutral-900 rounded-2xl shadow hover:shadow-xl border border-neutral-800 flex flex-col p-6 relative group transition"
              >
                <img
                  src={pack.image}
                  alt={pack.title}
                  className="w-full h-36 object-contain rounded mb-4 bg-neutral-800 border border-neutral-700"
                />
                <h3 className="text-lg font-bold mb-2 text-white line-clamp-2 min-h-10">{pack.title}</h3>
                <p className="text-sm text-neutral-400 mb-6 line-clamp-2 min-h-9">{pack.desc}</p>
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-semibold shadow hover:bg-sky-600">Open</button>
                  <button className="bg-neutral-800 border border-neutral-700 px-4 rounded-lg text-sky-500 font-semibold hover:bg-neutral-700">Download</button>
                  <button className="ml-auto text-sky-400 hover:text-sky-300"><Heart size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-base font-medium hover:bg-neutral-800 transition ${active ? "bg-neutral-800 text-sky-500" : "text-neutral-400"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
