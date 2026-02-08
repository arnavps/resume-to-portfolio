'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import Sidebar from '@/components/dashboard/Sidebar'
import { Github, Linkedin, FileText, Wand2, Play, CheckCircle, AlertCircle } from 'lucide-react'

export default function GeneratePage() {
  const { user } = useUser()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<any>(null)
  const [connectedSources, setConnectedSources] = useState<any>(null)
  const [portfolio, setPortfolio] = useState<any>(null)

  useEffect(() => {
    fetchConnectedSources()
    fetchPortfolio()
  }, [])

  const fetchConnectedSources = async () => {
    try {
      const { data } = await supabase
        .from('data_sources')
        .select('*')
        .eq('user_id', user?.id)

      setConnectedSources(data || [])
    } catch (error) {
      console.error('Error fetching data sources:', error)
    }
  }

  const fetchPortfolio = async () => {
    try {
      const { data } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      setPortfolio(data)
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    }
  }

  const handleGenerate = async () => {
    if (!portfolio) {
      alert('Please create a portfolio first')
      return
    }

    setIsGenerating(true)
    setGenerationProgress({ stage: 'Starting generation...', progress: 0 })

    try {
      const response = await fetch('/api/generate/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          options: {
            minStars: 0,
            maxProjects: 10,
            targetRole: 'Software Engineer'
          }
        })
      })

      const result = await response.json()

      if (response.ok) {
        setGenerationProgress({
          stage: 'Generation completed!',
          progress: 100,
          success: true,
          stats: result.stats
        })

        await fetchPortfolio()
      } else {
        throw new Error(result.error || 'Generation failed')
      }
    } catch (error: any) {
      setGenerationProgress({
        stage: error.message,
        progress: 0,
        error: true
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getSourceStatus = (sourceType: string) => {
    const source = connectedSources?.find((s: any) => s.source_type === sourceType)
    return {
      connected: !!source,
      status: source?.sync_status || 'not_connected',
      lastSynced: source?.last_synced_at
    }
  }

  const githubStatus = getSourceStatus('github')
  const resumeStatus = getSourceStatus('resume')
  const linkedinStatus = getSourceStatus('linkedin')

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Generate Portfolio</h1>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Connected Data Sources</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`border rounded-lg p-4 ${githubStatus.connected ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Github className={`w-6 h-6 ${githubStatus.connected ? 'text-green-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold">GitHub</h3>
                  {githubStatus.connected ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {githubStatus.connected ? 'Connected' : 'Not connected'}
                </p>
                {githubStatus.lastSynced && (
                  <p className="text-xs text-gray-500">
                    Last synced: {new Date(githubStatus.lastSynced).toLocaleDateString()}
                  </p>
                )}
                {!githubStatus.connected && (
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                    Connect GitHub →
                  </button>
                )}
              </div>

              <div className={`border rounded-lg p-4 ${resumeStatus.connected ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <FileText className={`w-6 h-6 ${resumeStatus.connected ? 'text-green-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold">Resume</h3>
                  {resumeStatus.connected ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {resumeStatus.connected ? 'Uploaded' : 'Not uploaded'}
                </p>
                {resumeStatus.lastSynced && (
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(resumeStatus.lastSynced).toLocaleDateString()}
                  </p>
                )}
                {!resumeStatus.connected && (
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                    Upload Resume →
                  </button>
                )}
              </div>

              <div className={`border rounded-lg p-4 ${linkedinStatus.connected ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Linkedin className={`w-6 h-6 ${linkedinStatus.connected ? 'text-green-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold">LinkedIn</h3>
                  {linkedinStatus.connected ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {linkedinStatus.connected ? 'Connected' : 'Not connected'}
                </p>
                {linkedinStatus.lastSynced && (
                  <p className="text-xs text-gray-500">
                    Last synced: {new Date(linkedinStatus.lastSynced).toLocaleDateString()}
                  </p>
                )}
                {!linkedinStatus.connected && (
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                    Connect LinkedIn →
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Generation Options</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Software Engineer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>DevOps Engineer</option>
                  <option>Data Scientist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum GitHub Stars
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0"
                  defaultValue="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Projects to Include
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="10"
                  defaultValue="10"
                />
              </div>
            </div>
          </div>

          {generationProgress && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Generation Progress</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{generationProgress.stage}</span>
                  <span className="text-sm text-gray-600">{generationProgress.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${generationProgress.error ? 'bg-red-500' :
                      generationProgress.success ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    style={{ width: `${generationProgress.progress}%` }}
                  ></div>
                </div>

                {generationProgress.stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{generationProgress.stats.projectsGenerated}</p>
                      <p className="text-sm text-gray-600">Projects Generated</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{generationProgress.stats.experiencesAdded}</p>
                      <p className="text-sm text-gray-600">Experiences Added</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{generationProgress.stats.skillsIdentified}</p>
                      <p className="text-sm text-gray-600">Skills Identified</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{generationProgress.stats.atsScore}</p>
                      <p className="text-sm text-gray-600">ATS Score</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !portfolio}
              className="flex items-center gap-2 bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Portfolio
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
