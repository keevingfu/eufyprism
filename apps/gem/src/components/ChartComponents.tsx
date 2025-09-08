'use client'

import dynamic from 'next/dynamic'

// Loading component for charts
const ChartLoading = () => (
  <div style={{ 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#718096',
    fontSize: '14px'
  }}>
    Loading chart...
  </div>
)

// Export all chart components with dynamic imports to avoid SSR issues
export const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const PieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const Pie = dynamic(
  () => import('recharts').then((mod) => mod.Pie),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const Cell = dynamic(
  () => import('recharts').then((mod) => mod.Cell),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const Legend = dynamic(
  () => import('recharts').then((mod) => mod.Legend),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const LineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { 
    ssr: false,
    loading: ChartLoading
  }
)

export const ReferenceLine = dynamic(
  () => import('recharts').then((mod) => mod.ReferenceLine),
  { 
    ssr: false,
    loading: ChartLoading
  }
)