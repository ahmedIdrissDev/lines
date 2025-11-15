'use client'
import { store } from '@/store'
import React from 'react'
import Customchart from './kits/customchart'

const Super = () => {
    const {data} = store()
    const newdata = Object.groupBy(data , ({lot})=> lot )
    const mapped = Object.entries(newdata).map(([lot, data]) => ({
  lot,
  count: data?.length,
  present: data ,
  Absent: data?.filter( ({status}) => status==='inactive'),
}));
    console.log(newdata)
  return (
    <>

    <div className='w-full  rounded-2xl  h-max gap-2.5   grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 '>
        {mapped.splice(0 , 8).map((data , index)=>(
          <Customchart key={index} {...data} />
        ) )}
    </div>
    </>
  )
}

export default Super
