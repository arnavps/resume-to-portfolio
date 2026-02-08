'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import Sidebar from '@/components/dashboard/Sidebar'
import ModernTemplate from '@/components/portfolio/templates/modern/ModernTemplate'
import { Eye, Download, Share2, Settings } from 'lucide-react'

export default function PreviewPage() {
  const { user } = useUser()
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (!portfolio) {
        setLoading(false)
        return
      }

      const [projects, experiences, skills, education, portfolioContent, userData] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('portfolio_id', portfolio.id)
          .order('display_order'),
        supabase
          .from('experiences')
          .select('*')
          .eq('portfolio_id', portfolio.id)
          .order('display_order'),
        supabase
          .from('skills')
          .select('*')
          .eq('portfolio_id', portfolio.id)
          .order('display_order'),
        supabase
          .from('education')
          .select('*')
          .eq('portfolio_id', portfolio.id)
          .order('display_order'),
        supabase
          .from('portfolio_content')
          .select('*')
          .eq('portfolio_id', portfolio.id),
        supabase
          .from('users')
          .select('*')
          .eq('id', user?.id)
          .single()
      ])

      setPortfolioData({
        ...portfolio,
        projects: projects.data || [],
        experiences: experiences.data || [],
        skills: skills.data || [],
        education: education.data || [],
        portfolio_content: portfolioContent.data || [],
        user: userData.data
      })
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    try {
      if (!portfolioData) return

      const { error } = await supabase
        .from('portfolios')
        .update({
          is_published: true,
          published_at: new Date().toISOString()
        })
        .eq('id', portfolioData.id)

      if (error) throw error

      alert('Portfolio published successfully!')
    } catch (error: any) {
      console.error('Error publishing portfolio:', error)
      alert('Failed to publish portfolio')
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/portfolio/${portfolioData?.subdomain}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${portfolioData?.user?.full_name}'s Portfolio`,
          text: 'Check out my portfolio!',
          url: shareUrl
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Portfolio link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="bg-gray-200 rounded-xl h-96"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">No Portfolio Found</h2>
            <p className="text-gray-600 mb-6">
              Create a portfolio first to preview it.
            </p>
            <a
              href="/dashboard/generate"
              className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition"
            >
              Generate Portfolio
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1">
        <div className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Portfolio Preview</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                {portfolioData.is_published ? 'Published' : 'Draft'}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="creative">Creative</option>
                <option value="professional">Professional</option>
              </select>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
              {!portfolioData.is_published && (
                <button
                  onClick={handlePublish}
                  className="bg-lime-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-lime-500 transition"
                >
                  Publish
                </button>
              )}
              
              <a
                href="/dashboard/customize"
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <Settings className="w-4 h-4" />
                Customize
              </a>
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-73px)] overflow-auto">
          <ModernTemplate 
            portfolioData={portfolioData} 
            isPreview={true}
          />
        </div>
      </div>
    </div>
  )
}
