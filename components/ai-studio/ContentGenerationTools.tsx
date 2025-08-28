'use client'

import { useState } from 'react'
import { 
  ImageIcon, 
  FileText, 
  Share2, 
  Wand2,
  Upload,
  Settings,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  Target,
  Palette,
  Type,
  Zap
} from 'lucide-react'
import { AIStudioClient } from '@/lib/ai-studio'

interface ContentGenerationToolsProps {
  userToken: string
  onJobCreated: (job: any) => void
}

export default function ContentGenerationTools({ userToken, onJobCreated }: ContentGenerationToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [previewData, setPreviewData] = useState<any>(null)

  const aiClient = new AIStudioClient(userToken)

  // Handle download functionality
  const handleDownload = async (downloadUrl: string, toolType: string | null) => {
    if (!downloadUrl) {
      alert('No download URL available')
      return
    }

    try {
      // Create a temporary link element and trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${toolType || 'generated-content'}-${Date.now()}.png`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: open in new tab
      window.open(downloadUrl, '_blank')
    }
  }

  const contentTools = [
    {
      id: 'hero_image',
      name: 'Hero Images',
      icon: ImageIcon,
      description: 'Generate stunning property hero images with AI',
      color: 'from-blue-500 to-cyan-500',
      action: 'generate_hero_image'
    },
    {
      id: 'business_card',
      name: 'Business Cards',
      icon: FileText,
      description: 'Create professional agent business cards',
      color: 'from-purple-500 to-pink-500',
      action: 'generate_business_card'
    },
    {
      id: 'social_post',
      name: 'Social Posts',
      icon: Share2,
      description: 'Generate engaging social media content',
      color: 'from-green-500 to-emerald-500',
      action: 'generate_social_post'
    },
    {
      id: 'flyer',
      name: 'Property Flyers',
      icon: FileText,
      description: 'Design professional property marketing flyers',
      color: 'from-orange-500 to-red-500',
      action: 'generate_flyer'
    },
    {
      id: 'copy',
      name: 'Marketing Copy',
      icon: Wand2,
      description: 'Generate compelling marketing copy and descriptions',
      color: 'from-indigo-500 to-purple-500',
      action: 'generate_copy'
    }
  ]

  const handleGenerate = async (toolId: string) => {
    if (!userToken) {
      console.error('No authentication token available')
      alert('Please log in to use AI generation features')
      return
    }

    setIsGenerating(true)
    try {
      console.log('Starting generation:', { 
      toolId, 
      hasToken: !!userToken, 
      tokenLength: userToken?.length,
      actualToken: userToken // Show full token for debugging
    })
      let result
      
      switch (toolId) {
        case 'hero_image':
          result = await aiClient.generateHeroImage(formData)
          break
        case 'business_card':
          // Flatten contact_info structure and map style field for business card
          const businessCardData = {
            ...formData,
            phone: formData.contact_info?.phone,
            email: formData.contact_info?.email,
            website: formData.contact_info?.website,
            template_style: formData.style_preference || 'professional'
          }
          // Remove the nested contact_info object and frontend-only fields
          delete businessCardData.contact_info
          delete businessCardData.style_preference
          
          console.log('Business card payload:', businessCardData)
          result = await aiClient.generateBusinessCard(businessCardData)
          break
        case 'social_post':
          result = await aiClient.generateSocialPost(formData)
          break
        case 'flyer':
          result = await aiClient.generateFlyer(formData)
          break
        case 'copy':
          result = await aiClient.generateCopy(formData)
          break
        default:
          throw new Error('Unknown tool')
      }

      onJobCreated(result)
      setPreviewData(result)
    } catch (error) {
      console.error('Generation failed:', error)
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('GPT-Image-1 failed: Forbidden')) {
        alert('OpenAI API access issue. Please check your API key configuration in the serverless function.')
      } else if (errorMessage.includes('500')) {
        alert('Server error occurred. Please try again or contact support if the issue persists.')
      } else {
        alert(`Generation failed: ${errorMessage}`)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const renderToolForm = (tool: any) => {
    switch (tool.id) {
      case 'hero_image':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Listing
              </label>
              <select 
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                value={formData.listing_id || ''}
                onChange={(e) => setFormData({...formData, listing_id: e.target.value})}
              >
                <option value="">Select a listing...</option>
                <option value="listing_1">123 Main St - Luxury Home</option>
                <option value="listing_2">456 Oak Ave - Modern Condo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Style Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['luxury', 'modern', 'cozy', 'professional', 'dramatic'].map(style => (
                  <button
                    key={style}
                    onClick={() => setFormData({...formData, style_preference: style})}
                    className={`p-3 rounded-lg border transition-all capitalize ${
                      formData.style_preference === style
                        ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Prompt (Optional)
              </label>
              <textarea
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                rows={3}
                placeholder="Add specific requirements or style notes..."
                value={formData.custom_prompt || ''}
                onChange={(e) => setFormData({...formData, custom_prompt: e.target.value})}
              />
            </div>
          </div>
        )

      case 'business_card':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  placeholder="John Smith"
                  value={formData.agent_name || ''}
                  onChange={(e) => setFormData({...formData, agent_name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  placeholder="Senior Real Estate Agent"
                  value={formData.agent_title || ''}
                  onChange={(e) => setFormData({...formData, agent_title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  placeholder="(555) 123-4567"
                  value={formData.contact_info?.phone || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    contact_info: {...formData.contact_info, phone: e.target.value}
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  placeholder="john@realty.com"
                  value={formData.contact_info?.email || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    contact_info: {...formData.contact_info, email: e.target.value}
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                placeholder="www.johnsmithrealty.com"
                value={formData.contact_info?.website || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  contact_info: {...formData.contact_info, website: e.target.value}
                })}
              />
            </div>
          </div>
        )

      case 'social_post':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform
                </label>
                <select 
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  value={formData.platform || ''}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                >
                  <option value="">Select platform...</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Post Type
                </label>
                <select 
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  value={formData.post_type || ''}
                  onChange={(e) => setFormData({...formData, post_type: e.target.value})}
                >
                  <option value="">Select type...</option>
                  <option value="listing_feature">Listing Feature</option>
                  <option value="market_update">Market Update</option>
                  <option value="agent_intro">Agent Introduction</option>
                  <option value="testimonial">Client Testimonial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                rows={4}
                placeholder="Add your custom message or let AI create it for you..."
                value={formData.custom_message || ''}
                onChange={(e) => setFormData({...formData, custom_message: e.target.value})}
              />
            </div>
          </div>
        )

      case 'copy':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Copy Type
                </label>
                <select 
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  value={formData.copy_type || ''}
                  onChange={(e) => setFormData({...formData, copy_type: e.target.value})}
                >
                  <option value="">Select type...</option>
                  <option value="listing_description">Listing Description</option>
                  <option value="email_campaign">Email Campaign</option>
                  <option value="website_content">Website Content</option>
                  <option value="blog_post">Blog Post</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tone
                </label>
                <select 
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  value={formData.tone || ''}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                >
                  <option value="">Select tone...</option>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="luxury">Luxury</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Audience
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['buyers', 'sellers', 'investors', 'first_time_buyers'].map(audience => (
                  <button
                    key={audience}
                    onClick={() => setFormData({...formData, target_audience: audience})}
                    className={`p-3 rounded-lg border transition-all capitalize text-sm ${
                      formData.target_audience === audience
                        ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {audience.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return <div>Tool configuration not available</div>
    }
  }

  if (activeTool) {
    const tool = contentTools.find(t => t.id === activeTool)
    if (!tool) return null

    const ToolIcon = tool.icon

    return (
      <div className="space-y-6">
        {/* Tool Header */}
        <div className={`relative bg-gradient-to-br ${tool.color} rounded-xl p-6 text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <ToolIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{tool.name}</h3>
                  <p className="text-white/80">{tool.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => setActiveTool(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Tool Configuration */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-white mb-6">Configuration</h4>
          {renderToolForm(tool)}
          
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700/50">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>AI Powered</span>
              </span>
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>High Quality</span>
              </span>
            </div>
            
            <button
              onClick={() => handleGenerate(tool.id)}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-gradient-to-r from-realtor-light-blue to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-realtor-light-blue transition-all duration-300 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {tool.name}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview */}
        {previewData && (
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Generated Content</h4>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.open(previewData.data?.download_url, '_blank')}
                  className="flex items-center space-x-2 text-realtor-light-blue hover:text-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button 
                  onClick={() => handleDownload(previewData.data?.download_url, activeTool)}
                  className="flex items-center space-x-2 text-green-400 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              {/* Show the actual generated image */}
              {previewData.data?.download_url ? (
                <div className="space-y-4">
                  <img 
                    src={previewData.data.download_url} 
                    alt="Generated content"
                    className="w-full max-w-md mx-auto rounded-lg border border-gray-600"
                    onError={(e) => {
                      console.error('Image load error:', e)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="text-center">
                    <p className="text-green-400 font-medium">{previewData.message || 'Content generated successfully!'}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Processing time: {previewData.data.generation_metadata?.processing_time?.toFixed(2)}s
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">Content generated successfully! Ready for download.</p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contentTools.map((tool) => {
        const Icon = tool.icon
        return (
          <div
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="group relative bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 cursor-pointer backdrop-blur-sm"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-gray-100">
                    {tool.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-400 mb-4 leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm font-medium">Ready to use</span>
                <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded-full flex items-center justify-center group-hover:border-realtor-light-blue group-hover:text-realtor-light-blue transition-colors">
                  <Wand2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
