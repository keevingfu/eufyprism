import { NextRequest, NextResponse } from 'next/server'

// Mock email campaign data
const emailCampaigns = [
  {
    id: '1',
    name: 'Welcome Series',
    subject: 'Welcome to Eufy - Get 10% Off Your First Order',
    status: 'active',
    recipients: ['subscribers', 'new_customers'],
    sent: 45230,
    delivered: 44120,
    opened: 12450,
    clicked: 3210,
    unsubscribed: 45,
    bounced: 110,
  },
]

export async function GET(request: NextRequest) {
  return NextResponse.json({
    campaigns: emailCampaigns,
    total: emailCampaigns.length,
  })
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newEmailCampaign = {
    id: Date.now().toString(),
    ...data,
    status: 'draft',
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
    bounced: 0,
    createdAt: new Date().toISOString(),
  }

  emailCampaigns.push(newEmailCampaign)

  return NextResponse.json(newEmailCampaign, { status: 201 })
}