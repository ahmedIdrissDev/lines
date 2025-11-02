
import { UserButton } from '@clerk/nextjs'
import Add from './Add'
import Search from './search'
import Project from './Project'

const Navbar = () => {
  return (
    <div className='flex px-3 md:px-6 h-12 justify-between items-center w-full  py-3 '>
<svg className='w-20' width="402" height="131" viewBox="0 0 402 131" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M401.1 69.9568V55H335.3H318V69.9568V115.01V130.058H335.3H401.1V115.01H335.3V69.9568H401.1Z" fill="black"/>
<path d="M300.1 69.9568V55H234.4H217V69.9568V115.01V130.058H234.4H300.1V115.01H234.4V69.9568H300.1Z" fill="black"/>
<path d="M133.5 115.01V69.9568H199.3V55H133.5H117V69.9568V115.01V130.058H133.5H182.8H199.3V115.01V99.9616V85.0048V84.9136H182.8V85.0048H149.8V99.9616H182.8V115.01H133.5Z" fill="black"/>
<path d="M7 30.9V129.5H47.6V63.8H14.7V47.2H97.2V63.8H64.7V129.5H106.3V0L7 30.9Z" fill="#461704"/>
</svg>


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
