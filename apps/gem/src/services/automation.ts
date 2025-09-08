import axios from 'axios'

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  recipients: string[]
  scheduledAt?: Date
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
}

export interface SocialMediaPost {
  id: string
  content: string
  platforms: ('facebook' | 'twitter' | 'instagram' | 'linkedin')[]
  mediaUrls?: string[]
  scheduledAt?: Date
  status: 'draft' | 'scheduled' | 'published' | 'failed'
}

export interface AdCampaign {
  id: string
  name: string
  platform: 'google' | 'facebook' | 'instagram' | 'linkedin'
  budget: number
  targetAudience: {
    demographics?: {
      ageMin?: number
      ageMax?: number
      gender?: 'all' | 'male' | 'female'
      locations?: string[]
    }
    interests?: string[]
    behaviors?: string[]
  }
  creative: {
    headline: string
    description: string
    imageUrl?: string
    videoUrl?: string
  }
  status: 'draft' | 'active' | 'paused' | 'completed'
}

export interface AutomationWorkflow {
  id: string
  name: string
  trigger: {
    type: 'event' | 'time' | 'condition'
    config: Record<string, any>
  }
  actions: {
    type: 'email' | 'social' | 'ad' | 'webhook'
    config: Record<string, any>
    delay?: number
  }[]
  status: 'active' | 'paused' | 'draft'
}

class MarketingAutomationService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

  // Email Campaign Management
  async createEmailCampaign(campaign: Omit<EmailCampaign, 'id' | 'status'>): Promise<EmailCampaign> {
    const response = await axios.post(`${this.apiUrl}/campaigns/email`, campaign)
    return response.data
  }

  async sendEmail(campaignId: string, testMode = false): Promise<void> {
    await axios.post(`${this.apiUrl}/campaigns/email/${campaignId}/send`, { testMode })
  }

  async scheduleEmail(campaignId: string, scheduledAt: Date): Promise<void> {
    await axios.post(`${this.apiUrl}/campaigns/email/${campaignId}/schedule`, { scheduledAt })
  }

  // Social Media Management
  async createSocialPost(post: Omit<SocialMediaPost, 'id' | 'status'>): Promise<SocialMediaPost> {
    const response = await axios.post(`${this.apiUrl}/social/posts`, post)
    return response.data
  }

  async publishSocialPost(postId: string): Promise<void> {
    await axios.post(`${this.apiUrl}/social/posts/${postId}/publish`)
  }

  async scheduleSocialPost(postId: string, scheduledAt: Date): Promise<void> {
    await axios.post(`${this.apiUrl}/social/posts/${postId}/schedule`, { scheduledAt })
  }

  // Ad Campaign Management
  async createAdCampaign(campaign: Omit<AdCampaign, 'id' | 'status'>): Promise<AdCampaign> {
    const response = await axios.post(`${this.apiUrl}/campaigns/ads`, campaign)
    return response.data
  }

  async updateAdBudget(campaignId: string, newBudget: number): Promise<void> {
    await axios.patch(`${this.apiUrl}/campaigns/ads/${campaignId}/budget`, { budget: newBudget })
  }

  async pauseAdCampaign(campaignId: string): Promise<void> {
    await axios.post(`${this.apiUrl}/campaigns/ads/${campaignId}/pause`)
  }

  async resumeAdCampaign(campaignId: string): Promise<void> {
    await axios.post(`${this.apiUrl}/campaigns/ads/${campaignId}/resume`)
  }

  // Workflow Automation
  async createWorkflow(workflow: Omit<AutomationWorkflow, 'id'>): Promise<AutomationWorkflow> {
    const response = await axios.post(`${this.apiUrl}/automation/workflows`, workflow)
    return response.data
  }

  async activateWorkflow(workflowId: string): Promise<void> {
    await axios.post(`${this.apiUrl}/automation/workflows/${workflowId}/activate`)
  }

  async pauseWorkflow(workflowId: string): Promise<void> {
    await axios.post(`${this.apiUrl}/automation/workflows/${workflowId}/pause`)
  }

  // Analytics & Reporting
  async getEmailMetrics(campaignId: string): Promise<{
    sent: number
    delivered: number
    opened: number
    clicked: number
    unsubscribed: number
    bounced: number
  }> {
    const response = await axios.get(`${this.apiUrl}/campaigns/email/${campaignId}/metrics`)
    return response.data
  }

  async getSocialMetrics(postId: string): Promise<{
    impressions: number
    engagements: number
    clicks: number
    shares: number
    comments: number
  }> {
    const response = await axios.get(`${this.apiUrl}/social/posts/${postId}/metrics`)
    return response.data
  }

  async getAdMetrics(campaignId: string): Promise<{
    impressions: number
    clicks: number
    conversions: number
    spend: number
    cpc: number
    ctr: number
    roas: number
  }> {
    const response = await axios.get(`${this.apiUrl}/campaigns/ads/${campaignId}/metrics`)
    return response.data
  }

  // Audience Segmentation
  async createAudienceSegment(segment: {
    name: string
    criteria: Record<string, any>
  }): Promise<{ id: string; name: string; size: number }> {
    const response = await axios.post(`${this.apiUrl}/audience/segments`, segment)
    return response.data
  }

  async getAudienceInsights(segmentId: string): Promise<{
    demographics: Record<string, any>
    behaviors: Record<string, any>
    interests: string[]
  }> {
    const response = await axios.get(`${this.apiUrl}/audience/segments/${segmentId}/insights`)
    return response.data
  }

  // Personalization
  async generatePersonalizedContent(
    template: string,
    userData: Record<string, any>
  ): Promise<string> {
    const response = await axios.post(`${this.apiUrl}/personalization/generate`, {
      template,
      userData,
    })
    return response.data.content
  }

  // A/B Testing for Automation
  async createAutomationTest(test: {
    name: string
    type: 'email' | 'social' | 'ad'
    variants: Array<Record<string, any>>
    audience: string
    successMetric: string
  }): Promise<{ id: string; status: string }> {
    const response = await axios.post(`${this.apiUrl}/automation/tests`, test)
    return response.data
  }
}

export const automationService = new MarketingAutomationService()