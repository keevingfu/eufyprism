import { NextRequest, NextResponse } from 'next/server'
import { contextEngineeringService } from '@/services/context-engineering'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic')

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic parameter is required' },
        { status: 400 }
      )
    }

    const research = await contextEngineeringService.analyzeTopicResearch(topic)

    return NextResponse.json({
      success: true,
      research
    })

  } catch (error) {
    console.error('Research analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze research' },
      { status: 500 }
    )
  }
}