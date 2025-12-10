'use client'
import Image from 'next/image'
import Project from './project'
import UserButton from './kits/UserButton'
import Search from './search'
import Hr from './Hr'
import Moderh from './kits/hrmode'
import PDF from './kits/pdf'
import { useSession } from 'next-auth/react'
import ProjectSelector from './project'
import { store } from '@/store'

const Navbar = () => {
  const {data } = useSession()
  const {PojectID} = store()
  const auth = ['HR' , 'ADMIN']
  const isincluds = new Set(auth.map((role)=> role))
  const isAuthorize = isincluds.has(data?.user?.role)
  return (
    <div className='flex  px-3 md:px-6 h-12 justify-end items-center w-full   '>
    <div className=" flex items-center gap-2.5">
     <Hr/>
      <Search/>
      <ProjectSelector/>
      {isAuthorize &&        <Moderh/> }
              <PDF/>

            <UserButton/>
    </div>
    </div>
  )
}

export default Navbar
