import { links } from '@/constants/links'
import React from 'react'
import Button from './kits/button'
import Add from './compose'
import CardAI from './kits/cardai'

const Sidebar = () => {
  return (
    <div className='w-full  bg-white h-full flex flex-col gap-1 items-left px-3 py-2'>
      <svg className='w-20' width="302" height="41" viewBox="0 0 402 131" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M401.1 69.9568V55H335.3H318V69.9568V115.01V130.058H335.3H401.1V115.01H335.3V69.9568H401.1Z" fill="black"/>
<path d="M300.1 69.9568V55H234.4H217V69.9568V115.01V130.058H234.4H300.1V115.01H234.4V69.9568H300.1Z" fill="black"/>
<path d="M133.5 115.01V69.9568H199.3V55H133.5H117V69.9568V115.01V130.058H133.5H182.8H199.3V115.01V99.9616V85.0048V84.9136H182.8V85.0048H149.8V99.9616H182.8V115.01H133.5Z" fill="black"/>
<path d="M7 30.9V129.5H47.6V63.8H14.7V47.2H97.2V63.8H64.7V129.5H106.3V0L7 30.9Z" fill="#461704"/>
</svg>
<div className="flex  py-3.5 flex-col gap-2">
  <Add/>
    {links.map((data , key)=>(
        <Button key={key} {...data} />
    ))}
</div>
<div className="w-full py-4 h-full flex flex-col justify-end items-center ">

<CardAI/>
</div>
    </div>
  )
}

export default Sidebar
