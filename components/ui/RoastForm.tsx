'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Loader2, Cpu } from 'lucide-react'

interface RoastFormData {
  stackId: string
  content: string
  roastType: 'brutal' | 'constructive' | 'meme'
  authorName: string
  stackTitle?: string
  frontend?: string
  backend?: string
  database?: string
  hosting?: string
}

export default function RoastSubmitForm({
  stackId,
  stackTitle,
  frontend,
  backend,
  database,
  hosting,
}: {
  stackId: string
  stackTitle?: string
  frontend?: string
  backend?: string
  database?: string
  hosting?: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [aiError, setAiError] = useState('')

  const [formData, setFormData] = useState<RoastFormData>({
    stackId,
    content: '',
    roastType: 'brutal',
    authorName: '',
    stackTitle,
    frontend,
    backend,
    database,
    hosting,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const submitData = {
        stack_id: formData.stackId,
        content: formData.content,
        roast_type: formData.roastType,
        author_name: formData.authorName || null,
      }
      const response = await fetch('/api/roasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit roast')
      }
      setFormData(prev => ({ ...prev, content: '', authorName: '' }))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    setAiError('')
    try {
      // Build prompt from stack info and roastType
      const prompt = `Generate a ${formData.roastType} roast for this tech stack:
                      Title: ${formData.stackTitle ?? 'Unknown'}
                      Frontend: ${formData.frontend ?? 'N/A'}
                      Backend: ${formData.backend ?? 'N/A'}
                      Database: ${formData.database ?? 'N/A'}
                      Hosting: ${formData.hosting ?? 'N/A'}
                      Keep it witty and punchy.`

      const response = await fetch('/api/aiRoast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate AI roast')
      }

      setFormData(prev => ({ ...prev, content: result.roast || '' }))
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mt-12 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
        <Flame className="text-orange-500" size={28} />
        <span>Roast This Stack</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
            Roast Content *
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Make it brutal, constructive, or meme-worthy..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label htmlFor="roastType" className="block text-sm font-medium text-white mb-2">
            Roast Type *
          </label>
          <select
            id="roastType"
            name="roastType"
            required
            value={formData.roastType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
            disabled={isGenerating || isSubmitting}
          >
            <option value="brutal">Brutal</option>
            <option value="constructive">Constructive</option>
            <option value="meme">Meme</option>
          </select>
        </div>

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
            placeholder="Anonymous or your real name"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
            disabled={isGenerating || isSubmitting}
          />
        </div>

        {(error || aiError) && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-200">{error || aiError}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 space-x-4">
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isGenerating || isSubmitting}
            className="bg-orange-700 hover:bg-orange-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Generating AI Roast...</span>
              </>
            ) : (
              <>
                <Cpu size={20} />
                <span>Generate AI Roast</span>
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isGenerating || !formData.content.trim()}
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
                <span>Submit Roast</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
