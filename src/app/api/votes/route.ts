import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roast_id, vote_type } = body
    if (!roast_id || !['up', 'down'].includes(vote_type)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    // Get voter IP for duplicate vote prevention (basic)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Check if this IP has voted for this roast
    const { data: existingVotes, error: fetchError } = await supabase
      .from('votes')
      .select('*')
      .eq('roast_id', roast_id)
      .eq('voter_ip', ip)
      .limit(1)

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (existingVotes && existingVotes.length > 0) {
      return NextResponse.json({ error: 'You have already voted on this roast' }, { status: 400 })
    }

    // Insert vote record
    const { error: insertError } = await supabase.from('votes').insert([
      {
        roast_id,
        voter_ip: ip,
        vote_type,
      },
    ])

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Update upvotes/downvotes count on roast
    const columnToIncrement = vote_type === 'up' ? 'upvotes' : 'downvotes'

    // Get current count
    const { data: roastData, error: roastFetchError } = await supabase
      .from('roasts')
      .select(columnToIncrement)
      .eq('id', roast_id)
      .single()

    if (roastFetchError || !roastData) {
      return NextResponse.json({ error: 'Failed to fetch roast votes' }, { status: 500 })
    }

    // TypeScript fix: assert type so property access is safe
    const roastCounts = roastData as { upvotes: number; downvotes: number }
    const newCount = roastCounts[columnToIncrement] + 1

    const { error: updateError } = await supabase
      .from('roasts')
      .update({ [columnToIncrement]: newCount })
      .eq('id', roast_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err || 'Unknown error' }, { status: 500 })
  }
}
