'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User, Bell, Settings } from 'lucide-react'
import { useState } from 'react'

export default function DashboardHeader() {
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800/30 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title Area */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 uppercase tracking-wider">Elite Realtor Toolkit</p>
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-realtor-light-blue transition-colors duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-realtor-light-blue rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-realtor-light-blue transition-colors duration-300">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-gray-400 hover:text-realtor-light-blue transition-colors duration-300 group"
            >
              <div className="w-8 h-8 bg-realtor-light-blue/20 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-300">
                <User className="w-4 h-4 text-realtor-light-blue" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user?.email?.split('@')[0] || 'Elite User'}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Premium Member</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 shadow-xl z-50">
                <div className="p-4 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Elite Member Since 2024</p>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-300 text-left">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile Settings</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-300 text-left">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Account Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-300 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
