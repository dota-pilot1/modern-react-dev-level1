import { useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: '� 순수 React 그리드', href: '/' },
  { label: '🚀 IBSheet 그리드', href: '/ibsheet' },
  { label: '📖 IBSheet 메뉴얼', href: '/ibsheet-manual' }
]

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href
        
        return (
          <a
            key={item.href}
            href={item.href}
            className={`transition-colors hover:text-slate-900 ${
              isActive 
                ? 'text-slate-900' 
                : 'text-slate-600'
            }`}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
