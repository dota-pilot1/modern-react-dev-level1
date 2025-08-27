import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const cellUpdateManual = [
  '# IBSheet 셀 업데이트(값 변경) 메뉴얼',
  '',
  'IBSheet에서 셀 값을 업데이트(수정)하는 기본 로직과 이벤트 활용 패턴을 정리합니다.',
  '',
  '## 1. 셀 값 직접 변경',
  '',
  '```typescript',
  'sheet.setValue(row, colName, newValue, 1); // 1: 이벤트 발생',
  '```',
  '',
  '## 2. 예시: 특정 행의 이름 변경',
  '',
  '### (1) 첫 번째 행의 name 변경',
  '```typescript',
  'const row = sheet.getDataRows()[0]; // 첫 번째 데이터 행의 row id',
  'sheet.setValue(row, "name", "홍길동", 1);',
  '```',
  '',
  '### (2) 조건에 맞는 행(row id) 찾기',
  '```typescript',
  'const rows = sheet.getDataRows();',
  'const targetRow = rows.find(row => sheet.getValue(row, "id") === "2");',
  'if (targetRow) {',
  '  sheet.setValue(targetRow, "name", "홍길동", 1);',
  '}',
  '```',
  '',
  '※ IBSheet에서 행(row)은 index가 아니라 row id(고유값)로 접근합니다.',
  '※ 원하는 행을 찾으려면 getDataRows()로 전체 row id를 받아 조건에 맞게 검색해야 합니다.',
  '',
  '## 3. onAfterValueChange 이벤트 활용',
  '',
  '```typescript',
  'const options = {',
  '  // ...existing code...',
  '  Events: {',
  '    onAfterValueChange: (evt) => {',
  '      if (evt.col === "name") {',
  '        console.log("이름 변경됨:", evt.value);',
  '      }',
  '      return "";',
  '    }',
  '  }',
  '};',
  '```',
  '',
  '## 4. 실무 팁',
  '- setValue의 마지막 인자(1)는 이벤트 발생 여부, 0이면 이벤트 미발생',
  '- onAfterValueChange에서 변경된 값, 행, 컬럼명 등 확인 가능',
  '- 서버 반영이 필요한 경우 이벤트에서 API 호출 가능',
  '- 여러 셀 동시 업데이트는 반복문 활용',
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

const IBSheetCellUpdateManual: React.FC = () => {
  const parsed = parseManual(cellUpdateManual);
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">IBSheet 셀 업데이트(값 변경) 메뉴얼</h1>
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

export default IBSheetCellUpdateManual;
