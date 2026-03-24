interface IdleScreenProps {
  onStart: () => void;
}

export default function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-5xl font-bold text-white">Letters vs Numbers</h1>

      <p className="text-gray-300 text-xl">
        Press{" "}
        <kbd className="bg-gray-700 text-white px-3 py-1 rounded font-mono">
          A
        </kbd>{" "}
        for a <span className="text-blue-400 font-semibold">Letter</span>
        <br />
        <br />
        Press{" "}
        <kbd className="bg-gray-700 text-white px-3 py-1 rounded font-mono">
          L
        </kbd>{" "}
        for a <span className="text-orange-400 font-semibold">Number</span>
      </p>

      <p className="text-gray-400">You have 3 lives. Good luck!</p>

      <button
        onClick={onStart}
        className="mt-4 bg-white text-gray-900 font-bold text-xl px-10 py-4 rounded-2xl hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
      >
        Press <kbd className="font-mono">SPACE</kbd> or click to Start
      </button>
    </div>
  );
}
