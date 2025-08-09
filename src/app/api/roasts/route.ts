import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const stack_id = searchParams.get('stack_id')

  if (!stack_id) {
    return NextResponse.json({ error: 'Missing stack_id' }, { status: 400 })
  }

  const { data: roasts, error } = await supabase
    .from('roasts')
    .select('*')
    .eq('stack_id', stack_id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ roasts })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stack_id, content, roast_type, author_name } = body

    if (!stack_id || !content || !roast_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.from('roasts').insert([
      {
        stack_id,
        content,
        roast_type,
        author_name: author_name || null,
        upvotes: 0,
        downvotes: 0,
      },
    ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Increment roast_count with safe fetch + update
    const { data: stackData, error: fetchError } = await supabase
      .from('stacks')
      .select('roast_count')
      .eq('id', stack_id)
      .single()

    if (!fetchError && stackData) {
      const newCount = (stackData.roast_count ?? 0) + 1
      console.log("newCount", newCount)
      const { error: updateError } = await supabase
        .from('stacks')
        .update({ roast_count: newCount })
        .eq('id', stack_id)

      if (updateError) {
        console.error('Failed to update roast_count:', updateError)
      }
    } else {
      console.error('Failed to fetch roast_count:', fetchError)
    }

    return NextResponse.json({ roast: data?.[0] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}
