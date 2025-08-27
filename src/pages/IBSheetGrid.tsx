import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import IBSheetLoader from '@ibsheet/loader';

// 기본 IBSheet 예제
const IBSheetGrid = () => {
  const title = '기본 예제';
  const subTitle = 'IBSheet의 기본적인 사용법을 보여주는 예제입니다.';
  
  const sheetRef = useRef<any>(null);
  const createdRef = useRef(false); // StrictMode 중복 생성 방지
  const [checkedCount, setCheckedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0); // 동적 총 행수

  // 샘플 데이터 (초기 렌더용)
  const sampleData = useMemo(() => [
    { SEQ: 1, id: '1', name: '김철수', email: 'kim@example.com', department: '개발팀', position: '시니어 개발자', joinDate: '2020-03-15', salary: 5500, status: '재직', selected: 0 },
    { SEQ: 2, id: '2', name: '이영희', email: 'lee@example.com', department: '디자인팀', position: 'UI/UX 디자이너', joinDate: '2021-07-22', salary: 4800, status: '재직', selected: 0 },
    { SEQ: 3, id: '3', name: '박민수', email: 'park@example.com', department: '마케팅팀', position: '마케팅 매니저', joinDate: '2019-11-08', salary: 6200, status: '재직', selected: 0 },
    { SEQ: 4, id: '4', name: '최지은', email: 'choi@example.com', department: '인사팀', position: '인사 담당자', joinDate: '2022-01-10', salary: 4200, status: '재직', selected: 0 },
    { SEQ: 5, id: '5', name: '정태윤', email: 'jung@example.com', department: '개발팀', position: '주니어 개발자', joinDate: '2023-05-03', salary: 3800, status: '재직', selected: 0 }
  ], []);

  // 원격 라이브러리 baseUrl (404 방지: Cfg.BaseUrl 명시)
  const remoteBaseUrl = 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/assets/ibsheet/';

  // 체크 카운트 갱신 함수 (다른 이벤트에서도 공통 사용)
  const updateCheckedCount = useCallback((sheet?: any) => {
    const s = sheet || sheetRef.current;
    if (!s) return;
    const rows = s.getDataRows();
    const count = rows.filter((r: any) => {
      const v = s.getValue(r, 'selected');
      return v === 1 || v === true || v === '1' || v === 'Y' || v === 'T';
    }).length;
    setCheckedCount(count);
    setTotalCount(rows.length);
  }, []);

  // 시트 옵션 (Data 직접 반영) - 이벤트는 여기서 미리 등록 (create 이후 동적 추가 X)
  const sheetOptions = useMemo(() => ({
    Cfg: {
      SearchMode: 0,            // loadSearchData / createSheet data 사용
      CustomScroll: 1,
      Style: 'IBMR',
      NoDataMessage: 3,
      NoDataMiddle: true,
      HeaderMerge: 3,
      InfoRowConfig: { Visible: false },
      BaseUrl: remoteBaseUrl
    },
    LeftCols: [
      { Header: ['No', 'No'], Type: 'Int', Name: 'SEQ', Width: 60, Align: 'Center' }
    ],
    Cols: [
      { Header: { Value: '선택', HeaderCheck: 1 }, Type: 'Bool', Name: 'selected', Width: 60, Align: 'Center', CanEdit: 1, TrueValue: 1, FalseValue: 0 },
      { Header: ['ID', 'ID'], Type: 'Text', Name: 'id', Width: 80, Align: 'Center', CanEdit: 0 },
      { Header: ['이름', '이름'], Type: 'Text', Name: 'name', Width: 120, Align: 'Left', Required: 1 },
      { Header: ['이메일', '이메일'], Type: 'Text', Name: 'email', Width: 200, Align: 'Left', Required: 1 },
      { Header: ['부서', '부서'], Type: 'Text', Name: 'department', Width: 120, Align: 'Center' },
      { Header: ['직급', '직급'], Type: 'Text', Name: 'position', Width: 140, Align: 'Center' },
      { Header: ['입사일', '입사일'], Type: 'Date', Name: 'joinDate', Width: 120, Align: 'Center', Format: 'yyyy-mm-dd' },
      { Header: ['급여', '급여'], Type: 'Int', Name: 'salary', Width: 100, Align: 'Right', Format: '#,### \\원' },
      { Header: ['상태', '상태'], Type: 'Enum', Name: 'status', Width: 80, Align: 'Center', Enum: '재직|휴직|퇴사', EnumKeys: '1|2|3' }
  ],
    Events: {
      // 최초 렌더 끝
      onRenderFirstFinish: (evt: any) => {
        console.log('초기 렌더 완료', evt.sheet.id);
        updateCheckedCount(evt.sheet);
        return '';
      },
      // 값이 실제로 변경된 직후 (편집 & Bool 클릭 포함)
      onAfterValueChange: (evt: any) => {
        if (evt.col === 'selected') {
          console.log('onAfterValueChange selected', evt.value);
          updateCheckedCount(evt.sheet);
        }
        return '';
      },
      // 셀 클릭 (값 토글 직전일 수 있으므로 비동기 처리)
      onClickCell: (evt: any) => {
        if (evt.col === 'selected') {
          setTimeout(() => updateCheckedCount(evt.sheet), 0);
        }
        return '';
      },
      // 헤더 체크박스 클릭 (HeaderCheck=1) 후 전체 토글 상황 커버
      onAfterClick: (evt: any) => {
        if (evt.col === 'selected' && evt.type === 'Header') {
          setTimeout(() => updateCheckedCount(evt.sheet), 0);
        }
        return '';
      }
    }
  }), [remoteBaseUrl, updateCheckedCount, sampleData]);

  // 시트 생성 (중복 방지)
  useEffect(() => {
    const elId = 'basicSheet';
    if (createdRef.current) return; // 이미 생성
    const host = document.getElementById(elId);
    if (!host) return; // 아직 DOM 없음

    const create = () => {
      if (createdRef.current) return;
      IBSheetLoader.createSheet({ el: elId, options: sheetOptions, data: sampleData })
        .then((sheet: any) => {
          if (createdRef.current) return;
            createdRef.current = true;
            sheetRef.current = sheet;
            console.log('시트 생성 및 데이터 로드 완료', sheet.id);
            // create 후 1회 보정 (이벤트에서도 수행하지만 안전하게 호출)
            updateCheckedCount(sheet);
            setTotalCount(sheet.getDataRows().length);
        })
        .catch(err => console.error('시트 생성 실패', err));
    };

    if (typeof (IBSheetLoader as any).isLoaded === 'function' && (IBSheetLoader as any).isLoaded('ibsheet')) {
      create();
    } else {
      IBSheetLoader.once('loaded', (e: any) => {
        if (e.target?.alias === 'ibsheet') create();
      });
    }

    return () => {
      // 언마운트 시 제거 (StrictMode 두 번 호출 대비 ref 체크)
      if (sheetRef.current) {
        IBSheetLoader.removeSheet(sheetRef.current.id);
        sheetRef.current = null;
        createdRef.current = false;
      }
    };
  }, [sheetOptions]);

  // 버튼 핸들러들
  const resequence = (sheet: any) => {
    const rows = sheet.getDataRows();
    rows.forEach((r: any, idx: number) => sheet.setValue(r, 'SEQ', idx + 1, 1));
  };

  const handleAddRow = () => {
  const sheet = sheetRef.current;
  if (!sheet) return;
  sheet.addRow({
      SEQ: sheet.getDataRows().length + 1,
      id: String(Date.now()),
      name: '',
      email: '',
      department: '',
      position: '',
      joinDate: new Date().toISOString().split('T')[0],
      salary: 0,
      status: '재직',
      selected: 0
    });
  updateCheckedCount(sheet);
  };

  const handleDeleteRow = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    console.log('[삭제] 현재 데이터 행 수:', sheet.getDataRows().length);
    const rows = sheet.getDataRows().filter((r: any) => {
      const raw = sheet.getValue(r, 'selected');
      const checked = raw === 1 || raw === true || raw === '1' || raw === 'Y' || raw === 'T';
      console.log(' row', sheet.getValue(r,'id'), 'selected raw=', raw, '->', checked);
      return checked;
    });
    console.log('[삭제] 판단된 체크 행 수:', rows.length);
    if (!rows.length) {
      alert('체크박스로 삭제할 행을 선택하세요.');
      return;
    }
  sheet.deleteRow(rows);
  resequence(sheet);
  console.log('[삭제] 삭제 후 행 수:', sheet.getDataRows().length);
  updateCheckedCount(sheet);
  };

  const handleSave = () => {
    if (sheetRef.current) {
      const saveData = sheetRef.current.getSaveJson();
      console.log('저장 데이터:', saveData);
      alert('저장되었습니다. (콘솔 확인)');
    }
  };

  const handleReload = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
  sheet.loadSearchData(sampleData);
  resequence(sheet);
  updateCheckedCount(sheet);
  };

  const handleClear = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
  sheet.loadSearchData([]);
  updateCheckedCount(sheet);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{subTitle}</p>
      </div>

      {/* 버튼 영역 */}
  <div className="mb-2 text-sm text-gray-700">체크된 행: <span className="font-semibold">{checkedCount}</span> / {totalCount}</div>
  <div className="mb-4 flex flex-wrap gap-2 items-center">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          행 추가
        </button>
        <button
          onClick={handleDeleteRow}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          행 삭제
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          저장
        </button>
        <button
          onClick={handleReload}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          다시 로드
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          전체 삭제
        </button>
      </div>

      {/* IBSheet 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative">
        <div id="basicSheet" style={{ width: '100%', height: '500px' }} />
      </div>

      {/* 사용법 안내 */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">사용법 안내</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">기본 조작</h4>
            <ul className="space-y-1">
              <li>• 셀 더블클릭: 편집 모드</li>
              <li>• 체크박스: 행 선택</li>
              <li>• 헤더 클릭: 정렬</li>
              <li>• 열 경계 드래그: 크기 조정</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">컬럼 유형</h4>
            <ul className="space-y-1">
              <li>• Text: 일반 텍스트</li>
              <li>• Date: 날짜 (yyyy-mm-dd)</li>
              <li>• Int: 정수 (급여)</li>
              <li>• Enum: 선택형 (상태)</li>
              <li>• Bool: 체크박스 (선택)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IBSheetGrid;
