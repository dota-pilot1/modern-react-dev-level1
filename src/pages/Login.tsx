import { type FormEvent, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (e) {
      setError('로그인 실패. 다시 시도하세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center sm:w-[380px] py-12">
      <div className="flex flex-col space-y-3 text-center mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
        <p className="text-sm text-muted-foreground">아래에 계정 정보를 입력하여 로그인하세요</p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            id="username"
            placeholder="name@example.com"
            type="text"
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect="off"
            disabled={loading}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full min-w-0 max-w-full"
          />
          <Input
            id="password"
            placeholder="비밀번호"
            type="password"
            autoComplete="current-password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full min-w-0 max-w-full"
          />
          {error && (
            <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/30">
              {error}
            </div>
          )}
          <Button disabled={loading} type="submit" className="w-full h-10">
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
        <div className="flex items-center gap-2 mt-2 w-full">
          <span className="flex-1 border-t" />
          <span className="px-2 bg-white text-[11px] text-muted-foreground uppercase tracking-wide whitespace-nowrap">또는 계속</span>
          <span className="flex-1 border-t" />
        </div>
        <Button variant="outline" type="button" disabled={loading} className="w-full h-10 font-normal">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          GitHub로 계속
        </Button>
      </div>
      <div className="mt-6 space-y-2 text-center">
        <p className="text-[11px] leading-relaxed text-muted-foreground">계속하면 <a href="/terms" className="underline underline-offset-4">서비스 약관</a> 및 <a href="/privacy" className="underline underline-offset-4">개인정보 처리방침</a>에 동의하게 됩니다.</p>
        <p className="text-xs text-muted-foreground">계정이 없나요? <a href="/signup" className="font-medium text-foreground underline underline-offset-4 decoration-transparent hover:decoration-inherit">회원가입</a></p>
      </div>
    </div>
  )
}
