'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Palette, 
  Upload, 
  Image as ImageIcon,
  Wand2,
  Settings,
  Eye,
  Download,
  RefreshCw,
  Sparkles,
  Star,
  Crown,
  Layers,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square as SquareIcon
} from 'lucide-react'
import { AIStudioClient } from '@/lib/ai-studio'

interface VirtualStagingToolsProps {
  userToken: string
  onJobCreated: (job: any) => void
}

interface Listing {
  id: string
  title: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  status: string
  property_type: string
  listing_type: string
  created_at: string
  media_assets?: MediaAsset[]
  media_count?: number
}

interface MediaAsset {
  id: string
  listing_id: string
  storage_path: string
  asset_kind: string
  public_url?: string
  metadata: any
}

export default function VirtualStagingTools({ userToken, onJobCreated }: VirtualStagingToolsProps) {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'advanced' | 'premium'>('basic')
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [listingAssets, setListingAssets] = useState<MediaAsset[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [stagingOptions, setStagingOptions] = useState<{
    room_type: string
    staging_style: string
    color_scheme: string
    furniture_preferences: string[]
    sam_prompt: string
  }>({
    room_type: '',
    staging_style: '',
    color_scheme: '',
    furniture_preferences: [],
    sam_prompt: ''
  })
  const [isStaging, setIsStaging] = useState(false)
  const [stagingResult, setStagingResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aiClient = new AIStudioClient(userToken)

  useEffect(() => {
    loadListings()
  }, [])

  // Set default SAM prompt when switching to advanced/premium tiers
  useEffect(() => {
    if ((selectedTier === 'advanced' || selectedTier === 'premium') && !stagingOptions.sam_prompt) {
      setStagingOptions(prev => ({
        ...prev,
        sam_prompt: 'old furniture,empty space,floor'
      }))
    }
  }, [selectedTier])

  useEffect(() => {
    if (selectedListing) {
      loadListingAssets(selectedListing.id)
    }
  }, [selectedListing])

  const loadListings = async () => {
    try {
      // Use listing-management serverless function to get user's listings
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/listing-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'list' // Correct action name
        })
      })

      if (response.ok) {
        const result = await response.json()
        const listingsData = result.data || []
        
        // Transform the data to include media assets count and set the listings
        const processedListings = listingsData.map((listing: any) => ({
          ...listing,
          media_count: listing.media_assets?.length || 0
        }))
        
        setListings(processedListings)
        console.log('Loaded listings:', processedListings)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to load listings:', error)
      // Fallback to mock data for demo
      setListings([
        {
          id: 'demo-1',
          title: '123 Luxury Avenue - Modern Estate',
          address: '123 Luxury Ave, Beverly Hills, CA 90210',
          price: 2500000,
          beds: 4,
          baths: 3,
          sqft: 3200,
          status: 'active',
          property_type: 'single_family',
          listing_type: 'sale',
          created_at: new Date().toISOString(),
          media_assets: []
        },
        {
          id: 'demo-2',
          title: '456 Ocean View - Coastal Villa',
          address: '456 Ocean View Dr, Malibu, CA 90265',
          price: 4200000,
          beds: 5,
          baths: 4,
          sqft: 4800,
          status: 'active',
          property_type: 'single_family',
          listing_type: 'sale',
          created_at: new Date().toISOString(),
          media_assets: []
        }
      ])
    }
  }

  const loadListingAssets = async (listingId: string) => {
    try {
      // Use listing-management function to get detailed listing with media assets
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/listing-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'read',
          listing_id: listingId
        })
      })

      if (response.ok) {
        const result = await response.json()
        const listing = result.data
        
        // Extract media assets and add public URLs
        const assets = (listing.media_assets || []).map((asset: any) => ({
          ...asset,
          public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media-assets/${asset.storage_path}`
        }))
        
        setListingAssets(assets)
        console.log('Loaded listing assets:', assets)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to load listing assets:', error)
      setListingAssets([])
    }
  }

  const stagingTiers = [
    {
      id: 'basic',
      name: 'Basic Staging',
      icon: Palette,
      price: '$5',
      features: [
        'GPT-4 Vision Analysis',
        'Basic Furniture Placement',
        'Standard Quality',
        '~30 seconds processing'
      ],
      color: 'from-green-500 to-emerald-500',
      description: 'Perfect for quick staging needs'
    },
    {
      id: 'advanced',
      name: 'Advanced SAM',
      icon: Layers,
      price: '$12',
      features: [
        'Meta SAM Segmentation',
        'Precision Inpainting',
        'Advanced Quality',
        '~2-3 minutes processing'
      ],
      color: 'from-blue-500 to-cyan-500',
      description: 'Professional quality with AI segmentation',
      popular: true
    },
    {
      id: 'premium',
      name: 'Pixel Perfect',
      icon: Crown,
      price: '$25',
      features: [
        'Multiple Refinement Passes',
        'Quality Scoring',
        'Premium Materials',
        '~5-8 minutes processing'
      ],
      color: 'from-yellow-500 to-orange-500',
      description: 'Ultra-high quality for luxury listings'
    }
  ]

  const roomTypes = [
    { id: 'living_room', name: 'Living Room', icon: '🛋️' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'dining_room', name: 'Dining Room', icon: '🍽️' },
    { id: 'office', name: 'Office', icon: '💼' },
    { id: 'bathroom', name: 'Bathroom', icon: '🛁' }
  ]

  const stagingStyles = [
    { id: 'modern', name: 'Modern', preview: '🏢' },
    { id: 'traditional', name: 'Traditional', preview: '🏠' },
    { id: 'luxury', name: 'Luxury', preview: '👑' },
    { id: 'minimalist', name: 'Minimalist', preview: '⚪' },
    { id: 'cozy', name: 'Cozy', preview: '🔥' },
    { id: 'industrial', name: 'Industrial', preview: '🏭' }
  ]



  const handleStaging = async () => {
    if (!selectedListing || !selectedAsset || !stagingOptions.room_type || !stagingOptions.staging_style) {
      alert('Please select a listing, photo, room type, and staging style first.')
      return
    }

    setIsStaging(true)
    try {
      let result

      // Use the proper workflow with real listing and asset IDs
      const data = {
        listing_id: selectedListing.id,
        photo_asset_id: selectedAsset.id,
        staging_style: stagingOptions.staging_style,
        room_type: stagingOptions.room_type,
        color_scheme: stagingOptions.color_scheme,
        furniture_preferences: stagingOptions.furniture_preferences,
        sam_prompt: stagingOptions.sam_prompt || 'old furniture,empty space,floor' // Default prompt
      }

      console.log('Staging payload:', data)

      switch (selectedTier) {
        case 'basic':
          result = await aiClient.basicVirtualStaging(data as any)
          break
        case 'advanced':
          result = await aiClient.advancedVirtualStaging(data as any)
          break
        case 'premium':
          result = await aiClient.pixelPerfectStaging({
            ...data,
            quality_tier: 'premium',
            refinement_passes: 3
          } as any)
          break
      }

      setStagingResult(result)
      onJobCreated(result)
    } catch (error) {
      console.error('Staging failed:', error)
    } finally {
      setIsStaging(false)
    }
  }

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Virtual Staging Studio</h2>
        <p className="text-gray-300">Transform empty rooms into stunning, staged spaces with AI</p>
      </div>

      {/* Tier Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stagingTiers.map((tier) => {
          const Icon = tier.icon
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id as any)}
              className={`relative bg-gray-900/50 border rounded-xl p-6 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                selectedTier === tier.id
                  ? 'border-realtor-light-blue bg-realtor-light-blue/10'
                  : 'border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-5 rounded-xl`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{tier.price}</div>
                    <div className="text-xs text-gray-400">per image</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {selectedTier === tier.id && (
                  <div className="mt-4 p-3 bg-realtor-light-blue/20 rounded-lg border border-realtor-light-blue/30">
                    <div className="flex items-center space-x-2 text-realtor-light-blue text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Selected</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Listing Selection */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Select Property</h3>
          <div className="text-sm text-gray-400">{listings.length} properties available</div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => setSelectedListing(listing)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedListing?.id === listing.id
                  ? 'border-realtor-light-blue bg-realtor-light-blue/10'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <Home className="w-5 h-5 text-realtor-light-blue flex-shrink-0 mt-1" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  listing.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {listing.status}
                </span>
              </div>
              
              <h4 className="text-white font-semibold mb-1 text-sm">{listing.title}</h4>
              <div className="flex items-center text-gray-400 text-xs mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate">{listing.address}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-green-400">
                  <DollarSign className="w-3 h-3 mr-1" />
                  <span className="font-semibold">{listing.price?.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="flex items-center">
                    <Bed className="w-3 h-3 mr-1" />
                    <span>{listing.beds}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-3 h-3 mr-1" />
                    <span>{listing.baths}</span>
                  </div>
                  <div className="flex items-center">
                    <SquareIcon className="w-3 h-3 mr-1" />
                    <span>{listing.sqft?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Selection */}
      {selectedListing && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Select Photo to Stage</h3>
            <div className="text-sm text-gray-400">{listingAssets.length} photos available</div>
          </div>

          {listingAssets.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto">
              {listingAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`relative aspect-video rounded-lg cursor-pointer transition-all overflow-hidden ${
                    selectedAsset?.id === asset.id
                      ? 'ring-2 ring-realtor-light-blue'
                      : 'hover:ring-1 hover:ring-gray-500'
                  }`}
                >
                  {asset.public_url ? (
                    <img 
                      src={asset.public_url}
                      alt="Property photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {selectedAsset?.id === asset.id && (
                    <div className="absolute inset-0 bg-realtor-light-blue/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-realtor-light-blue" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/60 text-white text-xs px-2 py-1 rounded truncate">
                      {asset.asset_kind.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No photos found for this property</p>
              <p className="text-gray-500 text-sm">Upload photos to get started with virtual staging</p>
            </div>
          )}
        </div>
      )}

      {/* Room Type Selection */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4">Room Type</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {roomTypes.map((room) => (
            <button
              key={room.id}
              onClick={() => setStagingOptions({...stagingOptions, room_type: room.id})}
              className={`p-4 rounded-xl border transition-all text-center ${
                stagingOptions.room_type === room.id
                  ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{room.icon}</div>
              <div className="text-sm font-medium">{room.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Staging Style Selection */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4">Staging Style</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stagingStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setStagingOptions({...stagingOptions, staging_style: style.id})}
              className={`p-4 rounded-xl border transition-all text-center ${
                stagingOptions.staging_style === style.id
                  ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{style.preview}</div>
              <div className="text-sm font-medium">{style.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options (for Advanced/Premium tiers) */}
      {(selectedTier === 'advanced' || selectedTier === 'premium') && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">Advanced Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color Scheme
              </label>
              <select 
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                value={stagingOptions.color_scheme}
                onChange={(e) => setStagingOptions({...stagingOptions, color_scheme: e.target.value})}
              >
                <option value="">Auto-select</option>
                <option value="neutral">Neutral Tones</option>
                <option value="warm">Warm Colors</option>
                <option value="cool">Cool Colors</option>
                <option value="monochrome">Monochrome</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Furniture Style
              </label>
              <select 
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                value={stagingOptions.furniture_preferences?.[0] || ''}
                onChange={(e) => setStagingOptions({...stagingOptions, furniture_preferences: [e.target.value]})}
              >
                <option value="">Auto-select</option>
                <option value="contemporary">Contemporary</option>
                <option value="classic">Classic</option>
                <option value="mid_century">Mid-Century Modern</option>
                <option value="scandinavian">Scandinavian</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SAM Prompt Controls - Only for Advanced/Premium */}
      {(selectedTier === 'advanced' || selectedTier === 'premium') && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-5 h-5 text-realtor-light-blue" />
            <h3 className="text-xl font-bold text-white">SAM Targeting</h3>
            <span className="text-xs bg-realtor-light-blue/20 text-realtor-light-blue px-2 py-1 rounded-full">
              Advanced AI
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Tell our AI exactly what areas to stage. Use specific objects or areas you want to replace with furniture.
          </p>

          {/* Recommended Prompts */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Quick Select (Recommended)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '🛏️ Bed', value: 'bed,mattress,bedframe' },
                { label: '🛋️ Sofa', value: 'sofa,couch,sectional' },
                { label: '🪑 Chair', value: 'chair,armchair,dining chair' },
                { label: '🏺 Lamp', value: 'lamp,floor lamp,table lamp' },
                { label: '🖼️ Painting', value: 'painting,artwork,wall art' },
                { label: '🟫 Carpet', value: 'carpet,rug,area rug' },
                { label: '📺 TV', value: 'tv,television,entertainment center' },
                { label: '🌱 Plant', value: 'plant,potted plant,greenery' },
                { label: '🪞 Mirror', value: 'mirror,wall mirror,decorative mirror' },
                { label: '📚 Shelf', value: 'shelf,bookshelf,storage unit' },
                { label: '☕ Table', value: 'table,coffee table,side table' },
                { label: '🏠 Custom', value: 'old furniture,empty space,floor' }
              ].map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => setStagingOptions({...stagingOptions, sam_prompt: prompt.value})}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    stagingOptions.sam_prompt === prompt.value
                      ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Targeting Prompt
            </label>
            <textarea
              value={stagingOptions.sam_prompt}
              onChange={(e) => setStagingOptions({...stagingOptions, sam_prompt: e.target.value})}
              placeholder="Describe what you want to replace: 'old sofa,lamp,carpet' or 'bed,nightstand,painting'"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Use comma-separated objects like "sofa,coffee table,lamp" or "bed,dresser,mirror,carpet"
            </p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>AI Powered</span>
          </span>
          <span className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>{stagingTiers.find(t => t.id === selectedTier)?.name}</span>
          </span>
        </div>
        
        <button
          onClick={handleStaging}
          disabled={!selectedListing || !selectedAsset || !stagingOptions.room_type || !stagingOptions.staging_style || isStaging}
          className="flex items-center space-x-3 bg-gradient-to-r from-realtor-light-blue to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-realtor-light-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStaging ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Staging in Progress...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Start Virtual Staging</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Results - Before/After Comparison */}
      {stagingResult && selectedAsset && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Virtual Staging Results</h3>
              <p className="text-gray-400 text-sm">
                {selectedListing?.title} • {stagingOptions.room_type.replace('_', ' ')} • {stagingOptions.staging_style}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.open(stagingResult.data?.download_url, '_blank')}
                className="flex items-center space-x-2 text-realtor-light-blue hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Full View</span>
              </button>
              <button 
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = stagingResult.data?.download_url
                  link.download = `staged-${selectedListing?.title}-${Date.now()}.png`
                  link.click()
                }}
                className="flex items-center space-x-2 text-green-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  Before
                </h4>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Original</span>
              </div>
              <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                {selectedAsset.public_url ? (
                  <img 
                    src={selectedAsset.public_url} 
                    alt="Before staging" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
            
            {/* After */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-realtor-light-blue to-green-400 rounded-full mr-2"></div>
                  After
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">AI Staged</span>
                  <span className="text-xs text-realtor-light-blue bg-realtor-light-blue/20 px-2 py-1 rounded">
                    {stagingTiers.find(t => t.id === selectedTier)?.name}
                  </span>
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-realtor-light-blue/10 to-green-400/10 rounded-xl overflow-hidden border border-realtor-light-blue/30">
                {stagingResult.data?.download_url ? (
                  <img 
                    src={stagingResult.data.download_url} 
                    alt="After staging" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-realtor-light-blue mx-auto mb-3" />
                      <p className="text-realtor-light-blue font-medium">Staged Successfully!</p>
                      <p className="text-gray-400 text-sm">High-quality result ready</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Staging Metadata */}
          {stagingResult.data?.generation_metadata && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Processing Time:</span>
                  <p className="text-white font-medium">{stagingResult.data.generation_metadata.processing_time?.toFixed(1)}s</p>
                </div>
                <div>
                  <span className="text-gray-400">AI Provider:</span>
                  <p className="text-white font-medium">{stagingResult.data.generation_metadata.ai_provider}</p>
                </div>
                <div>
                  <span className="text-gray-400">Quality Tier:</span>
                  <p className="text-white font-medium">{stagingTiers.find(t => t.id === selectedTier)?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Asset ID:</span>
                  <p className="text-white font-medium text-xs">{stagingResult.data.asset_id}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
