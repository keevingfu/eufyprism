'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, AlertCircle } from 'lucide-react'
import { services } from '../services'

interface ServiceProxyProps {
  serviceId: string
}

export default function ServiceProxy({ serviceId }: ServiceProxyProps) {
  const service = services.find(s => s.id === serviceId)
  
  if (!service) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-white/70">Service not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="glass px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 ${service.gradient} rounded-lg flex items-center justify-center text-xl`}>
            {service.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{service.name}</h2>
            <p className="text-sm text-white/60">{service.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Open in new tab"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-white/5 rounded-b-xl">
        <iframe
          src={service.url}
          className="w-full h-full rounded-b-xl"
          title={service.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}