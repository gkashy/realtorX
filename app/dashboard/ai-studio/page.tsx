'use client'

import { Brain, Video, Palette, Wand2, Image as ImageIcon } from 'lucide-react'

export default function AIStudioPage() {
  const tools = [
    {
      title: 'Property Video Generator',
      description: 'Transform 2D images into immersive 3D virtual tours',
      icon: Video,
      status: 'Available',
      comingSoon: false
    },
    {
      title: 'Virtual Staging',
      description: 'AI-powered staging and interior design',
      icon: Palette,
      status: 'Available',
      comingSoon: false
    },
    {
      title: 'Content Generator',
      description: 'Create compelling property descriptions and marketing copy',
      icon: Wand2,
      status: 'Available',
      comingSoon: false
    },
    {
      title: 'Image Enhancement',
      description: 'Professional photo editing and enhancement',
      icon: ImageIcon,
      status: 'Coming Soon',
      comingSoon: true
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-realtor-blue/10 to-realtor-light-blue/10 border border-realtor-light-blue/20 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center">
            <Brain className="w-8 h-8 text-realtor-light-blue" />
          </div>
          <div>
            <h1 className="text-3xl dramatic-text hero-text">AI Studio</h1>
            <p className="text-gray-400 text-lg">Content & Media Generation Toolkit</p>
          </div>
        </div>
        <p className="text-gray-300">
          Create stunning visual content that positions you as the premium choice in your market.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, index) => {
          const Icon = tool.icon
          return (
            <div 
              key={index} 
              className={`feature-card p-8 group ${tool.comingSoon ? 'opacity-60' : 'cursor-pointer hover:scale-105'} transition-all duration-300`}
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                  <Icon className="w-8 h-8 text-realtor-light-blue" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-realtor-light-blue transition-colors duration-500">
                      {tool.title}
                    </h3>
                    <span className={`text-xs px-3 py-1 border uppercase tracking-wider ${
                      tool.comingSoon 
                        ? 'border-gray-600 text-gray-500' 
                        : 'border-realtor-light-blue/30 text-realtor-light-blue'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    {tool.description}
                  </p>
                  {!tool.comingSoon && (
                    <button className="mt-4 text-realtor-light-blue text-sm font-medium hover:text-white transition-colors duration-300 uppercase tracking-wider">
                      Launch Tool →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
