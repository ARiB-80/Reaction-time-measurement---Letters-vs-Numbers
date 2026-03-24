"use client";

import { useState, useRef, useImperativeHandle, forwardRef } from "react";

export interface ReactionStats {
  avg: number;
  min: number;
  max: number;
}

export interface HUDHandle {
  registerCorrect: (rt: number) => void;
  registerWrong: () => number; // returns the new lives count
  reset: () => void;
  getScore: () => number;
  getStats: () => ReactionStats | null;
}

interface HUDProps {
  isPlaying: boolean;
}

function calcStats(times: number[]): ReactionStats | null {
  if (times.length === 0) return null;
  const sum = times.reduce((a, b) => a + b, 0);
  return {
    avg: Math.round(sum / times.length),
    min: Math.round(Math.min(...times)),
    max: Math.round(Math.max(...times)),
  };
}

const HUD = forwardRef<HUDHandle, HUDProps>(function HUD({ isPlaying }, ref) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [lastReaction, setLastReaction] = useState<number | null>(null);

  // Refs mirror state for synchronous imperative reads
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const reactionTimesRef = useRef<number[]>([]);

  useImperativeHandle(ref, () => ({
    registerCorrect(rt: number) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      reactionTimesRef.current.push(rt);
      setLastReaction(Math.round(rt));
    },
    registerWrong() {
      livesRef.current -= 1;
      setLives(livesRef.current);
      return livesRef.current;
    },
    reset() {
      scoreRef.current = 0;
      livesRef.current = 3;
      reactionTimesRef.current = [];
      setScore(0);
      setLives(3);
      setLastReaction(null);
    },
    getScore: () => scoreRef.current,
    getStats: () => calcStats(reactionTimesRef.current),
  }));

  return (
    <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-10">
      <div className="text-white text-xl font-semibold">
        Score:{" "}
        <span className="text-yellow-400 font-bold text-2xl">{score}</span>
      </div>

      {isPlaying && lastReaction !== null && (
        <div className="text-gray-400 text-sm text-center">
          <span className="text-white font-semibold">{lastReaction} ms</span>
          <br />
          last reaction
        </div>
      )}

      <div className="flex gap-2 text-2xl">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i}>{i < lives ? "❤️" : "🖤"}</span>
        ))}
      </div>
    </div>
  );
});

export default HUD;
