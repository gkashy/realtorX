'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    
    checkUser()
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-realtor-light-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with:', { email, password, isSignUp })
    setIsLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password
        })
        
        if (error) {
          setError(error.message)
        } else {
          setError('Check your email for confirmation link')
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        })
        
        if (error) {
          setError(error.message)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900 pointer-events-none"></div>
      
      {/* Moving Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-pulse"></div>
      </div>
      
      {/* Floating Geometric Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-realtor-light-blue/20 rotate-45 floating-element pointer-events-none"></div>
      <div className="absolute top-40 right-20 w-16 h-16 border border-silver/30 floating-element pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 left-20 w-8 h-8 bg-realtor-light-blue/30 floating-element pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        <div className="bg-gray-900/90 backdrop-blur-lg border border-gray-700 p-12 relative">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <Image
              src="/Logo.png"
              alt="RealtorX Logo"
              width={300}
              height={90}
              className="h-24 w-auto opacity-90"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl dramatic-text mb-4 hero-text">
              {isSignUp ? 'JOIN THE ELITE' : 'WELCOME BACK'}
            </h1>
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              {isSignUp ? 'Create your premium account' : 'Access your premium toolkit'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  console.log('Email changed:', e.target.value)
                  setEmail(e.target.value)
                }}
                required
                className="w-full px-4 py-4 bg-black/50 border border-gray-600 focus:border-realtor-light-blue focus:outline-none transition-colors duration-300 text-white placeholder-gray-400 relative z-10"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    console.log('Password changed:', e.target.value)
                    setPassword(e.target.value)
                  }}
                  required
                  className="w-full px-4 py-4 pr-12 bg-black/50 border border-gray-600 focus:border-realtor-light-blue focus:outline-none transition-colors duration-300 text-white placeholder-gray-400 relative z-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-realtor-light-blue transition-colors z-20 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-3 px-4">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative bg-transparent border-2 border-realtor-light-blue text-realtor-light-blue font-medium py-4 px-12 uppercase tracking-widest text-sm transition-all duration-500 hover:bg-realtor-light-blue/10 hover:transform hover:translateY(-1px) disabled:opacity-50 disabled:cursor-not-allowed z-10"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-realtor-light-blue border-t-transparent rounded-full animate-spin mr-3"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isSignUp ? 'Create Account' : 'Launch Platform'}
                  <ArrowRight className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              )}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                console.log('Toggle clicked, current isSignUp:', isSignUp)
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-gray-400 hover:text-realtor-light-blue transition-colors duration-300 text-sm uppercase tracking-wider underline underline-offset-4 relative z-10 cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Join the Elite'}
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Premium Tools for Elite Realtors
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
