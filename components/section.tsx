import { User } from 'lucide-react'
import React from 'react'
import Add from './Add'

const Title = () => {
  return (
    <div className='py-4 flex items-center justify-between'>
       <h1 className='text-2xl'>Employee</h1>
       <div className="">
       <Add/>
       </div>
    </div>
  )
}

export default Title
