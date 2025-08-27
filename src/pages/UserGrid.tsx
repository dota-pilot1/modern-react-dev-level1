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

export default function UserGrid() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [status, setStatus] = useState('순수 React 그리드가 준비되었습니다.')
  // ...existing code...
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

  // ...existing code...
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

  // ...existing code...
  // 부서 목록
  const departments = useMemo(() => {
    const depts = Array.from(new Set(users.map(user => user.department)))
    return depts.sort()
  }, [users])

  // 상태 목록
  const statuses = ['재직', '휴직', '퇴사']

  // ...existing code...
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
          🟦 순수 React 유저 그리드
        </h1>
        <p className="text-gray-600">
          Pure React Grid Example (No IBSheet)
        </p>
      </div>
      {/* ...existing code... */}
      {/* 이하 기존 테이블/기능 그대로 유지 */}
      {/* ...existing code... */}
    </div>
  )
}
