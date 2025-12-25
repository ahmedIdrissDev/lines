import PopoverUI from '@/components/users/ui/popover';
import Inbox from '../ui/title';

const Navbar = () => {
  
  return (
    <nav className='flex items-center justify-between gap-2  h-14 p-2 border-b border-neutral-200'>
         <Inbox/>
         <div className="p-2 w-96 border-b border-neutral-200 ">
        <input
          type="text"
          className="input rounded-md focus:shadow   "
          placeholder="search"
        />
      </div>
       <PopoverUI/>
    </nav>
  )
}

export default Navbar