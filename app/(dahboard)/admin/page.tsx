'use client'
import Chat from '@/components/Chat'
import Employees from '@/components/employees'
import Access from '@/components/kits/Access'
import Title from '@/components/section'
import React from 'react'

const page = () => {
 
  return (
   <>
   <Access/>
         <Chat/>
         <div className=""></div>
<Employees/>
   </>
  )
}

export default page
