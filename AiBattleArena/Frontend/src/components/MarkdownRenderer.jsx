import { useState, Fragment } from 'react';

export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  // Split content by code blocks: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'markdown',
        text: content.slice(lastIndex, match.index),
      });
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'code',
      code: match[2].trimEnd(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'markdown',
      text: content.slice(lastIndex),
    });
  }

  return (
    <div className={`space-y-4 text-zinc-300 leading-relaxed font-normal text-[14.5px] ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} code={part.code} lang={part.lang} />;
        }
        return <FormattedText key={index} text={part.text} />;
      })}
    </div>
  );
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="my-4 rounded-xl border border-white/10 bg-[#0d0f18] overflow-hidden shadow-lg group">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-zinc-900/60 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/60 inline-block"></span>
          <span className="uppercase font-semibold text-zinc-300 tracking-wider text-[11px]">{lang}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500">{lines.length} lines</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <span className="material-symbols-outlined text-[14px] text-emerald-400">check</span>
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 font-mono text-[13px] text-zinc-200 overflow-x-auto leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="select-none text-right pr-4 text-zinc-600 text-xs font-mono w-8 align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono text-zinc-300">
                  {highlightSyntax(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simple fast syntax colorizer for keywords, types, strings, comments
function highlightSyntax(line) {
  // Comment line
  if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
    return <span className="text-zinc-500 italic">{line}</span>;
  }

  // Tokens splitting
  const tokenRegex = /(\b(?:fn|pub|impl|struct|enum|type|const|let|mut|for|while|loop|if|else|match|return|use|mod|package|import|func|var|go|chan|defer|interface|select|case|class|function|async|await)\b)|(\b(?:Self|Option|Some|None|Result|Ok|Err|Vec|Box|Arc|RwLock|Atomic|String|bool|u8|u16|u32|u64|usize|i32|i64|uint32|uint64|int|time|sync|Duration)\b)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\b)/g;

  const elements = [];
  let lastIdx = 0;
  let match;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      elements.push(line.slice(lastIdx, match.index));
    }

    if (match[1]) {
      // Keyword
      elements.push(
        <span key={match.index} className="text-indigo-400 font-semibold">
          {match[1]}
        </span>
      );
    } else if (match[2]) {
      // Type
      elements.push(
        <span key={match.index} className="text-emerald-400">
          {match[2]}
        </span>
      );
    } else if (match[3]) {
      // String
      elements.push(
        <span key={match.index} className="text-amber-300">
          {match[3]}
        </span>
      );
    } else if (match[4]) {
      // Number
      elements.push(
        <span key={match.index} className="text-rose-400">
          {match[4]}
        </span>
      );
    }

    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < line.length) {
    elements.push(line.slice(lastIdx));
  }

  return elements.length > 0 ? elements : line;
}

function FormattedText({ text }) {
  const paragraphs = text.split('\n\n');

  return (
    <div className="space-y-3.5">
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={pIdx} className="text-sm font-semibold text-zinc-100 tracking-wide uppercase pt-2">
              {parseInlineStyles(trimmed.replace('#### ', ''))}
            </h5>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={pIdx} className="text-base font-semibold text-zinc-100 pt-3 pb-1 border-b border-white/5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {parseInlineStyles(trimmed.replace('### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={pIdx} className="text-lg font-bold text-white pt-3 pb-1 tracking-tight">
              {parseInlineStyles(trimmed.replace('## ', ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={pIdx} className="text-xl font-bold text-white pt-2 pb-1">
              {parseInlineStyles(trimmed.replace('# ', ''))}
            </h2>
          );
        }

        // Bulleted lists
        if (trimmed.includes('\n- ') || trimmed.startsWith('- ') || trimmed.includes('\n* ') || trimmed.startsWith('* ')) {
          const listItems = trimmed
            .split('\n')
            .filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          return (
            <ul key={pIdx} className="space-y-2 pl-2">
              {listItems.map((item, iIdx) => {
                const itemContent = item.replace(/^[-*]\s+/, '');
                return (
                  <li key={iIdx} className="flex items-start gap-2.5 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{parseInlineStyles(itemContent)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Regular paragraph with potential soft linebreaks
        const lines = trimmed.split('\n');
        return (
          <p key={pIdx} className="leading-relaxed text-zinc-300">
            {lines.map((l, lIdx) => (
              <Fragment key={lIdx}>
                {parseInlineStyles(l)}
                {lIdx < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// Inline formatting: `code`, **bold**, *italic*
function parseInlineStyles(text) {
  if (!text) return null;

  // Match `code` and **bold** and *italic*
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-zinc-800/90 border border-white/10 text-emerald-300 font-mono text-[12.5px]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-zinc-100">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-zinc-200">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
