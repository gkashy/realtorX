// AI Studio API Integration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API Base URL for serverless functions
const API_BASE_URL = 'https://pzqsnwoerzjanxmmkavo.supabase.co/functions/v1'

// AI Studio API Client
export class AIStudioClient {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  private async makeRequest(endpoint: string, action: string, data: any) {
    console.log('Making API request:', { endpoint, action, hasToken: !!this.token })
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        data
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', { status: response.status, statusText: response.statusText, body: errorText })
      throw new Error(`API Error: ${response.statusText} (${response.status})`)
    }

    return response.json()
  }

  // Content Generation (ai-realtime)
  async generateHeroImage(data: {
    listing_id?: string
    brand_kit_id?: string
    custom_prompt?: string
    style_preference?: string
  }) {
    return this.makeRequest('ai-realtime', 'generate_hero_image', data)
  }

  async generateBusinessCard(data: {
    agent_name: string
    agent_title?: string
    contact_info: {
      phone: string
      email: string
      website?: string
    }
    brand_kit_id?: string
    style_template?: string
  }) {
    return this.makeRequest('ai-realtime', 'generate_business_card', data)
  }

  async generateSocialPost(data: {
    listing_id?: string
    platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin'
    post_type: 'listing_feature' | 'market_update' | 'agent_intro' | 'testimonial'
    brand_kit_id?: string
    custom_message?: string
  }) {
    return this.makeRequest('ai-realtime', 'generate_social_post', data)
  }

  async generateFlyer(data: {
    listing_id: string
    flyer_type: 'property_feature' | 'open_house' | 'just_listed' | 'price_reduction'
    brand_kit_id?: string
    include_qr_code?: boolean
  }) {
    return this.makeRequest('ai-realtime', 'generate_flyer', data)
  }

  async generateCopy(data: {
    listing_id?: string
    copy_type: 'listing_description' | 'email_campaign' | 'website_content' | 'blog_post'
    tone: 'professional' | 'friendly' | 'luxury' | 'urgent'
    target_audience: 'buyers' | 'sellers' | 'investors' | 'first_time_buyers'
    brand_kit_id?: string
  }) {
    return this.makeRequest('ai-realtime', 'generate_copy', data)
  }

  // Design Library
  async listDesignStyles(filters?: {
    category?: string
    tags?: string[]
    popularity?: 'trending' | 'popular' | 'new'
  }) {
    return this.makeRequest('ai-realtime', 'list_design_styles', filters || {})
  }

  async generateStyledBusinessCard(data: {
    template_id: string
    agent_data: {
      name: string
      title: string
      contact: {
        phone: string
        email: string
        website?: string
      }
    }
    brand_kit_id?: string
  }) {
    return this.makeRequest('ai-realtime', 'generate_styled_business_card', data)
  }

  async generateStyledFlyer(data: {
    template_id: string
    listing_id: string
    brand_kit_id?: string
    customizations?: Record<string, any>
  }) {
    return this.makeRequest('ai-realtime', 'generate_styled_flyer', data)
  }

  // Virtual Staging (ai-staging)
  async basicVirtualStaging(data: {
    listing_id: string
    photo_asset_id: string
    staging_style: 'modern' | 'traditional' | 'luxury' | 'minimalist' | 'cozy'
    room_type: 'living_room' | 'bedroom' | 'kitchen' | 'dining_room' | 'office' | 'bathroom'
  }) {
    return this.makeRequest('ai-staging', 'virtual_staging', data)
  }

  async advancedVirtualStaging(data: {
    listing_id: string
    photo_asset_id: string
    staging_style: string
    room_type: string
    furniture_preferences?: string[]
    color_scheme?: string
  }) {
    return this.makeRequest('ai-staging', 'advanced_virtual_staging', data)
  }

  async pixelPerfectStaging(data: {
    listing_id: string
    photo_asset_id: string
    staging_style: string
    room_type: string
    quality_tier: 'premium'
    refinement_passes?: number
  }) {
    return this.makeRequest('ai-staging', 'pixel_perfect_staging', data)
  }

  // Video Generation (ai-video)
  async planVideoScenes(data: {
    listing_id: string
    uploaded_images: string[]
    special_requests?: string
    duration?: number
    include_cover?: boolean
    include_ending?: boolean
  }) {
    return this.makeRequest('ai-video', 'plan_video_scenes', data)
  }

  async queueVideoTour(data: {
    listing_id: string
    scene_plan: any
    video_style: 'cinematic' | 'smooth' | 'dynamic'
    music_preference?: string
  }) {
    return this.makeRequest('ai-video', 'queue_video_tour', data)
  }

  async queuePropertyVideo(data: {
    listing_id: string
    video_type: 'slideshow' | 'cinematic' | 'tour'
    photos: string[]
    duration?: number
    music?: boolean
  }) {
    return this.makeRequest('ai-video', 'queue_property_video', data)
  }

  // Brand Management (ai-brand-kit-manager)
  async createBrandFromDescription(data: {
    company_description: string
    market_focus: string
    target_audience: string
    style_preference: string
  }) {
    return this.makeRequest('ai-brand-kit-manager', 'create_from_description', data)
  }

  async analyzeLogo(data: {
    logo_image_url: string
    extract_colors?: boolean
    suggest_fonts?: boolean
  }) {
    return this.makeRequest('ai-brand-kit-manager', 'analyze_logo', data)
  }

  async extractFromWebsite(data: {
    website_url: string
    analyze_competitors?: boolean
  }) {
    return this.makeRequest('ai-brand-kit-manager', 'extract_from_website', data)
  }

  async generateBrandVariations(data: {
    brand_kit_id: string
    variation_types: ('seasonal' | 'audience' | 'platform' | 'mood')[]
  }) {
    return this.makeRequest('ai-brand-kit-manager', 'generate_variations', data)
  }

  // Batch Processing (ai-batch)
  async queueBatchContent(data: {
    listing_ids: string[]
    content_types: string[]
    brand_kit_id?: string
    priority?: 'low' | 'normal' | 'high'
  }) {
    return this.makeRequest('ai-batch', 'queue_batch_content', data)
  }

  async queueBatchStaging(data: {
    staging_requests: Array<{
      listing_id: string
      photo_asset_id: string
      staging_style: string
      room_type: string
      quality_tier: 'basic' | 'advanced' | 'premium'
    }>
    priority?: 'low' | 'normal' | 'high'
  }) {
    return this.makeRequest('ai-batch', 'queue_virtual_staging', data)
  }
}

