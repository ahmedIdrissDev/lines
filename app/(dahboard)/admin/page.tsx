import Chat from '@/components/Chat'
import Employees from '@/components/employees'
import Access from '@/components/kits/Access'
import Title from '@/components/section'
import UsersList from '@/components/UsersList'
import React from 'react'

const page = () => {
 
  return (
   <>
       <UsersList/>
       <Title/>
         <Chat/>
         <div className=""></div>
<Employees/>
   </>
  )
}

export default page
