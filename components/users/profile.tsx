'use client'
import { Camera } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'

const Profile = () => {
  const {data} = useSession()
  return (
    <div className='w-full h-full flex  flex-col gap-1 justify-center items-center'>
            <div className="w-1/2 h-60  flex justify-center items-center flex-col gap-1.5 rounded-md p-1">
                 <div className="w-20 h-20 relative rounded-full bg-white border-4 border-neutral-200">
                   <img
                     src={data?.user?.image?.trim() ? data.user.image : "/avatar.png"}
                      className="w-full bg-white h-full rounded-full cursor-pointer"
                    />
                    <button className='bg-tgcc-800 flex justify-center items-center cursor-pointer w-6 h-6  text-sm absolute bottom-0 right-0 text-white rounded-full'>
                      <Camera size={20}/>
                    </button>
                 </div>
                 <div className="text-center">
                    <h1>{data?.user?.name} </h1>
                    <p>{data?.user?.email}</p>
                 </div>
            </div>
            <div className="w-1/2 h-20 grid grid-cols-3 gap-1  rounded-md p-1">
              <div className="w-full h-full rounded-md border bg-white border-neutral-200"></div>
              <div className="w-full h-full rounded-md border bg-white border-neutral-200"></div>
              <div className="w-full h-full rounded-md border bg-white border-neutral-200"></div>

            </div>

    </div> 
  )
}

export default Profile