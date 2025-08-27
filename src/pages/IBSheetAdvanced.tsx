import React, { useRef, useMemo, useState, useEffect } from 'react';
import IBSheetLoader from '@ibsheet/loader';

const IBSheetAdvanced: React.FC = () => {
  const sheetRef = useRef<any>(null);
  const createdRef = useRef(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 더 복잡한 샘플 데이터
  const sampleData = useMemo(() => [
    { SEQ: 1, selected: 0, empId: 'EMP001', name: '김철수', department: '개발팀', position: '시니어', salary: 5500000, joinDate: '2020-03-15', status: 'active', performance: 'A', email: 'kim@company.com' },
    { SEQ: 2, selected: 0, empId: 'EMP002', name: '이영희', department: '디자인팀', position: '주니어', salary: 3200000, joinDate: '2022-01-10', status: 'active', performance: 'B', email: 'lee@company.com' },
    { SEQ: 3, selected: 0, empId: 'EMP003', name: '박민수', department: '개발팀', position: '리드', salary: 7000000, joinDate: '2018-05-20', status: 'active', performance: 'S', email: 'park@company.com' },
    { SEQ: 4, selected: 0, empId: 'EMP004', name: '최지혜', department: '마케팅팀', position: '매니저', salary: 4800000, joinDate: '2021-07-01', status: 'inactive', performance: 'A', email: 'choi@company.com' },
    { SEQ: 5, selected: 0, empId: 'EMP005', name: '정승호', department: '개발팀', position: '주니어', salary: 3800000, joinDate: '2023-02-14', status: 'active', performance: 'B', email: 'jung@company.com' },
    { SEQ: 6, selected: 0, empId: 'EMP006', name: '한소영', department: 'HR팀', position: '시니어', salary: 5200000, joinDate: '2019-11-30', status: 'active', performance: 'A', email: 'han@company.com' },
    { SEQ: 7, selected: 0, empId: 'EMP007', name: '장윤기', department: '디자인팀', position: '리드', salary: 6500000, joinDate: '2017-09-12', status: 'active', performance: 'S', email: 'jang@company.com' },
    { SEQ: 8, selected: 0, empId: 'EMP008', name: '오미래', department: '마케팅팀', position: '주니어', salary: 3500000, joinDate: '2023-08-01', status: 'inactive', performance: 'C', email: 'oh@company.com' }
  ], []);

  // 통계 계산 함수
  const updateStats = (sheet: any) => {
    if (!sheet) return;
    
    const rows = sheet.getDataRows();
    let selectedCount = 0;
    let totalSalary = 0;
    
    rows.forEach((row: any) => {
      const isSelected = sheet.getValue(row, 'selected');
      if (isSelected === 1 || isSelected === true || isSelected === '1') {
        selectedCount++;
        const salary = sheet.getValue(row, 'salary') || 0;
        totalSalary += parseInt(salary.toString().replace(/,/g, ''));
      }
    });
    
    setSelectedCount(selectedCount);
    setTotalSalary(totalSalary);
  };

  // 필터링 함수
  const handleFilter = (status: string) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    
    setFilterStatus(status);
    
    if (status === 'all') {
      sheet.setSearchRows('', ''); // 모든 행 표시
    } else {
      // status 컬럼 기준으로 필터링
      sheet.setSearchRows(`status='${status}'`, '');
    }
    
    updateStats(sheet);
  };

  // 정렬 함수
  const handleSort = (column: string) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    
    sheet.sort(column, newDirection === 'asc' ? 1 : 0);
    updateStats(sheet);
  };

  // 선택된 행 삭제
  const handleDeleteSelected = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    
    const allRows = sheet.getDataRows();
    const remainingData = allRows.filter((row: any) => {
      const isSelected = sheet.getValue(row, 'selected');
      return !(isSelected === 1 || isSelected === true || isSelected === '1');
    }).map((row: any) => ({
      SEQ: sheet.getValue(row, 'SEQ'),
      selected: 0,
      empId: sheet.getValue(row, 'empId'),
      name: sheet.getValue(row, 'name'),
      department: sheet.getValue(row, 'department'),
      position: sheet.getValue(row, 'position'),
      salary: sheet.getValue(row, 'salary'),
      joinDate: sheet.getValue(row, 'joinDate'),
      status: sheet.getValue(row, 'status'),
      performance: sheet.getValue(row, 'performance'),
      email: sheet.getValue(row, 'email')
    }));
    
    if (allRows.length === remainingData.length) {
      alert('삭제할 행을 선택해주세요.');
      return;
    }
    
    // SEQ 재정렬
    remainingData.forEach((data: any, idx: number) => {
      data.SEQ = idx + 1;
    });
    
    sheet.loadSearchData(remainingData);
    updateStats(sheet);
    alert(`${allRows.length - remainingData.length}개 행이 삭제되었습니다.`);
  };

  // 급여 일괄 인상
  const handleSalaryIncrease = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    
    const percentage = prompt('급여 인상률을 입력하세요 (예: 10 = 10%)');
    if (!percentage || isNaN(Number(percentage))) return;
    
    const increaseRate = Number(percentage) / 100;
    const rows = sheet.getDataRows();
    
    rows.forEach((row: any) => {
      const isSelected = sheet.getValue(row, 'selected');
      if (isSelected === 1 || isSelected === true || isSelected === '1') {
        const currentSalary = parseInt(sheet.getValue(row, 'salary').toString().replace(/,/g, ''));
        const newSalary = Math.round(currentSalary * (1 + increaseRate));
        sheet.setValue(row, 'salary', newSalary.toLocaleString(), 1);
      }
    });
    
    updateStats(sheet);
    alert(`선택된 직원들의 급여가 ${percentage}% 인상되었습니다.`);
  };

  // Excel 내보내기 (시뮬레이션)
  const handleExportExcel = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    
    // IBSheet의 실제 Excel 내보내기 기능 사용
    // 라이센스 버전에서만 완전 동작
    try {
      sheet.down('Excel', 'employee_data.xlsx');
    } catch (error) {
      // 평가판에서는 CSV 형태로 대체
      const rows = sheet.getDataRows();
      const csvData = rows.map((row: any) => {
        return [
          sheet.getValue(row, 'empId'),
          sheet.getValue(row, 'name'),
          sheet.getValue(row, 'department'),
          sheet.getValue(row, 'position'),
          sheet.getValue(row, 'salary'),
          sheet.getValue(row, 'status')
        ].join(',');
      }).join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee_data.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const options = useMemo(() => ({
    Cfg: {
      SearchMode: 0,
      Style: 'IBMR',
      Sort: 1, // 정렬 허용
      ColResize: 1, // 컬럼 크기 조정 허용
      ColMove: 1, // 컬럼 이동 허용
      FilterMode: 1 // 필터 모드 활성화
    },
    Cols: [
      { 
        Header: { Value: '선택', HeaderCheck: 1 }, 
        Type: 'Bool', 
        Name: 'selected', 
        Width: 60, 
        Align: 'Center', 
        CanEdit: 1 
      },
      { 
        Header: 'No', 
        Type: 'Int', 
        Name: 'SEQ', 
        Width: 60, 
        Align: 'Center',
        CanEdit: 0 
      },
      { 
        Header: '사번', 
        Type: 'Text', 
        Name: 'empId', 
        Width: 100, 
        Align: 'Center',
        CanEdit: 1
      },
      { 
        Header: '이름', 
        Type: 'Text', 
        Name: 'name', 
        Width: 100, 
        Align: 'Center',
        CanEdit: 1
      },
      { 
        Header: '부서', 
        Type: 'Enum', 
        Name: 'department', 
        Width: 100, 
        Align: 'Center',
        Enum: '|개발팀|디자인팀|마케팅팀|HR팀|영업팀',
        CanEdit: 1
      },
      { 
        Header: '직급', 
        Type: 'Enum', 
        Name: 'position', 
        Width: 100, 
        Align: 'Center',
        Enum: '|주니어|시니어|리드|매니저|임원',
        CanEdit: 1
      },
      { 
        Header: '급여', 
        Type: 'Int', 
        Name: 'salary', 
        Width: 120, 
        Align: 'Right',
        Format: '#,##0',
        CanEdit: 1
      },
      { 
        Header: '입사일', 
        Type: 'Date', 
        Name: 'joinDate', 
        Width: 100, 
        Align: 'Center',
        Format: 'yyyy-MM-dd',
        CanEdit: 1
      },
      { 
        Header: '상태', 
        Type: 'Enum', 
        Name: 'status', 
        Width: 80, 
        Align: 'Center',
        Enum: '|active|inactive',
        CanEdit: 1
      },
      { 
        Header: '평가', 
        Type: 'Enum', 
        Name: 'performance', 
        Width: 80, 
        Align: 'Center',
        Enum: '|S|A|B|C|D',
        CanEdit: 1
      },
      { 
        Header: '이메일', 
        Type: 'Text', 
        Name: 'email', 
        Width: 200, 
        Align: 'Left',
        CanEdit: 1
      }
    ],
    Events: {
      onRenderFirstFinish: (evt: any) => { 
        console.log('[IBSheet] Advanced grid loaded');
        updateStats(evt.sheet);
        return ''; 
      },
      onAfterValueChange: (evt: any) => {
        if (evt.col === 'selected') {
          updateStats(evt.sheet);
        }
        return '';
      },
      onHeaderClick: (evt: any) => {
        // 헤더 클릭 시 정렬
        if (evt.col && evt.col !== 'selected') {
          handleSort(evt.col);
        }
        return '';
      }
    }
  }), [sortDirection]);

  // 시트 생성
  useEffect(() => {
    const elId = 'advancedSheet';
    if (createdRef.current) return;
    const host = document.getElementById(elId);
    if (!host) return;

    const create = () => {
      if (createdRef.current) return;
      console.log('[IBSheet] Advanced sheet 생성 시작');
      IBSheetLoader.createSheet({ el: elId, options, data: sampleData })
        .then((sheet: any) => {
          createdRef.current = true;
          sheetRef.current = sheet;
          console.log('[IBSheet] Advanced sheet 생성 완료');
          updateStats(sheet);
        })
        .catch((err: any) => {
          console.error('[IBSheet] Advanced sheet 생성 실패', err);
        });
    };

    if ((IBSheetLoader as any).isLoaded?.('ibsheet')) {
      create();
    } else {
      IBSheetLoader.once('loaded', (e: any) => {
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

  return (
    <div className="max-w-full mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IBSheet 고급 기능 예제</h1>
        <p className="text-gray-600">
          필터링, 정렬, 일괄 수정, 통계, 내보내기 등 고급 기능들을 포함한 직원 관리 시스템
        </p>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">선택된 직원</h3>
          <p className="text-2xl font-bold text-blue-900">{selectedCount}명</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">선택 직원 총 급여</h3>
          <p className="text-2xl font-bold text-green-900">{totalSalary.toLocaleString()}원</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">평균 급여</h3>
          <p className="text-2xl font-bold text-purple-900">
            {selectedCount > 0 ? Math.round(totalSalary / selectedCount).toLocaleString() : 0}원
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-orange-800">필터 상태</h3>
          <p className="text-2xl font-bold text-orange-900 capitalize">{filterStatus}</p>
        </div>
      </div>

      {/* 필터 및 액션 버튼들 */}
      <div className="mb-6 space-y-4">
        {/* 필터 버튼 그룹 */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 self-center mr-2">필터:</span>
          <button
            onClick={() => handleFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filterStatus === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => handleFilter('active')}
            className={`px-3 py-1 rounded text-sm ${
              filterStatus === 'active' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            재직중
          </button>
          <button
            onClick={() => handleFilter('inactive')}
            className={`px-3 py-1 rounded text-sm ${
              filterStatus === 'inactive' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            퇴사
          </button>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            선택 직원 삭제
          </button>
          <button
            onClick={handleSalaryIncrease}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            선택 직원 급여 인상
          </button>
          <button
            onClick={() => handleSort('salary')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            급여순 정렬 ({sortDirection === 'asc' ? '낮은순' : '높은순'})
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Excel 내보내기
          </button>
        </div>
      </div>

      {/* IBSheet 그리드 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg" style={{height:'500px'}}>
        <div id="advancedSheet" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* 기능 설명 */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">구현된 고급 기능들</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• <strong>체크박스 선택</strong>: 다중 행 선택 및 통계 실시간 업데이트</li>
          <li>• <strong>필터링</strong>: 재직 상태별 데이터 필터링</li>
          <li>• <strong>정렬</strong>: 컬럼 헤더 클릭 또는 버튼으로 정렬</li>
          <li>• <strong>일괄 수정</strong>: 선택된 직원들의 급여 일괄 인상</li>
          <li>• <strong>실시간 통계</strong>: 선택 인원, 총 급여, 평균 급여 계산</li>
          <li>• <strong>데이터 타입</strong>: 텍스트, 숫자, 날짜, 드롭다운(Enum) 등 다양한 타입</li>
          <li>• <strong>셀 편집</strong>: 인라인 편집 지원</li>
          <li>• <strong>Excel 내보내기</strong>: 데이터 내보내기 기능</li>
          <li>• <strong>컬럼 조작</strong>: 크기 조정, 이동 가능</li>
        </ul>
      </div>
    </div>
  );
};

export default IBSheetAdvanced;
