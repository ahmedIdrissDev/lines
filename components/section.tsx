import { User } from 'lucide-react'
import React from 'react'
import Add from './Add'
import { currentUser } from '@clerk/nextjs/server'

const Title = async () => {
  const user =  await currentUser()
  return (
    <div className='py-4 flex items-center justify-between'>
       <h1 className='text-2xl'>Hello mr {user?.fullName} </h1>
      
    </div>
  )
}

export default Title
