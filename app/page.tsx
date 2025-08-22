'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Video, 
  Home as HomeIcon, 
  Palette, 
  Users, 
  Phone, 
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  Play,
  ChevronDown
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/30">
        <div className="section-container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Image
                src="/Logo.png"
                alt="RealtorX"
                width={240}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wider">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors duration-300">Features</a>
              <a href="#solutions" className="text-gray-400 hover:text-white transition-colors duration-300">Solutions</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a>
              <Link href="/login" className="btn-premium py-2 px-6 text-xs">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen Cinematic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                 {/* Animated Background */}
         <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900"></div>
        
        {/* Moving Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern animate-pulse"></div>
        </div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-realtor-light-blue/20 rotate-45 floating-element"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-silver/30 floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-8 h-8 bg-realtor-light-blue/30 floating-element" style={{ animationDelay: '4s' }}></div>
        
        {/* Main Hero Content */}
        <div className="section-container relative z-10 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-12 animate-fade-in">
              <Image
                src="/Logo.png"
                alt="RealtorX Logo"
                width={1800}
                height={1200}
                className="max-w-lg sm:max-w-2xl lg:max-w-4xl w-auto h-auto opacity-90"
                priority
              />
            </div>
            
            {/* Dramatic Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl dramatic-text mb-8 hero-text leading-none animate-slide-up">
              THE ULTIMATE
              <br />
              <span className="text-realtor-light-blue">TOOLKIT</span>
              <br />
              FOR ELITE REALTORS
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-16 text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay">
              AI-powered tools to sell faster, smarter, better.
              <br />
              <span className="text-realtor-light-blue font-medium">The future of real estate is here.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-delay-2">
              <Link href="/login" className="btn-premium group">
                Launch Platform
                <ArrowRight className="inline-block ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <button className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group">
                <Play className="w-6 h-6 mr-3 group-hover:text-realtor-light-blue transition-colors" />
                <span className="text-sm uppercase tracking-wider">Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Features Section - Reimagined */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent"></div>
        
        <div className="section-container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-24">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl dramatic-text mb-8 hero-text">
              WHAT'S INSIDE
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Six revolutionary AI-powered tools designed to transform how elite realtors operate
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="feature-card group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                  <Video className="w-8 h-8 text-realtor-light-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-realtor-light-blue transition-colors duration-500">
                    AI Property Videos & 3D Tours
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Transform simple 2D images into immersive, interactive Google Maps-style walkthroughs that captivate potential buyers
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                  <Palette className="w-8 h-8 text-realtor-light-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-realtor-light-blue transition-colors duration-500">
                    Virtual Staging & Content Generation
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    AI-generated staging and marketing materials that convert prospects into buyers at unprecedented rates
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                  <HomeIcon className="w-8 h-8 text-realtor-light-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-realtor-light-blue transition-colors duration-500">
                    Premium Branding Suite
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Custom business cards, marketing materials, and brand identity that positions you as the premium choice
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="feature-card group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                  <Users className="w-8 h-8 text-realtor-light-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-realtor-light-blue transition-colors duration-500">
                    Intelligent CRM & Lead Tracking
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Never lose a lead again with AI-powered tracking, scoring, and automated follow-up sequences
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="feature-card group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                  <Phone className="w-8 h-8 text-realtor-light-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-realtor-light-blue transition-colors duration-500">
                    AI Call Intelligence
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Psychology-based AI analysis that qualifies leads and optimizes every client conversation for maximum conversion
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="feature-card group">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 border border-realtor-light-blue/30 flex items-center justify-center group-hover:border-realtor-light-blue transition-colors duration-500">
                  <TrendingUp className="w-8 h-8 text-realtor-light-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-realtor-light-blue transition-colors duration-500">
                    Performance Analytics
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Real-time data insights and predictive analytics that optimize your sales process and maximize revenue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Problem/Solution Section */}
      <section id="solutions" className="py-32 relative">
        <div className="section-container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl dramatic-text mb-8 hero-text">
                THE PROBLEM
              </h2>
              <p className="text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                The real estate industry is stuck in the past while technology moves forward
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Problems */}
              <div className="space-y-12">
                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0 w-12 h-12 border border-red-500/30 flex items-center justify-center mt-2 group-hover:border-red-500 transition-colors duration-500">
                    <Target className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-red-300">Commoditized Competition</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Every agent offers the same generic services. No differentiation, no premium positioning, no competitive advantage.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0 w-12 h-12 border border-red-500/30 flex items-center justify-center mt-2 group-hover:border-red-500 transition-colors duration-500">
                    <DollarSign className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-red-300">Ineffective Marketing Spend</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Thousands wasted on Facebook ads and marketing that doesn't convert because it lacks sophistication and targeting.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0 w-12 h-12 border border-red-500/30 flex items-center justify-center mt-2 group-hover:border-red-500 transition-colors duration-500">
                    <Clock className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-red-300">Manual, Time-Intensive Processes</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Hours wasted on administrative tasks, manual follow-ups, and outdated workflows instead of closing deals.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Solutions */}
              <div className="space-y-12">
                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0 w-12 h-12 border border-realtor-light-blue/30 flex items-center justify-center mt-2 group-hover:border-realtor-light-blue transition-colors duration-500">
                    <CheckCircle className="w-6 h-6 text-realtor-light-blue" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-realtor-light-blue">Premium Market Positioning</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      AI-powered content and branding that positions you as the premium, tech-forward choice in your market.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0 w-12 h-12 border border-realtor-light-blue/30 flex items-center justify-center mt-2 group-hover:border-realtor-light-blue transition-colors duration-500">
                    <CheckCircle className="w-6 h-6 text-realtor-light-blue" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-realtor-light-blue">Intelligent Lead Conversion</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      AI analyzes and qualifies leads, creates targeted content, and optimizes every touchpoint for maximum conversion.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0 w-12 h-12 border border-realtor-light-blue/30 flex items-center justify-center mt-2 group-hover:border-realtor-light-blue transition-colors duration-500">
                    <CheckCircle className="w-6 h-6 text-realtor-light-blue" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-realtor-light-blue">Complete Automation</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Focus exclusively on high-value activities while AI handles everything else automatically and intelligently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Cinematic */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-radial from-realtor-blue/5 via-transparent to-transparent"></div>
        
        <div className="section-container relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center mb-12">
              <div className="w-24 h-24 border border-realtor-light-blue/30 flex items-center justify-center">
                <Zap className="w-12 h-12 text-realtor-light-blue" />
              </div>
            </div>
            
            <h2 className="text-5xl sm:text-6xl lg:text-8xl dramatic-text mb-12 hero-text leading-none">
              JOIN THE
              <br />
              <span className="text-realtor-light-blue">FUTURE</span>
            </h2>
            
            <p className="text-2xl sm:text-3xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto">
              Stop competing on price. Start competing on innovation.
              <br />
              <span className="text-realtor-light-blue font-medium">Be the agent everyone talks about.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/login" className="btn-premium text-lg py-6 px-16 group">
                Launch RealtorX
                <ArrowRight className="inline-block ml-4 w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Join elite realtors closing more deals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800/30">
        <div className="section-container">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Image
                src="/Logo.png"
                alt="RealtorX Logo"
                width={200}
                height={60}
                className="max-w-xs w-auto h-auto opacity-60"
              />
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wider">
              © 2024 RealtorX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Add custom animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in { animation: fade-in 1s ease-out; }
  .animate-fade-in-delay { animation: fade-in 1s ease-out 0.3s both; }
  .animate-fade-in-delay-2 { animation: fade-in 1s ease-out 0.6s both; }
  .animate-slide-up { animation: slide-up 1.2s ease-out; }
  
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
  }
`