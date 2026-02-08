import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generatePortfolio } from '@/lib/generators/portfolio'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { portfolioId, options } = await request.json()

    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 })
    }

    const result = await generatePortfolio(user.id, portfolioId, options)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error generating portfolio:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate portfolio' },
      { status: 500 }
    )
  }
}
