import React from 'react'
import Loading from './ui/loading'
import Reception from './reception'
import { Inbox } from 'lucide-react'
import Navbar from './workspace/nav'
import { Toaster } from 'sonner'
import PopoverUI from '../users/ui/popover'

const Messages = () => {
  return (
    <div className='w-full  h-full bg-white border-r border-neutral-200'>
      <Toaster />
        <div className="p-2 flex items-center justify-between gap-1 border-b border-neutral-200">
            <h2>Workspace</h2>
        </div>
        <Navbar/>
        <Reception/>
    </div>
  )
}

export default Messages