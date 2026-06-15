import React from 'react'
import { Card } from '@/components/ui/card'

export const SubcontractorSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="h-40 bg-neutral-100 border-hairline rounded-2xl border-none" />
      ))}
    </div>
  )
}
