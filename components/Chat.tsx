'use client'
import React from 'react'
import { ChartTootal } from './charts/chart-radial-shape'
import { Other } from './charts/other'
import { Total } from './charts/chart-radial-stacked'

const Chat = () => {
  return (
    <div className='grid  grid-cols-1 md:grid-cols-4 gap-2 h-max'>
         <Total/>
        <ChartTootal/>
        <Other/>
        <div className="w-full h-full p-4  border flex flex-col justify-center relative items-center border-neutral-200 bg-white rounded-2xl">
        
            <button className='w-full h-12 bg-black rounded-xl'>tak a look</button>
        </div>
    </div>
  )
}

export default Chat
