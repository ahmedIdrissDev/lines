'use client'
import { useUser } from '@clerk/nextjs'

const Title =  () => {
  const {user} =   useUser()
  return (
    <div className='py-4 flex items-center justify-between'>
       <h1 className='text-2xl'>HR {user?.fullName} </h1>
      
    </div>
  )
}

export default Title
