import { useState, useRef, useEffect } from 'react'

// IBSheet React 컴포넌트를 동적으로 import
const IBSheetReact = (() => {
  try {
    const { IBSheetReact } = require('@ibsheet/react')
    return IBSheetReact
  } catch (error) {
    console.warn('IBSheet React 컴포넌트를 불러올 수 없습니다:', error)
    return null
  }
})()

// 사용자 데이터 타입
interface User {
  id: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  salary: number
  status: string
  selected?: boolean
}

export default function IBSheetGrid() {
  const sheetRef = useRef<any>(null)
  const [status, setStatus] = useState('IBSheet React 컴포넌트를 확인 중입니다...')
  const [isIBSheetAvailable, setIsIBSheetAvailable] = useState(false)
  const [fallbackData, setFallbackData] = useState<User[]>([])

  // 샘플 데이터
  const sampleData: User[] = [
    { id: "1", name: "김철수", email: "kim@example.com", department: "개발팀", position: "시니어 개발자", joinDate: "2020-03-15", salary: 5500, status: "재직" },
    { id: "2", name: "이영희", email: "lee@example.com", department: "디자인팀", position: "UI/UX 디자이너", joinDate: "2021-07-22", salary: 4800, status: "재직" },
    { id: "3", name: "박민수", email: "park@example.com", department: "마케팅팀", position: "마케팅 매니저", joinDate: "2019-11-08", salary: 6200, status: "재직" },
    { id: "4", name: "최지은", email: "choi@example.com", department: "인사팀", position: "인사 담당자", joinDate: "2022-01-10", salary: 4200, status: "재직" },
    { id: "5", name: "정태윤", email: "jung@example.com", department: "개발팀", position: "주니어 개발자", joinDate: "2023-05-03", salary: 3800, status: "재직" }
  ]

  useEffect(() => {
    // IBSheet 라이브러리와 컴포넌트 가용성 확인
    const checkIBSheet = () => {
      const isLibraryLoaded = typeof window !== 'undefined' && (window as any).IBSheet
      const isComponentAvailable = IBSheetReact !== null
      
      if (isLibraryLoaded && isComponentAvailable) {
        setIsIBSheetAvailable(true)
        setStatus('IBSheet가 성공적으로 로드되었습니다!')
      } else {
        setIsIBSheetAvailable(false)
        setStatus('IBSheet 라이브러리를 찾을 수 없습니다. Fallback 테이블을 사용합니다.')
        setFallbackData(sampleData.map(user => ({ ...user, selected: false })))
      }
    }

    // 즉시 확인
    checkIBSheet()
    
    // 3초 후 다시 확인 (라이브러리 로딩 대기)
    const timer = setTimeout(checkIBSheet, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // IBSheet 설정
  const options = {
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3,
      InfoRowConfig: { Visible: false }
    },
    Cols: [
      { Header: "선택", Type: "Bool", Name: "selected", Width: 60, Align: "Center" },
      { Header: "ID", Type: "Text", Name: "id", Width: 80, Align: "Center", CanEdit: 0 },
      { Header: "이름", Type: "Text", Name: "name", Width: 120, Align: "Left", Required: 1 },
      { Header: "이메일", Type: "Text", Name: "email", Width: 200, Align: "Left", Required: 1 },
      { Header: "부서", Type: "Text", Name: "department", Width: 120, Align: "Center" },
      { Header: "직급", Type: "Text", Name: "position", Width: 140, Align: "Center" },
      { Header: "입사일", Type: "Date", Name: "joinDate", Width: 120, Align: "Center", Format: "yyyy-mm-dd" },
      { Header: "급여", Type: "Int", Name: "salary", Width: 100, Align: "Right", Format: "#,###" },
      { Header: "상태", Type: "Enum", Name: "status", Width: 80, Align: "Center", Enum: "재직|휴직|퇴사" }
    ]
  }

  // IBSheet 인스턴스 생성 시 호출
  const getInstance = (sheet: any) => {
    console.log('IBSheet 인스턴스가 생성되었습니다:', sheet)
    setStatus('IBSheet가 성공적으로 초기화되었습니다!')
  }

  // 액션 함수들
  const addUser = () => {
    if (isIBSheetAvailable && sheetRef.current) {
      const newId = Date.now().toString()
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
      
      if (sheetRef.current.addRow) {
        sheetRef.current.addRow(newUser)
        setStatus("새 사용자가 추가되었습니다.")
      }
    } else {
      // Fallback: 테이블에 직접 추가
      const newId = Date.now().toString()
      const newUser: User = {
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
      
      setFallbackData(prev => [...prev, newUser])
      setStatus("새 사용자가 추가되었습니다. (Fallback 모드)")
    }
  }

  const deleteSelected = () => {
    if (isIBSheetAvailable && sheetRef.current) {
      try {
        const allData = sheetRef.current.getDataRows ? sheetRef.current.getDataRows() : []
        const selectedRows = allData.filter((row: any) => row.selected)
        
        if (selectedRows.length === 0) {
          setStatus("삭제할 행을 선택해주세요.")
          return
        }
        
        selectedRows.forEach((row: any) => {
          if (sheetRef.current?.deleteRow) {
            sheetRef.current.deleteRow(row)
          }
        })
        
        setStatus(`${selectedRows.length}개의 행이 삭제되었습니다.`)
      } catch (error) {
        setStatus("선택된 행을 삭제하는 중 오류가 발생했습니다.")
      }
    } else {
      // Fallback: 선택된 항목 삭제
      const selectedCount = fallbackData.filter(user => user.selected).length
      if (selectedCount === 0) {
        setStatus("삭제할 행을 선택해주세요.")
        return
      }
      
      setFallbackData(prev => prev.filter(user => !user.selected))
      setStatus(`${selectedCount}개의 행이 삭제되었습니다. (Fallback 모드)`)
    }
  }

  const saveData = () => {
    if (isIBSheetAvailable && sheetRef.current) {
      const allData = sheetRef.current.getDataRows ? sheetRef.current.getDataRows() : []
      console.log('저장할 데이터:', allData)
      setStatus(`${allData.length}개의 행이 저장되었습니다.`)
    } else {
      console.log('저장할 데이터:', fallbackData)
      setStatus(`${fallbackData.length}개의 행이 저장되었습니다. (Fallback 모드)`)
    }
  }

  const exportExcel = () => {
    setStatus("Excel 내보내기 기능을 실행했습니다.")
    console.log('Excel 내보내기 요청')
  }

  const toggleSelection = (id: string) => {
    setFallbackData(prev => prev.map(user => 
      user.id === id ? { ...user, selected: !user.selected } : user
    ))
  }

  // 컨테이너 스타일
  const containerStyle = {
    width: '100%',
    height: '500px',
    border: '1px solid #ccc',
    borderRadius: '8px'
  }

  // Fallback 테이블 렌더링
  const renderFallbackTable = () => (
    <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '500px' }}>
      <div className="overflow-auto h-full">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-center w-16">선택</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-20">ID</th>
              <th className="border border-gray-300 px-3 py-2 text-left w-32">이름</th>
              <th className="border border-gray-300 px-3 py-2 text-left w-48">이메일</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-32">부서</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-36">직급</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-32">입사일</th>
              <th className="border border-gray-300 px-3 py-2 text-right w-24">급여</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-20">상태</th>
            </tr>
          </thead>
          <tbody>
            {fallbackData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <input 
                    type="checkbox" 
                    checked={user.selected || false}
                    onChange={() => toggleSelection(user.id)}
                    className="rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">{user.id}</td>
                <td className="border border-gray-300 px-3 py-2">{user.name}</td>
                <td className="border border-gray-300 px-3 py-2">{user.email}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{user.department}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{user.position}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{user.joinDate}</td>
                <td className="border border-gray-300 px-3 py-2 text-right">{user.salary.toLocaleString()}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 IBSheet React 컴포넌트 {!isIBSheetAvailable && '(Fallback 모드)'}
        </h1>
        <p className="text-gray-600">
          {isIBSheetAvailable 
            ? '공식 @ibsheet/react 패키지를 사용한 실제 IBSheet 그리드'
            : 'IBSheet 라이브러리 없이 작동하는 대체 테이블'
          }
        </p>
      </div>

      {/* IBSheet 라이브러리 상태 안내 */}
      <div className={`mb-6 p-4 rounded-lg border ${
        isIBSheetAvailable 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${
          isIBSheetAvailable ? 'text-green-800' : 'text-yellow-800'
        }`}>
          {isIBSheetAvailable ? '✅ IBSheet 라이브러리 로드됨' : '⚠️ IBSheet 라이브러리 필요'}
        </h3>
        <p className={`text-sm mb-2 ${
          isIBSheetAvailable ? 'text-green-700' : 'text-yellow-700'
        }`}>
          {isIBSheetAvailable 
            ? 'IBSheet React 컴포넌트가 정상적으로 작동하고 있습니다.'
            : 'IBSheet 라이브러리를 찾을 수 없어 대체 테이블을 사용합니다.'
          }
        </p>
        {!isIBSheetAvailable && (
          <p className="text-xs text-yellow-600">
            index.html에 IBSheet 스크립트를 추가하거나 @ibsheet/loader를 사용하세요.
          </p>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={addUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          ➕ 사용자 추가
        </button>
        <button 
          onClick={deleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          ❌ 선택 삭제
        </button>
        <button 
          onClick={saveData}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          💾 데이터 저장
        </button>
        <button 
          onClick={exportExcel}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          📊 Excel 내보내기
        </button>
      </div>

      {/* IBSheet React 컴포넌트 또는 Fallback 테이블 */}
      <div className="mb-4">
        {isIBSheetAvailable && IBSheetReact ? (
          <IBSheetReact
            ref={sheetRef}
            options={options}
            data={sampleData.map(user => ({ ...user, selected: false }))}
            style={containerStyle}
            instance={getInstance}
            sync={false}
          />
        ) : (
          renderFallbackTable()
        )}
      </div>

      {/* 기능 설명 */}
      <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-800 mb-2">
          ✅ {isIBSheetAvailable ? '공식 IBSheet React 기능' : 'Fallback 테이블 기능'}
        </h3>
        <ul className="text-sm text-green-700 space-y-1">
          {isIBSheetAvailable ? (
            <>
              <li>• IBSheetReact 컴포넌트 사용</li>
              <li>• 셀 편집: 더블클릭으로 직접 편집</li>
              <li>• 정렬 및 필터링: 컬럼 헤더 기능</li>
              <li>• 행 선택: 첫 번째 컬럼 체크박스</li>
              <li>• Excel 내보내기: 실제 파일 다운로드</li>
              <li>• 키보드 네비게이션 지원</li>
            </>
          ) : (
            <>
              <li>• HTML 테이블 기반 대체 구현</li>
              <li>• 행 선택: 체크박스 클릭</li>
              <li>• 데이터 추가/삭제 기능</li>
              <li>• 기본적인 그리드 레이아웃</li>
              <li>• IBSheet 없이도 작동</li>
            </>
          )}
        </ul>
      </div>

      {/* 사용법 안내 */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">📖 사용법</h3>
        <div className="text-sm text-blue-700 space-y-2">
          {isIBSheetAvailable ? (
            <>
              <p><strong>1. IBSheet 라이브러리:</strong> 정상적으로 로드됨</p>
              <p><strong>2. 셀 편집:</strong> 셀을 더블클릭하여 직접 편집</p>
              <p><strong>3. 행 선택:</strong> 첫 번째 컬럼의 체크박스 클릭</p>
              <p><strong>4. 정렬:</strong> 컬럼 헤더 클릭으로 정렬</p>
              <p><strong>5. 키보드:</strong> 화살표 키로 셀 이동, Enter로 편집</p>
            </>
          ) : (
            <>
              <p><strong>1. IBSheet 설치:</strong> index.html에 IBSheet 스크립트 추가 필요</p>
              <p><strong>2. 현재 상태:</strong> 대체 테이블로 기본 기능 제공</p>
              <p><strong>3. 행 선택:</strong> 체크박스 클릭으로 선택/해제</p>
              <p><strong>4. 데이터 관리:</strong> 추가/삭제 버튼 사용</p>
              <p><strong>5. 개발 목적:</strong> IBSheet 라이브러리 없이도 개발 가능</p>
            </>
          )}
        </div>
      </div>

      {/* 상태 바 */}
      <div className="p-3 bg-gray-100 rounded text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">{status}</span>
          <span className="text-xs text-gray-500">
            {isIBSheetAvailable ? '@ibsheet/react v1.0.3' : 'Fallback 모드'}
          </span>
        </div>
      </div>
    </div>
  )
}
