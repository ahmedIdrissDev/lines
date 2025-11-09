'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const UserButton = () => {
    const {data} = useSession()
  return (
    <>
    <img src={data?.user?.image as string} className='w-9 h-9 rounded-full cursor-pointer' />
    <div>
      
    </div>
    
    </>
  )
}

export default UserButton
