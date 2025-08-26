import { Outlet, Link } from 'react-router-dom'

export default function LoginLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 text-slate-900">
      {/* Brand / Visual Panel */}
      <div className="hidden lg:flex flex-col relative overflow-hidden p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-slate-100">
        <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-50 font-semibold text-xl">
              <span className="inline-block h-8 w-8 rounded-md bg-slate-100 text-slate-900 font-bold grid place-items-center text-sm shadow">LOGO</span>
              <span>App Portal</span>
            </Link>
          </div>
          <div className="mt-auto space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight leading-tight">데이터 그리드<br />관리 포털</h2>
            <p className="text-sm max-w-xs text-slate-200/80 leading-relaxed">
              빠르고 유연한 IBSheet 기반 업무용 데이터 관리 인터페이스. 안전한 인증과 직관적인 UI를 제공합니다.
            </p>
            <div className="flex gap-4 pt-4 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-400" />안정적</span>
              <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-sky-400" />실시간</span>
              <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-violet-400" />확장성</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-8 text-[11px] text-slate-400/70">
          © {new Date().getFullYear()} App. All rights reserved.
        </div>
      </div>

      {/* Auth Card */}
      <div className="flex items-center justify-center px-6 py-12 lg:px-12">
  <div className="w-full max-w-[480px]">
          <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-xl p-8">
            <Outlet />
          </div>
          <div className="mt-8 text-center text-[11px] text-slate-400">
            <Link to="/" className="hover:text-slate-600 transition-colors">© {new Date().getFullYear()} App</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
