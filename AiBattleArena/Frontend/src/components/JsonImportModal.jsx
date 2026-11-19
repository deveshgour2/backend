import { useState } from 'react';

const defaultTemplate = JSON.stringify(
  {
    problem: "Explain the difference between optimistic concurrency control and pessimistic locking with a short code example.",
    solution_1: "### Optimistic Concurrency Control (OCC)\n\nOCC assumes multiple transactions can complete without frequently interfering with each other.\n\n- **Mechanism**: Reads record with a version number, then checks version upon commit (`UPDATE ... WHERE id = 1 AND version = 5`).\n- **Best for**: Read-heavy workloads with low write collision.\n\n```sql\n-- Commit check\nUPDATE accounts \nSET balance = balance + 100, version = version + 1 \nWHERE id = 42 AND version = 3;\n```",
    solution_2: "### Pessimistic Locking\n\nPessimistic locking prevents conflicts by taking locks before data modification.\n\n- **Mechanism**: Acquires exclusive row locks via `SELECT ... FOR UPDATE`.\n- **Trade-off**: Higher latency and risk of deadlocks under load.\n\n```sql\nBEGIN;\nSELECT * FROM accounts WHERE id = 42 FOR UPDATE;\nUPDATE accounts SET balance = balance + 100 WHERE id = 42;\nCOMMIT;\n```",
    judge: {
      solution_1_score: 9.5,
      solution_2_score: 7,
      solution_1_reasoning: "Solution 1 correctly explains how OCC minimizes lock contention on distributed databases and provides idiomatic SQL version checks.",
      solution_2_reasoning: "Solution 2 is conceptually correct for pessimistic locking but fails to warn about deadlock mitigation strategies."
    }
  },
  null,
  2
);

export default function JsonImportModal({ isOpen, onClose, onImport }) {
  const [jsonText, setJsonText] = useState(defaultTemplate);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImport = () => {
    try {
      setError('');
      const parsed = JSON.parse(jsonText);

      // Validate schema
      if (!parsed.problem) {
        throw new Error("Missing required field: 'problem'");
      }
      if (!parsed.solution_1) {
        throw new Error("Missing required field: 'solution_1'");
      }
      if (!parsed.solution_2) {
        throw new Error("Missing required field: 'solution_2'");
      }
      if (!parsed.judge) {
        throw new Error("Missing required field: 'judge'");
      }

      onImport(parsed);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#12141f] shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[22px]">
              data_object
            </span>
            <h3 className="text-lg font-bold text-white">Import Custom Evaluation JSON</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-zinc-400 mt-3 font-mono">
          Paste a JSON object matching the exact schema: <code className="text-emerald-400">problem</code>, <code className="text-emerald-400">solution_1</code>, <code className="text-emerald-400">solution_2</code>, and <code className="text-emerald-400">judge</code>.
        </p>

        {/* Textarea */}
        <div className="mt-3">
          <textarea
            rows={14}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#090b11] p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 leading-relaxed resize-none"
          />
        </div>

        {error && (
          <div className="mt-2 text-xs text-rose-400 font-mono flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_task</span>
            <span>Add to Conversation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
