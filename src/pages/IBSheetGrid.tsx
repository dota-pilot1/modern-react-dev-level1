import { useState, useRef, useEffect } from 'react'

// IBSheet 타입 정의
declare global {
  interface Window {
    IBSheet: any;
  }
}

// 사용자 타입 정의
interface User {
  id: number
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  salary: number
  status: string
}

export default function IBSheetGrid() {
  const sheetRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState('IBSheet 라이브러리를 로딩 중입니다...')

  // 샘플 데이터
  const sampleUsers: User[] = [
    { id: 1, name: "김철수", email: "kim@example.com", department: "개발팀", position: "시니어 개발자", joinDate: "2020-03-15", salary: 5500, status: "재직" },
    { id: 2, name: "이영희", email: "lee@example.com", department: "디자인팀", position: "UI/UX 디자이너", joinDate: "2021-07-22", salary: 4800, status: "재직" },
    { id: 3, name: "박민수", email: "park@example.com", department: "마케팅팀", position: "마케팅 매니저", joinDate: "2019-11-08", salary: 6200, status: "재직" },
    { id: 4, name: "최지은", email: "choi@example.com", department: "인사팀", position: "인사 담당자", joinDate: "2022-01-10", salary: 4200, status: "재직" },
    { id: 5, name: "정태윤", email: "jung@example.com", department: "개발팀", position: "주니어 개발자", joinDate: "2023-05-03", salary: 3800, status: "재직" },
    { id: 6, name: "강수진", email: "kang@example.com", department: "영업팀", position: "영업 대표", joinDate: "2018-09-12", salary: 7000, status: "퇴사" },
    { id: 7, name: "윤서연", email: "yoon@example.com", department: "기획팀", position: "프로덕트 매니저", joinDate: "2020-12-01", salary: 5800, status: "재직" }
  ]

  // IBSheet 초기화
  useEffect(() => {
    const initializeSheet = () => {
      try {
        setStatus('IBSheet를 초기화하는 중입니다...')
        
        // IBSheet 생성
        const sheet = window.IBSheet.create({
          id: "mySheet",
          el: "sheetDiv",
          options: {
            Cfg: {
              SearchMode: 2,
              AutoFitColWidth: "search|resize|init|colhidden|rowhidden",
              InfoRowConfig: { Visible: false },
              SizeMode: 4,
              MenuString: {
                Cut: "잘라내기",
                Copy: "복사",
                Paste: "붙여넣기",
                Delete: "삭제",
                Insert: "삽입",
                Sort: "정렬"
              }
            }
          },
          def: {
            Row: {
              CanFormula: true
            }
          },
          events: {
            onSearchEnd: () => {
              setStatus(`IBSheet 로드 완료! ${sheet.getDataRows().length}행의 데이터가 있습니다.`)
            },
            onCellChange: (_sheet: any, row: any, col: any) => {
              setStatus(`셀이 변경되었습니다: ${row}행 ${col}열`)
            }
          }
        })

        // 컬럼 정의
        const columns = [
          { Header: "선택", Type: "Bool", Name: "selected", Width: 60, Align: "Center" },
          { Header: "ID", Type: "Int", Name: "id", Width: 80, Align: "Center", CanEdit: 0 },
          { Header: "이름", Type: "Text", Name: "name", Width: 120, Align: "Left", Required: 1 },
          { Header: "이메일", Type: "Text", Name: "email", Width: 200, Align: "Left", Required: 1 },
          { Header: "부서", Type: "Text", Name: "department", Width: 120, Align: "Center" },
          { Header: "직급", Type: "Text", Name: "position", Width: 140, Align: "Center" },
          { Header: "입사일", Type: "Date", Name: "joinDate", Width: 120, Align: "Center", Format: "yyyy-mm-dd" },
          { Header: "급여", Type: "Int", Name: "salary", Width: 100, Align: "Right", Format: "#,###" },
          { Header: "상태", Type: "Enum", Name: "status", Width: 80, Align: "Center", Enum: "재직|휴직|퇴사" }
        ]

        // 컬럼 설정
        sheet.initColumns(columns)

        // 데이터 로드
        sheet.loadSearchData(sampleUsers.map(user => ({
          ...user,
          selected: false
        })))

        sheetRef.current = sheet
        setIsLoading(false)
        setStatus('IBSheet가 성공적으로 로드되었습니다!')

      } catch (error) {
        console.error('IBSheet 초기화 실패:', error)
        setStatus('IBSheet 초기화에 실패했습니다.')
        setIsLoading(false)
      }
    }

    // IBSheet가 로드되었는지 확인 후 초기화
    if (window.IBSheet) {
      initializeSheet()
    } else {
      // IBSheet가 아직 로드되지 않았다면 잠시 대기
      const checkIBSheet = setInterval(() => {
        if (window.IBSheet) {
          clearInterval(checkIBSheet)
          initializeSheet()
        }
      }, 100)
      
      // 10초 후에도 로드되지 않으면 타임아웃
      setTimeout(() => {
        clearInterval(checkIBSheet)
        if (!window.IBSheet) {
          setStatus('IBSheet 라이브러리 로드 타임아웃')
          setIsLoading(false)
        }
      }, 10000)
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (sheetRef.current) {
        try {
          sheetRef.current.dispose()
        } catch (error) {
          console.error('IBSheet 정리 중 오류:', error)
        }
      }
    }
  }, [])

  // 사용자 추가
  const addUser = () => {
    if (!sheetRef.current) {
      setStatus('IBSheet가 초기화되지 않았습니다.')
      return
    }

    const newId = Date.now()
    const newUser = {
      id: newId,
      name: "새 사용자",
      email: `user${newId}@example.com`,
      department: "개발팀",
      position: "신입사원",
      joinDate: new Date().toISOString().split('T')[0],
      salary: 3500,
      status: "재직",
      selected: false
    }

    sheetRef.current.addRow(newUser)
    setStatus("새 사용자가 추가되었습니다.")
  }

  // 선택된 행 삭제
  const deleteSelected = () => {
    if (!sheetRef.current) {
      setStatus('IBSheet가 초기화되지 않았습니다.')
      return
    }

    const selectedRows = sheetRef.current.getCheckedRows("selected")
    if (selectedRows.length === 0) {
      setStatus("삭제할 행을 선택해주세요.")
      return
    }

    sheetRef.current.deleteRow(selectedRows)
    setStatus(`${selectedRows.length}개의 행이 삭제되었습니다.`)
  }

  // Excel 내보내기
  const exportToExcel = () => {
    if (!sheetRef.current) {
      setStatus('IBSheet가 초기화되지 않았습니다.')
      return
    }

    try {
      sheetRef.current.exportExcel({
        fileName: "사용자목록",
        sheetName: "사용자 데이터"
      })
      setStatus("Excel 파일이 다운로드되었습니다.")
    } catch (error) {
      console.error('Excel 내보내기 오류:', error)
      setStatus("Excel 내보내기에 실패했습니다.")
    }
  }

  // 데이터 저장
  const saveData = () => {
    if (!sheetRef.current) {
      setStatus('IBSheet가 초기화되지 않았습니다.')
      return
    }

    const allData = sheetRef.current.getAllData()
    console.log('저장할 데이터:', allData)
    setStatus(`${allData.length}개의 행이 저장되었습니다.`)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 IBSheet 공식 그리드 연습
        </h1>
        <p className="text-gray-600">
          IBSheet 8.0 CDN을 사용한 실제 그리드 컴포넌트
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={addUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          👤 사용자 추가
        </button>
        <button 
          onClick={deleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          🗑️ 선택 삭제
        </button>
        <button 
          onClick={saveData}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          💾 데이터 저장
        </button>
        <button 
          onClick={exportToExcel}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          📊 Excel 내보내기
        </button>
      </div>

      {/* IBSheet 그리드 영역 */}
      <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
        <div 
          id="sheetDiv" 
          style={{ 
            width: '100%', 
            height: '500px',
            minHeight: '400px'
          }}
          className={isLoading ? 'flex items-center justify-center bg-gray-50' : ''}
        >
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">IBSheet 로딩 중...</div>
            </div>
          )}
        </div>
      </div>

      {/* 기능 설명 */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">🔧 IBSheet 기능들</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 셀 편집: 더블클릭하여 직접 편집</li>
          <li>• 정렬: 컬럼 헤더 클릭</li>
          <li>• 필터링: 컬럼 헤더 우클릭 → 필터</li>
          <li>• 행 선택: 첫 번째 컬럼 체크박스</li>
          <li>• 컨텍스트 메뉴: 우클릭으로 추가 기능</li>
          <li>• 키보드 네비게이션: 화살표 키로 이동</li>
        </ul>
      </div>

      {/* 상태 바 */}
      <div className="p-3 bg-gray-100 rounded text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">{status}</span>
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>로딩 중...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}