'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { avatar } from '@/constants/avatar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { profile } from 'console'
import { useMutation } from 'convex/react'
import { Camera } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { toast, Toaster } from 'sonner'
import { twMerge } from 'tailwind-merge'

const PopoverUI = () => {
    const {data }= useSession()

  return (
    <>
<Popover >
  <PopoverTrigger className=' w-9 h-9 bg-white rounded-full cursor-pointer flex justify-center items-center bottom-0 right-0'>
      <img
                     src={data?.user?.image as string}
                      className="w-full bg-white h-full rounded-md cursor-pointer"
                    />  </PopoverTrigger>
  <PopoverContent className='w-80 flex flex-col gap-1.5 justify-between h-96 '>
     <div className="flex justify-center items-center flex-col gap-1">
      <img
                     src={data?.user?.image as string}
                      className="w-12 bg-white h-12 rounded-full cursor-pointer"
                    />
                    <span>{data?.user?.name} </span>
      </div>    
      <button onClick={e=> signOut({redirect:true ,callbackUrl:'/'}) } > LogOut </button>

  </PopoverContent>
</Popover>
    </>

)
}

export default PopoverUI