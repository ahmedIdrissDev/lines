'use client'
import { store } from '@/store'
import React from 'react'
import Customchart from './kits/customchart'
import Title from './section'

const Super = () => {
    const {data} = store()
    const newdata = Object.groupBy(data , ({lot})=> lot )
    const mapped = Object.entries(newdata).map(([lot, data]) => ({
  lot,
  count: data?.length,
  present: data?.filter( ({status}) => status==='active') ,
  Absent: data?.filter( ({status}) => status==='inactive'),
}));
    console.log(newdata)
  return (
    <>

    <div className='w-full gap-2.5   grid  grid-cols-3 '>
        {mapped.splice(0 , 8).map((data , index)=>(
          <Customchart key={index} {...data} />
        ) )}
    </div>
    </>
  )
}

export default Super
