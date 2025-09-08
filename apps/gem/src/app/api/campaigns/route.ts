import { NextRequest, NextResponse } from 'next/server'

// Mock data for campaigns
const campaigns = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    type: 'multi-channel',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    budget: 50000,
    spent: 23450,
    conversions: 1234,
    roi: 285,
    channels: ['email', 'facebook', 'google'],
  },
  {
    id: '2',
    name: 'Product Launch - Smart Lock Pro',
    type: 'multi-channel',
    status: 'active',
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    budget: 100000,
    spent: 45670,
    conversions: 2567,
    roi: 412,
    channels: ['email', 'instagram', 'google', 'linkedin'],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let filteredCampaigns = campaigns

  if (status) {
    filteredCampaigns = filteredCampaigns.filter(c => c.status === status)
  }

  if (type) {
    filteredCampaigns = filteredCampaigns.filter(c => c.type === type)
  }

  return NextResponse.json({
    campaigns: filteredCampaigns,
    total: filteredCampaigns.length,
  })
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newCampaign = {
    id: Date.now().toString(),
    ...data,
    spent: 0,
    conversions: 0,
    roi: 0,
    createdAt: new Date().toISOString(),
  }

  // In a real application, save to database
  campaigns.push(newCampaign)

  return NextResponse.json(newCampaign, { status: 201 })
}