export default function Sidebar({
  evaluations = [],
  currentRound = 0,
  onSelectRound,
  onNewEvaluation,
  isOpen = false,
  onClose,
  onOpenImport
}) {
  // Calculate win counts
  let sol1Wins = 0;
  let sol2Wins = 0;

  evaluations.forEach((item) => {
    const judge = item.judge || item.judge_recommendation;
    const s1 = Number(judge?.solution_1_score) || 0;
    const s2 = Number(judge?.solution_2_score) || 0;
    if (s1 > s2) sol1Wins++;
    else if (s2 > s1) sol2Wins++;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0f111a] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/20">
                ⚡
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white block">
                  AI Battle Arena
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase block">
                  Dual Bench & Judge
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* New Evaluation Action */}
          <div className="p-4">
            <button
              onClick={onNewEvaluation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ New Session</span>
            </button>
          </div>

          {/* Session Feed Navigation */}
          <div className="flex-1 overflow-y-auto px-3 space-y-6">
            {/* Rounds in Current Session */}
            <div>
              <div className="px-2 pb-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                <span>Rounds ({evaluations.length})</span>
                <span className="material-symbols-outlined text-[14px]">timeline</span>
              </div>

              <div className="space-y-1">
                {evaluations.map((item, idx) => {
                  const judge = item.judge || item.judge_recommendation;
                  const s1 = Number(judge?.solution_1_score) || 0;
                  const s2 = Number(judge?.solution_2_score) || 0;
                  const winner = s1 > s2 ? 'Sol 1' : s2 > s1 ? 'Sol 2' : 'Tie';

                  return (
                    <button
                      key={item.id || idx}
                      onClick={() => onSelectRound(idx)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 group cursor-pointer ${
                        currentRound === idx
                          ? 'bg-white/10 border border-white/10 text-white'
                          : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200 border border-transparent'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        s1 > s2 ? 'bg-emerald-400' : s2 > s1 ? 'bg-amber-400' : 'bg-zinc-500'
                      }`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="font-semibold text-zinc-200 truncate">
                            Round {idx + 1}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 shrink-0">
                            {winner} ({Math.max(s1, s2)}/10)
                          </span>
                        </div>
                        <p className="text-[11.5px] text-zinc-400 truncate line-clamp-1">
                          {item.problem}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
           
          </div>
        </div>

        {/* Win Rate Stats Dock */}
        <div className="p-4 border-t border-white/10 bg-[#0b0d14]/70">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center justify-between">
            <span>Scorecard Summary</span>
            <span className="material-symbols-outlined text-[14px] text-zinc-500">insights</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block font-medium">
                Solution 1
              </span>
              <span className="text-base font-bold text-emerald-300 font-mono">
                {sol1Wins} <span className="text-xs font-normal text-zinc-400">wins</span>
              </span>
            </div>

            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-amber-400 block font-medium">
                Solution 2
              </span>
              <span className="text-base font-bold text-amber-300 font-mono">
                {sol2Wins} <span className="text-xs font-normal text-zinc-400">wins</span>
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Gemini Judge Active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
