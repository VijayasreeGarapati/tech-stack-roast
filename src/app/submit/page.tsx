'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Flame, Loader2 } from 'lucide-react'

interface FormData {
  title: string
  frontend: string
  backend: string
  database: string
  hosting: string
  otherTools: string
  description: string
  authorName: string
  isAnonymous: boolean
}

export default function SubmitPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    frontend: '',
    backend: '',
    database: '',
    hosting: '',
    otherTools: '',
    description: '',
    authorName: '',
    isAnonymous: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Process other tools
      const otherToolsArray = formData.otherTools
        .split(',')
        .map(tool => tool.trim())
        .filter(tool => tool.length > 0)

      const submitData = {
        ...formData,
        otherTools: otherToolsArray
      }

      const response = await fetch('/api/stacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit stack')
      }

      // Success! Redirect to the new stack page
      router.push(`/stack/${result.stack.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center space-x-3">
              <Flame className="text-orange-500" size={28} />
              <div>
                <h1 className="text-2xl font-bold text-white">Submit Your Stack</h1>
                <p className="text-gray-400">Ready to get roasted?</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stack Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                Stack Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="My Awesome Full Stack Setup"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="frontend" className="block text-sm font-medium text-white mb-2">
                  Frontend *
                </label>
                <input
                  type="text"
                  id="frontend"
                  name="frontend"
                  required
                  value={formData.frontend}
                  onChange={handleInputChange}
                  placeholder="React, Vue, Angular..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="backend" className="block text-sm font-medium text-white mb-2">
                  Backend *
                </label>
                <input
                  type="text"
                  id="backend"
                  name="backend"
                  required
                  value={formData.backend}
                  onChange={handleInputChange}
                  placeholder="Node.js, Python, Java..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="database" className="block text-sm font-medium text-white mb-2">
                  Database *
                </label>
                <input
                  type="text"
                  id="database"
                  name="database"
                  required
                  value={formData.database}
                  onChange={handleInputChange}
                  placeholder="PostgreSQL, MongoDB, MySQL..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="hosting" className="block text-sm font-medium text-white mb-2">
                  Hosting/Cloud *
                </label>
                <input
                  type="text"
                  id="hosting"
                  name="hosting"
                  required
                  value={formData.hosting}
                  onChange={handleInputChange}
                  placeholder="Vercel, AWS, Heroku..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Other Tools */}
            <div>
              <label htmlFor="otherTools" className="block text-sm font-medium text-white mb-2">
                Other Tools (Optional)
              </label>
              <input
                type="text"
                id="otherTools"
                name="otherTools"
                value={formData.otherTools}
                onChange={handleInputChange}
                placeholder="Docker, Redis, GraphQL (comma-separated)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
              />
              <p className="text-sm text-gray-400 mt-1">Separate multiple tools with commas</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Why did you choose this stack? (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your stack choices, project type, or any context that might make the roasts more interesting..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Author Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="isAnonymous" className="text-sm text-white">
                  Submit anonymously
                </label>
              </div>

              {!formData.isAnonymous && (
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-white mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    placeholder="John Developer"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to stacks
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Flame size={20} />
                    <span>Submit for Roasting</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}