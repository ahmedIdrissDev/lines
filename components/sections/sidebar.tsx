import { links } from '@/constants/links'
import React from 'react'
import Button from '../kits/button'
import CardAI from '../kits/cardai'
import UserButton from '../kits/UserButton'
import Logo from '../ui/logo'
import Add from '../inbox/compose'
import Loading from '../inbox/ui/loading'
import { MessageCircleDashed, Settings } from 'lucide-react'

const Sidebar = () => {
  return (
    <div className='w-full bg-white  border-r border-neutral-200    h-full flex flex-col justify-start gap-3 items-left  py-2'>
    <div className="w-full h-max p-2  ">
      <Logo/>
    </div>
<div className="flex   h-full flex-col gap-4">
  <div className="w-full flex flex-col border-b border-neutral-200"/>
  <div className="px-2">
  <Add/>

  </div>
  <div className="flex px-2 flex-col gap-0.5">
    {links.map((data , key)=>(
        <Button key={key} {...data} />
    ))}

  </div>
</div>
<div className="px-2">
  <span>teams</span>
  <div className="w-full">
    <Loading/>

  </div>
</div>
<div className="w-full  p-4 h-full flex flex-col justify-end items-start ">
 <span>help</span>
 <Button 
 icon={<Settings/>}
 label='Settings'
 path='/Settings'
 
 />
 <Button 
 icon={<MessageCircleDashed/>}
 label='Support'
 path='/Support'
 
 />
</div>
    </div>
  )
}

export default Sidebar
