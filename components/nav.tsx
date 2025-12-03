
import Image from 'next/image'
import Add from './compose'
import Project from './project'
import UsersList from './UsersList'
import Hello from './kits/Hello'
import UserButton from './kits/UserButton'
import Search from './search'
import Hr from './Hr'
import Hs from './hs'
import Moderh from './kits/hrmode'
import PDF from './kits/pdf'

const Navbar = () => {
  return (
    <div className='flex  px-3 md:px-6 h-12 justify-end items-center w-full   '>



    <div className=" flex items-center gap-2.5">
     <Hr/>
    
      <Search/>
      <Project/>
      <Moderh/>
              <PDF/>

            <UserButton/>
    </div>
    </div>
  )
}

export default Navbar
