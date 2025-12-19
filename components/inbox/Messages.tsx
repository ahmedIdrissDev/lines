import React from 'react'
import Loading from './ui/loading'

const Messages = () => {
  return (
    <div className='w-full rounded-xl h-full bg-white border border-neutral-100'>
        <div className="p-2">
            <h2>Inbox</h2>
        </div>
        <div className="border-t p-2 flex flex-col gap-2 border-neutral-100">
        <Loading/>
        <Loading/>
        <Loading/>
        <Loading/>
        <Loading/>
        <Loading/>


        </div>
    </div>
  )
}

export default Messages