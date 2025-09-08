'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react'
import { services } from '../services'

interface ServiceFrameProps {
  serviceId: string
}

export default function ServiceFrame({ serviceId }: ServiceFrameProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const service = services.find(s => s.id === serviceId)

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    
    // Simulate iframe load time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [serviceId])

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

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const refresh = () => {
    setIsLoading(true)
    setHasError(false)
    // Force iframe refresh by changing key
    const iframe = document.querySelector('iframe')
    if (iframe) {
      iframe.src = iframe.src
    }
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
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
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

      {/* Content */}
      <div className="flex-1 relative bg-white/5 rounded-b-xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-center">
              <Loader2 size={48} className="text-white animate-spin mx-auto mb-4" />
              <p className="text-white/70">Loading {service.name}...</p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-center">
              <AlertCircle size={48} className="text-yellow-400 mx-auto mb-4" />
              <p className="text-white mb-4">Unable to load {service.name}</p>
              <p className="text-sm text-white/60 mb-6">
                The service might be running on a different port or unavailable.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={refresh}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                >
                  Try Again
                </button>
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}

        <iframe
          key={serviceId}
          src={service.url}
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
          title={service.name}
          style={{
            border: 'none',
            backgroundColor: 'white'
          }}
        />
      </div>
    </div>
  )
}