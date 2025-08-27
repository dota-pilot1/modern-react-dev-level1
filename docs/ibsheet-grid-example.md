# IBSheet Grid 예제 가이드

## 개요

이 프로젝트의 IBSheetGrid 컴포넌트는 IB Sheet v8을 React 환경에서 사용하는 예제입니다.  
유저 목록을 관리할 수 있는 데이터 그리드 기능을 제공합니다.

## 주요 기능

### 1. 데이터 관리
- **사용자 추가**: 새로운 사용자를 그리드에 추가
- **사용자 삭제**: 선택된 행을 삭제
- **데이터 저장**: 현재 그리드 데이터를 저장 (콘솔 출력)
- **Excel 내보내기**: 그리드 데이터를 Excel 파일로 다운로드
- **데이터 새로고침**: 원본 샘플 데이터로 다시 로드

### 2. 그리드 기능
- **정렬**: 각 컬럼별 오름차순/내림차순 정렬
- **편집**: 셀 직접 편집 가능 (ID 제외)
- **선택**: 단일/다중 행 선택
- **검증**: 필수 필드 및 이메일 형식 검증

### 3. 컬럼 구성
| 헤더 | 타입 | 설명 | 옵션 |
|------|------|------|------|
| ID | Int | 사용자 고유 번호 | 편집 불가 |
| 이름 | Text | 사용자 이름 | 필수 |
| 이메일 | Email | 이메일 주소 | 필수, 형식 검증 |
| 부서 | Enum | 소속 부서 | 드롭다운 선택 |
| 직급 | Text | 직급/직책 | |
| 입사일 | Date | 입사일 | yyyy-MM-dd 형식 |
| 급여 | Int | 급여 | 천 단위 구분자 |
| 상태 | Enum | 재직 상태 | 색상 구분 |

## 기술 구조

### 컴포넌트 구조
```
IBSheetGrid.tsx
├── useState: 상태 관리
│   ├── mySheet: IB Sheet 인스턴스
│   ├── status: 상태 메시지
│   ├── isLoading: 로딩 상태
│   └── sampleUsers: 샘플 데이터
├── useEffect: 라이브러리 동적 로딩
├── useRef: DOM 참조 (sheetRef)
└── Functions: 각종 기능 함수들
```

### 라이브러리 로딩
```javascript
// CSS 동적 로딩
const cssLink = document.createElement('link')
cssLink.href = 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/lib/ibsheet.css'

// JavaScript 동적 로딩
const script = document.createElement('script')
script.src = 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/lib/ibsheet.js'
```

## IB Sheet 설정

### 기본 설정 (sheetOptions)
```javascript
{
  Cfg: {
    SearchMode: 2,    // 검색 모드
    Page: 50          // 페이지당 행 수
  },
  Def: {
    Row: {
      CanFormula: true,     // 수식 사용 가능
      CalcOrder: "id"       // 계산 순서
    }
  },
  Cols: [...]             // 컬럼 정의
}
```

### 컬럼 타입 설명
- **Int**: 정수형 숫자
- **Text**: 일반 텍스트
- **Email**: 이메일 형식 검증
- **Enum**: 드롭다운 선택 (미리 정의된 값들)
- **Date**: 날짜 형식

## 사용 방법

### 1. 페이지 접근
- 헤더 메뉴에서 "IBSheet Grid" 클릭
- 또는 직접 `/grid` 경로로 이동

### 2. 기본 조작
1. **사용자 추가**: "사용자 추가" 버튼 클릭
2. **데이터 편집**: 셀을 직접 클릭하여 수정
3. **행 선택**: 행을 클릭하여 선택
4. **삭제**: 행 선택 후 "선택 삭제" 버튼
5. **저장**: "데이터 저장" 버튼으로 현재 상태 저장

### 3. Excel 내보내기
- "Excel 내보내기" 버튼 클릭
- `사용자목록.xlsx` 파일이 다운로드됨
- IB Sheet가 로드된 경우에만 사용 가능

## Fallback 기능

IB Sheet 라이브러리 로드에 실패할 경우, 자동으로 대체 테이블이 표시됩니다.

### 대체 테이블 기능
- 동일한 데이터 표시
- 체크박스를 통한 선택 기능
- 기본적인 CRUD 작업 지원
- Tailwind CSS를 활용한 반응형 디자인

## 샘플 데이터

총 7명의 샘플 사용자가 포함되어 있습니다:

1. **김철수** - 개발팀 시니어 개발자
2. **이영희** - 디자인팀 UI/UX 디자이너
3. **박민수** - 마케팅팀 마케팅 매니저
4. **최지은** - 인사팀 인사 담당자
5. **정태윤** - 개발팀 주니어 개발자
6. **강수진** - 영업팀 영업 대표 (퇴사)
7. **윤서연** - 기획팀 프로덕트 매니저

## 이벤트 처리

### IB Sheet 이벤트
- `onRenderFirstFinish`: 시트 로드 완료
- `onRowSearchEnd`: 행 선택 변경

### React 이벤트
- 버튼 클릭 이벤트들
- 컴포넌트 마운트/언마운트 처리

## 주의사항

1. **라이브러리 의존성**: 외부 CDN에 의존하므로 네트워크 상태 영향
2. **메모리 관리**: 컴포넌트 언마운트 시 IB Sheet 인스턴스 정리 필요
3. **브라우저 호환성**: IB Sheet v8의 브라우저 지원 범위 확인 필요

## 확장 가능성

- 서버 API와 연동하여 실제 데이터 CRUD
- 더 복잡한 그리드 기능 (필터링, 그룹핑 등)
- 사용자 권한별 기능 제한
- 실시간 데이터 업데이트

---

이 문서는 IBSheetGrid 컴포넌트의 구조와 사용법을 설명합니다.  
추가 질문이나 기능 요청이 있으면 언제든 문의해 주세요.
