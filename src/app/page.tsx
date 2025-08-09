import { supabase } from '@/lib/supabase'
import StackCard from '@/components/ui/StackCard'
import { TechStack } from '@/types'
import Link from 'next/link'
import { Plus, Flame } from 'lucide-react'

// Convert database row to our TechStack interface
interface TechStackRow {
  id: string ;
  title: string;
  frontend: string;
  backend: string;
  database: string;
  hosting: string;
  other_tools?: string[] | null;
  description: string;
  author_name: string;
  is_anonymous: boolean;
  created_at: string;
  roast_count: number;
}

function convertDatabaseRowToTechStack(row: TechStackRow): TechStack {
  return {
    id: row.id,
    title: row.title,
    frontend: row.frontend,
    backend: row.backend,
    database: row.database,
    hosting: row.hosting,
    otherTools: row.other_tools || [],
    description: row.description,
    authorName: row.author_name,
    isAnonymous: row.is_anonymous,
    createdAt: row.created_at,
    roastCount: row.roast_count
  }
}

export default async function HomePage() {
  // Fetch stacks from Supabase
  const { data: stacksData, error } = await supabase
    .from('stacks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Database Error</h1>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    )
  }

  // Convert database rows to our interface
  const stacks: TechStack[] = stacksData?.map(convertDatabaseRowToTechStack) || []

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flame className="text-orange-500" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Tech Stack Roast Battle
                </h1>
                <p className="text-gray-400 mt-1">
                  Submit your stack. Get roasted. Learn something.
                </p>
              </div>
            </div>
            
            <Link
              href="/submit"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Submit Stack</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-500">
              {stacks.length}
            </div>
            <div className="text-gray-400 mt-1">Stacks Submitted</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-500">
              {stacks.reduce((total, stack) => total + stack.roastCount, 0)}
            </div>
            <div className="text-gray-400 mt-1">Total Roasts</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">
              {stacks.length > 0 ? Math.max(...stacks.map(s => s.roastCount)) : 0}
            </div>
            <div className="text-gray-400 mt-1">Most Roasted</div>
          </div>
        </div>

        {/* Filter/Sort Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Latest Stacks ({stacks.length})
          </h2>
          
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors">
              Latest
            </button>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-600 transition-colors">
              Most Roasted
            </button>
          </div>
        </div>

        {/* Stacks Grid */}
        {stacks.length === 0 ? (
          <div className="text-center py-12">
            <Flame className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No stacks yet!</h3>
            <p className="text-gray-400 mb-6">Be the first to submit your tech stack for roasting.</p>
            <Link
              href="/submit"
              className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus size={20} />
              <span>Submit First Stack</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stacks.map((stack) => (
              <StackCard key={stack.id} stack={stack} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-800">
          <div className="text-center text-gray-400">
            <p>Built with Next.js, TypeScript, and Supabase</p>
            <p className="mt-1">Ready to get roasted? Submit your stack! 🔥</p>
          </div>
        </footer>
      </main>
    </div>
  )
}