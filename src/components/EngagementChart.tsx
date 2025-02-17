"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
    date: string;
    engagement: number;
}
export default function EngagementChart({ data }: { data: ChartData[] }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">📊 Engajamento dos Usuários</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="email" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="streak" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
