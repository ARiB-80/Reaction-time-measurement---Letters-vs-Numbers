"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface SessionRecord {
  Session: number;
  Date: string;
  Time: string;
  Score: number;
  "Avg RT (ms)": number;
  "Min RT (ms)": number;
  "Max RT (ms)": number;
}

interface SessionGraphProps {
  sessions: SessionRecord[];
}

export default function SessionGraph({ sessions }: SessionGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={sessions} margin={{ top: 5, right: 16, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="Session"
          stroke="#6B7280"
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          label={{ value: "Session #", position: "insideBottom", offset: -12, fill: "#6B7280", fontSize: 12 }}
        />
        <YAxis
          stroke="#6B7280"
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          label={{ value: "ms", angle: -90, position: "insideLeft", offset: 10, fill: "#6B7280", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#F9FAFB",
          }}
        />
        <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: 13, paddingTop: "8px" }} />
        <Line type="monotone" dataKey="Avg RT (ms)" stroke="#60A5FA" strokeWidth={2} dot={{ fill: "#60A5FA", r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="Min RT (ms)" stroke="#34D399" strokeWidth={2} dot={{ fill: "#34D399", r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="Max RT (ms)" stroke="#F87171" strokeWidth={2} dot={{ fill: "#F87171", r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
