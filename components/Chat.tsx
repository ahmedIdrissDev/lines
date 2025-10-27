import React from 'react'
import { ChartRadialText } from './chart-radial-text'
import { ChartTootal } from './chart-radial-shape'

const Chat = () => {
  return (
    <div className='grid grid-cols-3 gap-2 h-40'>
        <ChartRadialText/>
        <ChartTootal/>
        <div className="w-full h-full border border-neutral-100 rounded-2xl"></div>
        <div className="w-full h-full border border-neutral-100 rounded-2xl"></div>

    </div>
  )
}

export default Chat
