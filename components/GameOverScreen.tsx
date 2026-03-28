"use client";

import { useEffect, useState } from "react";
import { type ReactionStats } from "@/components/HUD";
import SessionGraph, { type SessionRecord } from "@/components/SessionGraph";

const STORAGE_KEY = "reaction_game_sessions";

function loadSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSession(session: SessionRecord) {
  const sessions = loadSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function downloadCSV(sessions: SessionRecord[]) {
  const headers = ["Session", "Date", "Time", "Score", "Avg RT (ms)", "Min RT (ms)", "Max RT (ms)"];
  const rows = sessions.map((s) => [
    s.Session, s.Date, s.Time, s.Score,
    s["Avg RT (ms)"], s["Min RT (ms)"], s["Max RT (ms)"],
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reaction_times.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface GameOverScreenProps {
  score: number;
  stats: ReactionStats | null;
  onPlayAgain: () => void;
}

export default function GameOverScreen({ score, stats, onPlayAgain }: GameOverScreenProps) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    if (stats) {
      const existing = loadSessions();
      const newSession: SessionRecord = {
        Session: existing.length + 1,
        Date: new Date().toLocaleDateString(),
        Time: new Date().toLocaleTimeString(),
        Score: score,
        "Avg RT (ms)": stats.avg,
        "Min RT (ms)": stats.min,
        "Max RT (ms)": stats.max,
      };
      saveSession(newSession);
    }
    setSessions(loadSessions());
  // Runs once when the game over screen mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center space-y-6 w-full max-w-2xl px-6">
      <h2 className="text-5xl font-bold text-white">Game Over</h2>

      <p className="text-gray-300 text-2xl">
        Final Score:{" "}
        <span className="text-yellow-400 font-bold text-4xl">{score}</span>
      </p>

      {stats ? (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Avg", value: stats.avg, color: "text-blue-400" },
            { label: "Min", value: stats.min, color: "text-green-400" },
            { label: "Max", value: stats.max, color: "text-red-400" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-gray-800 rounded-2xl px-6 py-4 flex flex-col items-center gap-1"
            >
              <span className="text-gray-400 text-sm uppercase tracking-widest">
                {label}
              </span>
              <span className={`${color} font-bold text-3xl`}>{value}</span>
              <span className="text-gray-500 text-xs">ms</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No correct answers recorded.</p>
      )}

      {sessions.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-4">
          <h3 className="text-white text-base font-semibold mb-2 text-left">
            Reaction Time History
          </h3>
          <SessionGraph sessions={sessions} />
          <div className="mt-3 flex gap-4 justify-center">
            <button
              onClick={() => downloadCSV(sessions)}
              className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors cursor-pointer"
            >
              Download CSV
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setSessions([]);
              }}
              className="text-xs text-red-700 hover:text-red-400 underline transition-colors cursor-pointer"
            >
              Clear History
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="bg-white text-gray-900 font-bold text-xl px-10 py-4 rounded-2xl hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
      >
        Play Again
      </button>
    </div>
  );
}
