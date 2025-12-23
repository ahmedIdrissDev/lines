import React from 'react'
import Loading from './ui/loading'
import Reception from './reception'
import { Inbox } from 'lucide-react'
import Navbar from './workspace/nav'
import { Toaster } from 'sonner'

const Messages = () => {
  return (
    <div className='w-full  h-full bg-white border border-neutral-100'>
      <Toaster />
        <div className="p-2 flex items-center gap-1 border-b border-neutral-100">
            <h2>Workspace</h2>
        </div>
        <Navbar/>
        <Reception/>
    </div>
  )
}

export default Messages