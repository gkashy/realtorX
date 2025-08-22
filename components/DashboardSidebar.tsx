'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Brain, 
  Users, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare 
} from 'lucide-react'

const navigationItems = [
  {
    name: 'AI Studio',
    href: '/dashboard/ai-studio',
    icon: Brain,
    description: 'Content & Media Generation'
  },
  {
    name: 'Smart CRM',
    href: '/dashboard/crm',
    icon: Users,
    description: 'Lead Management & Analytics'
  },
  {
    name: 'Voice & SMS',
    href: '/dashboard/communications',
    icon: Phone,
    description: 'AI Call Intelligence & Messaging'
  }
]

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} transition-all duration-300 bg-black border-r border-gray-800/30 flex flex-col relative`}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-realtor-light-blue hover:border-realtor-light-blue/50 transition-colors duration-300 z-10"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800/30">
        <div className="flex items-center">
          <Image
            src="/Logo.png"
            alt="RealtorX"
            width={isCollapsed ? 40 : 160}
            height={isCollapsed ? 40 : 50}
            className={`${isCollapsed ? 'h-10 w-10' : 'h-12 w-auto'} transition-all duration-300`}
          />
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-sm font-bold text-white uppercase tracking-wider">
                Elite Dashboard
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Premium Toolkit
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-4">
          {navigationItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center space-x-4 p-4 rounded-none border transition-all duration-300
                  ${isActive 
                    ? 'bg-realtor-light-blue/10 border-realtor-light-blue/30 text-realtor-light-blue' 
                    : 'border-gray-800/30 text-gray-400 hover:border-realtor-light-blue/30 hover:text-realtor-light-blue hover:bg-realtor-light-blue/5'
                  }
                `}
              >
                <div className={`flex-shrink-0 w-6 h-6 ${isActive ? 'text-realtor-light-blue' : 'text-gray-500 group-hover:text-realtor-light-blue'} transition-colors duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm uppercase tracking-wider">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-800/30">
        {!isCollapsed && (
          <div className="text-center">
            <div className="w-12 h-12 border border-realtor-light-blue/30 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-realtor-light-blue" />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Need Support?
            </p>
            <button className="text-xs text-realtor-light-blue hover:text-white transition-colors duration-300 uppercase tracking-wider">
              Contact Elite Support
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
