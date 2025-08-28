'use client'

import { useState, useEffect } from 'react'
import { 
  Layers,
  CheckSquare,
  Square,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Plus,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap,
  Star,
  Target,
  BarChart3,
  Filter,
  Search,
  ArrowRight,
  Settings
} from 'lucide-react'
import { AIStudioClient } from '@/lib/ai-studio'

interface BatchProcessingToolsProps {
  userToken: string
  onJobCreated: (job: any) => void
}

interface BatchJob {
  id: string
  name: string
  type: 'content' | 'staging'
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  total_items: number
  completed_items: number
  failed_items: number
  priority: 'low' | 'normal' | 'high'
  created_at: string
  estimated_completion?: string
  items: BatchItem[]
}

interface BatchItem {
  id: string
  listing_id: string
  listing_title: string
  content_types: string[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message?: string
}

interface Listing {
  id: string
  title: string
  address: string
  status: string
  media_count: number
}

export default function BatchProcessingTools({ userToken, onJobCreated }: BatchProcessingToolsProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [batchType, setBatchType] = useState<'content' | 'staging'>('content')
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const aiClient = new AIStudioClient(userToken)

  const contentTypes = [
    { id: 'hero_image', name: 'Hero Images', icon: '🖼️', estimated_time: '30s' },
    { id: 'business_card', name: 'Business Cards', icon: '💼', estimated_time: '45s' },
    { id: 'social_post', name: 'Social Posts', icon: '📱', estimated_time: '25s' },
    { id: 'flyer', name: 'Property Flyers', icon: '📄', estimated_time: '60s' },
    { id: 'copy', name: 'Marketing Copy', icon: '✍️', estimated_time: '20s' }
  ]

  const stagingTypes = [
    { id: 'basic', name: 'Basic Staging', icon: '🏠', estimated_time: '2m' },
    { id: 'advanced', name: 'Advanced SAM', icon: '🎯', estimated_time: '5m' },
    { id: 'premium', name: 'Pixel Perfect', icon: '👑', estimated_time: '10m' }
  ]

  useEffect(() => {
    loadListings()
    loadBatchJobs()
  }, [])

  const loadListings = async () => {
    // Mock data - replace with actual API call
    setListings([
      {
        id: '1',
        title: '123 Main Street - Luxury Home',
        address: '123 Main St, Beverly Hills, CA',
        status: 'active',
        media_count: 15
      },
      {
        id: '2',
        title: '456 Oak Avenue - Modern Condo',
        address: '456 Oak Ave, Santa Monica, CA',
        status: 'active',
        media_count: 8
      },
      {
        id: '3',
        title: '789 Pine Road - Family Home',
        address: '789 Pine Rd, Pasadena, CA',
        status: 'draft',
        media_count: 12
      }
    ])
  }

  const loadBatchJobs = async () => {
    // Mock data - replace with actual API call
    setBatchJobs([
      {
        id: '1',
        name: 'Marketing Content Batch #1',
        type: 'content',
        status: 'processing',
        progress: 65,
        total_items: 3,
        completed_items: 2,
        failed_items: 0,
        priority: 'high',
        created_at: new Date().toISOString(),
        estimated_completion: new Date(Date.now() + 300000).toISOString(),
        items: []
      }
    ])
  }

  const handleListingToggle = (listingId: string) => {
    setSelectedListings(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  const handleContentTypeToggle = (contentType: string) => {
    setSelectedContentTypes(prev => 
      prev.includes(contentType)
        ? prev.filter(type => type !== contentType)
        : [...prev, contentType]
    )
  }

  const handleCreateBatch = async () => {
    if (selectedListings.length === 0) return

    setIsCreating(true)
    try {
      let result
      
      if (batchType === 'content') {
        result = await aiClient.queueBatchContent({
          listing_ids: selectedListings,
          content_types: selectedContentTypes,
          priority: 'normal'
        })
      } else {
        // For staging, we'd need more specific parameters
        result = await aiClient.queueBatchStaging({
          staging_requests: selectedListings.map(listingId => ({
            listing_id: listingId,
            photo_asset_id: 'demo_photo',
            staging_style: 'modern',
            room_type: 'living_room',
            quality_tier: 'basic' as const
          })),
          priority: 'normal'
        })
      }

      onJobCreated(result)
      
      // Create new batch job entry
      const newBatch: BatchJob = {
        id: Date.now().toString(),
        name: `${batchType === 'content' ? 'Content' : 'Staging'} Batch #${batchJobs.length + 1}`,
        type: batchType,
        status: 'queued',
        progress: 0,
        total_items: selectedListings.length,
        completed_items: 0,
        failed_items: 0,
        priority: 'normal',
        created_at: new Date().toISOString(),
        items: selectedListings.map(listingId => {
          const listing = listings.find(l => l.id === listingId)
          return {
            id: `${listingId}-${Date.now()}`,
            listing_id: listingId,
            listing_title: listing?.title || 'Unknown',
            content_types: selectedContentTypes,
            status: 'pending'
          }
        })
      }

      setBatchJobs(prev => [newBatch, ...prev])
      
      // Reset form
      setSelectedListings([])
      setSelectedContentTypes([])
      setActiveTab('manage')
    } catch (error) {
      console.error('Batch creation failed:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const calculateEstimatedTime = () => {
    if (batchType === 'content') {
      const totalSeconds = selectedListings.length * selectedContentTypes.length * 45 // avg 45s per item
      return Math.ceil(totalSeconds / 60) // minutes
    } else {
      return selectedListings.length * 5 // avg 5 minutes per staging
    }
  }

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBatchJobs = batchJobs.filter(job => 
    filterStatus === 'all' || job.status === filterStatus
  )

  const renderCreateBatch = () => (
    <div className="space-y-6">
      {/* Batch Type Selection */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4">Batch Type</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { 
              id: 'content', 
              name: 'Content Generation', 
              description: 'Generate multiple content types across listings',
              icon: '📝'
            },
            { 
              id: 'staging', 
              name: 'Virtual Staging', 
              description: 'Stage multiple rooms across properties',
              icon: '🏠'
            }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setBatchType(type.id as any)}
              className={`p-4 rounded-lg border transition-all text-left ${
                batchType === type.id
                  ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{type.icon}</span>
                <h4 className="font-semibold">{type.name}</h4>
              </div>
              <p className="text-sm opacity-75">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Content/Staging Type Selection */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4">
          {batchType === 'content' ? 'Content Types' : 'Staging Quality'}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {(batchType === 'content' ? contentTypes : stagingTypes).map((type) => (
            <button
              key={type.id}
              onClick={() => handleContentTypeToggle(type.id)}
              className={`p-4 rounded-lg border transition-all text-center ${
                selectedContentTypes.includes(type.id)
                  ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.name}</div>
              <div className="text-xs opacity-75 mt-1">{type.estimated_time}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Listing Selection */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Select Listings</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {selectedListings.length} of {filteredListings.length} selected
            </span>
            <button
              onClick={() => setSelectedListings(
                selectedListings.length === filteredListings.length 
                  ? [] 
                  : filteredListings.map(l => l.id)
              )}
              className="text-realtor-light-blue hover:text-white text-sm font-medium transition-colors"
            >
              {selectedListings.length === filteredListings.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-realtor-light-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Listings Grid */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => handleListingToggle(listing.id)}
              className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
                selectedListings.includes(listing.id)
                  ? 'border-realtor-light-blue bg-realtor-light-blue/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex-shrink-0">
                {selectedListings.includes(listing.id) ? (
                  <CheckSquare className="w-5 h-5 text-realtor-light-blue" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{listing.title}</h4>
                <p className="text-sm text-gray-400 truncate">{listing.address}</p>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider ${
                  listing.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {listing.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">{listing.media_count} photos</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Summary & Create */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Batch Summary</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>~{calculateEstimatedTime()} minutes</span>
            </span>
            <span className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>{selectedListings.length * selectedContentTypes.length} items</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{selectedListings.length}</div>
            <div className="text-sm text-gray-400">Listings</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{selectedContentTypes.length}</div>
            <div className="text-sm text-gray-400">
              {batchType === 'content' ? 'Content Types' : 'Quality Tiers'}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {selectedListings.length * selectedContentTypes.length}
            </div>
            <div className="text-sm text-gray-400">Total Items</div>
          </div>
        </div>
        
        <button
          onClick={handleCreateBatch}
          disabled={selectedListings.length === 0 || selectedContentTypes.length === 0 || isCreating}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-realtor-light-blue to-blue-500 text-white py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-realtor-light-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Creating Batch...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start Batch Processing</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderManageBatches = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Batch Jobs</h3>
          
          <div className="flex items-center space-x-4">
            <select 
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-realtor-light-blue"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="queued">Queued</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Jobs List */}
      <div className="space-y-4">
        {filteredBatchJobs.map((job) => (
          <div key={job.id} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  job.type === 'content' 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <Layers className="w-6 h-6" />
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white">{job.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="capitalize">{job.type} batch</span>
                    <span>{job.total_items} items</span>
                    <span className={`px-2 py-1 rounded-full uppercase tracking-wider ${
                      job.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      job.priority === 'normal' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {job.priority}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className={`flex items-center space-x-2 ${
                    job.status === 'completed' ? 'text-green-400' :
                    job.status === 'processing' ? 'text-yellow-400' :
                    job.status === 'failed' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {job.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                    {job.status === 'processing' && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {job.status === 'failed' && <AlertCircle className="w-4 h-4" />}
                    {job.status === 'queued' && <Clock className="w-4 h-4" />}
                    <span className="capitalize font-medium">{job.status}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {job.completed_items}/{job.total_items} completed
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-400 hover:text-realtor-light-blue transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  {job.status === 'completed' && (
                    <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {job.status === 'failed' && (
                    <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            {job.status === 'processing' && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-realtor-light-blue to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-400">{job.completed_items}</div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-400">
                  {job.total_items - job.completed_items - job.failed_items}
                </div>
                <div className="text-xs text-gray-400">Pending</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-400">{job.failed_items}</div>
                <div className="text-xs text-gray-400">Failed</div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredBatchJobs.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No batch jobs found. Create your first batch!</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Batch Processing</h2>
            <p className="text-gray-300">Process multiple listings simultaneously for maximum efficiency</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold">{batchJobs.length} Active Batches</p>
              <p className="text-gray-400 text-sm">Bulk AI Processing</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex items-center space-x-4">
          {[
            { id: 'create', name: 'Create Batch', icon: Plus, description: 'Start new batch job' },
            { id: 'manage', name: 'Manage Batches', icon: BarChart3, description: 'View and manage existing batches' }
          ].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-realtor-light-blue/20 text-realtor-light-blue border border-realtor-light-blue/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'create' ? renderCreateBatch() : renderManageBatches()}
    </div>
  )
}
