import { SearchIcon } from 'lucide-react'
import React from 'react'

const Search = () => {
  return (
 <button className='w-26  cursor-pointer rounded-md  flex justify-center items-center gap-1.5 h-9 border border-neutral-100'>
            <SearchIcon/>
            <span> Search  </span>
        </button>
  )
}

export default Search
