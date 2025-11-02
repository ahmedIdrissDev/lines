import { SearchIcon } from 'lucide-react'
import React from 'react'

const Search = () => {
  return (
 <button className='w-50  rounded-full  cursor-pointer   flex justify-center items-center gap-1.5 h-9 border border-neutral-100'>
            <SearchIcon className='opacity-60'/>
        </button>
  )
}

export default Search
