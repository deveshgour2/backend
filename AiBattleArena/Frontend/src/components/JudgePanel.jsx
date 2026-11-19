import { useState } from 'react';

export default function JudgePanel({ judge, solution1Title = 'Solution 1', solution2Title = 'Solution 2' }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'sol1', 'sol2'

  if (!judge) return null;

  const score1 = Number(judge.solution_1_score) || 0;
  const score2 = Number(judge.solution_2_score) || 0;
  const maxScore = Math.max(10, score1, score2);

  const pct1 = Math.min(100, Math.round((score1 / maxScore) * 100));
  const pct2 = Math.min(100, Math.round((score2 / maxScore) * 100));

  let winnerText = 'Tie Decision';
  let winnerColor = 'zinc';
  let diffText = 'Equal performance';

  if (score1 > score2) {
    winnerText = `${solution1Title} Preferred`;
    winnerColor = 'emerald';
    diffText = `+${(score1 - score2).toFixed(1)} pts advantage`;
  } else if (score2 > score1) {
    winnerText = `${solution2Title} Preferred`;
    winnerColor = 'amber';
    diffText = `+${(score2 - score1).toFixed(1)} pts advantage`;
  }

  const handleCopyVerdict = () => {
    const text = `AI Judge Verdict: ${winnerText} (${score1}/${maxScore} vs ${score2}/${maxScore})\n\n[${solution1Title} (Score: ${score1}/${maxScore})]\n${judge.solution_1_reasoning}\n\n[${solution2Title} (Score: ${score2}/${maxScore})]\n${judge.solution_2_reasoning}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#12141f]/95 shadow-2xl p-6 lg:p-8 overflow-hidden backdrop-blur-xl">
      {/* Subtle ambient lighting */}
      <div className={`absolute top-0 right-0 w-96 h-96 pointer-events-none rounded-full blur-3xl opacity-15 ${
        winnerColor === 'emerald' ? 'bg-emerald-500' : winnerColor === 'amber' ? 'bg-amber-500' : 'bg-indigo-500'
      }`}></div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium tracking-wide uppercase mb-2">
            <span className="material-symbols-outlined text-[15px]">gavel</span>
            <span>AI Judge Recommendation & Verdict</span>
          </div>

          <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>{winnerText}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold tracking-wider uppercase ${
              winnerColor === 'emerald'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {score1} vs {score2}
            </span>
          </h3>

          <p className="text-zinc-400 text-xs font-mono mt-1 flex items-center gap-2">
            <span className="text-emerald-400 font-medium">{diffText}</span>
            <span>•</span>
            <span>Evaluated by Autonomous Benchmark Model</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyVerdict}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied Verdict' : 'Copy Verdict'}</span>
          </button>
        </div>
      </div>

      {/* Score Comparison Meters */}
      <div className="py-6 border-b border-white/10">
        <div className="text-xs font-mono uppercase text-zinc-400 font-medium tracking-wider mb-4 flex items-center justify-between">
          <span>Comparative Score Metric</span>
          <span className="text-zinc-500">Scale: 0 - {maxScore}</span>
        </div>

        <div className="space-y-4">
          {/* Solution 1 Score Meter */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-2 font-medium text-zinc-200">
                <span className={`w-2 h-2 rounded-full ${score1 >= score2 ? 'bg-emerald-400 ring-2 ring-emerald-400/20' : 'bg-zinc-500'}`}></span>
                {solution1Title}
                {score1 > score2 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-semibold">
                    Winner
                  </span>
                )}
              </span>
              <span className="font-mono font-semibold text-sm text-emerald-400">
                {score1} <span className="text-zinc-500 text-xs font-normal">/ {maxScore}</span>
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
                style={{ width: `${pct1}%` }}
              ></div>
            </div>
          </div>

          {/* Solution 2 Score Meter */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-2 font-medium text-zinc-200">
                <span className={`w-2 h-2 rounded-full ${score2 > score1 ? 'bg-amber-400 ring-2 ring-amber-400/20' : 'bg-zinc-500'}`}></span>
                {solution2Title}
                {score2 > score1 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-semibold">
                    Winner
                  </span>
                )}
              </span>
              <span className={`font-mono font-semibold text-sm ${score2 > score1 ? 'text-amber-300' : 'text-zinc-400'}`}>
                {score2} <span className="text-zinc-500 text-xs font-normal">/ {maxScore}</span>
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  score2 > score1
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-zinc-600'
                }`}
                style={{ width: `${pct2}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Mobile or Filter */}
      <div className="flex items-center gap-2 pt-6 pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-white/10 text-white border border-white/15'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Side-by-Side Breakdown
        </button>
        <button
          onClick={() => setActiveTab('sol1')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'sol1'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {solution1Title} Reasoning ({score1})
        </button>
        <button
          onClick={() => setActiveTab('sol2')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'sol2'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {solution2Title} Reasoning ({score2})
        </button>
      </div>

      {/* Detailed Reasoning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Solution 1 Reasoning */}
        {(activeTab === 'all' || activeTab === 'sol1') && (
          <div className={`p-5 rounded-xl border transition-all ${
            score1 >= score2
              ? 'border-emerald-500/30 bg-emerald-950/10'
              : 'border-white/5 bg-zinc-900/40'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${score1 >= score2 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {score1 >= score2 ? 'verified' : 'notes'}
                </span>
                <span className="font-semibold text-sm text-zinc-100">
                  {solution1Title} Evaluation
                </span>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">
                Score {score1}/10
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-normal">
              {judge.solution_1_reasoning || 'No specific reasoning provided for Solution 1.'}
            </p>
          </div>
        )}

        {/* Solution 2 Reasoning */}
        {(activeTab === 'all' || activeTab === 'sol2') && (
          <div className={`p-5 rounded-xl border transition-all ${
            score2 > score1
              ? 'border-amber-500/30 bg-amber-950/10'
              : 'border-white/5 bg-zinc-900/40'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${score2 > score1 ? 'text-amber-400' : 'text-zinc-400'}`}>
                  {score2 > score1 ? 'verified' : 'notes'}
                </span>
                <span className="font-semibold text-sm text-zinc-100">
                  {solution2Title} Evaluation
                </span>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                Score {score2}/10
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-normal">
              {judge.solution_2_reasoning || 'No specific reasoning provided for Solution 2.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
