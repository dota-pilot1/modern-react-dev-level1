import { useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: '💻 순수 React 그리드', href: '/' },
  { label: '🚀 IBSheet 그리드', href: '/ibsheet' },
  { label: '⭐ IBSheet 고급 기능', href: '/ibsheet-advanced' }
];

const manualItems: NavItem[] = [
  { label: '📖 IBSheet 기본 메뉴얼', href: '/ibsheet-manual' },
  { label: '📋 IBSheet 테이블/조회 메뉴얼', href: '/ibsheet-basic-table-manual' },
  { label: '➕ IBSheet 행 추가 메뉴얼', href: '/ibsheet-add-row-manual' },
  { label: '✏️ IBSheet 셀 업데이트 메뉴얼', href: '/ibsheet-cell-update-manual' },
  { label: '☑️ IBSheet 전체 체크/해제 메뉴얼', href: '/ibsheet-all-check-manual' },
  { label: '⚖️ IBSheet vs AG Grid 비교', href: '/ibsheet-vs-aggrid-manual' }
];

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            className={`transition-colors hover:text-slate-900 ${
              isActive ? 'text-slate-900' : 'text-slate-600'
            }`}
          >
            {item.label}
          </a>
        );
      })}
      {/* 메뉴얼 드롭다운 */}
      <div className="relative group">
        <button className="transition-colors hover:text-slate-900 text-slate-600 flex items-center gap-1">
          <span>📚 IBSheet 메뉴얼</span>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className="inline-block"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.084l3.71-3.854a.75.75 0 1 1 1.08 1.04l-4.24 4.4a.75.75 0 0 1-1.08 0l-4.24-4.4a.75.75 0 0 1 .02-1.06z"/></svg>
        </button>
        <div
          className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded shadow-lg opacity-0 group-hover:opacity-100 hover:opacity-100 focus-within:opacity-100 pointer-events-auto transition-opacity z-50"
        >
          <ul className="py-2">
            {manualItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block px-4 py-2 hover:bg-slate-100 text-slate-700 ${location.pathname === item.href ? 'font-bold text-slate-900' : ''}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
