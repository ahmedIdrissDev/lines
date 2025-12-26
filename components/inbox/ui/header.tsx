import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Archive, FlagTriangleRight, Pin, SquareArrowOutUpRight, Users } from 'lucide-react'
import React from 'react'

const Header = ({title}:{title:string}) => {
  return (
    <div className='w-full px-1  h-14 border-b border-neutral-200   flex justify-between items-center p-1.5'>
      <div className="flex items-center gap-1.5">
        <h1 className=''>{title} </h1>
        <span className='min-w-30 w-max h-9 bg-tgcc-100 rounded-md flex  items-center justify-center'>inbox</span>
      </div>
        <div className="flex items-center gap-1.5">
                    <Archive/>


        </div>
    </div>
  )
}

export default Header