import { Service } from './types'

export const services: Service[] = [
  // Core Services
  {
    id: 'intelligence',
    name: 'Intelligence',
    description: 'Marketing intelligence analysis platform for opportunity tracking, competitor analysis, and market insights.',
    icon: '🧠',
    port: 3010,
    url: 'http://localhost:3010',
    category: 'core',
    status: 'running',
    gradient: 'gradient-intelligence'
  },
  {
    id: 'gem',
    name: 'GEM',
    description: 'Global Execution Management for campaign creation, execution tracking, and performance monitoring.',
    icon: '💎',
    port: 3002,
    url: 'http://localhost:3002',
    category: 'core',
    status: 'running',
    gradient: 'gradient-gem'
  },
  {
    id: 'geo',
    name: 'GEO',
    description: 'Geographic Optimization Engine for regional market analysis and location-based insights.',
    icon: '🌍',
    port: 3003,
    url: 'http://localhost:3003',
    category: 'core',
    status: 'running',
    gradient: 'gradient-geo'
  },
  {
    id: 'sandbox',
    name: 'Sandbox',
    description: 'Decision sandbox simulator for scenario testing and strategy impact analysis.',
    icon: '🎮',
    port: 3004,
    url: 'http://localhost:3004',
    category: 'core',
    status: 'running',
    gradient: 'gradient-sandbox'
  },
  {
    id: 'dam',
    name: 'DAM',
    description: 'Digital Asset Management for content organization, asset analytics, and resource optimization.',
    icon: '📚',
    port: 3011,
    url: 'http://localhost:3011',
    category: 'core',
    status: 'running',
    gradient: 'gradient-dam'
  },
  // Monitoring Services
  {
    id: 'gateway',
    name: 'API Gateway',
    description: 'Unified API gateway for service routing and health monitoring.',
    icon: '🚪',
    port: 3030,
    url: 'http://localhost:3030/services/status',
    category: 'monitoring',
    status: 'running',
    gradient: 'gradient-gateway'
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Monitoring dashboards and metrics visualization. Login: admin/admin',
    icon: '📊',
    port: 3001,
    url: 'http://localhost:3001',
    category: 'monitoring',
    status: 'running',
    gradient: 'gradient-grafana'
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    description: 'Message queue management console. Login: guest/guest',
    icon: '🐰',
    port: 15672,
    url: 'http://localhost:15672',
    category: 'monitoring',
    status: 'running',
    gradient: 'gradient-rabbitmq'
  }
]