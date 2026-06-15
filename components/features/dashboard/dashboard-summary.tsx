'use client'
import React from 'react'
import { ChartTootal } from '@/components/features/dashboard/charts/chart-radial-shape'
import { Other } from '@/components/features/dashboard/charts/other'
import { Total } from '@/components/features/dashboard/charts/chart-radial-stacked'

const Chat = () => {
  return (
    <div className='grid  grid-cols-1 md:grid-cols-3 gap-2 h-max'>
         <Total/>
        <ChartTootal/>
        <Other/>
      
    </div>
  )
}

export default Chat
