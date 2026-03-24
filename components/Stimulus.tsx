"use client";

import { useState, useEffect, useRef } from "react";

export type SymbolType = "letter" | "number";

export interface StimulusSymbol {
  value: string;
  type: SymbolType;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "0123456789".split("");

export function getRandomSymbol(): StimulusSymbol {
  const isLetter = Math.random() < 0.5;
  return isLetter
    ? {
        value: LETTERS[Math.floor(Math.random() * LETTERS.length)],
        type: "letter",
      }
    : {
        value: NUMBERS[Math.floor(Math.random() * NUMBERS.length)],
        type: "number",
      };
}

interface StimulusProps {
  triggerNext: number;
  onSymbolReady: (symbol: StimulusSymbol, shownAt: number) => void;
  onEndGame: () => void;
}

export default function Stimulus({
  triggerNext,
  onSymbolReady,
  onEndGame,
}: StimulusProps) {
  const [symbol, setSymbol] = useState<StimulusSymbol>(() => getRandomSymbol());
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Notify parent of the initial symbol generated on mount
      isFirstRender.current = false;
      onSymbolReady(symbol, performance.now());
      return;
    }
    // Generate and show the next symbol when triggerNext increments
    const next = getRandomSymbol();
    setSymbol(next);
    onSymbolReady(next, performance.now());
    // onSymbolReady is intentionally excluded — it's stable but not memoized in parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerNext]);

  return (
    <>
      <div
        className={`text-[10rem] font-extrabold select-none leading-none transition-colors duration-100 ${
          symbol.type === "letter" ? "text-blue-400" : "text-orange-400"
        }`}
      >
        {symbol.value}
      </div>

      <p className="text-gray-500 text-sm tracking-widest uppercase">
        {symbol.type === "letter" ? "→ Press A" : "→ Press L"}
      </p>

      <button
        onClick={onEndGame}
        className="mt-8 bg-red-700 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl transition-colors cursor-pointer"
      >
        End Game
      </button>

      <div className="absolute bottom-6 flex gap-8 text-gray-500 text-sm">
        <span>
          <kbd className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono">
            A
          </kbd>{" "}
          = Letter
        </span>
        <span>
          <kbd className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono">
            L
          </kbd>{" "}
          = Number
        </span>
      </div>
    </>
  );
}
