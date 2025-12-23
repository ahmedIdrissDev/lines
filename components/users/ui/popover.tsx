'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { avatar } from '@/constants/avatar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { Camera } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

const PopoverUI = () => {
    const updateUserProfile = useMutation(api.functions.login.updateProfile)
    const [Profile , setProfile] = useState<string>('')
    const {data , update}= useSession()
    function handleUpdateUserProfile(){
          try {
              if(Profile){
                  const args={
                         imgURL:Profile ,
                         id: data?.user?._id as Id<"users">
                  }
               updateUserProfile(args)
               
            }
            update() 
          } catch (error) {
            console.log(error)
          }
    }
  return (
<Popover>
  <PopoverTrigger className='absolute w-8 h-8 bg-white rounded-full cursor-pointer flex justify-center items-center bottom-0 right-0'>
    <Camera/>
  </PopoverTrigger>
  <PopoverContent className='w-80 flex flex-col gap-1.5 justify-between h-96 '>
    <h1>select your Profile</h1>
    <div className="grid grid-cols-4">
     {avatar.map(({src} , index)=>(
        <img onClick={()=> setProfile(src) } key={index} src={src} className={twMerge('w-full cursor-pointer h-full rounded-full' , Profile === src && 'border-2 border-tgcc-700')} />
     ) )}
    </div>
    <div className="w-full flex justify-end px-1.5 ">
        <button  onClick={handleUpdateUserProfile} className='w-30 h-11 bg-tgcc-800 text-white rounded-full'>save</button>
    </div>
  </PopoverContent>
</Popover>  )
}

export default PopoverUI