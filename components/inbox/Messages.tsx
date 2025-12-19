import React from 'react'
import Loading from './ui/loading'
import Reception from './reception'

const Messages = () => {
  return (
    <div className='w-full rounded-xl h-full bg-white border border-neutral-100'>
        <div className="p-2 border-b border-neutral-100">
            <h2>Inbox</h2>
        </div>
        <Reception/>
    </div>
  )
}

export default Messages