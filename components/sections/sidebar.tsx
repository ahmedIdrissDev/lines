import { links } from '@/constants/links'
import React from 'react'
import Button from '../kits/button'
import CardAI from '../kits/cardai'
import UserButton from '../kits/UserButton'
import Logo from '../ui/logo'
import Add from '../inbox/compose'
import Loading from '../inbox/ui/loading'
import { Home, MessageCircleDashed, Settings } from 'lucide-react'

const Sidebar = () => {
  return (
    <div className='w-full   border-r border-neutral-200    h-full flex flex-col justify-start gap-3 items-left  '>
    <div className="w-full h-14 border-b border-neutral-200 p-2  ">
      <Logo/>
    </div>
    <span className="material-symbols-outlined  ">

</span>
<div className="flex   h-full flex-col gap-4">
  <div className="px-2">
  <Add/>

  </div>
  <div className="flex px-2 flex-col gap-2">
    <Button 
 icon={'home'}
 label='Dashboard'
 path='/dashboard'
 
 />

 <span className='px-1 opacity-60'> workspace</span>
 <div className="">

    {links.slice(0) .map((data , key)=>(
        <Button key={key} {...data} />
    ))}

 </div>

  </div>
</div>
<div className="px-2">
 
</div>
<div className="w-full  p-4 h-full flex flex-col justify-end items-start ">
 <span className='px-1 opacity-60'> help</span>
 <Button 
 icon={'settings'}
 label='Settings'
 path='/Settings'
 
 />
 <Button 
 icon={'chat_dashed'}
 label='Help center'
 path='/Support'
 
 />
</div>
    </div>
  )
}

export default Sidebar
