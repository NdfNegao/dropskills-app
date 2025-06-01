import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    fill?: boolean;
  }[];
}

interface AdvancedChartsProps {
  evolution: Array<{
    date: string;
    usage: number;
    tokens: number;
    cost: number;
  }>;
  tools: Array<{
    id: string;
    name: string;
    usage: number;
    tokens: number;
    cost: number;
  }>;
  categories: Array<{
    category: string;
    usage: number;
  }>;
}

export default function AdvancedCharts({ evolution, tools, categories }: AdvancedChartsProps) {
  // Graphique d'évolution
  const evolutionData: ChartData = {
    labels: evolution.map(e => new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })),
    datasets: [
      {
        label: 'Requêtes',
        data: evolution.map(e => e.usage),
        borderColor: '#ff0033',
        backgroundColor: 'rgba(255, 0, 51, 0.1)',
        fill: true,
      },
      {
        label: 'Tokens',
        data: evolution.map(e => e.tokens / 1000), // Conversion en milliers
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
      },
    ],
  };

  // Graphique des outils les plus utilisés
  const toolsData: ChartData = {
    labels: tools.slice(0, 5).map(t => t.name),
    datasets: [
      {
        label: 'Utilisation',
        data: tools.slice(0, 5).map(t => t.usage),
        backgroundColor: [
          'rgba(255, 0, 51, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  // Graphique de répartition par catégorie
  const categoriesData: ChartData = {
    labels: categories.map(c => c.category),
    datasets: [
      {
        label: 'Utilisation par catégorie',
        data: categories.map(c => c.usage),
        backgroundColor: [
          'rgba(255, 0, 51, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique d'évolution */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
        <h3 className="text-lg font-semibold text-white mb-4">Évolution de l'utilisation</h3>
        <Line data={evolutionData} options={chartOptions} />
      </div>

      {/* Graphique des outils les plus utilisés */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
        <h3 className="text-lg font-semibold text-white mb-4">Top 5 des outils</h3>
        <Bar data={toolsData} options={chartOptions} />
      </div>

      {/* Graphique de répartition par catégorie */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">Répartition par catégorie</h3>
        <div className="h-80">
          <Doughnut data={categoriesData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
} 