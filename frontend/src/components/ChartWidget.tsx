import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_URL = "/api/monitoring/stats";

const ChartWidget: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const stats = await res.json();
        setData(prev => [
          ...prev.slice(-19), // keep last 20 points
          {
            time: new Date().toLocaleTimeString(),
            apiRequests: stats.apiRequests,
            errors: stats.errors,
          }
        ]);
      } catch {
        // ignore errors for demo
      }
    };
    fetchData();
    interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#232946] rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">API Usage & Errors (Live)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="apiRequests" stroke="#8884d8" name="API Requests" />
          <Line type="monotone" dataKey="errors" stroke="#ff4d4f" name="Errors" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWidget;
