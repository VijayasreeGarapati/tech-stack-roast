// Main application types
export interface TechStack {
    id: string
    title: string
    frontend: string
    backend: string
    database: string
    hosting: string
    otherTools: string[]
    description: string | null
    authorName: string | null
    isAnonymous: boolean
    createdAt: string
    roastCount: number
  }
  
  export interface Roast {
    id: string
    stackId: string
    content: string
    roastType: RoastType
    authorName: string | null
    upvotes: number
    downvotes: number
    createdAt: string
  }
  
  export interface Vote {
    id: string
    roastId: string
    voterIp: string
    voteType: VoteType
    createdAt: string
  }
  
  // Enums
  export type RoastType = 'brutal' | 'constructive' | 'meme'
  export type VoteType = 'up' | 'down'
  
  // Form interfaces
  export interface StackSubmissionForm {
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
  
  export interface RoastSubmissionForm {
    content: string
    roastType: RoastType
    authorName: string
  }
  
  // API response interfaces
  export interface ApiResponse<T> {
    data?: T
    error?: string
    success: boolean
  }
  
  export interface PaginatedResponse<T> {
    data: T[]
    count: number
    page: number
    totalPages: number
  }
  
  // Component props
  export interface StackCardProps {
    stack: TechStack
    showFullDescription?: boolean
  }
  
  export interface RoastListProps {
    stackId: string
    initialRoasts?: Roast[]
  }
  
  export interface LeaderboardEntry {
    stack: TechStack
    position: number
  }
  
  // Utility types
  export type SortOrder = 'recent' | 'most_roasted' | 'least_roasted'
  export type FilterType = 'all' | 'brutal' | 'constructive' | 'meme'
  
  // Database utility types
  export type DatabaseStack = {
    id: string
    title: string
    frontend: string
    backend: string
    database: string
    hosting: string
    other_tools: string[]
    description: string | null
    author_name: string | null
    is_anonymous: boolean
    created_at: string
    roast_count: number
  }
  
  export type DatabaseRoast = {
    id: string
    stack_id: string
    content: string
    roast_type: RoastType
    author_name: string | null
    upvotes: number
    downvotes: number
    created_at: string
  }