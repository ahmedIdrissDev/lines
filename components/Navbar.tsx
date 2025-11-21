
import Image from 'next/image'
import Add from './Add'
import Project from './Project'
import UsersList from './UsersList'
import Hello from './kits/Hello'
import UserButton from './kits/UserButton'
import Search from './search'
import Hr from './Hr'
import Hs from './hs'

const Navbar = () => {
  return (
    <div className='flex px-3 md:px-6 h-12 justify-end items-center w-full   '>



    <div className=" flex items-center gap-2.5">
     <Hr/>
     <Add/>      
      <Search/>
            <UserButton/>
    </div>
    </div>
  )
}

export default Navbar
