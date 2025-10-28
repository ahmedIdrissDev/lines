'use client'
import React from 'react'
import { ChartRadialText } from './chart-radial-text'
import { ChartTootal } from './chart-radial-shape'

const Chat = () => {
  return (
    <div className='grid bg-white grid-cols-3 gap-2 h-max'>
        <ChartRadialText/>
        <ChartTootal/>
        <ChartTootal/>


    </div>
  )
}

export default Chat
