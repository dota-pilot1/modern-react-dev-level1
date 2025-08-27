import React, { useEffect, useRef, useMemo } from 'react';
import IBSheetLoader from '@ibsheet/loader';

const IBSheetGrid = () => {
  const sheetRef = useRef<any>(null);
  const createdRef = useRef(false);

  const sampleData = useMemo(() => [
    { SEQ: 1, id: '1', name: '김철수' },
    { SEQ: 2, id: '2', name: '이영희' },
    { SEQ: 3, id: '3', name: '박민수' }
  ], []);

  const remoteBaseUrl = 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/assets/ibsheet/';

  const sheetOptions = useMemo(() => ({
    Cfg: {
      SearchMode: 0,
      Style: 'IBMR',
      BaseUrl: remoteBaseUrl
    },
    Cols: [
      { Header: 'No', Type: 'Int', Name: 'SEQ', Width: 60, Align: 'Center' },
      { Header: 'ID', Type: 'Text', Name: 'id', Width: 80, Align: 'Center' },
      { Header: '이름', Type: 'Text', Name: 'name', Width: 140, Align: 'Left' }
    ],
    Events: {
      onRenderFirstFinish: (evt: any) => {
        console.log('[IBSheet] 렌더 완료 sheetId=', evt.sheet.id, 'rowCount=', evt.sheet.getDataRows().length);
        return '';
      }
    }
  }), [remoteBaseUrl]);

  useEffect(() => {
    const elId = 'basicSheet';
    if (createdRef.current) return;
    const host = document.getElementById(elId);
    if (!host) return;

    const create = () => {
      if (createdRef.current) return;
      console.log('[IBSheet] createSheet 호출');
      IBSheetLoader.createSheet({ el: elId, options: sheetOptions, data: sampleData })
        .then((sheet: any) => {
          createdRef.current = true;
          sheetRef.current = sheet;
          console.log('[IBSheet] 시트 생성 성공 id=', sheet.id, 'rows=', sheet.getDataRows().length);
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
      if (sheetRef.current) IBSheetLoader.removeSheet(sheetRef.current.id);
      sheetRef.current = null;
      createdRef.current = false;
    };
  }, [sheetOptions, sampleData]);

  // 기존 모든 조작 버튼 제거: 데이터 로딩 여부만 검증

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">IBSheet 최소 로딩 테스트</h1>
        <p className="text-sm text-gray-600">콘솔 로그로 로딩 여부 확인 (createSheet / 렌더 완료 / 행 수)</p>
      </div>

      {/* IBSheet 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative">
        <div id="basicSheet" style={{ width: '100%', height: '500px' }} />
      </div>

  {/* 안내 제거 */}
    </div>
  );
};

export default IBSheetGrid;
