import Link from 'next/link'
import RoastSubmitForm from '@/components/ui/RoastForm'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Stack {
  id: string
  title: string
  frontend: string
  backend: string
  database: string
  hosting: string
  other_tools: string[]
  description: string
  author_name: string | null
  is_anonymous: boolean
  created_at: string
  roast_count: number
}

interface Roast {
  id: string
  content: string
  roast_type: 'brutal' | 'constructive' | 'meme'
  author_name: string | null
  upvotes: number
  downvotes: number
  created_at: string
}

interface StackPageProps {
    params: Promise<{ id: string }>;
}

export default async function StackPage(props: StackPageProps) {
    const { params } = props
    const { id } = await params 

  const { data: stack, error: stackError } = await supabase
    .from('stacks')
    .select('*')
    .eq('id', id)
    .single()

  if (stackError || !stack) {
    notFound()
  }

  const { data: roasts, error: roastsError } = await supabase
    .from('roasts')
    .select('*')
    .eq('stack_id', id)
    .order('created_at', { ascending: false })

  // Optional: handle roastsError if needed

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-block mb-6 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to stacks
        </Link>

        {/* Stack Header */}
        <h1 className="text-4xl font-extrabold mb-4 text-orange-500">{stack.title}</h1>
        <p className="mb-4 text-gray-300">{stack.description || 'No description provided.'}</p>

        {/* Tech Stack Details */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-white">
          <div>
            <p><strong>Frontend:</strong> {stack.frontend}</p>
            <p><strong>Backend:</strong> {stack.backend}</p>
            <p><strong>Database:</strong> {stack.database}</p>
          </div>
          <div>
            <p><strong>Hosting:</strong> {stack.hosting}</p>
            <p><strong>Other Tools:</strong> {stack.other_tools?.length ? stack.other_tools.join(', ') : 'None'}</p>
          </div>
        </div>

        {/* Roasts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-orange-500">
            Roasts ({stack.roast_count})
          </h2>

          {roasts && roasts.length > 0 ? (
            <ul className="space-y-4">
              {roasts.map(roast => (
                <li
                  key={roast.id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4"
                >
                  <p className="mb-2">{roast.content}</p>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Type: {roast.roast_type}</span>
                    <span>By: {roast.author_name || 'Anonymous'}</span>
                    <span>
                      👍 {roast.upvotes} 👎 {roast.downvotes}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No roasts yet. Be the first to roast!</p>
          )}
        </section>

        {/* Roast Submit Form */}
        <RoastSubmitForm stackId={stack.id} />
      </main>
    </div>
  )
}
