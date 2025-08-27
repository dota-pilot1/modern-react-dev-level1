import React, { useRef, useMemo, useState, useEffect } from 'react';
import IBSheetLoader from '@ibsheet/loader';

const IBSheetGrid: React.FC = () => {
  const sheetRef = useRef<any>(null);
  const createdRef = useRef(false);
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
    
    // 모든 데이터 행 가져오기
    const allRows = sheet.getDataRows();
    console.log('[삭제 시작] 전체 행 수:', allRows.length);
    
    // 체크되지 않은 행들만 필터링
    const remainingData = allRows.filter((r: any) => {
      const v = sheet.getValue(r, 'selected');
      const isChecked = v === 1 || v === true || v === '1';
      console.log(`행 ${sheet.getValue(r, 'id')}: selected=${v}, isChecked=${isChecked}`);
      return !isChecked; // 체크되지 않은 행만 유지
    }).map((r: any) => {
      // 각 행의 데이터를 객체로 변환
      return {
        SEQ: sheet.getValue(r, 'SEQ'),
        id: sheet.getValue(r, 'id'),
        name: sheet.getValue(r, 'name'),
        selected: 0 // 체크 상태 초기화
      };
    });
    
    console.log('[삭제 결과] 남은 행 수:', remainingData.length);
    
    if (allRows.length === remainingData.length) {
      alert('삭제할 행을 체크해주세요.');
      return;
    }
    
    // 전체 데이터를 새로운 데이터로 교체
    sheet.loadSearchData(remainingData);
    
    // SEQ 재정렬
    const newRows = sheet.getDataRows();
    newRows.forEach((r: any, idx: number) => {
      sheet.setValue(r, 'SEQ', idx + 1, 1);
    });
    
    updateCheckedCount(sheet);
    console.log(`[삭제 완료] ${allRows.length - remainingData.length}개 행 삭제됨`);
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
        console.log('[IBSheet] render finish rows=', evt.sheet.getDataRows().length); 
        updateCheckedCount(evt.sheet);
        return ''; 
      },
      onAfterValueChange: (evt: any) => {
        if (evt.col === 'selected') {
          console.log('[IBSheet] checkbox changed');
          updateCheckedCount(evt.sheet);
        }
        return '';
      }
    }
  }), []);

  // 시트 생성
  useEffect(() => {
    const elId = 'basicSheet';
    if (createdRef.current) return;
    const host = document.getElementById(elId);
    if (!host) return;

    const create = () => {
      if (createdRef.current) return;
      console.log('[IBSheet] createSheet 호출');
      IBSheetLoader.createSheet({ el: elId, options, data: sampleData })
        .then((sheet: any) => {
          createdRef.current = true;
          sheetRef.current = sheet;
          console.log('[IBSheet] 시트 생성 성공, rows=', sheet.getDataRows().length);
          updateCheckedCount(sheet);
        })
        .catch(err => {
          console.error('[IBSheet] 시트 생성 실패', err);
        });
    };

    if ((IBSheetLoader as any).isLoaded?.('ibsheet')) {
      console.log('[IBSheet] 라이브러리 이미 로드됨');
      create();
    } else {
      console.log('[IBSheet] 라이브러리 로드 대기');
      IBSheetLoader.once('loaded', (e: any) => {
        console.log('[IBSheet] loaded 이벤트', e.target?.alias);
        if (e.target?.alias === 'ibsheet') create();
      });
      try { (IBSheetLoader as any).load?.('ibsheet'); } catch {}
    }

    return () => {
      if (sheetRef.current) {
        IBSheetLoader.removeSheet(sheetRef.current.id);
        sheetRef.current = null;
        createdRef.current = false;
      }
    };
  }, [options, sampleData]);

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
      {/* IBSheet 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative" style={{height:'400px'}}>
        <div id="basicSheet" style={{ width: '100%', height: '100%' }} />
      </div>  {/* 안내 제거 */}
    </div>
  );
};

export default IBSheetGrid;
