import { useState, useRef } from 'react';
import axios from 'axios';


export default function PromptInput({ onSendMessage, isSubmitting = false }) {
  const [prompt, setPrompt] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const textareaRef = useRef(null);
  const busy = isSubmitting || isRequesting;

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    if (!prompt.trim() || busy) return;

    setIsRequesting(true);
    try {
      const response = await axios.post("http://localhost:3000/invoke", { input: prompt.trim() });
      const result = response.data?.result;

      if (!result || typeof result !== 'object') {
        throw new Error('The backend returned an invalid evaluation.');
      }

      onSendMessage({
        problem: prompt.trim(),
        ...result
      });
      setPrompt('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to invoke the AI arena:', error);
      window.alert(error.response?.data?.message || error.message || 'Failed to generate solutions.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptSelect = (text) => {
    setPrompt(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleInput = (e) => {
    setPrompt(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-30 p-4 lg:p-6 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/95 to-transparent backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Suggestion Chips */}


        {/* Input Card Container */}
        <div className="relative rounded-2xl border border-white/15 bg-[#141724]/95 shadow-2xl backdrop-blur-xl p-3.5 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={prompt}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your challenge, question, or problem for the dual models to solve... (Press ⌘+Enter to Evaluate)"
            className="w-full bg-transparent border-0 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 resize-none text-[15px] leading-relaxed px-2 font-normal"
          />

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 px-1 border-t border-white/5 mt-1">
            {/* Left Controls */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-zinc-400 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Arena: Dual Solution + Judge</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-zinc-400 font-mono text-[11px]">
                <span className="material-symbols-outlined text-[13px] text-indigo-400">balance</span>
                <span>AI Judge Active</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline-block">
                {prompt.length} chars
              </span>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!prompt.trim() || busy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {busy ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      sync
                    </span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Evaluate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
