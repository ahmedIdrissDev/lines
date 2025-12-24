import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { FlagTriangleRight, Pin, Users } from 'lucide-react'
import React from 'react'

const Header = ({title}:{title:string}) => {
  return (
    <div className='w-full h-12 border rounded-md border-neutral-200 flex justify-between items-center p-1.5'>
        <h1>{title} </h1>
      <FlagTriangleRight/>
      <Tooltip>
               <TooltipTrigger asChild>
                <button className="w-20 cursor-pointer  bg-tgcc-100  text-tgcc-950 flex justify-center items-center gap-2 h-9 rounded-2xl px-2 ">
                <Users /> {5}
              </button>      
              
              </TooltipTrigger>
          <TooltipContent >
            <p>make as Group</p>
          </TooltipContent>
        </Tooltip>
    </div>
  )
}

export default Header