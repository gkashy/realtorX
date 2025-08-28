'use client'

import { useState, useEffect } from 'react'
import { 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  ArrowRight,
  Zap,
  Star,
  TrendingUp,
  Calendar,
  User,
  Building
} from 'lucide-react'
import { JobTracker as JobTrackerClass, AIJob, formatJobType, getJobStatusColor } from '@/lib/ai-studio'

interface JobTrackerProps {
  userToken: string
  userId: string
  companyId: string
  showHeader?: boolean
  maxJobs?: number
  autoRefresh?: boolean
}

export default function JobTracker({ 
  userToken, 
  userId, 
  companyId, 
  showHeader = true, 
  maxJobs = 50,
  autoRefresh = true 
}: JobTrackerProps) {
  const [jobs, setJobs] = useState<AIJob[]>([])
  const [filteredJobs, setFilteredJobs] = useState<AIJob[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    completed: 0,
    failed: 0
  })

  const jobTracker = new JobTrackerClass()

  useEffect(() => {
    // Subscribe to real-time job updates
    if (autoRefresh) {
      jobTracker.subscribeToJobs(userId, (updatedJobs) => {
        setJobs(updatedJobs.slice(0, maxJobs))
        setIsLoading(false)
      })
    }

    return () => {
      jobTracker.unsubscribeFromJobs(userId)
    }
  }, [userId, maxJobs, autoRefresh])

  useEffect(() => {
    // Filter jobs based on current filters
    let filtered = jobs

    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => job.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.job_type === filterType)
    }

    if (searchTerm) {
      filtered = filtered.filter(job => 
        formatJobType(job.job_type).toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.listing_id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredJobs(filtered)

    // Update stats
    setStats({
      total: jobs.length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length
    })
  }, [jobs, filterStatus, filterType, searchTerm])

  const getJobIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'queued':
        return <Clock className="w-5 h-5 text-gray-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getJobTypeIcon = (jobType: string) => {
    const iconMap: Record<string, string> = {
      'generate_hero_image': '🖼️',
      'generate_business_card': '💼',
      'generate_social_post': '📱',
      'generate_flyer': '📄',
      'generate_copy': '✍️',
      'virtual_staging': '🏠',
      'advanced_virtual_staging': '🎯',
      'pixel_perfect_staging': '👑',
      'plan_video_scenes': '🎬',
      'queue_video_tour': '🎥',
      'create_from_description': '🎨',
      'analyze_logo': '📷',
      'extract_from_website': '🌐',
      'queue_batch_content': '📦',
      'queue_virtual_staging': '🏢'
    }
    return iconMap[jobType] || '⚡'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/20'
      case 'high':
        return 'text-orange-400 bg-orange-500/20'
      case 'normal':
        return 'text-blue-400 bg-blue-500/20'
      case 'low':
        return 'text-gray-400 bg-gray-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const handleRetryJob = async (jobId: string) => {
    // Implement job retry logic
    console.log('Retrying job:', jobId)
  }

  const handleCancelJob = async (jobId: string) => {
    // Implement job cancellation logic
    console.log('Cancelling job:', jobId)
  }

  const handleDownloadResult = async (jobId: string) => {
    // Implement download logic
    console.log('Downloading result for job:', jobId)
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-8 backdrop-blur-sm text-center">
        <RefreshCw className="w-8 h-8 text-realtor-light-blue animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading job history...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Job Tracker</h2>
              <p className="text-gray-300">Monitor your AI generation jobs in real-time</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">{stats.total} Total Jobs</p>
                <p className="text-gray-400 text-sm">{stats.processing} processing</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'text-blue-400', icon: Zap },
              { label: 'Processing', value: stats.processing, color: 'text-yellow-400', icon: RefreshCw },
              { label: 'Completed', value: stats.completed, color: 'text-green-400', icon: CheckCircle },
              { label: 'Failed', value: stats.failed, color: 'text-red-400', icon: AlertCircle }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-realtor-light-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select 
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-realtor-light-blue"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="queued">Queued</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            
            <select 
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-realtor-light-blue"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="generate_hero_image">Hero Images</option>
              <option value="generate_business_card">Business Cards</option>
              <option value="generate_social_post">Social Posts</option>
              <option value="virtual_staging">Virtual Staging</option>
              <option value="queue_video_tour">Video Tours</option>
              <option value="create_from_description">Brand Creation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Job Icon & Status */}
                <div className="flex-shrink-0">
                  {getJobIcon(job.status)}
                </div>
                
                {/* Job Type Icon */}
                <div className="text-2xl flex-shrink-0">
                  {getJobTypeIcon(job.job_type)}
                </div>
                
                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-white truncate">
                      {formatJobType(job.job_type)}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider ${getPriorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTimeAgo(job.created_at)}</span>
                    </span>
                    
                    {job.ai_provider && (
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span className="capitalize">{job.ai_provider}</span>
                      </span>
                    )}
                    
                    {job.listing_id && (
                      <span className="flex items-center space-x-1">
                        <Building className="w-3 h-3" />
                        <span>Listing</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Progress & Actions */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                {/* Progress */}
                {job.status === 'processing' && (
                  <div className="w-24">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-realtor-light-blue to-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className={`text-sm font-medium capitalize ${getJobStatusColor(job.status)}`}>
                  {job.status}
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-1">
                  {job.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handleDownloadResult(job.id)}
                        className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                        title="Download result"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* View result */}}
                        className="p-2 text-gray-400 hover:text-realtor-light-blue transition-colors"
                        title="View result"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  
                  {job.status === 'failed' && (
                    <button
                      onClick={() => handleRetryJob(job.id)}
                      className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                      title="Retry job"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  
                  {job.status === 'processing' && (
                    <button
                      onClick={() => handleCancelJob(job.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Cancel job"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => {/* Delete job */}}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Error Message */}
            {job.status === 'failed' && job.error_message && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{job.error_message}</p>
              </div>
            )}
            
            {/* Estimated Completion */}
            {job.status === 'processing' && job.estimated_completion && (
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Estimated completion: {new Date(job.estimated_completion).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        ))}
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {jobs.length === 0 ? 'No jobs yet. Start creating content!' : 'No jobs match your filters.'}
            </p>
          </div>
        )}
      </div>
      
      {/* Load More */}
      {jobs.length >= maxJobs && (
        <div className="text-center">
          <button className="flex items-center space-x-2 text-realtor-light-blue hover:text-white transition-colors mx-auto">
            <span>Load more jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
