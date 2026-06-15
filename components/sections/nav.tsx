'use client'
import { UserButton, useUser } from '@clerk/nextjs'
import dynamic from 'next/dynamic'
import ProjectSelect from '../features/projects/project-selector'


const Navbar = () => {
  const { user } = useUser()
  
  return (
    <div className='flex px-4 md:px-8 h-15 justify-end items-center w-full'>
      <div className="flex items-center gap-1">
        <ProjectSelect />
       
        <UserButton/>
      </div>
    </div>
  )
}

export default Navbar
