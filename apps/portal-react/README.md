# Eufy PRISM E28 - React Portal

Modern React-based portal for the Eufy PRISM E28 Intelligent Marketing System.

## Features

- **Unified Dashboard**: Overview of all system services and status
- **Sidebar Navigation**: Quick access to all services with real-time health monitoring
- **Iframe Integration**: Load services directly within the portal
- **Responsive Design**: Works on desktop and tablet devices
- **Keyboard Shortcuts**: Ctrl+1-5 for quick service access
- **Real-time Monitoring**: Service health checks every 30 seconds

## Tech Stack

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Effects**: Glassmorphism design

## Running the Portal

```bash
# From the portal-react directory
npm install
npm run dev
```

The portal will start on http://localhost:3020

## Service Integration

The portal integrates with the following services:

### Core Services
- Intelligence (Port 3010)
- GEM (Port 3002)
- GEO (Port 3003)
- Sandbox (Port 3004)
- DAM (Port 3011)

### Monitoring Services
- API Gateway (Port 3030)
- Grafana (Port 3001)
- RabbitMQ (Port 15672)

## Architecture

- `app/page.tsx` - Main portal page with layout
- `app/components/Sidebar.tsx` - Navigation sidebar with service list
- `app/components/Dashboard.tsx` - Main dashboard view
- `app/components/ServiceFrame.tsx` - Iframe wrapper for services
- `app/components/Footer.tsx` - Portal footer
- `app/services.ts` - Service configuration and metadata
- `app/types.ts` - TypeScript type definitions