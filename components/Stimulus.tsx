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
          symbol.type === "letter" ? "text-violet-600" : "text-gray-900"
        }`}
      >
        {symbol.value}
      </div>

      <p className="text-gray-400 text-xs tracking-widest uppercase">
        {symbol.type === "letter" ? "→ press A" : "→ press L"}
      </p>

      <button
        onClick={onEndGame}
        className="mt-8 border border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 text-sm px-5 py-1.5 rounded-sm transition-colors cursor-pointer"
      >
        end game
      </button>

      <div className="absolute bottom-6 flex gap-8 text-gray-400 text-xs">
        <span>
          <kbd className="bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded-sm font-mono">
            A
          </kbd>{" "}
          = letter
        </span>
        <span>
          <kbd className="bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded-sm font-mono">
            L
          </kbd>{" "}
          = number
        </span>
      </div>
    </>
  );
}
