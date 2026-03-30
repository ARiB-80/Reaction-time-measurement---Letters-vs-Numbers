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
    <div className="relative">
      {/* <span className="absolute top-1 right-2 text-xs text-gray-400 z-10">
        session <span className="text-violet-600 font-semibold">#{sessions.length}</span>
      </span> */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={sessions}
          margin={{ top: 5, right: 16, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="Session"
            stroke="#d1d5db"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            label={{
              value: "Session #",
              position: "insideBottom",
              offset: -12,
              fill: "#9ca3af",
              fontSize: 11,
            }}
          />
          <YAxis
            stroke="#d1d5db"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            label={{
              value: "ms",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fill: "#9ca3af",
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "2px",
              color: "#111111",
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{
              color: "#6b7280",
              fontSize: 12,
              paddingTop: "20px",
            }}
          />
          <Line
            type="monotone"
            dataKey="Avg RT (ms)"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ fill: "#7c3aed", r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Min RT (ms)"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={{ fill: "#a78bfa", r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Max RT (ms)"
            stroke="#c4b5fd"
            strokeWidth={2}
            dot={{ fill: "#c4b5fd", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
