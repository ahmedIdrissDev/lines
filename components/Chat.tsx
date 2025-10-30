'use client'
import React from 'react'
import { ChartRadialText } from './chart-radial-text'
import { ChartTootal } from './chart-radial-shape'
import { Other } from './other'
import { Total } from './chart-radial-stacked'

const Chat = () => {
  return (
    <div className='grid  bg-white grid-cols-1 md:grid-cols-3 gap-2 h-max'>
         <Total/>
        <ChartTootal/>
        <Other/>
    </div>
  )
}

export default Chat
