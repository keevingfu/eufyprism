export interface Service {
  id: string
  name: string
  description: string
  icon: string
  port: number
  url: string
  category: 'core' | 'monitoring'
  status: 'running' | 'stopped' | 'error'
  gradient: string
}

export interface NavItem {
  id: string
  label: string
  href: string
  icon: string
  service?: Service
}