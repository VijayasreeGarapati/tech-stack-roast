import Link from 'next/link'
import { TechStack } from '@/types'
import { MessageCircle, Calendar, User } from 'lucide-react'

interface StackCardProps {
  stack: TechStack
}

export default function StackCard({ stack }: StackCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Link href={`/stack/${stack.id}`}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
            {stack.title}
          </h3>
          <div className="flex items-center space-x-2 text-gray-400">
            <MessageCircle size={16} />
            <span className="text-sm">{stack.roastCount}</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Frontend:</span>
              <span className="ml-2 px-2 py-1 bg-blue-600 text-blue-100 rounded text-xs">
                {stack.frontend}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Backend:</span>
              <span className="ml-2 px-2 py-1 bg-green-600 text-green-100 rounded text-xs">
                {stack.backend}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Database:</span>
              <span className="ml-2 px-2 py-1 bg-purple-600 text-purple-100 rounded text-xs">
                {stack.database}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Hosting:</span>
              <span className="ml-2 px-2 py-1 bg-yellow-600 text-yellow-100 rounded text-xs">
                {stack.hosting}
              </span>
            </div>
          </div>

          {/* Other Tools */}
          {stack.otherTools && stack.otherTools.length > 0 && (
            <div>
              <span className="text-gray-400 text-sm">Other tools:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {stack.otherTools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-gray-200 rounded text-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {stack.description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {stack.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-1">
            <User size={12} />
            <span>{stack.isAnonymous ? 'Anonymous' : stack.authorName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{formatDate(stack.createdAt)}</span>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="mt-3 text-right">
          <span className="text-xs text-gray-500 group-hover:text-orange-400 transition-colors">
            Click to roast →
          </span>
        </div>
      </div>
    </Link>
  )
}