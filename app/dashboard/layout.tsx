'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardSidebar from '@/components/DashboardSidebar'
import DashboardHeader from '@/components/DashboardHeader'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-realtor-light-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader />
        
        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
