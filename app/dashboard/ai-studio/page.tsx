'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Brain, 
  Video, 
  Palette, 
  Wand2, 
  Image as ImageIcon,
  Sparkles,
  Camera,
  FileText,
  Layers,
  Zap,
  Play,
  Upload,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Download,
  Eye,
  RefreshCw,
  Star,
  Target,
  Brush,
  Film,
  PaintBucket,
  Scissors,
  Globe,
  Cpu,
  TrendingUp,
  Users,
  Heart,
  Share2
} from 'lucide-react'

// Import AI Studio Components
import ContentGenerationTools from '@/components/ai-studio/ContentGenerationTools'
import VirtualStagingTools from '@/components/ai-studio/VirtualStagingTools'
import VideoGenerationTools from '@/components/ai-studio/VideoGenerationTools'
import BrandManagementTools from '@/components/ai-studio/BrandManagementTools'
import BatchProcessingTools from '@/components/ai-studio/BatchProcessingTools'
import JobTracker from '@/components/ai-studio/JobTracker'

// Types
interface Job {
  id: string
  type: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  created_at: string
  result_data?: any
}

interface AIStudioStats {
  totalJobs: number
  completedJobs: number
  processingJobs: number
  savedAssets: number
}

export default function AIStudioPage() {
  const { user, session } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<AIStudioStats>({
    totalJobs: 0,
    completedJobs: 0,
    processingJobs: 0,
    savedAssets: 0
  })
  const [isGenerating, setIsGenerating] = useState(false)

  // AI Studio Categories
  const aiCategories = [
    {
      id: 'content',
      name: 'Content Generation',
      icon: Wand2,
      color: 'from-purple-500 to-pink-500',
      description: 'Create marketing copy, social posts, and business cards',
      tools: [
        { name: 'Hero Images', icon: ImageIcon, action: 'generate_hero_image' },
        { name: 'Business Cards', icon: FileText, action: 'generate_business_card' },
        { name: 'Social Posts', icon: Share2, action: 'generate_social_post' },
        { name: 'Property Flyers', icon: FileText, action: 'generate_flyer' },
        { name: 'Marketing Copy', icon: FileText, action: 'generate_copy' }
      ]
    },
    {
      id: 'staging',
      name: 'Virtual Staging',
      icon: Palette,
      color: 'from-blue-500 to-cyan-500',
      description: 'Transform empty spaces with AI-powered interior design',
      tools: [
        { name: 'Basic Staging', icon: PaintBucket, action: 'virtual_staging', tier: 'basic' },
        { name: 'Advanced SAM', icon: Layers, action: 'advanced_virtual_staging', tier: 'advanced' },
        { name: 'Pixel Perfect', icon: Sparkles, action: 'pixel_perfect_staging', tier: 'premium' }
      ]
    },
    {
      id: 'video',
      name: 'Video Generation',
      icon: Video,
      color: 'from-green-500 to-emerald-500',
      description: 'Create property tours and cinematic videos',
      tools: [
        { name: 'Scene Planning', icon: Film, action: 'plan_video_scenes' },
        { name: 'Video Tours', icon: Play, action: 'queue_video_tour' },
        { name: 'Property Videos', icon: Camera, action: 'queue_property_video' }
      ]
    },
    {
      id: 'branding',
      name: 'Brand Management',
      icon: Brush,
      color: 'from-orange-500 to-red-500',
      description: 'AI-powered brand creation and management',
      tools: [
        { name: 'Create from Description', icon: FileText, action: 'create_from_description' },
        { name: 'Logo Analysis', icon: Eye, action: 'analyze_logo' },
        { name: 'Website Extraction', icon: Globe, action: 'extract_from_website' },
        { name: 'Brand Variations', icon: Scissors, action: 'generate_variations' }
      ]
    },
    {
      id: 'batch',
      name: 'Batch Processing',
      icon: Layers,
      color: 'from-indigo-500 to-purple-500',
      description: 'Process multiple listings simultaneously',
      tools: [
        { name: 'Batch Content', icon: Cpu, action: 'queue_batch_content' },
        { name: 'Bulk Staging', icon: Layers, action: 'queue_virtual_staging' }
      ]
    }
  ]

  // Mock data for demonstration
  useEffect(() => {
    // Simulate real-time job updates
    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => ({
        ...job,
        progress: job.status === 'processing' ? Math.min(job.progress + Math.random() * 10, 100) : job.progress,
        status: job.progress >= 100 ? 'completed' : job.status
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleGenerateContent = async (action: string, categoryId: string) => {
    setIsGenerating(true)
    
    // Create new job
    const newJob: Job = {
      id: Date.now().toString(),
      type: action,
      status: 'processing',
      progress: 0,
      created_at: new Date().toISOString()
    }
    
    setJobs(prev => [newJob, ...prev])
    
    // Simulate API call to your serverless functions
    try {
      // This would be your actual API call
      // const response = await fetch('/api/ai-realtime', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     action,
      //     data: { /* your data */ }
      //   })
      // })
      
      setTimeout(() => {
        setIsGenerating(false)
        setStats(prev => ({
          ...prev,
          totalJobs: prev.totalJobs + 1,
          processingJobs: prev.processingJobs + 1
        }))
      }, 1000)
    } catch (error) {
      console.error('Generation failed:', error)
      setIsGenerating(false)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Jobs', value: stats.totalJobs, icon: BarChart3, color: 'text-blue-400' },
          { label: 'Processing', value: stats.processingJobs, icon: Clock, color: 'text-yellow-400' },
          { label: 'Completed', value: stats.completedJobs, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Saved Assets', value: stats.savedAssets, icon: Download, color: 'text-purple-400' }
        ].map((stat, index) => (
          <div key={index} className="bg-gray-900/50 border border-gray-700/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* AI Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {aiCategories.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.id}
              className="group relative bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-500 cursor-pointer backdrop-blur-sm"
              onClick={() => setActiveTab(category.id)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{category.tools.length} Tools Available</p>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {category.tools.slice(0, 3).map((tool, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gray-800 border-2 border-gray-700 rounded-full flex items-center justify-center"
                      >
                        <tool.icon className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                    {category.tools.length > 3 && (
                      <div className="w-8 h-8 bg-gray-800 border-2 border-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-400">+{category.tools.length - 3}</span>
                      </div>
                    )}
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-realtor-light-blue group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Jobs */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Jobs</h3>
          <button className="text-realtor-light-blue hover:text-white text-sm font-medium transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {jobs.slice(0, 5).map((job) => (
            <div key={job.id} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="flex-shrink-0">
                {job.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {job.status === 'processing' && <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />}
                {job.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {job.status === 'queued' && <Clock className="w-5 h-5 text-gray-400" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate capitalize">
                  {job.type.replace(/_/g, ' ')}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(job.created_at).toLocaleTimeString()}
                </p>
              </div>
              
              {job.status === 'processing' && (
                <div className="flex-shrink-0 w-24">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-realtor-light-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {job.status === 'completed' && (
                <button className="text-realtor-light-blue hover:text-white text-sm font-medium transition-colors">
                  Download
                </button>
              )}
            </div>
          ))}
          
          {jobs.length === 0 && (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No AI jobs yet. Start creating!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderCategoryTools = (categoryId: string) => {
    const category = aiCategories.find(c => c.id === categoryId)
    if (!category) return null

    const Icon = category.icon

    // Get user token for API calls
    const userToken = session?.access_token || ''
    
              // Debug token availability
          console.log('Auth state:', { 
            hasUser: !!user, 
            hasSession: !!session, 
            hasToken: !!userToken,
            tokenLength: userToken.length,
            actualToken: userToken // Show full token for debugging
          })

    return (
      <div className="space-y-6">
        {/* Category Header */}
        <div className={`relative bg-gradient-to-br ${category.color} rounded-xl p-8 text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{category.name}</h2>
                <p className="text-white/80">{category.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{category.tools.length} Tools</span>
              </span>
              <span className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>AI Powered</span>
              </span>
            </div>
          </div>
        </div>

        {/* Render specific category component */}
        {categoryId === 'content' && (
          <ContentGenerationTools 
            userToken={userToken}
            onJobCreated={(job) => handleJobCreated(job)}
          />
        )}
        
        {categoryId === 'staging' && (
          <VirtualStagingTools 
            userToken={userToken}
            onJobCreated={(job) => handleJobCreated(job)}
          />
        )}
        
        {categoryId === 'video' && (
          <VideoGenerationTools 
            userToken={userToken}
            onJobCreated={(job) => handleJobCreated(job)}
          />
        )}
        
        {categoryId === 'branding' && (
          <BrandManagementTools 
            userToken={userToken}
            onJobCreated={(job) => handleJobCreated(job)}
          />
        )}
        
        {categoryId === 'batch' && (
          <BatchProcessingTools 
            userToken={userToken}
            onJobCreated={(job) => handleJobCreated(job)}
          />
        )}
        
        {categoryId === 'jobs' && (
          <JobTracker 
            userToken={userToken}
            userId={user?.id || ''}
            companyId="demo-company-id"
            showHeader={false}
            maxJobs={100}
            autoRefresh={true}
          />
        )}
      </div>
    )
  }

  const handleJobCreated = (job: any) => {
    // Handle job creation - add to jobs list
    const newJob: Job = {
      id: job.id || Date.now().toString(),
      type: job.job_type || job.type || 'unknown',
      status: job.status || 'queued',
      progress: job.progress || 0,
      created_at: job.created_at || new Date().toISOString()
    }
    
    setJobs(prev => [newJob, ...prev])
    setStats(prev => ({
      ...prev,
      totalJobs: prev.totalJobs + 1,
      processingJobs: prev.processingJobs + 1
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-realtor-blue/20 via-realtor-light-blue/20 to-purple-500/20 border border-realtor-light-blue/20 rounded-xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-realtor-light-blue to-purple-500 rounded-xl flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">AI Studio</h1>
                <p className="text-gray-300 text-lg">Professional Real Estate Content Generation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">Welcome back!</p>
                <p className="text-gray-400 text-sm">Ready to create amazing content?</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-8 text-sm">
            <span className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>18 AI Tools Available</span>
            </span>
            <span className="flex items-center space-x-2 text-blue-400">
              <Zap className="w-4 h-4" />
              <span>Real-time Processing</span>
            </span>
            <span className="flex items-center space-x-2 text-purple-400">
              <Star className="w-4 h-4" />
              <span>Premium Quality</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-900/50 rounded-xl p-1 border border-gray-700/50 backdrop-blur-sm overflow-x-auto">
        {[
          { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
          ...aiCategories.map(cat => ({ id: cat.id, name: cat.name, icon: cat.icon })),
          { id: 'jobs', name: 'Job Tracker', icon: Clock }
        ].map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-realtor-light-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="font-medium">{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'dashboard' ? renderDashboard() : renderCategoryTools(activeTab)}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-realtor-light-blue to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generating Content...</h3>
            <p className="text-gray-400">Our AI is working its magic</p>
          </div>
        </div>
      )}
    </div>
  )
}