import React, { useRef, useMemo, useState } from 'react';
import { IBSheetReact } from '@ibsheet/react';

const IBSheetGrid: React.FC = () => {
  const sheetRef = useRef<any>(null);
  const [checkedCount, setCheckedCount] = useState(0);

  const sampleData = useMemo(() => [
    { SEQ: 1, id: '1', name: '김철수', selected: 0 },
    { SEQ: 2, id: '2', name: '이영희', selected: 0 },
    { SEQ: 3, id: '3', name: '박민수', selected: 0 }
  ], []);

  // 체크된 행 수 업데이트 함수
  const updateCheckedCount = (sheet: any) => {
    if (!sheet) return;
    const rows = sheet.getDataRows();
    const count = rows.filter((r: any) => {
      const v = sheet.getValue(r, 'selected');
      return v === 1 || v === true || v === '1';
    }).length;
    setCheckedCount(count);
  };

  // 체크된 행 삭제
  const handleDeleteChecked = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    
    const checkedRows = sheet.getDataRows().filter((r: any) => {
      const v = sheet.getValue(r, 'selected');
      return v === 1 || v === true || v === '1';
    });
    
    if (checkedRows.length === 0) {
      alert('삭제할 행을 체크해주세요.');
      return;
    }
    
    sheet.deleteRow(checkedRows);
    updateCheckedCount(sheet);
    console.log(`[삭제] ${checkedRows.length}개 행 삭제됨`);
  };

  // 새 행 추가
  const handleAddRow = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    
    const newRowData = {
      SEQ: sheet.getDataRows().length + 1,
      id: `new_${Date.now()}`,
      name: '새 사용자',
      selected: 0
    };
    
    sheet.addRow(newRowData);
    updateCheckedCount(sheet);
    console.log('[추가] 새 행 추가됨');
  };

  const options = useMemo(() => ({
    Cfg: {
      SearchMode: 0,
      Style: 'IBMR',
      BaseUrl: 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/assets/ibsheet/'
    },
    Cols: [
      { Header: { Value: '선택', HeaderCheck: 1 }, Type: 'Bool', Name: 'selected', Width: 60, Align: 'Center', CanEdit: 1 },
      { Header: 'No', Type: 'Int', Name: 'SEQ', Width: 60, Align: 'Center' },
      { Header: 'ID', Type: 'Text', Name: 'id', Width: 80, Align: 'Center' },
      { Header: '이름', Type: 'Text', Name: 'name', Width: 140, Align: 'Left' }
    ],
    Events: {
      onRenderFirstFinish: (evt: any) => { 
        console.log('[IBSheetReact] render finish rows=', evt.sheet.getDataRows().length); 
        updateCheckedCount(evt.sheet);
        return ''; 
      },
      onAfterValueChange: (evt: any) => {
        if (evt.col === 'selected') {
          console.log('[IBSheetReact] checkbox changed');
          updateCheckedCount(evt.sheet);
        }
        return '';
      }
    }
  }), []);

  // 기존 모든 조작 버튼 제거: 데이터 로딩 여부만 검증

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">IBSheet React 체크박스 예제</h1>
        <p className="text-sm text-gray-600">체크박스를 선택하고 삭제 버튼으로 행을 삭제할 수 있습니다.</p>
      </div>

      {/* 체크 상태 및 버튼 */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm">체크된 행: <strong>{checkedCount}</strong>개</span>
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          행 추가
        </button>
        <button
          onClick={handleDeleteChecked}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          체크된 행 삭제
        </button>
      </div>

      {/* IBSheet 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative" style={{height:'400px'}}>
        <IBSheetReact
          options={options as any}
          sync={false}
          instance={(sheet) => { 
            sheetRef.current = sheet; 
            // 초기 데이터 로드 (data prop 대신 수동 로드)
            setTimeout(() => {
              sheet.loadSearchData(sampleData);
              updateCheckedCount(sheet);
            }, 100);
            console.log('[IBSheetReact] instance set'); 
          }}
          style={{ width:'100%', height:'100%' }}
        />
      </div>

  {/* 안내 제거 */}
    </div>
  );
};

export default IBSheetGrid;
