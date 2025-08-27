import React, { useRef, useMemo } from 'react';
import { IBSheetReact } from '@ibsheet/react';

const IBSheetGrid: React.FC = () => {
  const sheetRef = useRef<any>(null);

  const sampleData = useMemo(() => [
    { SEQ: 1, id: '1', name: '김철수' },
    { SEQ: 2, id: '2', name: '이영희' },
    { SEQ: 3, id: '3', name: '박민수' }
  ], []);

  const options = useMemo(() => ({
    Cfg: {
      SearchMode: 0,
      Style: 'IBMR',
      BaseUrl: 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/assets/ibsheet/'
    },
    Cols: [
      { Header: 'No', Type: 'Int', Name: 'SEQ', Width: 60, Align: 'Center' },
      { Header: 'ID', Type: 'Text', Name: 'id', Width: 80, Align: 'Center' },
      { Header: '이름', Type: 'Text', Name: 'name', Width: 140, Align: 'Left' }
    ],
    Events: {
      onRenderFirstFinish: (evt: any) => { console.log('[IBSheetReact] render finish', evt.sheet.id, 'rows=', evt.sheet.getDataRows().length); return ''; }
    }
  }), []);

  // 기존 모든 조작 버튼 제거: 데이터 로딩 여부만 검증

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">IBSheet 최소 로딩 테스트</h1>
        <p className="text-sm text-gray-600">콘솔 로그로 로딩 여부 확인 (createSheet / 렌더 완료 / 행 수)</p>
      </div>

      {/* IBSheet 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative" style={{height:'400px'}}>
        <IBSheetReact
          options={options as any}
          data={sampleData}
          instance={(sheet) => { sheetRef.current = sheet; console.log('[IBSheetReact] instance set'); }}
          style={{ width:'100%', height:'100%' }}
        />
      </div>

  {/* 안내 제거 */}
    </div>
  );
};

export default IBSheetGrid;
