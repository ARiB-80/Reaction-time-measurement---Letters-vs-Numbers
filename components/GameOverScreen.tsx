"use client";

import { useEffect, useState } from "react";
import { type ReactionStats } from "@/components/HUD";
import SessionGraph, { type SessionRecord } from "@/components/SessionGraph";

interface GameOverScreenProps {
  score: number;
  stats: ReactionStats | null;
  onPlayAgain: () => void;
}

export default function GameOverScreen({ score, stats, onPlayAgain }: GameOverScreenProps) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    const saveAndFetch = async () => {
      // Only save if there were correct answers to record
      if (stats) {
        await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score,
            avgRT: stats.avg,
            minRT: stats.min,
            maxRT: stats.max,
          }),
        });
      }

      const res = await fetch("/api/sessions");
      const data = await res.json();
      setSessions(data);
    };

    saveAndFetch();
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
          <a
            href="/api/sessions?download=true"
            className="inline-block mt-3 text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
          >
            Download Spreadsheet (.xlsx)
          </a>
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
