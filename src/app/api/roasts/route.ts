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

    return NextResponse.json({ roast: data?.[0] })
  } 
  
  catch (err) {
    return NextResponse.json({ error: err|| 'Unknown error' }, { status: 500 })
  }
}