// Job Status Types (matching ai_generation_jobs table)
export interface AIJob {
  id: string
  user_id: string
  company_id: string
  listing_id?: string
  job_type: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  parameters: any
  result_data?: any
  error_message?: string
  ai_provider?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  estimated_completion?: string
  created_at: string
  updated_at: string
}

// Real-time Job Tracking
export class JobTracker {
  private supabase = supabase
  private subscriptions: Map<string, any> = new Map()

  subscribeToJobs(userId: string, callback: (jobs: AIJob[]) => void) {
    const subscription = this.supabase
      .channel('ai_jobs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_generation_jobs',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Handle real-time updates
          this.fetchUserJobs(userId).then(callback)
        }
      )
      .subscribe()

    this.subscriptions.set(userId, subscription)
    
    // Initial fetch
    this.fetchUserJobs(userId).then(callback)
  }

  unsubscribeFromJobs(userId: string) {
    const subscription = this.subscriptions.get(userId)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(userId)
    }
  }

  private async fetchUserJobs(userId: string): Promise<AIJob[]> {
    const { data, error } = await this.supabase
      .from('ai_generation_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching jobs:', error)
      return []
    }

    return data || []
  }

  async getJobById(jobId: string): Promise<AIJob | null> {
    const { data, error } = await this.supabase
      .from('ai_generation_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) {
      console.error('Error fetching job:', error)
      return null
    }

    return data
  }
}

// Utility Functions
export const formatJobType = (type: string): string => {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

export const getJobStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': return 'text-green-400'
    case 'processing': return 'text-yellow-400'
    case 'failed': return 'text-red-400'
    case 'queued': return 'text-gray-400'
    default: return 'text-gray-400'
  }
}

export const getJobStatusIcon = (status: string): string => {
  switch (status) {
    case 'completed': return 'CheckCircle'
    case 'processing': return 'RefreshCw'
    case 'failed': return 'AlertCircle'
    case 'queued': return 'Clock'
    default: return 'Clock'
  }
}

// Content Generation Presets
export const CONTENT_PRESETS = {
  hero_images: {
    styles: ['luxury', 'modern', 'cozy', 'professional', 'dramatic'],
    compositions: ['wide_angle', 'close_up', 'aerial', 'interior', 'exterior']
  },
  social_posts: {
    platforms: ['instagram', 'facebook', 'twitter', 'linkedin'],
    types: ['listing_feature', 'market_update', 'agent_intro', 'testimonial', 'tips']
  },
  staging_styles: {
    modern: ['clean lines', 'neutral colors', 'minimal furniture'],
    traditional: ['warm colors', 'classic furniture', 'cozy textures'],
    luxury: ['high-end furniture', 'rich colors', 'premium materials'],
    minimalist: ['sparse furniture', 'white/gray palette', 'clean spaces']
  },
  video_styles: {
    cinematic: ['smooth transitions', 'dramatic lighting', 'professional'],
    smooth: ['gentle pans', 'soft transitions', 'welcoming'],
    dynamic: ['quick cuts', 'energetic', 'modern']
  }
}
