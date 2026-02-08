import Link from 'next/link'
import { ArrowRight, Github, Linkedin, FileText, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-white">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="font-bold text-xl">PortfolioGen</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Resume Into a
            <span className="text-lime-500"> Stunning Portfolio</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered portfolio generation that connects your GitHub, LinkedIn, and resume
            to create a professional online presence in minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition flex items-center gap-2"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              View Demo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Github className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">GitHub Integration</h3>
            <p className="text-gray-600">
              Automatically import and analyze your repositories with AI-generated narratives
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Linkedin className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">LinkedIn Sync</h3>
            <p className="text-gray-600">
              Import your professional experience and enhance it with AI storytelling
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Resume Upload</h3>
            <p className="text-gray-600">
              Upload your resume and let AI extract and structure your professional data
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold mb-4">AI-Powered Generation</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our advanced AI analyzes your digital footprint to create compelling project narratives,
            optimize for ATS systems, and provide personalized coaching to make your portfolio stand out.
          </p>
          <Link
            href="/signup"
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Create Your Portfolio Now
          </Link>
        </div>
      </main>

      <footer className="border-t mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-600"> 2024 PortfolioGen. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
