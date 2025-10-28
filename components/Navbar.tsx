import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Add from './Add'
import Search from './search'
import Project from './Project'

const Navbar = () => {
  return (
    <div className='flex h-12 justify-between items-center w-full  py-3 px-2'>
  <h1 className='text-2xl'>Tgcc mangment system</h1>

    <div className=" flex items-center gap-2">
        <Search/>
            <Add/>
            <Project/>

     <UserButton/>
    </div>
    </div>
  )
}

export default Navbar
