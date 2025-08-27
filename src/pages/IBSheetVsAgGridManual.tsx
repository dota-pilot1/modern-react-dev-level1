import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const compareManual = [
  '# IBSheet vs AG Grid vs React Data Grid 비교 메뉴얼',
  '',
  '대표적인 그리드 라이브러리들의 컬럼/행 설정 방식과 주요 특징을 비교합니다.',
  '',
  '## 1. 컬럼 정의 방식 비교',
  '',
  '### IBSheet',
  '```typescript',
  'const columns = [',
  '  { Header: { Value: "선택", HeaderCheck: 1 }, Type: "Bool", Name: "selected", CanEdit: 1 },',
  '  { Header: "순번", Type: "Int", Name: "SEQ", Width: 60, Align: "Center" },',
  '  { Header: "ID", Type: "Text", Name: "id", Width: 120 },',
  '  { Header: "이름", Type: "Text", Name: "name", Width: 120, CanEdit: 1 },',
  '];',
  '```',
  '',
  '### AG Grid',
  '```typescript',
  'const columnDefs = [',
  '  { headerName: "선택", field: "selected", checkboxSelection: true, editable: true },',
  '  { headerName: "순번", field: "SEQ", width: 60, cellStyle: { textAlign: "center" } },',
  '  { headerName: "ID", field: "id", width: 120 },',
  '  { headerName: "이름", field: "name", width: 120, editable: true },',
  '];',
  '```',
  '',
  '### React Data Grid',
  '```typescript',
  'const columns = [',
  '  { key: "selected", name: "선택", editable: true, formatter: CheckboxFormatter },',
  '  { key: "SEQ", name: "순번", width: 60, resizable: true },',
  '  { key: "id", name: "ID", width: 120 },',
  '  { key: "name", name: "이름", width: 120, editable: true },',
  '];',
  '```',
  '',
  '## 2. 주요 특징 비교',
  '',
  '[TABLE_PLACEHOLDER]',
  '## 3. 결론 및 선택 가이드',
  '- **IBSheet**: 대용량, 고성능, 상용 기능이 필요한 기업/관공서에 적합. React 친화성은 낮음.',
  '- **AG Grid**: 대용량, 고성능, 자유로운 커스터마이즈, React 친화적. 무료/상용 모두 지원.',
  '- **React Data Grid**: React 프로젝트에 가장 자연스럽게 통합, 커스터마이즈와 선언적 코드에 강점. 대용량은 AG Grid/IBSheet에 비해 다소 약함.',
  '',
  '실제 프로젝트 요구사항(성능, 커스터마이즈, 라이선스, React 친화성)에 따라 선택하세요.',
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

const IBSheetVsAgGridManual: React.FC = () => {
  const parsed = parseManual(compareManual);
  // 테이블 데이터 분리
  const table = (
    <table className="w-full text-sm border border-slate-300 rounded mb-6">
      <thead className="bg-slate-100">
        <tr>
          <th className="p-2 border">항목</th>
          <th className="p-2 border">IBSheet</th>
          <th className="p-2 border">AG Grid</th>
          <th className="p-2 border">React Data Grid</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border">컬럼 정의 방식</td>
          <td className="p-2 border">중첩 객체, 타입명</td>
          <td className="p-2 border">선언적, 속성명 명확</td>
          <td className="p-2 border">선언적, React 친화적</td>
        </tr>
        <tr>
          <td className="p-2 border">편집/체크박스</td>
          <td className="p-2 border">Type/CanEdit/HeaderCheck</td>
          <td className="p-2 border">editable/checkboxSelection</td>
          <td className="p-2 border">editable/formatter</td>
        </tr>
        <tr>
          <td className="p-2 border">이벤트 처리</td>
          <td className="p-2 border">onAfterValueChange 등</td>
          <td className="p-2 border">onCellValueChanged 등</td>
          <td className="p-2 border">onRowsChange 등</td>
        </tr>
        <tr>
          <td className="p-2 border">성능/대용량</td>
          <td className="p-2 border">매우 우수(상용)</td>
          <td className="p-2 border">매우 우수(상용/무료)</td>
          <td className="p-2 border">우수(무료)</td>
        </tr>
        <tr>
          <td className="p-2 border">React 친화성</td>
          <td className="p-2 border">낮음(Imperative)</td>
          <td className="p-2 border">높음(Declarative)</td>
          <td className="p-2 border">매우 높음(Declarative)</td>
        </tr>
        <tr>
          <td className="p-2 border">커스터마이즈</td>
          <td className="p-2 border">고급(상용 기능)</td>
          <td className="p-2 border">매우 자유로움</td>
          <td className="p-2 border">JSX 기반 자유로움</td>
        </tr>
        <tr>
          <td className="p-2 border">라이선스/비용</td>
          <td className="p-2 border">상용</td>
          <td className="p-2 border">무료/상용</td>
          <td className="p-2 border">무료</td>
        </tr>
      </tbody>
    </table>
  );
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">IBSheet vs AG Grid vs React Data Grid 비교 메뉴얼</h1>
      {parsed.map((part, idx) =>
        part.type === 'code' ? (
          <SyntaxHighlighter
            key={idx}
            language={part.lang}
            style={oneDark}
            customStyle={{ borderRadius: '8px', fontSize: '0.95em', marginBottom: '1.5rem', width: '100%' }}
          >
            {part.content.trim()}
          </SyntaxHighlighter>
        ) : (
          <div key={idx} className="mb-4 whitespace-pre-wrap text-base text-slate-800">
            {/* 주요 특징 비교 테이블 위치에만 table 삽입 */}
            {part.content.includes('[TABLE_PLACEHOLDER]')
              ? <>{part.content.replace('[TABLE_PLACEHOLDER]', '')}{table}</>
              : part.content}
          </div>
        )
      )}
    </div>
  );
};

export default IBSheetVsAgGridManual;
