"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import HUD, { type HUDHandle, type ReactionStats } from "@/components/HUD";
import IdleScreen from "@/components/IdleScreen";
import Stimulus, { type StimulusSymbol } from "@/components/Stimulus";
import GameOverScreen from "@/components/GameOverScreen";

type GameState = "idle" | "playing" | "gameover";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [triggerNext, setTriggerNext] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [stats, setStats] = useState<ReactionStats | null>(null);

  const hudRef = useRef<HUDHandle>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSymbol = useRef<StimulusSymbol | null>(null);
  const symbolShownAt = useRef<number | null>(null);

  const showFeedback = (type: "correct" | "wrong") => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(type);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 400);
  };

  const handleSymbolReady = (symbol: StimulusSymbol, shownAt: number) => {
    currentSymbol.current = symbol;
    symbolShownAt.current = shownAt;
  };

  const nextSymbol = useCallback(() => {
    setTriggerNext((n) => n + 1);
  }, []);

  const endGame = useCallback(() => {
    setFinalScore(hudRef.current?.getScore() ?? 0);
    setStats(hudRef.current?.getStats() ?? null);
    setGameState("gameover");
  }, []);

  const startGame = useCallback(() => {
    hudRef.current?.reset();
    setFeedback(null);
    setTriggerNext(0);
    setGameState("playing");
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (gameState === "idle" && key === " ") {
        startGame();
        return;
      }

      if (gameState !== "playing" || !currentSymbol.current) return;

      const pressed = key.toUpperCase();
      if (pressed !== "A" && pressed !== "L") return;

      const symbol = currentSymbol.current;
      const isCorrect =
        (pressed === "A" && symbol.type === "letter") ||
        (pressed === "L" && symbol.type === "number");

      if (isCorrect) {
        const rt =
          symbolShownAt.current !== null
            ? performance.now() - symbolShownAt.current
            : null;
        if (rt !== null) hudRef.current?.registerCorrect(rt);
        showFeedback("correct");
        nextSymbol();
      } else {
        showFeedback("wrong");
        const newLives = hudRef.current?.registerWrong() ?? 0;
        if (newLives <= 0) {
          endGame();
        } else {
          nextSymbol();
        }
      }
    },
    [gameState, nextSymbol, endGame, startGame],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") e.preventDefault();
      handleKey(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const bgColor =
    feedback === "correct"
      ? "bg-green-900"
      : feedback === "wrong"
        ? "bg-red-900"
        : "bg-gray-950";

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center py-20 transition-colors duration-150 ${bgColor}`}
    >
      <HUD ref={hudRef} isPlaying={gameState === "playing"} />

      <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-4">
        {gameState === "idle" && <IdleScreen onStart={startGame} />}

        {gameState === "playing" && (
          <Stimulus
            triggerNext={triggerNext}
            onSymbolReady={handleSymbolReady}
            onEndGame={endGame}
          />
        )}

        {gameState === "gameover" && (
          <GameOverScreen score={finalScore} stats={stats} onPlayAgain={startGame} />
        )}
      </div>
    </main>
  );
}
