'use client'
import { Camera } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import PopoverUI from './ui/popover'

const Profile = () => {
  const {data} = useSession()
  return (
    <div className='w-full h-full flex  flex-col gap-1 justify-center items-center'>
            <div className="w-1/2 h-60  flex justify-center items-center flex-col gap-1.5 rounded-md p-1">
                 <div className="w-20 h-20 relative rounded-full bg-white border-4 border-neutral-200">
                   <img
                     src={data?.user?.image as string}
                      className="w-full bg-white h-full rounded-full cursor-pointer"
                    />
                    <PopoverUI/>
                 </div>
                 <div className="text-center">
                    <h1>{data?.user?.name} </h1>
                    <p>{data?.user?.email}</p>
                    <button onClick={()=> signOut() }>LogOut</button>
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