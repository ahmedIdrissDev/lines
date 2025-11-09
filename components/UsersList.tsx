'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const UsersList = async () => {
    const {data} = useSession()
   
  return (
    <div className='flex border border-neutral-200 items-center gap-0.5 w-20 h-10 rounded-full '>
          <img src={data?.user?.image as string} className='w-9 h-9 rounded-full cursor-pointer' />

    </div>
  )
}

export default UsersList
