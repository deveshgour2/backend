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
        <div className="hidden md:flex items-center p-1 rounded-xl bg-white/5 border border-white/5 text-xs">
          <button
            onClick={() => onChangeViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white/15 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Side-by-side parallel view"
          >
            <span className="material-symbols-outlined text-[15px]">splitscreen</span>
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => onChangeViewMode('stacked')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'stacked'
                ? 'bg-white/15 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Vertical stacked view"
          >
            <span className="material-symbols-outlined text-[15px]">view_agenda</span>
            <span>Stacked</span>
          </button>

          <button
            onClick={() => onChangeViewMode('tabs')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'tabs'
                ? 'bg-white/15 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Tabbed view"
          >
            <span className="material-symbols-outlined text-[15px]">tab</span>
            <span>Tabs</span>
          </button>
        </div>

        {/* Import JSON */}
        <button
          onClick={onOpenImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          title="Import JSON matching data schema"
        >
          <span className="material-symbols-outlined text-[16px] text-emerald-400">
            data_object
          </span>
          <span className="hidden sm:inline">Import JSON</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          title="Export conversation data as JSON"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Clear Conversation */}
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
