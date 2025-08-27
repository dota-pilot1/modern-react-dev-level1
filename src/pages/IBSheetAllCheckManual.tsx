import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const allCheckManual = [
  '# IBSheet 전체 체크/해제(헤더 체크박스) 메뉴얼',
  '',
  'IBSheet에서 전체 행을 체크하거나 해제하는 로직과 이벤트 활용 패턴을 정리합니다.',
  '',
  '## 1. Bool 컬럼에 HeaderCheck 옵션 사용',
  '',
  '```typescript',
  '{ Header: { Value: "선택", HeaderCheck: 1 }, Type: "Bool", Name: "selected", CanEdit: 1 }',
  '```',
  '',
  '헤더에 체크박스가 표시되며, 클릭 시 전체 행이 체크/해제됩니다.',
  '',
  '## 2. 전체 체크/해제 이벤트 감지',
  '',
  '```typescript',
  'Events: {',
  '  onAfterValueChange: (evt) => {',
  '    if (evt.col === "selected" && evt.row === "Header") {',
  '      // 전체 체크/해제됨',
  '      const checked = evt.value === 1;',
  '      console.log("전체 체크 상태:", checked);',
  '    }',
  '    return "";',
  '  }',
  '}',
  '```',
  '',
  '## 3. 전체 체크/해제 상태에 따른 행별 값 처리',
  '',
  '```typescript',
  'const rows = sheet.getDataRows();',
  'const checkedRows = rows.filter(row => sheet.getValue(row, "selected") === 1);',
  'const uncheckedRows = rows.filter(row => sheet.getValue(row, "selected") === 0);',
  '```',
  '',
  '## 4. 실무 팁',
  '- HeaderCheck: 1 옵션만 주면 IBSheet가 자동으로 전체 체크/해제 로직을 처리',
  '- onAfterValueChange에서 row === "Header"로 전체 체크/해제 이벤트를 구분',
  '- 전체 체크/해제 후 checkedRows/uncheckedRows로 실시간 상태 파악 가능',
  '- 필요시 checkedRows를 활용해 일괄 처리(삭제, 업데이트 등) 가능',
].join('\n');

function parseManual(text: string) {
  const CODE_BLOCK_REGEX = /```(\w+)?([\s\S]*?)```/g;
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

const IBSheetAllCheckManual: React.FC = () => {
  const parsed = parseManual(allCheckManual);
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">IBSheet 전체 체크/해제 메뉴얼</h1>
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

export default IBSheetAllCheckManual;
