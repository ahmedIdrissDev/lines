import { links } from '@/constants/links'
import React from 'react'
import Button from '../kits/button'
import CardAI from '../kits/cardai'
import UserButton from '../kits/UserButton'
import Logo from '../ui/logo'
import Add from '../inbox/compose'

const Sidebar = () => {
  return (
    <div className='w-full bg-white border border-neutral-100 rounded-2xl px-2  h-full flex flex-col justify-start gap-3 items-left px-3 py-2'>
    <div className="w-full h-max  ">
      <Logo/>
    </div>
<div className="flex  h-full py-3.5 flex-col gap-4">
  <Add/>
  <div className="w-full flex flex-col border-b border-neutral-200"/>
  <div className="flex flex-col gap-0.5">
    {links.map((data , key)=>(
        <Button key={key} {...data} />
    ))}
    <UserButton/>

  </div>
</div>
<div className="w-full py-4 h-full flex flex-col justify-end items-center ">

<CardAI/>
</div>
    </div>
  )
}

export default Sidebar
