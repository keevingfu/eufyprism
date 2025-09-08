import { NextRequest, NextResponse } from 'next/server'

// Mock ad campaign data
const adCampaigns = [
  {
    id: '1',
    name: 'Smart Lock Pro - Google Ads',
    platform: 'google',
    budget: 25000,
    spent: 12340,
    status: 'active',
    impressions: 567890,
    clicks: 12345,
    conversions: 789,
    cpc: 1.0,
    ctr: 2.17,
    roas: 4.2,
  },
  {
    id: '2',
    name: 'Summer Sale - Facebook',
    platform: 'facebook',
    budget: 15000,
    spent: 8760,
    status: 'active',
    impressions: 234567,
    clicks: 5678,
    conversions: 456,
    cpc: 1.54,
    ctr: 2.42,
    roas: 3.8,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform')
  const status = searchParams.get('status')

  let filteredCampaigns = adCampaigns

  if (platform) {
    filteredCampaigns = filteredCampaigns.filter(c => c.platform === platform)
  }

  if (status) {
    filteredCampaigns = filteredCampaigns.filter(c => c.status === status)
  }

  return NextResponse.json({
    campaigns: filteredCampaigns,
    total: filteredCampaigns.length,
  })
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newAdCampaign = {
    id: Date.now().toString(),
    ...data,
    status: 'draft',
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    cpc: 0,
    ctr: 0,
    roas: 0,
    createdAt: new Date().toISOString(),
  }

  adCampaigns.push(newAdCampaign)

  return NextResponse.json(newAdCampaign, { status: 201 })
}