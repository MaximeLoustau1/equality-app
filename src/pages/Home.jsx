import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import WorldMap from './WorldMap';

export default function EqualityDashboard() {
  const [stats, setStats] = useState({
    averageScore: 'Loading...',
    topRegion: 'Loading...',
    topIndustry: 'Loading...'
  });

  const [countryData, setCountryData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filters, setFilters] = useState({ sector: '', group: '', search: '' });

  useEffect(() => {
    fetch('http://localhost:8000/summary')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));

    fetch('http://localhost:8000/countries')
      .then(res => res.json())
      .then(data => setCountryData(data))
      .catch(err => console.error('Failed to fetch countries:', err));
  }, []);

  const filteredGroups = filters.sector
    ? [...new Set(countryData.filter(d => d.Sector === filters.sector).map(d => d.Group))].sort()
    : [...new Set(countryData.map(d => d.Group))].sort();

  const filteredData = countryData.filter(c => {
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(c.Country);
    const sectorMatch = !filters.sector || c.Sector === filters.sector;
    const groupMatch = !filters.group || c.Group === filters.group;
    return countryMatch && sectorMatch && groupMatch;
  });

  const uniqueCountries = [...new Set(countryData.map(d => d.Country))].sort();
  const uniqueSectors = [...new Set(countryData.map(d => d.Sector))].sort();

  const handleCountryToggle = (country) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleSelectAllCountries = () => {
    setSelectedCountries(uniqueCountries);
  };

  const aggregatedScore = filteredData.length
    ? (filteredData.reduce((acc, curr) => acc + curr['Total Score'], 0) / filteredData.length).toFixed(2)
    : 'Not available';

  const aggregatedFemale = filteredData.length
    ? (filteredData.reduce((acc, curr) => acc + parseFloat(curr['Female %'] || 0), 0) / filteredData.length).toFixed(2)
    : 'Not available';

  return (
    <main className="min-h-screen bg-black text-white font-sans px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-6 mb-16">
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight">Workforce Equality Intelligence</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Explore gender equality trends across countries and industries. Built for transparency. Powered by open data.</p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-12 items-start">
          <div className="space-y-6">
            <button onClick={handleSelectAllCountries} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">Select All Countries</button>

            <input
              type="text"
              placeholder="Search countries..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="bg-zinc-800 text-white p-2 rounded w-full"
            />

            <div className="bg-zinc-900 border border-zinc-700 rounded p-4">
              <h4 className="text-sm uppercase tracking-widest text-gray-400 mb-2">Countries</h4>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {uniqueCountries.filter(c => c.toLowerCase().includes(filters.search.toLowerCase())).map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(c)}
                      onChange={() => handleCountryToggle(c)}
                      className="accent-blue-600"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <select onChange={e => setFilters(f => ({ ...f, sector: e.target.value, group: '' }))} className="bg-zinc-800 text-white p-2 rounded w-full">
              <option value="">All Sectors</option>
              {uniqueSectors.map(s => <option key={s}>{s}</option>)}
            </select>

            <select onChange={e => setFilters(f => ({ ...f, group: e.target.value }))} className="bg-zinc-800 text-white p-2 rounded w-full">
              <option value="">All Groups</option>
              {filteredGroups.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-10">
            <WorldMap onCountrySelect={handleCountryToggle} selectedCountries={selectedCountries} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 p-6 rounded-2xl shadow-inner">
                <StatCard title="Average Equality Score" value={aggregatedScore !== null ? `${aggregatedScore} / 100` : 'Not available'} color="text-green-400" />
              </div>
              <div className="bg-zinc-900 p-6 rounded-2xl shadow-inner">
                <StatCard title="Average Female Workforce %" value={aggregatedFemale !== null ? `${aggregatedFemale}%` : 'Not available'} color="text-pink-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="text-center space-y-2">
      <h4 className="text-sm uppercase tracking-widest text-gray-500">{title}</h4>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
