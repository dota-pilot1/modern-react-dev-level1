import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LoginLayout from './components/LoginLayout'
import UserGrid from './pages/UserGrid'
import IBSheetGrid from './pages/IBSheetGrid'
import IBSheetManual from './pages/IBSheetManual'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { AuthProvider, useAuth } from './auth'

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6">로딩중...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<LoginLayout />}> {/* 로그인 전용 레이아웃 */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
          <Route element={<Layout />}> {/* 공통 레이아웃 */}
            <Route
              index
              element={
                <ProtectedRoute>
                  <UserGrid />
                </ProtectedRoute>
              }
            />
            <Route
              path="ibsheet"
              element={
                <ProtectedRoute>
                  <IBSheetGrid />
                </ProtectedRoute>
              }
            />
            <Route
              path="ibsheet-manual"
              element={
                <ProtectedRoute>
                  <IBSheetManual />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
