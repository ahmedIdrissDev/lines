import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { FlagTriangleRight, Pin, Users } from 'lucide-react'
import React from 'react'

const Header = ({title}:{title:string}) => {
  return (
    <div className='w-full h-12 border rounded-md border-neutral-200 flex justify-between items-center p-1.5'>
        <h1 className='font-bold'>{title} </h1>
        <div className="flex items-center gap-1.5">
      <button className="flex w-9 rounded-md h-9 items-center justify-center  bg-tgcc-50 text-tgcc-950">
      <FlagTriangleRight/>

      </button>
      <Tooltip>
               <TooltipTrigger asChild>
                <button className="w-20 cursor-pointer  bg-neutral-400  text-white border-t-2  border-neutral-300 flex justify-center items-center gap-2 h-9 rounded-md px-2 ">
                <Users /> {5}
              </button>      
              
              </TooltipTrigger>
          <TooltipContent >
            <p>make as Group</p>
          </TooltipContent>
        </Tooltip>
        </div>
    </div>
  )
}

export default Header