import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import JudgePanel from './JudgePanel';

export default function MessageItem({
  evaluation,
  roundIndex,
  viewMode = 'side-by-side', // 'side-by-side', 'stacked', 'tabs'
  model1Name = 'Solution 1 (Model Alpha)',
  model2Name = 'Solution 2 (Model Beta)'
}) {
  const [activeTab, setActiveTab] = useState('solution_1'); // for tabs mode
  const [copiedSol1, setCopiedSol1] = useState(false);
  const [copiedSol2, setCopiedSol2] = useState(false);

  const { problem, solution_1, solution_2, judge, timestamp, tags } = evaluation;

  const score1 = Number(judge?.solution_1_score) || 0;
  const score2 = Number(judge?.solution_2_score) || 0;

  const isSol1Winner = score1 > score2;
  const isSol2Winner = score2 > score1;

  const copySolution = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="space-y-8 py-8 border-b border-white/[0.06] last:border-b-0">
      {/* 1. User Problem / Prompt Card */}
      <div className="relative rounded-2xl border border-white/10 bg-[#12141f] p-6 lg:p-7 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              U
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-zinc-100">User Prompt</span>
                <span className="text-zinc-500">•</span>
                <span className="text-xs font-mono text-zinc-400">Round #{roundIndex + 1}</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {timestamp || 'Just now'}
              </span>
            </div>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Problem text */}
        <div className="text-zinc-100 font-medium text-base lg:text-[17px] leading-relaxed tracking-normal pl-1">
          {problem}
        </div>
      </div>

      {/* 2. Dual Solutions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">
              compare_arrows
            </span>
            <h4 className="text-sm font-semibold tracking-wide text-zinc-300 uppercase font-mono">
              Dual Generated Solutions
            </h4>
          </div>

          <div className="text-xs font-mono text-zinc-500">
            {viewMode === 'side-by-side' ? 'Parallel Side-by-Side View' : 'Sequential View'}
          </div>
        </div>

        {/* Tab switcher if in tabs mode */}
        {viewMode === 'tabs' && (
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('solution_1')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'solution_1'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{model1Name}</span>
              {isSol1Winner && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-mono text-[10px] uppercase font-bold">
                  Winner ({score1})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('solution_2')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'solution_2'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{model2Name}</span>
              {isSol2Winner && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold">
                  Winner ({score2})
                </span>
              )}
            </button>
          </div>
        )}

        {/* Solutions Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'side-by-side'
            ? 'grid-cols-1 lg:grid-cols-2 items-start'
            : viewMode === 'tabs'
            ? 'grid-cols-1'
            : 'grid-cols-1'
        }`}>
          {/* Solution 1 Card */}
          {(viewMode !== 'tabs' || activeTab === 'solution_1') && (
            <div className={`relative rounded-2xl border transition-all p-6 lg:p-7 flex flex-col justify-between overflow-hidden shadow-xl ${
              isSol1Winner
                ? 'border-emerald-500/40 bg-[#111622]/90 ring-1 ring-emerald-500/20'
                : 'border-white/10 bg-[#12141f]/90'
            }`}>
              {/* Winner top accent glow */}
              {isSol1Winner && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
              )}

              <div>
                {/* Solution Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="font-semibold text-base text-zinc-100 tracking-tight">
                      {model1Name}
                    </span>
                    {isSol1Winner && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[13px]">military_tech</span>
                        Winner
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-400">
                      Score: {score1}/10
                    </span>
                    <button
                      onClick={() => copySolution(solution_1, setCopiedSol1)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs cursor-pointer"
                      title="Copy full solution markdown"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedSol1 ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Markdown Solution Body */}
                <MarkdownRenderer content={solution_1} />
              </div>

              {/* Solution Footer Metadata */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>{solution_1?.length || 0} characters</span>
                <span className="text-emerald-400 font-medium">Ready for execution</span>
              </div>
            </div>
          )}

          {/* Solution 2 Card */}
          {(viewMode !== 'tabs' || activeTab === 'solution_2') && (
            <div className={`relative rounded-2xl border transition-all p-6 lg:p-7 flex flex-col justify-between overflow-hidden shadow-xl ${
              isSol2Winner
                ? 'border-amber-500/40 bg-[#16151f]/90 ring-1 ring-amber-500/20'
                : 'border-white/10 bg-[#12141f]/90'
            }`}>
              {/* Winner top accent glow */}
              {isSol2Winner && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400"></div>
              )}

              <div>
                {/* Solution Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="font-semibold text-base text-zinc-100 tracking-tight">
                      {model2Name}
                    </span>
                    {isSol2Winner && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[13px]">military_tech</span>
                        Winner
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 ${
                      isSol2Winner ? 'text-amber-300' : 'text-zinc-400'
                    }`}>
                      Score: {score2}/10
                    </span>
                    <button
                      onClick={() => copySolution(solution_2, setCopiedSol2)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs cursor-pointer"
                      title="Copy full solution markdown"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedSol2 ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Markdown Solution Body */}
                <MarkdownRenderer content={solution_2} />
              </div>

              {/* Solution Footer Metadata */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>{solution_2?.length || 0} characters</span>
                <span className="text-zinc-400 font-medium">Alternative approach</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. AI Judge Recommendation Section */}
      <JudgePanel
        judge={judge}
        solution1Title={model1Name}
        solution2Title={model2Name}
      />
    </article>
  );
}
