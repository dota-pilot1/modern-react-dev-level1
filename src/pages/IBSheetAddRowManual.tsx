import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const addRowManual = [
  '# IBSheet 행 추가 메뉴얼',
  '',
  'IBSheet에서 행을 추가하는 기본 로직과 실전 패턴을 정리합니다.',
  '',
  '## 1. 기본 행 추가 로직',
  '',
  '```typescript',
  'const handleAddRow = () => {',
  '  const sheet = sheetRef.current;',
  '  if (!sheet) return;',
  '  ',
  '  const newRowData = {',
  '    SEQ: sheet.getDataRows().length + 1,',
  '    id: "new_" + Date.now(),',
  "    name: '',", 
  '    // ... 기타 필드',
  '  };',
  '  ',
  '  sheet.addRow(newRowData);',
  '};',
  '```',
  '',
  '## 2. 실전 패턴',
  '- SEQ(순번) 자동 증가',
  '- id는 고유값(타임스탬프 등)으로 생성',
  '- 기타 필드는 필요에 따라 추가',
  '- 추가 후 sheet.getDataRows()로 전체 행 확인 가능',
  '',
  '## 3. 주의사항',
  '- sheet 인스턴스가 null이 아닌지 반드시 체크',
  '- StrictMode 환경에서는 중복 생성 방지',
  '- 추가 후 SEQ 재정렬 필요시 별도 로직 추가',
  '',
  '## 4. 확장 예시: 여러 행 동시 추가',
  '',
  '```typescript',
  'const handleAddRows = (rows) => {',
  '  const sheet = sheetRef.current;',
  '  if (!sheet) return;',
  '  sheet.addRows(rows);',
  '};',
  '```',
  '',
  '## 5. 실무 팁',
  '- 행 추가 후 포커스 이동, 스크롤 등 UX 개선 가능',
  '- 추가된 행에 기본값/초기값 세팅 가능',
].join('\n');

const IBSheetAddRowManual: React.FC = () => {
  // 마크다운과 코드 하이라이트 분리 렌더링
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
  const parsed = parseManual(addRowManual);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">IBSheet 행 추가 메뉴얼</h1>
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

export default IBSheetAddRowManual;
