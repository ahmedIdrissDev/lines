import React from 'react'
import Loading from './ui/loading'
import Reception from './reception'
import { Inbox } from 'lucide-react'
import Navbar from './workspace/nav'
import { Toaster } from 'sonner'
import PopoverUI from '../users/ui/popover'

const Messages = () => {
  return (
    <div className='w-full  h-full border-r border-neutral-200'>
      <Toaster />
       
        <Reception/>
    </div>
  )
}

export default Messages