import { type FormEvent, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SignUp() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // 실제 회원가입 로직은 여기에 구현
      console.log('Sign up with:', email)
      // 임시로 로그인 페이지로 이동
      navigate('/login')
    } catch (e) {
      setError('회원가입 실패. 다시 시도하세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center sm:w-[380px] py-12">
      <div className="flex flex-col space-y-3 text-center mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">계정 만들기</h1>
        <p className="text-sm text-muted-foreground">아래에 이메일을 입력하여 계정을 만드세요</p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/30 text-left">
              {error}
            </div>
          )}
          <Button disabled={loading} type="submit" className="w-full h-10">
            {loading ? '처리 중...' : '이메일로 가입'}
          </Button>
        </form>
        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wide"><span className="bg-background px-2 text-muted-foreground">또는 계속</span></div>
        </div>
        <Button variant="outline" type="button" disabled={loading} className="w-full h-10 font-normal">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          GitHub로 계속
        </Button>
      </div>
      <div className="mt-6 space-y-2 text-center">
        <p className="text-[11px] leading-relaxed text-muted-foreground">계속하면 <a href="/terms" className="underline underline-offset-4">서비스 약관</a> 및 <a href="/privacy" className="underline underline-offset-4">개인정보 처리방침</a>에 동의하게 됩니다.</p>
        <p className="text-xs text-muted-foreground">이미 계정이 있나요? <a href="/login" className="font-medium text-foreground underline underline-offset-4 decoration-transparent hover:decoration-inherit">로그인</a></p>
      </div>
    </div>
  )
}
