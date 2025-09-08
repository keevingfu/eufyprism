import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { testMode } = await request.json()

  // In a real application, this would trigger the email sending process
  // through an email service provider like SendGrid, AWS SES, etc.

  if (testMode) {
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      campaignId: id,
      recipients: 5, // Test mode sends to limited recipients
    })
  }

  return NextResponse.json({
    success: true,
    message: 'Email campaign queued for sending',
    campaignId: id,
    estimatedRecipients: 45230,
    estimatedTime: '2 hours',
  })
}