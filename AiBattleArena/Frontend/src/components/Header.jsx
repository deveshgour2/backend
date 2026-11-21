export default function Header({
  viewMode,
  onChangeViewMode,
  onToggleSidebar,
  onOpenImport,
  onExport,
  onClear,
  totalMessages = 0
}) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0b0d14]/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 flex items-center justify-between">
      {/* Left items */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          title="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-semibold text-base text-white tracking-tight truncate">
            Dual Solution Evaluation Arena
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {totalMessages} {totalMessages === 1 ? 'Message' : 'Messages'}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* View Mode Toggle */}
        
        <button
          onClick={onClear}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Clear all messages"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
        </button>
      </div>
    </header>
  );
}
