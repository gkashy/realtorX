'use client'

import { useState, useRef } from 'react'
import { 
  Video, 
  Upload, 
  Play,
  Camera,
  Film,
  Settings,
  Eye,
  Download,
  RefreshCw,
  Sparkles,
  Clock,
  CheckCircle,
  ArrowRight,
  Plus,
  X,
  Wand2,
  Zap,
  Star,
  Target,
  Music,
  Timer,
  Image as ImageIcon
} from 'lucide-react'
import { AIStudioClient } from '@/lib/ai-studio'

interface VideoGenerationToolsProps {
  userToken: string
  onJobCreated: (job: any) => void
}

interface UploadedImage {
  id: string
  file: File
  preview: string
  order: number
}

export default function VideoGenerationTools({ userToken, onJobCreated }: VideoGenerationToolsProps) {
  const [activeStep, setActiveStep] = useState<'upload' | 'plan' | 'generate'>('upload')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [videoOptions, setVideoOptions] = useState({
    duration: 30,
    video_style: 'cinematic',
    include_cover: true,
    include_ending: true,
    special_requests: '',
    music_preference: 'ambient'
  })
  const [scenePlan, setScenePlan] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aiClient = new AIStudioClient(userToken)

  const videoStyles = [
    {
      id: 'cinematic',
      name: 'Cinematic',
      description: 'Dramatic transitions with professional quality',
      icon: Film,
      preview: '🎬'
    },
    {
      id: 'smooth',
      name: 'Smooth',
      description: 'Gentle pans and welcoming transitions',
      icon: Camera,
      preview: '🌊'
    },
    {
      id: 'dynamic',
      name: 'Dynamic',
      description: 'Quick cuts with modern energy',
      icon: Zap,
      preview: '⚡'
    }
  ]

  const musicOptions = [
    { id: 'ambient', name: 'Ambient', icon: '🎵' },
    { id: 'upbeat', name: 'Upbeat', icon: '🎶' },
    { id: 'classical', name: 'Classical', icon: '🎼' },
    { id: 'none', name: 'No Music', icon: '🔇' }
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage: UploadedImage = {
            id: Date.now() + index,
            file,
            preview: e.target?.result as string,
            order: uploadedImages.length + index
          }
          setUploadedImages(prev => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }

  const reorderImages = (dragIndex: number, hoverIndex: number) => {
    const draggedImage = uploadedImages[dragIndex]
    const newImages = [...uploadedImages]
    newImages.splice(dragIndex, 1)
    newImages.splice(hoverIndex, 0, draggedImage)
    
    // Update order numbers
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      order: index
    }))
    
    setUploadedImages(reorderedImages)
  }

  const handlePlanScenes = async () => {
    if (uploadedImages.length < 2) return

    setIsProcessing(true)
    setProcessingStep('Analyzing images with AI...')

    try {
      const imageUrls = uploadedImages.map(img => img.preview)
      
      const result = await aiClient.planVideoScenes({
        listing_id: 'demo_listing',
        uploaded_images: imageUrls,
        special_requests: videoOptions.special_requests,
        duration: videoOptions.duration,
        include_cover: videoOptions.include_cover,
        include_ending: videoOptions.include_ending
      })

      setScenePlan(result)
      setActiveStep('plan')
    } catch (error) {
      console.error('Scene planning failed:', error)
    } finally {
      setIsProcessing(false)
      setProcessingStep('')
    }
  }

  const handleGenerateVideo = async () => {
    if (!scenePlan) return

    setIsProcessing(true)
    setProcessingStep('Queuing video generation...')

    try {
      const result = await aiClient.queueVideoTour({
        listing_id: 'demo_listing',
        scene_plan: scenePlan,
        video_style: videoOptions.video_style,
        music_preference: videoOptions.music_preference
      })

      onJobCreated(result)
      setActiveStep('generate')
    } catch (error) {
      console.error('Video generation failed:', error)
    } finally {
      setIsProcessing(false)
      setProcessingStep('')
    }
  }

  const renderUploadStep = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4">Upload Property Photos</h3>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-realtor-light-blue/50 transition-colors"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-2">Drop multiple photos here or click to browse</p>
              <p className="text-gray-400 text-sm">Minimum 2 photos required • Supports JPG, PNG up to 10MB each</p>
            </div>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">
              Uploaded Photos ({uploadedImages.length})
            </h4>
            <p className="text-gray-400 text-sm">Drag to reorder</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group bg-gray-800 rounded-lg overflow-hidden cursor-move"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))
                  reorderImages(dragIndex, index)
                }}
              >
                <img
                  src={image.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeImage(image.id)}
                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 w-6 h-6 bg-realtor-light-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Style Selection */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-white mb-4">Video Style</h4>
          
          <div className="space-y-3">
            {videoStyles.map((style) => {
              const Icon = style.icon
              return (
                <button
                  key={style.id}
                  onClick={() => setVideoOptions({...videoOptions, video_style: style.id})}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    videoOptions.video_style === style.id
                      ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{style.preview}</div>
                    <div>
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm opacity-75">{style.description}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Duration & Options */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-white mb-4">Video Options</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration: {videoOptions.duration} seconds
              </label>
              <input
                type="range"
                min="15"
                max="60"
                value={videoOptions.duration}
                onChange={(e) => setVideoOptions({...videoOptions, duration: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>15s</span>
                <span>60s</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={videoOptions.include_cover}
                  onChange={(e) => setVideoOptions({...videoOptions, include_cover: e.target.checked})}
                  className="w-4 h-4 text-realtor-light-blue bg-gray-700 border-gray-600 rounded focus:ring-realtor-light-blue"
                />
                <span className="text-gray-300">Include title cover</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={videoOptions.include_ending}
                  onChange={(e) => setVideoOptions({...videoOptions, include_ending: e.target.checked})}
                  className="w-4 h-4 text-realtor-light-blue bg-gray-700 border-gray-600 rounded focus:ring-realtor-light-blue"
                />
                <span className="text-gray-300">Include contact ending</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Music
              </label>
              <div className="grid grid-cols-2 gap-2">
                {musicOptions.map((music) => (
                  <button
                    key={music.id}
                    onClick={() => setVideoOptions({...videoOptions, music_preference: music.id})}
                    className={`p-2 rounded-lg border transition-all text-sm ${
                      videoOptions.music_preference === music.id
                        ? 'border-realtor-light-blue bg-realtor-light-blue/20 text-realtor-light-blue'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div>{music.icon}</div>
                    <div>{music.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h4 className="text-lg font-semibold text-white mb-4">Special Requests (Optional)</h4>
        <textarea
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-realtor-light-blue"
          rows={3}
          placeholder="Any specific requirements for the video tour? (e.g., highlight the kitchen, focus on natural lighting, etc.)"
          value={videoOptions.special_requests}
          onChange={(e) => setVideoOptions({...videoOptions, special_requests: e.target.value})}
        />
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4" />
            <span>{uploadedImages.length} photos uploaded</span>
          </span>
          <span className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span>{videoOptions.duration}s duration</span>
          </span>
        </div>
        
        <button
          onClick={handlePlanScenes}
          disabled={uploadedImages.length < 2 || isProcessing}
          className="flex items-center space-x-3 bg-gradient-to-r from-realtor-light-blue to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-realtor-light-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Plan Video Scenes</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderPlanStep = () => (
    <div className="space-y-6">
      {/* Scene Plan Header */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Scene Plan Generated</h3>
            <p className="text-gray-300">AI has analyzed your photos and created an optimal video sequence</p>
          </div>
        </div>
      </div>

      {/* Scene Preview */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h4 className="text-lg font-semibold text-white mb-4">Video Sequence Preview</h4>
        
        <div className="space-y-4">
          {scenePlan?.video_pairs?.map((pair: any, index: number) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="w-8 h-8 bg-realtor-light-blue rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <p className="text-white font-medium">{pair.transition_description}</p>
                <p className="text-gray-400 text-sm">{pair.scene_description}</p>
              </div>
              
              <div className="text-gray-400 text-sm">
                {pair.duration}s
              </div>
            </div>
          )) || (
            <div className="text-center py-8">
              <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Scene plan will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveStep('upload')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Upload</span>
        </button>
        
        <button
          onClick={handleGenerateVideo}
          disabled={!scenePlan || isProcessing}
          className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-500 hover:to-green-500 transition-all duration-300 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Generate Video Tour</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderGenerateStep = () => (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Video Generation Started!</h3>
        <p className="text-gray-300 mb-4">
          Your video tour is being processed. This typically takes 5-10 minutes depending on the complexity.
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <span className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Est. 5-10 minutes</span>
          </span>
          <span className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>{videoOptions.video_style} style</span>
          </span>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h4 className="text-lg font-semibold text-white mb-4">Processing Steps</h4>
        
        <div className="space-y-4">
          {[
            { step: 'Scene Analysis', status: 'completed', description: 'AI analyzed your photos' },
            { step: 'Video Pair Generation', status: 'processing', description: 'Creating video transitions' },
            { step: 'Music & Effects', status: 'pending', description: 'Adding audio and effects' },
            { step: 'Final Assembly', status: 'pending', description: 'Combining all elements' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                item.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {item.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                {item.status === 'processing' && <RefreshCw className="w-4 h-4 animate-spin" />}
                {item.status === 'pending' && <Clock className="w-4 h-4" />}
              </div>
              
              <div className="flex-1">
                <p className="text-white font-medium">{item.step}</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setActiveStep('upload')
            setUploadedImages([])
            setScenePlan(null)
          }}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Another Video</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 text-realtor-light-blue hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
            <span>View All Jobs</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Download When Ready</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header with Steps */}
      <div className="bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Video Generation</h2>
            <p className="text-gray-300">Create stunning property tours with AI-powered video generation</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold">Sequential Processing</p>
              <p className="text-gray-400 text-sm">High-quality video pairs</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center space-x-4">
          {[
            { id: 'upload', name: 'Upload Photos', icon: Upload },
            { id: 'plan', name: 'Plan Scenes', icon: Wand2 },
            { id: 'generate', name: 'Generate Video', icon: Play }
          ].map((step, index) => {
            const StepIcon = step.icon
            const isActive = activeStep === step.id
            const isCompleted = (
              (activeStep === 'plan' && step.id === 'upload') ||
              (activeStep === 'generate' && ['upload', 'plan'].includes(step.id))
            )
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                  isActive ? 'bg-realtor-light-blue/20 text-realtor-light-blue' :
                  isCompleted ? 'bg-green-500/20 text-green-400' :
                  'text-gray-400'
                }`}>
                  <StepIcon className="w-4 h-4" />
                  <span className="font-medium">{step.name}</span>
                </div>
                {index < 2 && (
                  <ArrowRight className={`w-4 h-4 mx-2 ${
                    isCompleted ? 'text-green-400' : 'text-gray-600'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="bg-gray-900/50 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <RefreshCw className="w-6 h-6 text-yellow-400 animate-spin" />
            <div>
              <p className="text-white font-medium">Processing...</p>
              <p className="text-gray-400 text-sm">{processingStep}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      {activeStep === 'upload' && renderUploadStep()}
      {activeStep === 'plan' && renderPlanStep()}
      {activeStep === 'generate' && renderGenerateStep()}
    </div>
  )
}
