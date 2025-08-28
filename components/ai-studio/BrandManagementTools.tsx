'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Brush,
  Wand2,
  Upload,
  Eye,
  Download,
  RefreshCw,
  Sparkles,
  Star,
  Crown,
  Palette,
  Type,
  Globe,
  Camera,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  ArrowRight,
  Zap,
  Target,
  Settings,
  Image as ImageIcon
} from 'lucide-react'
import { AIStudioClient } from '@/lib/ai-studio'

interface BrandManagementToolsProps {
  userToken: string
  onJobCreated: (job: any) => void
}

interface BrandKit {
  id: string
  name: string
  is_default: boolean
  theme: {
    colors?: {
      primary: string
      secondary: string
      accent: string
      neutral_light: string
      neutral_dark: string
    }
    typography?: {
      heading_font: string
      body_font: string
      accent_font: string
    }
    style?: string
  }
  voice?: string
  website_url?: string
  created_at: string
  updated_at: string
}

export default function BrandManagementTools({ userToken, onJobCreated }: BrandManagementToolsProps) {
  const [activeMode, setActiveMode] = useState<'ai' | 'manual'>('ai')
  const [activeAITool, setActiveAITool] = useState<string | null>(null)
  const [brandKits, setBrandKits] = useState<BrandKit[]>([])
  const [selectedBrandKit, setSelectedBrandKit] = useState<BrandKit | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const aiClient = new AIStudioClient(userToken)

  const aiTools = [
    {
      id: 'from_description',
      name: 'Create from Description',
      icon: Wand2,
      description: 'AI creates complete brand kit from your company description',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'analyze_logo',
      name: 'Analyze Logo',
      icon: Camera,
      description: 'Extract colors, fonts, and style from your existing logo',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'from_website',
      name: 'Extract from Website',
      icon: Globe,
      description: 'Analyze existing website to create consistent brand kit',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'variations',
      name: 'Generate Variations',
      icon: Sparkles,
      description: 'Create seasonal and contextual brand variations',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const colorPresets = [
    { name: 'Professional Blue', primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
    { name: 'Luxury Gold', primary: '#d97706', secondary: '#92400e', accent: '#f59e0b' },
    { name: 'Modern Green', primary: '#059669', secondary: '#047857', accent: '#10b981' },
    { name: 'Elegant Purple', primary: '#7c3aed', secondary: '#5b21b6', accent: '#8b5cf6' },
    { name: 'Classic Red', primary: '#dc2626', secondary: '#991b1b', accent: '#ef4444' },
    { name: 'Sophisticated Gray', primary: '#374151', secondary: '#1f2937', accent: '#6b7280' }
  ]

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Nunito',
    'Raleway',
    'Ubuntu'
  ]

  useEffect(() => {
    loadBrandKits()
  }, [])

  const loadBrandKits = async () => {
    // Mock data - replace with actual API call
    setBrandKits([
      {
        id: '1',
        name: 'Default Brand Kit',
        is_default: true,
        theme: {
          colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#3b82f6',
            neutral_light: '#f8fafc',
            neutral_dark: '#1e293b'
          },
          typography: {
            heading_font: 'Inter',
            body_font: 'Inter',
            accent_font: 'Inter'
          },
          style: 'modern'
        },
        voice: 'Professional and trustworthy',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
  }

  const handleAIGeneration = async (toolId: string) => {
    setIsCreating(true)
    try {
      let result
      
      switch (toolId) {
        case 'from_description':
          result = await aiClient.createBrandFromDescription(formData)
          break
        case 'analyze_logo':
          result = await aiClient.analyzeLogo(formData)
          break
        case 'from_website':
          result = await aiClient.extractFromWebsite(formData)
          break
        case 'variations':
          result = await aiClient.generateBrandVariations(formData)
          break
        default:
          throw new Error('Unknown AI tool')
      }

      setAnalysisResult(result)
      onJobCreated(result)
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({
          ...formData,
          logo_image_url: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateManualBrandKit = async () => {
    setIsCreating(true)
    try {
      // Create brand kit via brand-kit-manager API
      const newBrandKit: BrandKit = {
        id: Date.now().toString(),
        name: formData.name || 'New Brand Kit',
        is_default: false,
        theme: {
          colors: formData.colors,
          typography: formData.typography,
          style: formData.style || 'modern'
        },
        voice: formData.voice,
        website_url: formData.website_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setBrandKits(prev => [...prev, newBrandKit])
      setFormData({})
    } catch (error) {
      console.error('Manual brand kit creation failed:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const renderAITools = () => (
    <div className="space-y-6">
      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiTools.map((tool) => {
          const Icon = tool.icon
          return (
            <div
              key={tool.id}
              onClick={() => setActiveAITool(tool.id)}
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
                  <span className="text-green-400 text-sm font-medium">AI Powered</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-realtor-light-blue group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Tool Form */}
      {activeAITool && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {aiTools.find(t => t.id === activeAITool)?.name}
            </h3>
            <button
              onClick={() => setActiveAITool(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeAITool === 'from_description' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Description
                </label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  rows={4}
                  placeholder="Describe your real estate company, target market, and unique value proposition..."
                  value={formData.company_description || ''}
                  onChange={(e) => setFormData({...formData, company_description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Market Focus
                  </label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                    value={formData.market_focus || ''}
                    onChange={(e) => setFormData({...formData, market_focus: e.target.value})}
                  >
                    <option value="">Select market focus...</option>
                    <option value="luxury_homes">Luxury Homes</option>
                    <option value="first_time_buyers">First-Time Buyers</option>
                    <option value="commercial">Commercial Real Estate</option>
                    <option value="investment">Investment Properties</option>
                    <option value="residential">General Residential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Style Preference
                  </label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                    value={formData.style_preference || ''}
                    onChange={(e) => setFormData({...formData, style_preference: e.target.value})}
                  >
                    <option value="">Select style...</option>
                    <option value="modern">Modern</option>
                    <option value="traditional">Traditional</option>
                    <option value="luxury">Luxury</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  placeholder="e.g., Young professionals, luxury home buyers, families..."
                  value={formData.target_audience || ''}
                  onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                />
              </div>
            </div>
          )}

          {activeAITool === 'analyze_logo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Logo
                </label>
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-realtor-light-blue/50 transition-colors"
                >
                  {formData.logo_image_url ? (
                    <div className="space-y-4">
                      <img 
                        src={formData.logo_image_url} 
                        alt="Logo" 
                        className="max-w-32 max-h-32 mx-auto"
                      />
                      <p className="text-green-400 font-medium">Logo uploaded successfully!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-2">Upload your logo</p>
                        <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.extract_colors !== false}
                    onChange={(e) => setFormData({...formData, extract_colors: e.target.checked})}
                    className="w-4 h-4 text-realtor-light-blue bg-gray-700 border-gray-600 rounded focus:ring-realtor-light-blue"
                  />
                  <span className="text-gray-300">Extract color palette</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.suggest_fonts !== false}
                    onChange={(e) => setFormData({...formData, suggest_fonts: e.target.checked})}
                    className="w-4 h-4 text-realtor-light-blue bg-gray-700 border-gray-600 rounded focus:ring-realtor-light-blue"
                  />
                  <span className="text-gray-300">Suggest matching fonts</span>
                </label>
              </div>
            </div>
          )}

          {activeAITool === 'from_website' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                  placeholder="https://your-website.com"
                  value={formData.website_url || ''}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                />
              </div>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.analyze_competitors || false}
                  onChange={(e) => setFormData({...formData, analyze_competitors: e.target.checked})}
                  className="w-4 h-4 text-realtor-light-blue bg-gray-700 border-gray-600 rounded focus:ring-realtor-light-blue"
                />
                <span className="text-gray-300">Include competitive analysis</span>
              </label>
            </div>
          )}

          <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-700/50">
            <button
              onClick={() => handleAIGeneration(activeAITool)}
              disabled={isCreating}
              className="flex items-center space-x-2 bg-gradient-to-r from-realtor-light-blue to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-realtor-light-blue transition-all duration-300 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Brand Kit</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">AI Analysis Complete</h3>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 text-realtor-light-blue hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button className="flex items-center space-x-2 text-green-400 hover:text-white transition-colors">
                <Download className="w-4 h-4" />
                <span>Create Brand Kit</span>
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300">Brand analysis completed successfully! Review the generated brand elements and create your brand kit.</p>
          </div>
        </div>
      )}
    </div>
  )

  const renderManualCreation = () => (
    <div className="space-y-6">
      {/* Manual Brand Kit Form */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-6">Create Brand Kit Manually</h3>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand Kit Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                placeholder="e.g., Summer 2024 Brand"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website URL (Optional)
              </label>
              <input
                type="url"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
                placeholder="https://your-website.com"
                value={formData.website_url || ''}
                onChange={(e) => setFormData({...formData, website_url: e.target.value})}
              />
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Color Palette
            </label>
            
            {/* Color Presets */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setFormData({
                    ...formData,
                    colors: {
                      primary: preset.primary,
                      secondary: preset.secondary,
                      accent: preset.accent,
                      neutral_light: '#f8fafc',
                      neutral_dark: '#1e293b'
                    }
                  })}
                  className="p-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                >
                  <div className="flex space-x-1 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <div className="text-xs text-gray-300">{preset.name}</div>
                </button>
              ))}
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { key: 'primary', label: 'Primary' },
                { key: 'secondary', label: 'Secondary' },
                { key: 'accent', label: 'Accent' },
                { key: 'neutral_light', label: 'Light' },
                { key: 'neutral_dark', label: 'Dark' }
              ].map((color) => (
                <div key={color.key}>
                  <label className="block text-xs text-gray-400 mb-1">{color.label}</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      className="w-8 h-8 rounded border border-gray-600 bg-gray-800"
                      value={formData.colors?.[color.key] || '#000000'}
                      onChange={(e) => setFormData({
                        ...formData,
                        colors: {
                          ...formData.colors,
                          [color.key]: e.target.value
                        }
                      })}
                    />
                    <input
                      type="text"
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-realtor-light-blue"
                      value={formData.colors?.[color.key] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        colors: {
                          ...formData.colors,
                          [color.key]: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Typography
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'heading_font', label: 'Heading Font' },
                { key: 'body_font', label: 'Body Font' },
                { key: 'accent_font', label: 'Accent Font' }
              ].map((font) => (
                <div key={font.key}>
                  <label className="block text-xs text-gray-400 mb-2">{font.label}</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-realtor-light-blue"
                    value={formData.typography?.[font.key] || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      typography: {
                        ...formData.typography,
                        [font.key]: e.target.value
                      }
                    })}
                  >
                    <option value="">Select font...</option>
                    {fontOptions.map((fontName) => (
                      <option key={fontName} value={fontName}>{fontName}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Voice */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Brand Voice & Personality
            </label>
            <textarea
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
              rows={3}
              placeholder="Describe your brand's personality, tone, and voice (e.g., Professional yet approachable, trustworthy, modern...)"
              value={formData.voice || ''}
              onChange={(e) => setFormData({...formData, voice: e.target.value})}
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Overall Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['modern', 'traditional', 'luxury', 'minimalist', 'professional', 'friendly', 'bold', 'elegant'].map(style => (
                <button
                  key={style}
                  onClick={() => setFormData({...formData, style})}
                  className={`p-3 rounded-lg border transition-all capitalize ${
                    formData.style === style
                      ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-gray-700/50">
            <button
              onClick={handleCreateManualBrandKit}
              disabled={!formData.name || isCreating}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-500 hover:to-green-500 transition-all duration-300 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Brand Kit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBrandKitsList = () => (
    <div className="space-y-4">
      {brandKits.map((kit) => (
        <div
          key={kit.id}
          className={`bg-gray-900/50 border rounded-xl p-6 backdrop-blur-sm transition-all duration-300 ${
            kit.is_default 
              ? 'border-realtor-light-blue bg-realtor-light-blue/10' 
              : 'border-gray-700/50 hover:border-gray-600/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                {kit.theme.colors && Object.values(kit.theme.colors).slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{kit.name}</h3>
                {kit.is_default && (
                  <span className="text-xs px-2 py-1 bg-realtor-light-blue/20 text-realtor-light-blue rounded-full uppercase tracking-wider">
                    Default
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-realtor-light-blue transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
              {!kit.is_default && (
                <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Typography:</span>
              <p className="text-white">{kit.theme.typography?.heading_font || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-400">Style:</span>
              <p className="text-white capitalize">{kit.theme.style || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-400">Voice:</span>
              <p className="text-white truncate">{kit.voice || 'Not set'}</p>
            </div>
          </div>
        </div>
      ))}
      
      {brandKits.length === 0 && (
        <div className="text-center py-12">
          <Brush className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No brand kits yet. Create your first one!</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Brand Management</h2>
            <p className="text-gray-300">Create and manage your brand identity with AI assistance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold">{brandKits.length} Brand Kits</p>
              <p className="text-gray-400 text-sm">AI + Manual Creation</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <Brush className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex items-center space-x-4">
          {[
            { id: 'ai', name: 'AI Creation', icon: Wand2, description: 'Let AI create your brand' },
            { id: 'manual', name: 'Manual Creation', icon: Settings, description: 'Design manually' }
          ].map((mode) => {
            const ModeIcon = mode.icon
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                  activeMode === mode.id
                    ? 'bg-realtor-light-blue/20 text-realtor-light-blue border border-realtor-light-blue/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <ModeIcon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">{mode.name}</div>
                  <div className="text-xs opacity-75">{mode.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {activeMode === 'ai' ? renderAITools() : renderManualCreation()}

      {/* Existing Brand Kits */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Your Brand Kits</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Star className="w-4 h-4" />
            <span>{brandKits.filter(k => k.is_default).length} Default</span>
          </div>
        </div>
        
        {renderBrandKitsList()}
      </div>
    </div>
  )
}
