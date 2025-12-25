import React, { useEffect, useState } from 'react';

// Types for runtime stats
interface RuntimeStats {
  uptime: string;
  memoryUsage: string;
  cpuUsage: string;
  apiRequests: number;
  errors: number;
}

const RUNTIME_API = '/api/monitoring/stats'; // You can implement this endpoint in your backend

const RuntimeStatsWidget: React.FC = () => {
  const [stats, setStats] = useState<RuntimeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch(RUNTIME_API);
        if (!res.ok) throw new Error('Failed to fetch runtime stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setStats(null);
      }
      setLoading(false);
    }
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading runtime stats...</div>;
  if (!stats) return <div>Failed to load runtime stats.</div>;

  return (
    <div className="bg-[#22223b] text-white rounded-xl p-6 shadow-lg w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Live Runtime Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-lg">Uptime:</div>
          <div className="text-2xl font-extrabold">{stats.uptime}</div>
        </div>
        <div>
          <div className="text-lg">Memory Usage:</div>
          <div className="text-2xl font-extrabold">{stats.memoryUsage}</div>
        </div>
        <div>
          <div className="text-lg">CPU Usage:</div>
          <div className="text-2xl font-extrabold">{stats.cpuUsage}</div>
        </div>
        <div>
          <div className="text-lg">API Requests:</div>
          <div className="text-2xl font-extrabold text-blue-400">{stats.apiRequests}</div>
        </div>
        <div>
          <div className="text-lg">Errors:</div>
          <div className="text-2xl font-extrabold text-red-400">{stats.errors}</div>
        </div>
      </div>
    </div>
  );
};

export default RuntimeStatsWidget;
