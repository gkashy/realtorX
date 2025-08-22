'use client'

import { Phone, MessageSquare, Mic, BarChart3, Clock, Zap } from 'lucide-react'

export default function CommunicationsPage() {
  const features = [
    {
      title: 'AI Call Analysis',
      description: 'Psychology-based conversation analysis and optimization',
      icon: Phone,
      status: 'Available'
    },
    {
      title: 'Smart SMS Campaigns',
      description: 'Automated messaging with AI-powered personalization',
      icon: MessageSquare,
      status: 'Available'
    },
    {
      title: 'Voice Intelligence',
      description: 'Real-time call coaching and sentiment analysis',
      icon: Mic,
      status: 'Available'
    },
    {
      title: 'Communication Analytics',
      description: 'Track engagement and conversion metrics',
      icon: BarChart3,
      status: 'Available'
    },
    {
      title: 'Follow-up Automation',
      description: 'Intelligent scheduling and reminder systems',
      icon: Clock,
      status: 'Coming Soon'
    },
    {
      title: 'Lead Qualification Bot',
      description: 'AI-powered initial lead screening and routing',
      icon: Zap,
      status: 'Coming Soon'
    }
  ]

  const recentCalls = [
    { client: 'Sarah Johnson', duration: '12:34', score: 94, outcome: 'Qualified Lead' },
    { client: 'Mike Chen', duration: '8:21', score: 87, outcome: 'Follow-up Scheduled' },
    { client: 'Lisa Rodriguez', duration: '15:42', score: 96, outcome: 'Listing Appointment' },
    { client: 'David Kim', duration: '6:18', score: 72, outcome: 'Needs Nurturing' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-realtor-blue/10 to-realtor-light-blue/10 border border-realtor-light-blue/20 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center">
            <Phone className="w-8 h-8 text-realtor-light-blue" />
          </div>
          <div>
            <h1 className="text-3xl dramatic-text hero-text">Voice & SMS</h1>
            <p className="text-gray-400 text-lg">AI Call Intelligence & Messaging</p>
          </div>
        </div>
        <p className="text-gray-300">
          Psychology-based AI analysis that qualifies leads and optimizes every client conversation for maximum conversion.
        </p>
      </div>

      {/* Communication Tools Grid */}
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
                    Launch Tool →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Call Analysis */}
      <div className="feature-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Recent Call Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 text-gray-400 text-sm uppercase tracking-wider">Client</th>
                <th className="text-left py-4 text-gray-400 text-sm uppercase tracking-wider">Duration</th>
                <th className="text-left py-4 text-gray-400 text-sm uppercase tracking-wider">AI Score</th>
                <th className="text-left py-4 text-gray-400 text-sm uppercase tracking-wider">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call, index) => (
                <tr key={index} className="border-b border-gray-800/50 hover:bg-realtor-light-blue/5 transition-colors duration-300">
                  <td className="py-4 text-white font-medium">{call.client}</td>
                  <td className="py-4 text-gray-400">{call.duration}</td>
                  <td className="py-4">
                    <span className={`text-sm font-bold ${
                      call.score >= 90 ? 'text-green-400' : 
                      call.score >= 80 ? 'text-realtor-light-blue' : 
                      'text-yellow-400'
                    }`}>
                      {call.score}%
                    </span>
                  </td>
                  <td className="py-4 text-gray-300">{call.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
