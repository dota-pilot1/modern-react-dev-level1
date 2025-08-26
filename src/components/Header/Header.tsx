import Navigation from './Navigation'
import UserMenu from './UserMenu'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* 로고 */}
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-slate-50">
              <span className="text-sm font-bold">IB</span>
            </div>
            <span className="font-bold text-slate-900 hidden sm:inline-block">IBSheet Practice</span>
          </a>
        </div>

        {/* 네비게이션 */}
        <Navigation />

        {/* 사용자 메뉴 */}
        <UserMenu />
      </div>
    </header>
  )
}
