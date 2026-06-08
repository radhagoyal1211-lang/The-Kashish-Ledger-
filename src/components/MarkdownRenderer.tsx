import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split content by paragraphs/double line breaks to parse blocks
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-8 text-neutral-800 dark:text-neutral-250 font-sans text-[16px] sm:text-[17px] leading-[1.8] sm:leading-[1.85] tracking-[0.012em] font-light">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Parse Headings
        if (trimmed.startsWith('### ')) {
          const text = trimmed.replace('### ', '').trim();
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h3 
              key={idx} 
              id={id}
              className="font-serif text-2xl sm:text-3xl text-[#111111] dark:text-[#EAE8E4] font-medium pt-10 pb-2 tracking-tight first:pt-0 scroll-mt-24 border-b border-stone-200/60 dark:border-stone-850"
            >
              {text}
            </h3>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 
              key={idx}
              className="font-serif text-3xl sm:text-4xl text-[#111111] dark:text-[#EAE8E4] font-medium pt-12 pb-3 border-b border-stone-200/60 dark:border-stone-850"
            >
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // 2. Parse Blockquotes
        if (trimmed.startsWith('> ')) {
          const text = trimmed.replace(/^>\s+/, '').replace(/^"/, '').replace(/"$/, '').trim();
          return (
            <blockquote 
              key={idx} 
              className="pl-6 border-l-2 border-gold my-10 bg-stone-50/40 dark:bg-stone-900/10 p-6 rounded-none"
            >
              <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#111111] dark:text-[#EAE8E4] italic leading-relaxed font-light">
                "{text}"
              </p>
            </blockquote>
          );
        }

        // 3. Parse Unordered Lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const items = trimmed.split('\n').map(item => item.replace(/^[*|-]\s+/, '').trim());
          return (
            <ul key={idx} className="list-disc pl-6 space-y-3 my-6 text-stone-700 dark:text-stone-300 text-sm sm:text-[15px] leading-relaxed tracking-wide font-light">
              {items.map((item, itemIdx) => {
                // Parse simple bold tags like **bold** inside list items
                const parts = item.split('**');
                return (
                  <li key={itemIdx}>
                    {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-[#111111] dark:text-white">{part}</strong> : part)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // 4. Parse Tables
        if (trimmed.startsWith('|')) {
          const lines = trimmed.split('\n').map(line => line.trim()).filter(Boolean);
          if (lines.length > 2) {
            const parseRow = (line: string) => line.split('|').map(cell => cell.trim()).filter((cell, i, arr) => i > 0 && i < arr.length - 1);
            const headers = parseRow(lines[0]);
            const rows = lines.slice(2).map(line => parseRow(line));

            return (
              <div key={idx} className="overflow-x-auto my-8 border border-stone-200 dark:border-stone-800 rounded-none">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50 dark:bg-stone-900/20 font-mono text-[9px] uppercase tracking-wider text-stone-400 border-b border-stone-200 dark:border-stone-800">
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3.5 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-stone-100/10">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3.5 text-stone-600 dark:text-stone-450">
                            {cell.startsWith('**') ? <strong>{cell.replace(/\*\*/g, '')}</strong> : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 5. Default Paragraph
        const parts = trimmed.split('**');
        return (
          <p key={idx} className="text-stone-750 dark:text-stone-300 leading-[1.8] sm:leading-[1.85] font-light font-sans text-[16px] sm:text-[17px] mb-6 tracking-[0.012em] shrink-0">
            {parts.map((part, pIdx) => {
              if (pIdx % 2 === 1) {
                return (
                  <strong key={pIdx} className="font-semibold text-neutral-950 dark:text-white">
                    {part.startsWith('_') ? <em className="italic">{part.replace(/_/g, '')}</em> : part}
                  </strong>
                );
              }
              // Render inline code or italic blocks, or simply regular text
              const innerParts = part.split('`');
              return innerParts.map((ip, ipIdx) => {
                if (ipIdx % 2 === 1) {
                  return (
                    <code key={ipIdx} className="bg-neutral-50 dark:bg-neutral-900 text-[11px] font-mono p-1 px-1.5 border border-neutral-100 dark:border-neutral-800 rounded-sm text-gold">
                      {ip}
                    </code>
                  );
                }
                const italicParts = ip.split('_');
                return italicParts.map((itp, itpIdx) => {
                  if (itpIdx % 2 === 1) {
                    return <em key={itpIdx} className="italic text-neutral-950 dark:text-white">{itp}</em>;
                  }
                  return itp;
                });
              });
            })}
          </p>
        );
      })}
    </div>
  );
}
