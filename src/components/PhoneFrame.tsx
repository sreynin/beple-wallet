import React from 'react'
import { Signal, Wifi, Battery } from 'lucide-react'

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-10 pb-1 text-xs font-medium text-text-dark bg-white relative z-50">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={14} />
      </div>
    </div>
  )
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="screen bg-white">
          <StatusBar />
          {children}
        </div>
      </div>
    </div>
  )
}
