import React from 'react';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CODE_BLOCK_REGEX = /```(\w+)?([\s\S]*?)```/g;

function parseManual(text: string) {
  const parts: Array<{ type: 'text' | 'code'; content: string; lang?: string }> = [];
  let lastIndex = 0;
  let match;
  while ((match = CODE_BLOCK_REGEX.exec(text))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', content: match[2], lang: match[1] || 'typescript' });
    lastIndex = CODE_BLOCK_REGEX.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return parts;
}

const IBSheetManual: React.FC = () => {
  const [manual, setManual] = useState('');

  useEffect(() => {
    fetch('/docs/ibsheet-basic-patterns.txt')
      .then(res => res.text())
      .then(setManual);
  }, []);

  const parsed = parseManual(manual);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">IBSheet 메뉴얼</h1>
      {parsed.map((part, idx) =>
        part.type === 'code' ? (
          <SyntaxHighlighter
            key={idx}
            language={part.lang}
            style={oneDark}
            customStyle={{ borderRadius: '8px', fontSize: '0.95em', marginBottom: '1.5rem' }}
          >
            {part.content.trim()}
          </SyntaxHighlighter>
        ) : (
          <div key={idx} className="mb-4 whitespace-pre-wrap text-base text-slate-800">
            {part.content}
          </div>
        )
      )}
    </div>
  );
};

export default IBSheetManual;
