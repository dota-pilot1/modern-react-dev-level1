import { useEffect, useRef, useState } from 'react'

export default function IBSheetGrid() {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [mySheet, setMySheet] = useState<any>(null)
  const [status, setStatus] = useState('IB Sheet를 로드하는 중...')
  const [isLoading, setIsLoading] = useState(true)

  // 샘플 유저 데이터
  const [sampleUsers, setSampleUsers] = useState([
    { id: 1, name: "김철수", email: "kim@example.com", department: "개발팀", position: "시니어 개발자", joinDate: "2020-03-15", salary: 5500, status: "재직" },
    { id: 2, name: "이영희", email: "lee@example.com", department: "디자인팀", position: "UI/UX 디자이너", joinDate: "2021-07-22", salary: 4800, status: "재직" },
    { id: 3, name: "박민수", email: "park@example.com", department: "마케팅팀", position: "마케팅 매니저", joinDate: "2019-11-08", salary: 6200, status: "재직" },
    { id: 4, name: "최지은", email: "choi@example.com", department: "인사팀", position: "인사 담당자", joinDate: "2022-01-10", salary: 4200, status: "재직" },
    { id: 5, name: "정태윤", email: "jung@example.com", department: "개발팀", position: "주니어 개발자", joinDate: "2023-05-03", salary: 3800, status: "재직" },
    { id: 6, name: "강수진", email: "kang@example.com", department: "영업팀", position: "영업 대표", joinDate: "2018-09-12", salary: 7000, status: "퇴사" },
    { id: 7, name: "윤서연", email: "yoon@example.com", department: "기획팀", position: "프로덕트 매니저", joinDate: "2020-12-01", salary: 5800, status: "재직" }
  ])

  // IB Sheet 설정
  const sheetOptions = {
    Cfg: {
      SearchMode: 2,
      Page: 50
    },
    Def: {
      Row: {
        CanFormula: true,
        CalcOrder: "id"
      }
    },
    Cols: [
      { Header: "ID", Type: "Int", Name: "id", Width: 80, Align: "Center", CanEdit: false },
      { Header: "이름", Type: "Text", Name: "name", Width: 120, Required: true },
      { Header: "이메일", Type: "Email", Name: "email", Width: 200, Required: true },
      { Header: "부서", Type: "Enum", Name: "department", Width: 120, 
        Enum: "개발팀|디자인팀|마케팅팀|인사팀|영업팀|기획팀" },
      { Header: "직급", Type: "Text", Name: "position", Width: 150 },
      { Header: "입사일", Type: "Date", Name: "joinDate", Width: 120, Format: "yyyy-MM-dd" },
      { Header: "급여", Type: "Int", Name: "salary", Width: 100, Format: "#,##0", Align: "Right" },
      { Header: "상태", Type: "Enum", Name: "status", Width: 100, 
        Enum: "재직|휴직|퇴사", Colors: "재직:Blue,휴직:Orange,퇴사:Red" }
    ]
  }

  // 대체 테이블 컴포넌트
  const FallbackTable = () => (
    <div className="overflow-auto h-[500px] border border-gray-300 rounded">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="border border-gray-300 p-2">선택</th>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">이름</th>
            <th className="border border-gray-300 p-2">이메일</th>
            <th className="border border-gray-300 p-2">부서</th>
            <th className="border border-gray-300 p-2">직급</th>
            <th className="border border-gray-300 p-2">입사일</th>
            <th className="border border-gray-300 p-2">급여</th>
            <th className="border border-gray-300 p-2">상태</th>
          </tr>
        </thead>
        <tbody>
          {sampleUsers.map(user => {
            const statusColor = user.status === '재직' ? 'text-blue-600' : 
                               user.status === '휴직' ? 'text-yellow-600' : 'text-red-600'
            return (
              <tr key={user.id} className="border-b border-gray-200">
                <td className="border border-gray-300 p-2 text-center">
                  <input type="checkbox" value={user.id} />
                </td>
                <td className="border border-gray-300 p-2 text-center">{user.id}</td>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.department}</td>
                <td className="border border-gray-300 p-2">{user.position}</td>
                <td className="border border-gray-300 p-2">{user.joinDate}</td>
                <td className="border border-gray-300 p-2 text-right">{user.salary.toLocaleString()}원</td>
                <td className={`border border-gray-300 p-2 font-bold ${statusColor}`}>{user.status}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  // IB Sheet 초기화
  const initSheet = () => {
    try {
      // IBSheet가 로드되지 않은 경우 대체 테이블 사용
      if (typeof window !== 'undefined' && !(window as any).IBSheet) {
        setStatus('IB Sheet 로드에 실패했습니다. 데모 테이블로 대체합니다.')
        setIsLoading(false)
        return
      }

      // 기존 시트가 있다면 제거
      if (mySheet) {
        mySheet.dispose()
      }

      // IBSheet 생성
      const sheet = (window as any).IBSheet.create({
        id: "sheet",
        el: sheetRef.current,
        options: sheetOptions
      })

      // 시트 로드 완료 이벤트
      sheet.addEventListener("onRenderFirstFinish", function() {
        setStatus("시트 로드 완료!")
        loadUserData(sheet)
      })

      // 행 선택 이벤트
      sheet.addEventListener("onRowSearchEnd", function() {
        const selectedCount = sheet.getSelectedRowsCount()
        setStatus(`선택된 행: ${selectedCount}개`)
      })

      setMySheet(sheet)
      setIsLoading(false)

    } catch (error) {
      console.error("IB Sheet 초기화 실패:", error)
      setStatus("IB Sheet 로드에 실패했습니다. 데모 테이블로 대체합니다.")
      setIsLoading(false)
    }
  }

  // 유저 데이터 로드
  const loadUserData = (sheet = mySheet) => {
    try {
      if (sheet && sheet.loadSearchData) {
        sheet.loadSearchData(sampleUsers)
        setStatus(`${sampleUsers.length}명의 사용자 데이터를 로드했습니다.`)
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error)
      setStatus("데이터 로드에 실패했습니다.")
    }
  }

  // 사용자 추가
  const addUser = () => {
    const newId = Math.max(...sampleUsers.map(u => u.id)) + 1
    const newUser = {
      id: newId,
      name: "새 사용자",
      email: `user${newId}@example.com`,
      department: "개발팀",
      position: "신입사원",
      joinDate: new Date().toISOString().split('T')[0],
      salary: 3500,
      status: "재직"
    }

    try {
      if (mySheet && mySheet.addRow) {
        mySheet.addRow(newUser)
        setSampleUsers([...sampleUsers, newUser])
        setStatus("새 사용자가 추가되었습니다.")
      } else {
        setSampleUsers([...sampleUsers, newUser])
        setStatus("새 사용자가 추가되었습니다.")
      }
    } catch (error) {
      console.error("사용자 추가 실패:", error)
      setStatus("사용자 추가에 실패했습니다.")
    }
  }

  // 선택된 행 삭제
  const deleteSelected = () => {
    try {
      if (mySheet && mySheet.deleteRow) {
        const selectedRows = mySheet.getSelectedRows()
        if (selectedRows.length > 0) {
          mySheet.deleteRow(selectedRows)
          setStatus(`${selectedRows.length}개의 행이 삭제되었습니다.`)
        } else {
          setStatus("삭제할 행을 선택해주세요.")
        }
      } else {
        // 대체 테이블의 경우
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>
        if (checkboxes.length > 0) {
          const idsToDelete = Array.from(checkboxes).map(cb => parseInt(cb.value))
          const updatedUsers = sampleUsers.filter(u => !idsToDelete.includes(u.id))
          setSampleUsers(updatedUsers)
          setStatus(`${checkboxes.length}개의 사용자가 삭제되었습니다.`)
        } else {
          setStatus("삭제할 사용자를 선택해주세요.")
        }
      }
    } catch (error) {
      console.error("삭제 실패:", error)
      setStatus("삭제에 실패했습니다.")
    }
  }

  // 데이터 저장
  const saveData = () => {
    try {
      if (mySheet && mySheet.getSaveData) {
        const data = mySheet.getSaveData()
        console.log("저장할 데이터:", data)
        setStatus("데이터가 저장되었습니다. (콘솔 확인)")
      } else {
        console.log("저장할 데이터:", sampleUsers)
        setStatus("데이터가 저장되었습니다. (콘솔 확인)")
      }
    } catch (error) {
      console.error("저장 실패:", error)
      setStatus("데이터 저장에 실패했습니다.")
    }
  }

  // Excel 내보내기
  const exportExcel = () => {
    try {
      if (mySheet && mySheet.exportExcel) {
        mySheet.exportExcel({
          fileName: "사용자목록.xlsx",
          sheetName: "Users"
        })
        setStatus("Excel 파일이 다운로드되었습니다.")
      } else {
        setStatus("Excel 내보내기는 IB Sheet에서만 지원됩니다.")
      }
    } catch (error) {
      console.error("Excel 내보내기 실패:", error)
      setStatus("Excel 내보내기에 실패했습니다.")
    }
  }

  // 데이터 새로고침
  const refreshData = () => {
    loadUserData()
  }

  useEffect(() => {
    // IB Sheet CSS 로드
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/lib/ibsheet.css'
    document.head.appendChild(cssLink)

    // IB Sheet JS 로드
    const script = document.createElement('script')
    script.src = 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/lib/ibsheet.js'
    script.onload = () => {
      setTimeout(initSheet, 1000) // IB Sheet 라이브러리 로드 대기
    }
    script.onerror = () => {
      setStatus('IB Sheet 로드에 실패했습니다. 데모 테이블로 대체합니다.')
      setIsLoading(false)
    }
    document.head.appendChild(script)

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (mySheet) {
        mySheet.dispose()
      }
      if (cssLink.parentNode) document.head.removeChild(cssLink)
      if (script.parentNode) document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧑‍💼 유저 목록 관리</h1>
        <p className="text-gray-600">IB Sheet를 사용한 사용자 데이터 관리 예제</p>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={addUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          👤 사용자 추가
        </button>
        <button 
          onClick={saveData}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          💾 데이터 저장
        </button>
        <button 
          onClick={deleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          🗑️ 선택 삭제
        </button>
        <button 
          onClick={exportExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          📊 Excel 내보내기
        </button>
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          🔄 데이터 새로고침
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[500px] border border-gray-300 rounded">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      ) : mySheet ? (
        <div ref={sheetRef} className="w-full h-[500px] border border-gray-300 rounded" />
      ) : (
        <FallbackTable />
      )}
      
      <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
        {status}
      </div>
    </div>
  )
}