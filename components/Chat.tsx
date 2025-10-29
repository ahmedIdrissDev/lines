'use client'
import React from 'react'
import { ChartRadialText } from './chart-radial-text'
import { ChartTootal } from './chart-radial-shape'
import { Other } from './other'

const Chat = () => {
  return (
    <div className='grid  bg-white grid-cols-1 md:grid-cols-3 gap-2 h-max'>
        <ChartRadialText/>
        <ChartTootal/>
        <Other/>
    </div>
  )
}

export default Chat
