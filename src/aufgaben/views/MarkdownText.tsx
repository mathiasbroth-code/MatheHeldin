/**
 * Simple Markdown-Text Renderer für Aufgabentexte.
 * Rendert Listen, Tabellen, Code-Blöcke, Leerzeilen und normalen Text.
 * Kein vollständiger Markdown-Parser — nur die Patterns die in unseren Aufgaben vorkommen.
 */
export function MarkdownText({
  text,
  className = 'text-sm text-body leading-relaxed',
}: {
  text: string;
  className?: string;
}) {
  if (!text) return null;

  const blocks = splitIntoBlocks(text);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.type === 'code') {
          return (
            <pre
              key={i}
              className="font-mono text-xs bg-card border border-border/50 rounded-lg p-3 overflow-x-auto whitespace-pre leading-relaxed my-1"
            >
              {block.content}
            </pre>
          );
        }

        // Render inline lines
        return block.lines.map((line, j) => {
          const key = `${i}-${j}`;
          const trimmed = line.trim();

          // Markdown table separator rows → skip
          if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
            return null;
          }

          // Markdown table rows → render as table-like grid
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const cells = trimmed.split('|').slice(1, -1).map((c) => c.trim());
            return (
              <div key={key} className="flex font-mono text-xs tabular-nums">
                {cells.map((cell, k) => (
                  <span
                    key={k}
                    className="flex-1 text-center py-0.5 px-1 border border-border/50"
                  >
                    {cell.includes('**')
                      ? <strong>{cell.replace(/\*\*/g, '')}</strong>
                      : cell || '\u00A0'}
                  </span>
                ))}
              </div>
            );
          }

          // List items (- item) → bullet
          if (trimmed.startsWith('- ')) {
            return (
              <p key={key} className="ml-3">
                • {renderInline(trimmed.slice(2))}
              </p>
            );
          }

          // Numbered list (1. item) → keep number
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <p key={key} className="ml-3">
                {renderInline(trimmed)}
              </p>
            );
          }

          // Empty line → small spacer
          if (!trimmed) {
            return <div key={key} className="h-1.5" />;
          }

          // Normal text (with possible bold/inline formatting)
          return <p key={key}>{renderInline(trimmed)}</p>;
        });
      })}
    </div>
  );
}

/** Rendert Inline-Formatierung: **bold**, `code` */
function renderInline(text: string): React.ReactNode {
  if (!text.includes('**') && !text.includes('`')) {
    return text;
  }

  // Split on **bold** and `code` patterns
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-xs bg-card px-1 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface TextBlock {
  type: 'text';
  lines: string[];
}

interface CodeBlock {
  type: 'code';
  content: string;
}

type Block = TextBlock | CodeBlock;

/** Splittet Text in normale Text-Blöcke und Code-Blöcke (```...```) */
function splitIntoBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.split('\n');
  let inCode = false;
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        // End code block
        blocks.push({ type: 'code', content: currentLines.join('\n') });
        currentLines = [];
        inCode = false;
      } else {
        // Start code block — flush text lines first
        if (currentLines.length > 0) {
          blocks.push({ type: 'text', lines: currentLines });
          currentLines = [];
        }
        inCode = true;
      }
    } else {
      currentLines.push(line);
    }
  }

  // Flush remaining
  if (currentLines.length > 0) {
    blocks.push({ type: inCode ? 'code' : 'text', lines: inCode ? [] : currentLines, ...(inCode ? { content: currentLines.join('\n') } : {}) } as Block);
  }

  return blocks;
}
