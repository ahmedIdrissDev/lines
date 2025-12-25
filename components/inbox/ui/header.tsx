import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { FlagTriangleRight, Pin, SquareArrowOutUpRight, Users } from 'lucide-react'
import React from 'react'

const Header = ({title}:{title:string}) => {
  return (
    <div className='w-full h-12  rounded-md  flex justify-between items-center p-1.5'>
      <div className="flex items-center gap-1.5">
        <h1 className='font-bold'>{title} </h1>
        <span className='w-30 h-9 bg-tgcc-50 rounded-md flex items-center justify-center'>inbox</span>
      </div>
        <div className="flex items-center gap-1.5">
      <button className="flex w-9 rounded-md h-9 items-center justify-center  bg-tgcc-50 text-tgcc-950">
      <SquareArrowOutUpRight/>

      </button>
      {/* <Tooltip>
               <TooltipTrigger asChild>
                <button className="w-20 cursor-pointer  bg-tgcc-50  text-tgcc-950 border-t-2  border-yellow-300 flex justify-center items-center gap-2 h-9 rounded-md px-2 ">
                <Users /> {5}
              </button>      
              
              </TooltipTrigger>
          <TooltipContent >
            <p>make as Group</p>
          </TooltipContent>
        </Tooltip> */}
        </div>
    </div>
  )
}

export default Header