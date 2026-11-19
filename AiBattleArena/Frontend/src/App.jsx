import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MessageItem from './components/MessageItem';
import PromptInput from './components/PromptInput';
import JsonImportModal from './components/JsonImportModal';
import { initialEvaluations } from './data/sampleData';
import { generateMockEvaluation } from './utils/generateEvaluation';

export default function App() {
  const [evaluations, setEvaluations] = useState(() => {
    const saved = localStorage.getItem('arena_evaluations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved evaluations', e);
      }
    }
    return initialEvaluations;
  });

  const [currentRound, setCurrentRound] = useState(0);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side', 'stacked', 'tabs'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const messagesEndRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('arena_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSendMessage = (promptText) => {
    setIsSubmitting(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const newEval = generateMockEvaluation(promptText);
      setEvaluations((prev) => [...prev, newEval]);
      setCurrentRound(evaluations.length);
      setIsSubmitting(false);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 700);
  };

  const handleImportJson = (parsedData) => {
    const formatted = {
      id: `eval-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      problem: parsedData.problem,
      solution_1: parsedData.solution_1,
      solution_2: parsedData.solution_2,
      judge: {
        solution_1_score: parsedData.judge?.solution_1_score ?? 10,
        solution_2_score: parsedData.judge?.solution_2_score ?? 6,
        solution_1_reasoning: parsedData.judge?.solution_1_reasoning || '',
        solution_2_reasoning: parsedData.judge?.solution_2_reasoning || '',
      },
      tags: parsedData.tags || ['Custom JSON']
    };

    setEvaluations((prev) => [...prev, formatted]);
    setCurrentRound(evaluations.length);
    showToast('Imported evaluation successfully!');

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectRound = (index) => {
    setCurrentRound(index);
    const element = document.getElementById(`round-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewSession = () => {
    if (window.confirm('Start a fresh evaluation session?')) {
      setEvaluations([]);
      setCurrentRound(0);
      showToast('Started fresh evaluation session.');
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all evaluations in this arena?')) {
      setEvaluations([]);
      setCurrentRound(0);
      showToast('Cleared conversation.');
    }
  };

  const handleExport = () => {
    const cleanData = evaluations.map(({ problem, solution_1, solution_2, judge }) => ({
      problem,
      solution_1,
      solution_2,
      judge
    }));

    const jsonBlob = new Blob([JSON.stringify(cleanData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-battle-arena-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported conversation data as JSON.');
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/90 text-zinc-950 font-medium text-xs shadow-xl animate-fade-in backdrop-blur-md">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        evaluations={evaluations}
        currentRound={currentRound}
        onSelectRound={handleSelectRound}
        onNewEvaluation={handleNewSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenImport={() => setIsImportModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenImport={() => setIsImportModalOpen(true)}
          onExport={handleExport}
          onClear={handleClear}
          totalMessages={evaluations.length}
        />

        {/* Message Thread Feed */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-48">
          {evaluations.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 px-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-2xl">
                ⚡
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                AI Dual Solution & Judge Arena
              </h2>
              <p className="text-sm text-zinc-400 max-w-md leading-relaxed mb-8">
                Send any technical challenge or problem statement. The arena generates two competing solutions evaluated side-by-side by an AI Judge.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setEvaluations(initialEvaluations)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span>Load Sample Evaluations</span>
                </button>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">
                    data_object
                  </span>
                  <span>Paste Custom JSON</span>
                </button>
              </div>
            </div>
          ) : (
            /* Evaluations List */
            <div className="space-y-12">
              {evaluations.map((item, index) => (
                <div key={item.id || index} id={`round-${index}`}>
                  <MessageItem
                    evaluation={item}
                    roundIndex={index}
                    viewMode={viewMode}
                    model1Name="Solution 1 (Model Alpha)"
                    model2Name="Solution 2 (Model Beta)"
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Floating Bottom Prompt Composer */}
        <PromptInput
          onSendMessage={handleSendMessage}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* JSON Import Modal */}
      <JsonImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportJson}
      />
    </div>
  );
}
