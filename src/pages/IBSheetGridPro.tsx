import { useState, useCallback, useMemo } from 'react'

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

// 검색 필터 타입
interface SearchFilter {
  keyword: string
  department: string
  status: string
}

export default function UserManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [status, setStatus] = useState('실무급 React 그리드가 준비되었습니다.')
  
  // 검색 필터 상태
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    keyword: '',
    department: '',
    status: ''
  })

  // 초기 데이터
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "김철수", email: "kim@example.com", department: "개발팀", position: "시니어 개발자", joinDate: "2020-03-15", salary: 5500, status: "재직" },
    { id: 2, name: "이영희", email: "lee@example.com", department: "디자인팀", position: "UI/UX 디자이너", joinDate: "2021-07-22", salary: 4800, status: "재직" },
    { id: 3, name: "박민수", email: "park@example.com", department: "마케팅팀", position: "마케팅 매니저", joinDate: "2019-11-08", salary: 6200, status: "재직" },
    { id: 4, name: "최지은", email: "choi@example.com", department: "인사팀", position: "인사 담당자", joinDate: "2022-01-10", salary: 4200, status: "재직" },
    { id: 5, name: "정태윤", email: "jung@example.com", department: "개발팀", position: "주니어 개발자", joinDate: "2023-05-03", salary: 3800, status: "재직" },
    { id: 6, name: "강수진", email: "kang@example.com", department: "영업팀", position: "영업 대표", joinDate: "2018-09-12", salary: 7000, status: "퇴사" },
    { id: 7, name: "윤서연", email: "yoon@example.com", department: "기획팀", position: "프로덕트 매니저", joinDate: "2020-12-01", salary: 5800, status: "재직" },
    { id: 8, name: "조현우", email: "cho@example.com", department: "개발팀", position: "프론트엔드 개발자", joinDate: "2022-08-15", salary: 4500, status: "재직" },
    { id: 9, name: "임수연", email: "lim@example.com", department: "마케팅팀", position: "디지털 마케터", joinDate: "2021-03-20", salary: 4000, status: "휴직" },
    { id: 10, name: "신민호", email: "shin@example.com", department: "영업팀", position: "영업 관리자", joinDate: "2019-05-10", salary: 6500, status: "재직" }
  ])

  // 필터링된 데이터
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesKeyword = !searchFilter.keyword || 
        user.name.toLowerCase().includes(searchFilter.keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(searchFilter.keyword.toLowerCase()) ||
        user.position.toLowerCase().includes(searchFilter.keyword.toLowerCase())
      
      const matchesDepartment = !searchFilter.department || user.department === searchFilter.department
      const matchesStatus = !searchFilter.status || user.status === searchFilter.status
      
      return matchesKeyword && matchesDepartment && matchesStatus
    })
  }, [users, searchFilter])

  // 부서 목록
  const departments = useMemo(() => {
    const depts = Array.from(new Set(users.map(user => user.department)))
    return depts.sort()
  }, [users])

  // 상태 목록
  const statuses = ['재직', '휴직', '퇴사']

  // 검색 필터 업데이트
  const updateFilter = useCallback((key: keyof SearchFilter, value: string) => {
    setSearchFilter(prev => ({ ...prev, [key]: value }))
  }, [])

  // 전체 검색 초기화
  const clearFilters = useCallback(() => {
    setSearchFilter({ keyword: '', department: '', status: '' })
    setStatus('모든 필터가 초기화되었습니다.')
  }, [])

  // 사용자 추가
  const addUser = useCallback(() => {
    const newId = Math.max(...users.map(u => u.id)) + 1
    const newUser: User = {
      id: newId,
      name: "새 사용자",
      email: `user${newId}@example.com`,
      department: "개발팀",
      position: "신입사원",
      joinDate: new Date().toISOString().split('T')[0],
      salary: 3500,
      status: "재직"
    }
    
    setUsers(prev => [...prev, newUser])
    setStatus("새 사용자가 추가되었습니다.")
  }, [users])

  // 선택된 사용자 삭제
  const deleteSelectedUsers = useCallback(() => {
    if (selectedRows.length === 0) {
      setStatus("삭제할 사용자를 선택해주세요.")
      return
    }
    
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id))
    setUsers(updatedUsers)
    setSelectedRows([])
    setStatus(`${selectedRows.length}명의 사용자가 삭제되었습니다.`)
  }, [users, selectedRows])

  // 데이터 저장
  const saveData = useCallback(() => {
    setIsLoading(true)
    // 실제로는 서버 API 호출
    setTimeout(() => {
      console.log('저장될 데이터:', filteredUsers)
      setStatus("데이터가 성공적으로 저장되었습니다.")
      setIsLoading(false)
    }, 1000)
  }, [filteredUsers])

  // Excel 내보내기
  const exportToExcel = useCallback(() => {
    const headers = ['ID', '이름', '이메일', '부서', '직급', '입사일', '급여', '상태']
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.id,
        user.name,
        user.email,
        user.department,
        user.position,
        user.joinDate,
        user.salary,
        user.status
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = '사용자목록.csv'
    link.click()
    
    setStatus("Excel 파일이 다운로드되었습니다.")
  }, [filteredUsers])

  // 급여 통계 계산
  const salaryStats = useMemo(() => {
    if (filteredUsers.length === 0) return { min: 0, max: 0, avg: 0, total: 0 }
    
    const salaries = filteredUsers.map(u => u.salary)
    return {
      min: Math.min(...salaries),
      max: Math.max(...salaries),
      avg: Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length),
      total: salaries.reduce((sum, salary) => sum + salary, 0)
    }
  }, [filteredUsers])

  // 행 선택 처리
  const handleRowSelect = useCallback((userId: number, isSelected: boolean) => {
    setSelectedRows(prev => 
      isSelected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    )
  }, [])

  // 전체 선택/해제
  const handleSelectAll = useCallback((isSelected: boolean) => {
    setSelectedRows(isSelected ? filteredUsers.map(user => user.id) : [])
  }, [filteredUsers])

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧑‍💼 실무급 유저 관리 시스템
        </h1>
        <p className="text-gray-600">
          Advanced React-based User Management with Enhanced Features
        </p>
      </div>

      {/* 통계 대시보드 */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-800 text-sm font-medium">총 인원</div>
          <div className="text-2xl font-bold text-blue-900">{filteredUsers.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-800 text-sm font-medium">평균 급여</div>
          <div className="text-2xl font-bold text-green-900">{salaryStats.avg}만원</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-purple-800 text-sm font-medium">최고 급여</div>
          <div className="text-2xl font-bold text-purple-900">{salaryStats.max}만원</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-orange-800 text-sm font-medium">선택됨</div>
          <div className="text-2xl font-bold text-orange-900">{selectedRows.length}</div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">키워드 검색</label>
            <input
              type="text"
              value={searchFilter.keyword}
              onChange={(e) => updateFilter('keyword', e.target.value)}
              placeholder="이름, 이메일, 직급 검색..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">부서</label>
            <select
              value={searchFilter.department}
              onChange={(e) => updateFilter('department', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">전체 부서</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select
              value={searchFilter.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">전체 상태</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
            >
              🔄 필터 초기화
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
          <span>총 {users.length}명 중 {filteredUsers.length}명 표시</span>
          <span>선택: {selectedRows.length}명</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={addUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          disabled={isLoading}
        >
          👤 사용자 추가
        </button>
        <button 
          onClick={saveData}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          disabled={isLoading}
        >
          💾 데이터 저장
        </button>
        <button 
          onClick={deleteSelectedUsers}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          disabled={isLoading || selectedRows.length === 0}
        >
          🗑️ 선택 삭제 ({selectedRows.length})
        </button>
        <button 
          onClick={exportToExcel}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          disabled={isLoading}
        >
          📊 Excel 내보내기
        </button>
      </div>

      {/* 데이터 테이블 */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={filteredUsers.length > 0 && selectedRows.length === filteredUsers.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 focus:ring-blue-400"
                />
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">ID</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">이름</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">이메일</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">부서</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">직급</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">입사일</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">급여</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="border border-gray-300 p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <div className="text-lg font-medium mb-2">검색 결과가 없습니다</div>
                    <div className="text-sm">다른 검색 조건을 시도해보세요</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => {
                const isSelected = selectedRows.includes(user.id)
                const statusColor = user.status === '재직' ? 'text-blue-600 bg-blue-50 border-blue-200' : 
                                   user.status === '휴직' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 
                                   'text-red-600 bg-red-50 border-red-200'
                
                return (
                  <tr 
                    key={user.id} 
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <td className="border border-gray-300 p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleRowSelect(user.id, e.target.checked)}
                        className="rounded border-gray-300 focus:ring-blue-400"
                      />
                    </td>
                    <td className="border border-gray-300 p-3 text-center font-mono text-sm font-medium">
                      {user.id}
                    </td>
                    <td className="border border-gray-300 p-3 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <a 
                        href={`mailto:${user.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {user.department}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 text-sm">{user.position}</td>
                    <td className="border border-gray-300 p-3 font-mono text-sm">{user.joinDate}</td>
                    <td className="border border-gray-300 p-3 text-right font-mono font-medium">
                      {user.salary.toLocaleString()}만원
                    </td>
                    <td className="border border-gray-300 p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 상태 바 */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">{status}</span>
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">처리 중...</span>
            </div>
          )}
        </div>
        
        {/* 추가 통계 정보 */}
        <div className="mt-3 pt-3 border-t border-gray-300 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">최저 급여: </span>
            <span className="font-medium">{salaryStats.min}만원</span>
          </div>
          <div>
            <span className="text-gray-500">최고 급여: </span>
            <span className="font-medium">{salaryStats.max}만원</span>
          </div>
          <div>
            <span className="text-gray-500">총 급여: </span>
            <span className="font-medium">{salaryStats.total.toLocaleString()}만원</span>
          </div>
          <div>
            <span className="text-gray-500">부서 수: </span>
            <span className="font-medium">{departments.length}개</span>
          </div>
        </div>
      </div>
    </div>
  )
}
