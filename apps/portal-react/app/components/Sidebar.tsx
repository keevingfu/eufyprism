'use client'

import { useState, useEffect } from 'react'
import { 
  Home, 
  Brain, 
  Gem, 
  Globe, 
  Gamepad2, 
  Library,
  DoorOpen,
  BarChart3,
  MessageSquare,
  Activity,
  ChevronLeft,
  ChevronRight,
  Circle
} from 'lucide-react'
import { Service } from '../types'
import { services } from '../services'

interface SidebarProps {
  activeService: string | null
  onServiceChange: (serviceId: string | null) => void
}

export default function Sidebar({ activeService, onServiceChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, boolean>>({})

  // Check service health
  useEffect(() => {
    const checkServices = async () => {
      const statuses: Record<string, boolean> = {}
      
      for (const service of services) {
        try {
          // For now, we'll assume all services are running
          // In production, you'd actually ping the service endpoints
          statuses[service.id] = true
        } catch {
          statuses[service.id] = false
        }
      }
      
      setServiceStatuses(statuses)
    }

    checkServices()
    const interval = setInterval(checkServices, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'home': return <Home size={20} />
      case 'intelligence': return <Brain size={20} />
      case 'gem': return <Gem size={20} />
      case 'geo': return <Globe size={20} />
      case 'sandbox': return <Gamepad2 size={20} />
      case 'dam': return <Library size={20} />
      case 'gateway': return <DoorOpen size={20} />
      case 'grafana': return <BarChart3 size={20} />
      case 'rabbitmq': return <MessageSquare size={20} />
      default: return <Activity size={20} />
    }
  }

  const menuItems = [
    {
      id: 'home',
      label: 'Dashboard',
      category: 'main'
    },
    ...services.filter(s => s.category === 'core').map(s => ({
      id: s.id,
      label: s.name,
      category: 'core'
    })),
    ...services.filter(s => s.category === 'monitoring').map(s => ({
      id: s.id,
      label: s.name,
      category: 'monitoring'
    }))
  ]

  const groupedItems = {
    main: menuItems.filter(item => item.category === 'main'),
    core: menuItems.filter(item => item.category === 'core'),
    monitoring: menuItems.filter(item => item.category === 'monitoring')
  }

  return (
    <div className={`glass h-full text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : 'block'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
              E28
            </div>
            <div>
              <h1 className="font-semibold text-lg">Eufy PRISM</h1>
              <p className="text-xs text-white/70">Portal v0.1.0</p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6">
        {/* Main */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Main</p>
          )}
          {groupedItems.main.map(item => (
            <button
              key={item.id}
              onClick={() => onServiceChange(item.id === 'home' ? null : item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeService === (item.id === 'home' ? null : item.id)
                  ? 'bg-white/20 text-white'
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              {getIcon(item.id)}
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Core Services */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Core Services</p>
          )}
          {groupedItems.core.map(item => (
            <button
              key={item.id}
              onClick={() => onServiceChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeService === item.id
                  ? 'bg-white/20 text-white'
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {getIcon(item.id)}
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && (
                <Circle
                  size={8}
                  className={`${
                    serviceStatuses[item.id] ? 'fill-green-400 text-green-400' : 'fill-red-400 text-red-400'
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Monitoring */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Monitoring</p>
          )}
          {groupedItems.monitoring.map(item => (
            <button
              key={item.id}
              onClick={() => onServiceChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeService === item.id
                  ? 'bg-white/20 text-white'
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {getIcon(item.id)}
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && (
                <Circle
                  size={8}
                  className={`${
                    serviceStatuses[item.id] ? 'fill-green-400 text-green-400' : 'fill-red-400 text-red-400'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="text-xs text-white/50">
            <p>System Status: <span className="text-green-400">Online</span></p>
            <p className="mt-1">Services: {Object.values(serviceStatuses).filter(s => s).length}/{services.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}