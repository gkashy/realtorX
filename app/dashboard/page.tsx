'use client'

import { useAuth } from '@/contexts/AuthContext'
import { 
  Brain, 
  Users, 
  Phone, 
  TrendingUp, 
  DollarSign, 
  Target,
  ArrowRight,
  Activity,
  Calendar,
  MessageSquare
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Active Leads',
      value: '127',
      change: '+12%',
      positive: true,
      icon: Users
    },
    {
      title: 'Conversion Rate',
      value: '34.2%',
      change: '+8.1%',
      positive: true,
      icon: Target
    },
    {
      title: 'Revenue This Month',
      value: '$89,420',
      change: '+23%',
      positive: true,
      icon: DollarSign
    },
    {
      title: 'AI Engagement',
      value: '96%',
      change: '+5.2%',
      positive: true,
      icon: Activity
    }
  ]

  const quickActions = [
    {
      title: 'Generate Property Video',
      description: 'Create immersive 3D tours from photos',
      icon: Brain,
      href: '/dashboard/ai-studio/video',
      color: 'realtor-light-blue'
    },
    {
      title: 'Analyze Lead Quality',
      description: 'AI-powered lead scoring and insights',
      icon: Users,
      href: '/dashboard/crm/leads',
      color: 'realtor-light-blue'
    },
    {
      title: 'Schedule AI Call',
      description: 'Set up intelligent call analysis',
      icon: Phone,
      href: '/dashboard/communications/calls',
      color: 'realtor-light-blue'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-realtor-blue/10 to-realtor-light-blue/10 border border-realtor-light-blue/20 p-8">
        <h1 className="text-3xl dramatic-text mb-4 hero-text">
          Welcome Back, Elite Agent
        </h1>
        <p className="text-gray-400 text-lg">
          {user?.email && `${user.email.split('@')[0]}, `}
          your premium toolkit is ready. Let's close more deals today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="feature-card p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                  <Icon className="w-6 h-6 text-realtor-light-blue" />
                </div>
                <div className={`text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-sm uppercase tracking-wider">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div key={index} className="feature-card p-6 group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                    <Icon className="w-6 h-6 text-realtor-light-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-realtor-light-blue transition-colors duration-500 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center text-realtor-light-blue text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                      Launch Tool
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Recent Activity</h2>
        <div className="feature-card p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border-l-2 border-realtor-light-blue/30">
              <div className="w-8 h-8 bg-realtor-light-blue/20 border border-realtor-light-blue/30 flex items-center justify-center">
                <Brain className="w-4 h-4 text-realtor-light-blue" />
              </div>
              <div>
                <p className="text-white font-medium">AI Video Generated</p>
                <p className="text-gray-500 text-sm">3D tour created for 1234 Oak Street • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border-l-2 border-realtor-light-blue/30">
              <div className="w-8 h-8 bg-realtor-light-blue/20 border border-realtor-light-blue/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-realtor-light-blue" />
              </div>
              <div>
                <p className="text-white font-medium">New Lead Qualified</p>
                <p className="text-gray-500 text-sm">High-value prospect identified • 4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border-l-2 border-realtor-light-blue/30">
              <div className="w-8 h-8 bg-realtor-light-blue/20 border border-realtor-light-blue/30 flex items-center justify-center">
                <Phone className="w-4 h-4 text-realtor-light-blue" />
              </div>
              <div>
                <p className="text-white font-medium">Call Analysis Complete</p>
                <p className="text-gray-500 text-sm">Client conversation optimized • 6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
