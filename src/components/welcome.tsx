const Welcome = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center select-none">
    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-lg">
      <span className="text-white text-2xl font-bold">G</span>
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        How can I help you today?
      </h1>
      <p className="text-gray-400 text-sm">Start a conversation below</p>
    </div>
    <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-2">
      {[
        "Explain quantum computing",
        "Write a Python script",
        "Plan a weekend trip",
        "Summarize an article",
      ].map((s) => (
        <button
          key={s}
          className="text-left p-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          {s}
        </button>
      ))}
    </div>
  </div>
);

export default Welcome;
