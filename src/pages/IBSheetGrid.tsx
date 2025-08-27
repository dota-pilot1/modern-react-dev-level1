import React, { useMemo, useRef, useCallback, useState } from 'react';
import { IBSheetReact } from '@ibsheet/react';

// 기본 IBSheet 예제
const IBSheetGrid = () => {
  const title = '기본 예제';
  const subTitle = 'IBSheet의 기본적인 사용법을 보여주는 예제입니다.';
  
  const sheetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 시트 옵션 설정
  const sheetOptions = useMemo(() => ({
    Cfg: {
      SearchMode: 0,        // 일반 모드
      CustomScroll: 1,      // 커스텀 스크롤
      Style: 'IBMR',        // 스타일
      NoDataMessage: 3,     // 데이터 없을 때 메시지
      NoDataMiddle: true,   // 메시지 중앙 정렬
      HeaderMerge: 3,       // 헤더 병합 허용
      InfoRowConfig: { Visible: false } // 정보 행 숨김
    },
    LeftCols: [
      {
        Header: ['No', 'No'],
        Type: 'Int',
        Name: 'SEQ',
        Width: 60,
        Align: 'Center'
      }
    ],
    Cols: [
      {
        Header: ['선택', '선택'],
        Type: 'Bool',
        Name: 'selected',
        Width: 60,
        Align: 'Center'
      },
      {
        Header: ['ID', 'ID'],
        Type: 'Text',
        Name: 'id',
        Width: 80,
        Align: 'Center',
        CanEdit: 0
      },
      {
        Header: ['이름', '이름'],
        Type: 'Text',
        Name: 'name',
        Width: 120,
        Align: 'Left',
        Required: 1
      },
      {
        Header: ['이메일', '이메일'],
        Type: 'Text',
        Name: 'email',
        Width: 200,
        Align: 'Left',
        Required: 1
      },
      {
        Header: ['부서', '부서'],
        Type: 'Text',
        Name: 'department',
        Width: 120,
        Align: 'Center'
      },
      {
        Header: ['직급', '직급'],
        Type: 'Text',
        Name: 'position',
        Width: 140,
        Align: 'Center'
      },
      {
        Header: ['입사일', '입사일'],
        Type: 'Date',
        Name: 'joinDate',
        Width: 120,
        Align: 'Center',
        Format: 'yyyy-mm-dd'
      },
      {
        Header: ['급여', '급여'],
        Type: 'Int',
        Name: 'salary',
        Width: 100,
        Align: 'Right',
        Format: '#,### \\원'
      },
      {
        Header: ['상태', '상태'],
        Type: 'Enum',
        Name: 'status',
        Width: 80,
        Align: 'Center',
        Enum: '재직|휴직|퇴사',
        EnumKeys: '1|2|3'
      }
    ]
  }), []);

  // 샘플 데이터
  const sampleData = useMemo(() => [
    { SEQ: 1, id: "1", name: "김철수", email: "kim@example.com", department: "개발팀", position: "시니어 개발자", joinDate: "2020-03-15", salary: 5500, status: "재직" },
    { SEQ: 2, id: "2", name: "이영희", email: "lee@example.com", department: "디자인팀", position: "UI/UX 디자이너", joinDate: "2021-07-22", salary: 4800, status: "재직" },
    { SEQ: 3, id: "3", name: "박민수", email: "park@example.com", department: "마케팅팀", position: "마케팅 매니저", joinDate: "2019-11-08", salary: 6200, status: "재직" },
    { SEQ: 4, id: "4", name: "최지은", email: "choi@example.com", department: "인사팀", position: "인사 담당자", joinDate: "2022-01-10", salary: 4200, status: "재직" },
    { SEQ: 5, id: "5", name: "정태윤", email: "jung@example.com", department: "개발팀", position: "주니어 개발자", joinDate: "2023-05-03", salary: 3800, status: "재직" }
  ], []);

  // 시트 인스턴스 생성 시 호출
  const onInstance = useCallback((sheet: any) => {
    if (!sheet) return;
    
    sheetRef.current = sheet;
    console.log('IBSheet instance created:', sheet.id);
    
    // 이벤트 핸들러 설정
    sheet.options.Events = {
      onAfterEdit: (evt: any) => {
        console.log('Cell edited:', evt);
      },
      onBeforeAdd: (evt: any) => {
        console.log('Before add row:', evt);
      },
      onAfterAdd: (evt: any) => {
        console.log('After add row:', evt);
      }
    };
    
    // 초기 데이터 로드
    setIsLoading(true);
    setTimeout(() => {
      if (sampleData.length > 0) {
        sheet.loadSearchData(sampleData);
      }
      setIsLoading(false);
    }, 500);
  }, [sampleData]);

  // 버튼 핸들러들
  const handleAddRow = () => {
    if (sheetRef.current) {
      const newRow = {
        SEQ: sheetRef.current.getDataRows().length + 1,
        id: String(Date.now()),
        name: '',
        email: '',
        department: '',
        position: '',
        joinDate: new Date().toISOString().split('T')[0],
        salary: 0,
        status: '재직'
      };
      sheetRef.current.addRow(newRow);
    }
  };

  const handleDeleteRow = () => {
    if (sheetRef.current) {
      const selectedRows = sheetRef.current.getSelectedRows();
      if (selectedRows.length > 0) {
        sheetRef.current.deleteRow(selectedRows);
      } else {
        alert('삭제할 행을 선택해주세요.');
      }
    }
  };

  const handleSave = () => {
    if (sheetRef.current) {
      const saveData = sheetRef.current.getSaveJson();
      console.log('저장 데이터:', saveData);
      alert('저장되었습니다. (콘솔 확인)');
    }
  };

  const handleReload = () => {
    if (sheetRef.current) {
      setIsLoading(true);
      setTimeout(() => {
        sheetRef.current.loadSearchData(sampleData);
        setIsLoading(false);
        alert('데이터를 다시 로드했습니다.');
      }, 300);
    }
  };

  const handleClear = () => {
    if (sheetRef.current) {
      sheetRef.current.loadSearchData([]);
      alert('데이터를 모두 삭제했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{subTitle}</p>
      </div>

      {/* 버튼 영역 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          행 추가
        </button>
        <button
          onClick={handleDeleteRow}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          disabled={isLoading}
        >
          행 삭제
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          disabled={isLoading}
        >
          저장
        </button>
        <button
          onClick={handleReload}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          disabled={isLoading}
        >
          다시 로드
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          disabled={isLoading}
        >
          전체 삭제
        </button>
      </div>

      {/* IBSheet 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">데이터 로딩 중...</p>
            </div>
          </div>
        )}
        <IBSheetReact
          options={sheetOptions}
          instance={onInstance}
          style={{ width: '100%', height: '500px' }}
        />
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
