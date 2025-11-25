import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import { Homepage, SignUpPage, ProfilePage, SettingsPage, LoginPage } from './pages'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useThemeStore();
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  if (!authUser && isCheckingAuth) {
    return <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
