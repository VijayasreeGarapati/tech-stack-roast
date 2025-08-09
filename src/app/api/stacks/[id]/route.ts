import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'

// GET /api/stacks/:id → fetch stack & roasts
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Fetch stack
    const { id } = await context.params;
    const { data: stack, error: stackError } = await supabase
      .from('stacks')
      .select('*')
      .eq('id', id)
      .single()

    if (stackError || !stack) {
      return NextResponse.json({ error: 'Stack not found' }, { status: 404 })
    }

    // Fetch roasts for that stack
    const { data: roasts, error: roastsError } = await supabase
      .from('roasts')
      .select('*')
      .eq('stack_id', id)
      .order('created_at', { ascending: false })

    if (roastsError) {
      return NextResponse.json({ error: 'Failed to fetch roasts' }, { status: 500 })
    }

    return NextResponse.json({ stack, roasts })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
