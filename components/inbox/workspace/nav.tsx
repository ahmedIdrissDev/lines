import PopoverUI from '@/components/users/ui/popover';
import Inbox from '../ui/title';
import Notification from '../ui/Notification';
import { Archive } from 'lucide-react';

const Navbar = () => {
  
  return (
    <nav className='flex items-center justify-between gap-2  h-14 p-2 border-b border-neutral-200'>
         <Inbox/>
         <div className="p-2 w-96 border-b border-neutral-200 ">
        <input
          type="text"
          className="input border-0 bg-tgcc-50 w-96  rounded-full focus:shadow   "
          placeholder="search"
        />
      </div>
        <div className="flex gap-2 items-center">
         <Notification/>
       <PopoverUI/>
        </div>
    </nav>
  )
}

export default Navbar