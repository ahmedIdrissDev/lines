import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Archive, FlagTriangleRight, Pin, SquareArrowOutUpRight, Users } from 'lucide-react'
import React from 'react'

const Header = ({title}:{title:string}) => {
  return (
    <div className='w-full px-1  h-14 border-b border-neutral-200   flex justify-between items-center p-1.5'>
      <div className="flex items-center gap-1.5">
        <h1 className=''>{title} </h1>
        <span className='w-30 h-9 bg-tgcc-100 rounded-md flex  items-center justify-center'>inbox</span>
      </div>
        <div className="flex items-center gap-1.5">
                    <Archive/>

      <button className="flex w-9 rounded-md h-9 items-center justify-center  bg-tgcc-50 text-tgcc-950">
      <SquareArrowOutUpRight/>

      </button>
     
        </div>
    </div>
  )
}

export default Header