'use client'

import { Users, TrendingUp, Target, UserPlus, Calendar, MessageSquare } from 'lucide-react'

export default function CRMPage() {
  const features = [
    {
      title: 'Lead Management',
      description: 'Track and qualify prospects with AI-powered insights',
      icon: Users,
      status: 'Available'
    },
    {
      title: 'Performance Analytics',
      description: 'Real-time data insights and predictive analytics',
      icon: TrendingUp,
      status: 'Available'
    },
    {
      title: 'Lead Scoring',
      description: 'AI-driven qualification and priority ranking',
      icon: Target,
      status: 'Available'
    },
    {
      title: 'Contact Management',
      description: 'Comprehensive client and prospect database',
      icon: UserPlus,
      status: 'Available'
    },
    {
      title: 'Appointment Scheduling',
      description: 'Smart calendar integration and booking',
      icon: Calendar,
      status: 'Coming Soon'
    },
    {
      title: 'Communication Hub',
      description: 'Centralized messaging and follow-up automation',
      icon: MessageSquare,
      status: 'Coming Soon'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-realtor-blue/10 to-realtor-light-blue/10 border border-realtor-light-blue/20 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center">
            <Users className="w-8 h-8 text-realtor-light-blue" />
          </div>
          <div>
            <h1 className="text-3xl dramatic-text hero-text">Smart CRM</h1>
            <p className="text-gray-400 text-lg">Lead Management & Analytics</p>
          </div>
        </div>
        <p className="text-gray-300">
          Never lose a lead again with AI-powered tracking, scoring, and automated follow-up sequences.
        </p>
      </div>

      {/* CRM Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const isComingSoon = feature.status === 'Coming Soon'
          
          return (
            <div 
              key={index} 
              className={`feature-card p-6 group ${isComingSoon ? 'opacity-60' : 'cursor-pointer hover:scale-105'} transition-all duration-300`}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                    <Icon className="w-6 h-6 text-realtor-light-blue" />
                  </div>
                  <span className={`text-xs px-3 py-1 border uppercase tracking-wider ${
                    isComingSoon 
                      ? 'border-gray-600 text-gray-500' 
                      : 'border-realtor-light-blue/30 text-realtor-light-blue'
                  }`}>
                    {feature.status}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-realtor-light-blue transition-colors duration-500 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {!isComingSoon && (
                  <button className="text-realtor-light-blue text-sm font-medium hover:text-white transition-colors duration-300 uppercase tracking-wider text-left">
                    Access Tool →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats Dashboard */}
      <div className="feature-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Lead Pipeline Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-realtor-light-blue mb-2">47</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">New Leads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-realtor-light-blue mb-2">23</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Qualified</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-realtor-light-blue mb-2">12</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">In Negotiation</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-realtor-light-blue mb-2">8</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Closing Soon</div>
          </div>
        </div>
      </div>
    </div>
  )
}
