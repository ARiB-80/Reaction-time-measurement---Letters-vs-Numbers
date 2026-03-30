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
      <h2 className="text-5xl font-bold text-gray-900 tracking-tight">game over</h2>

      <p className="text-gray-500 text-base">
        final score{" "}
        <span className="text-violet-600 font-bold text-4xl">{score}</span>
      </p>

      {stats ? (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "avg", value: stats.avg },
            { label: "min", value: stats.min },
            { label: "max", value: stats.max },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-sm px-6 py-4 flex flex-col items-center gap-1"
            >
              <span className="text-gray-400 text-xs uppercase tracking-widest">
                {label}
              </span>
              <span className="text-violet-600 font-bold text-3xl">{value}</span>
              <span className="text-gray-400 text-xs">ms</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">no correct answers recorded.</p>
      )}

      {sessions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <h3 className="text-gray-700 text-sm font-semibold mb-2 text-left tracking-wide">
            reaction time history
          </h3>
          <SessionGraph sessions={sessions} />
          <div className="mt-3 flex gap-4 justify-center">
            <button
              onClick={() => downloadCSV(sessions)}
              className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors cursor-pointer"
            >
              download csv
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setSessions([]);
              }}
              className="text-xs text-red-400 hover:text-red-600 underline transition-colors cursor-pointer"
            >
              clear history
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="bg-violet-600 text-white font-semibold text-base px-8 py-3 rounded-sm hover:bg-violet-700 active:scale-95 transition-all cursor-pointer"
      >
        play again
      </button>
    </div>
  );
}
