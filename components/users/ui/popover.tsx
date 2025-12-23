'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { avatar } from '@/constants/avatar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { profile } from 'console'
import { useMutation } from 'convex/react'
import { Camera } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { toast, Toaster } from 'sonner'
import { twMerge } from 'tailwind-merge'

const PopoverUI = () => {
    const updateUserProfile = useMutation(api.functions.login.updateProfile)
    const [Profile , setProfile] = useState<string>('')
    const {data , update}= useSession()
   async function handleUpdateUserProfile(){
          try {
                  const args={
                         imgURL:Profile ,
                         id: data?.user?._id as Id<"users">
                  }
               updateUserProfile(args)
               const updateSession = await update({image: Profile});
               console.log(updateSession)
               toast.success('thank you')
            
          } catch (error) {
            console.log(error)
          }
    }
  return (
    <>
    <Toaster/>
<Popover >
  <PopoverTrigger className=' w-10 h-10 bg-white rounded-full cursor-pointer flex justify-center items-center bottom-0 right-0'>
      <img
                     src={data?.user?.image as string}
                      className="w-full bg-white h-full rounded-full cursor-pointer"
                    />  </PopoverTrigger>
  <PopoverContent className='w-80 flex flex-col gap-1.5 justify-between h-96 '>
     <div className="flex justify-center items-center flex-col gap-1">
      <img
                     src={data?.user?.image as string}
                      className="w-12 bg-white h-12 rounded-full cursor-pointer"
                    />
                    <span>{data?.user?.name} </span>
      </div>    
    <div className="w-full flex justify-end px-1.5 ">
        <button  onClick={handleUpdateUserProfile} className='w-30 h-11 bg-tgcc-800 text-white rounded-full'>save</button>
    </div>
  </PopoverContent>
</Popover>
    </>

)
}

export default PopoverUI