'use client'

import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ServiceFrame from './components/ServiceFrame'
import ServiceProxy from './components/ServiceProxy'
import Footer from './components/Footer'

export default function PortalPage() {
  const [activeService, setActiveService] = useState<string | null>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            setActiveService('intelligence')
            break
          case '2':
            setActiveService('gem')
            break
          case '3':
            setActiveService('geo')
            break
          case '4':
            setActiveService('sandbox')
            break
          case '5':
            setActiveService('dam')
            break
          case '0':
            setActiveService(null)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeService={activeService} onServiceChange={setActiveService} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {activeService === null ? (
            <Dashboard />
          ) : (
            <div className="h-full">
              <ServiceProxy serviceId={activeService} />
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}