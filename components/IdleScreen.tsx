interface IdleScreenProps {
  onStart: () => void;
}

export default function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Letters vs Numbers</h1>

      <p className="text-gray-500 text-base">
        Press{" "}
        <kbd className="bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded-sm font-mono text-sm">
          A
        </kbd>{" "}
        for a <span className="text-violet-600 font-semibold">Letter</span>
        <br />
        <br />
        Press{" "}
        <kbd className="bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded-sm font-mono text-sm">
          L
        </kbd>{" "}
        for a <span className="text-violet-600 font-semibold">Number</span>
      </p>

      <p className="text-gray-400 text-sm">3 lives. stay sharp.</p>

      <button
        onClick={onStart}
        className="mt-4 bg-violet-600 text-white font-semibold text-base px-8 py-3 rounded-sm hover:bg-violet-700 active:scale-95 transition-all cursor-pointer"
      >
        press <kbd className="font-mono">SPACE</kbd> or click to start
      </button>
    </div>
  );
}
