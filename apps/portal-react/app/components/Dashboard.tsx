'use client'

import { services } from '../services'
import { Service } from '../types'
import { ExternalLink, Activity, Users, TrendingUp, Zap } from 'lucide-react'

export default function Dashboard() {
  const coreServices = services.filter(s => s.category === 'core')
  const monitoringServices = services.filter(s => s.category === 'monitoring')

  const stats = [
    { label: 'Core Services', value: coreServices.length, icon: <Activity size={20} />, color: 'text-blue-400' },
    { label: 'Monitoring Tools', value: monitoringServices.length, icon: <TrendingUp size={20} />, color: 'text-green-400' },
    { label: 'Active Users', value: '12', icon: <Users size={20} />, color: 'text-purple-400' },
    { label: 'System Health', value: '100%', icon: <Zap size={20} />, color: 'text-yellow-400' },
  ]

  const ServiceCard = ({ service }: { service: Service }) => (
    <div
      className="glass rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
      onClick={() => window.open(service.url, '_blank')}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${service.gradient} rounded-lg flex items-center justify-center text-2xl`}>
          {service.icon}
        </div>
        <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
          :{service.port}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
      <p className="text-sm text-white/70 mb-4">{service.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${service.status === 'running' ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-xs text-white/60 capitalize">{service.status}</span>
        </div>
        <ExternalLink size={16} className="text-white/40" />
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Eufy PRISM E28</h1>
        <p className="text-white/70">Intelligent Marketing System Portal - All your services in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Core Services */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Core Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Monitoring Services */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Monitoring & Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monitoringServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-white/70">• Use keyboard shortcuts (Ctrl+1-5) to quickly access core services</p>
            <p className="text-sm text-white/70">• Click on any service card to open it in a new tab</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white/70">• All services are monitored in real-time for health status</p>
            <p className="text-sm text-white/70">• Use the sidebar navigation to access services within the portal</p>
          </div>
        </div>
      </div>
    </div>
  )
}