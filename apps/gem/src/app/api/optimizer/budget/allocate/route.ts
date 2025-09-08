import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { totalBudget, constraints } = await request.json()

  // Mock budget optimization algorithm
  // In a real application, this would use ML models and historical data
  const channels = ['email', 'facebook', 'google', 'instagram', 'linkedin']
  const historicalROI = {
    email: 4.2,
    facebook: 3.8,
    google: 4.5,
    instagram: 3.5,
    linkedin: 3.2,
  }

  // Simple optimization: allocate more budget to channels with higher ROI
  const totalROI = Object.values(historicalROI).reduce((sum, roi) => sum + roi, 0)
  
  const allocations = channels.map(channel => {
    const roiWeight = historicalROI[channel as keyof typeof historicalROI] / totalROI
    let recommendedBudget = Math.round(totalBudget * roiWeight)

    // Apply constraints if provided
    if (constraints?.minPerChannel && recommendedBudget < constraints.minPerChannel) {
      recommendedBudget = constraints.minPerChannel
    }
    if (constraints?.maxPerChannel && recommendedBudget > constraints.maxPerChannel) {
      recommendedBudget = constraints.maxPerChannel
    }

    return {
      channel,
      currentBudget: Math.round(totalBudget / channels.length), // Equal distribution as current
      recommendedBudget,
      expectedROI: historicalROI[channel as keyof typeof historicalROI],
      confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
    }
  })

  // Ensure total doesn't exceed budget
  const totalRecommended = allocations.reduce((sum, a) => sum + a.recommendedBudget, 0)
  if (totalRecommended > totalBudget) {
    const scale = totalBudget / totalRecommended
    allocations.forEach(a => {
      a.recommendedBudget = Math.round(a.recommendedBudget * scale)
    })
  }

  return NextResponse.json(allocations)
}