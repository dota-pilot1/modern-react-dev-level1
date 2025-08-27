import { useState } from 'react'
import { useAuth } from '../../auth'
import { Button } from '@/components/ui/button'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const userName = user.username || 'User'

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 rounded-full p-0"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-50 border border-slate-300 shadow">
          <span className="text-base font-semibold">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-4 w-56 rounded-md border border-slate-200 bg-white p-0 shadow-md">
            <div className="flex flex-col items-center justify-center gap-2 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-slate-50 border border-slate-300 shadow-lg">
                <span className="text-xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col items-center space-y-1 leading-none mt-1">
                <p className="font-medium text-slate-900 text-base">{userName}</p>
                <p className="text-xs text-slate-600">{userName}@demo.com</p>
              </div>
            </div>
            <div className="border-t border-slate-200" />
            <div className="p-1">
              <button
                onClick={() => {
                  setIsOpen(false)
                  logout()
                }}
                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-slate-900 outline-none hover:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                로그아웃
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
