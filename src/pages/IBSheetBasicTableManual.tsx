import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const basicTableManual = [
  '# IBSheet 기본 조회 및 테이블 컬럼/행 데이터 설정 메뉴얼',
  '',
  'IBSheet에서 테이블을 생성하고 컬럼/행 데이터를 설정하는 기본 패턴을 정리합니다.',
  '',
  '## 1. 컬럼(Cols) 설정',
  '',
  '```typescript',
  'const columns = [',
  '  { Header: { Value: "선택", HeaderCheck: 1 }, Type: "Bool", Name: "selected", CanEdit: 1 },',
  '  { Header: "순번", Type: "Int", Name: "SEQ", Width: 60, Align: "Center" },',
  '  { Header: "ID", Type: "Text", Name: "id", Width: 120 },',
  '  { Header: "이름", Type: "Text", Name: "name", Width: 120, CanEdit: 1 },',
  '  // ... 기타 컬럼',
  '];',
  '```',
  '',
  '## 2. 행 데이터 설정',
  '',
  '```typescript',
  'const data = [',
  '  { SEQ: 1, id: "1", name: "김철수", selected: 0 },',
  '  { SEQ: 2, id: "2", name: "이영희", selected: 1 },',
  '  { SEQ: 3, id: "3", name: "박민수", selected: 0 },',
  '  // ... 기타 행',
  '];',
  '```',
  '',
  '## 3. 시트 옵션 및 생성',
  '',
  '```typescript',
  'const options = {',
  '  Cfg: {',
  '    SearchMode: 0,',
  '    Style: "IBMR",',
  '    BaseUrl: "CDN주소"',
  '  },',
  '  Cols: columns,',
  '  Events: {',
  '    onRenderFirstFinish: (evt) => {',
  '      console.log("렌더 완료");',
  '      return "";',
  '    }',
  '  }',
  '};',
  '',
  'IBSheetLoader.createSheet({ el: "sheetContainer", options, data })',
  '  .then(sheet => {',
  '    // 시트 인스턴스 활용',
  '  });',
  '```',
  '',
  '## 4. 실무 팁',
  '- 컬럼 순서, 너비, 편집 가능 여부 등은 옵션으로 자유롭게 설정',
  '- 행 데이터는 서버에서 받아와서 동적으로 할당 가능',
  '- Bool 타입 컬럼은 체크박스, Int/Float는 숫자, Text는 문자열 입력',
  '- onRenderFirstFinish 등 이벤트에서 초기화/조회 후처리 가능',
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

const IBSheetBasicTableManual: React.FC = () => {
  const parsed = parseManual(basicTableManual);
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">IBSheet 기본 조회 및 테이블 설정 메뉴얼</h1>
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

export default IBSheetBasicTableManual;
