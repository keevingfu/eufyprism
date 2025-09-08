# GEM - Growth Engine Management Module

The Growth Engine Management (GEM) module is a comprehensive marketing automation and optimization platform for Eufy E28 PRISM system.

## Features

### 🎯 Marketing Campaign Management
- Multi-channel campaign orchestration (Email, Social Media, Paid Ads)
- Campaign builder with drag-and-drop interface
- Real-time performance tracking
- Budget allocation and management

### 🧪 A/B Testing Platform
- Visual experiment designer
- Statistical significance calculation
- Multi-variant testing support
- Automatic winner selection

### 📊 ROI Analytics Dashboard
- Real-time revenue and cost tracking
- Customer acquisition cost (CAC) analysis
- Lifetime value (LTV) calculations
- Conversion funnel visualization
- Channel performance comparison

### 🤖 Marketing Automation
- Email marketing automation
- Social media post scheduling
- Ad campaign management
- Workflow automation builder
- Personalization engine

### 💰 Budget Optimization
- AI-powered budget allocation
- Smart bidding optimization
- Real-time budget reallocation
- Multi-touch attribution
- Performance prediction

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: Chakra UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **API**: Next.js API Routes

## Getting Started

### Installation

```bash
cd apps/gem
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3002`

### Building

```bash
npm run build
```

### API Endpoints

#### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/email` - List email campaigns
- `POST /api/campaigns/email` - Create email campaign
- `POST /api/campaigns/email/[id]/send` - Send email campaign
- `GET /api/campaigns/ads` - List ad campaigns
- `POST /api/campaigns/ads` - Create ad campaign

#### Optimization
- `POST /api/optimizer/budget/allocate` - Get budget allocation recommendations
- `POST /api/optimizer/bids/optimize` - Optimize campaign bids
- `GET /api/optimizer/audiences/[id]` - Get audience optimization recommendations

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── campaigns/         # Campaign management
│   ├── experiments/       # A/B testing
│   ├── analytics/        # ROI dashboard
│   └── api/             # API routes
├── components/           # React components
│   ├── CampaignBuilder.tsx
│   └── ExperimentDesigner.tsx
├── services/            # Business logic services
│   ├── automation.ts    # Marketing automation
│   └── optimizer.ts     # Budget optimization
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Components

### CampaignBuilder
A multi-step modal for creating marketing campaigns with:
- Basic campaign information
- Target audience configuration
- Creative content setup
- Automation settings

### ExperimentDesigner
An intuitive interface for setting up A/B tests with:
- Hypothesis definition
- Variant configuration
- Traffic allocation
- Success metrics

### Analytics Dashboard
Comprehensive view of marketing performance including:
- Revenue and profit trends
- Channel performance breakdown
- Conversion funnel analysis
- Customer value metrics

## Future Enhancements

- [ ] Integration with real marketing platforms (Google Ads, Facebook Ads, etc.)
- [ ] Advanced ML models for budget optimization
- [ ] Predictive analytics for campaign performance
- [ ] Custom report builder
- [ ] Marketing calendar view
- [ ] Team collaboration features
- [ ] Advanced segmentation tools
- [ ] Content recommendation engine