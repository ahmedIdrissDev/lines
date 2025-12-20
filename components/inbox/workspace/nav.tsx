import { CircleDashed, Inbox, RefreshCcwDot, Video } from 'lucide-react'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex items-center gap-2  h-12 p-2 border-b border-neutral-100'>
       <div className="w-20 p-1.5 flex items-center gap-1 h-full bg-neutral-100 rounded-full">
        <Inbox/>
        <span>Inbox</span>
       </div>
       <div className="w-20 p-1.5 flex items-center gap-1 h-full bg-neutral-100 rounded-full">
        <CircleDashed/>
        <span>Seen</span>
       </div>
       <div className="w-20 p-1.5 flex items-center gap-1 h-full bg-neutral-100 rounded-full">
        <Video/>
        <span>Meeting</span>
       </div>

    </nav>
  )
}

export default Navbar