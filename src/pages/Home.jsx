import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function EqualityDashboard() {
  const [stats, setStats] = useState({
    averageScore: 'Loading...',
    topRegion: 'Loading...',
    topIndustry: 'Loading...'
  });

  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState('country'); // 'country' | 'industry'

  useEffect(() => {
    fetch('http://localhost:8000/summary')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));

    fetchData(view);
  }, [view]);

  const fetchData = (type) => {
    const url =
      type === 'industry'
        ? 'http://localhost:8000/average-by-industry'
        : 'http://localhost:8000/average-by-country';

    fetch(url)
      .then(res => res.json())
      .then(data => setChartData(data))
      .catch(err => console.error('Failed to fetch chart data:', err));
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans px-6 py-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight">
            Workforce Equality Intelligence
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore gender equality trends across countries and industries. Built for transparency. Powered by open data.
          </p>
        </motion.section>

        {/* Summary Cards */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <StatCard title="Global Avg Score" value={stats.averageScore} color="text-blue-500" />
          <StatCard title="Top Region" value={stats.topRegion} color="text-green-400" />
          <StatCard title="Top Industry" value={stats.topIndustry} color="text-purple-400" />
        </motion.section>

        {/* Chart Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-2xl font-semibold">Average Equality Score by {view === 'industry' ? 'Industry' : 'Country'}</h2>
            <div className="space-x-2">
              <button
                onClick={() => setView('country')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${view === 'country' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                Country
              </button>
              <button
                onClick={() => setView('industry')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${view === 'industry' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                Industry
              </button>
            </div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-6 overflow-x-auto">
            <div style={{ width: Math.max(1000, chartData.length * 60), height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
                  <XAxis
                    dataKey={view === 'industry' ? 'industry' : 'country'}
                    stroke="#ccc"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis stroke="#ccc" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Bar dataKey="avg_score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.section>

        {/* Locked Placeholder */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/50 backdrop-blur p-10 text-center"
        >
          <Lock className="h-6 w-6 mx-auto text-gray-500 mb-2" />
          <h3 className="text-xl font-semibold">Company Profiles</h3>
          <p className="text-gray-400 mb-4">Detailed company stats available with Pro Access</p>
          <button disabled className="bg-gray-800 text-gray-400 px-4 py-2 rounded-xl cursor-not-allowed">
            Coming Soon
          </button>
        </motion.section>
      </div>
    </main>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-zinc-900 p-8 rounded-2xl shadow-inner text-center space-y-2">
      <h4 className="text-sm uppercase tracking-widest text-gray-500">{title}</h4>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
