import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// GET /api/stacks - Fetch all stacks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    const { data: stacks, error } = await supabase
      .from('stacks')
      .select('*')
      .order(sortBy, { ascending: order === 'asc' })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stacks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ stacks })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/stacks - Create new stack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { title, frontend, backend, database, hosting } = body
    
    if (!title || !frontend || !backend || !database || !hosting) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare data for database
    const stackData = {
      title: title.trim(),
      frontend: frontend.trim(),
      backend: backend.trim(),
      database: database.trim(),
      hosting: hosting.trim(),
      other_tools: body.otherTools || [],
      description: body.description?.trim() || null,
      author_name: body.authorName?.trim() || null,
      is_anonymous: body.isAnonymous || false
    }

    // Insert into database
    const { data: newStack, error } = await supabase
      .from('stacks')
      .insert([stackData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create stack' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Stack created successfully',
        stack: newStack
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}