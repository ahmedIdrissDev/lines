'use client'
import { store } from '@/store'
import React from 'react'
import Customchart from '@/components/features/dashboard/custom-chart'

const Super = () => {
    const {data} = store()
    const newdata = Object.groupBy(data , ({siteManger})=> siteManger  )
    const mapped = Object.entries(newdata).map(([siteManger, data]) => ({
  siteManger,
  count: data?.length,
  present: data ,
  Absent: data?.filter( ({status}) => status==='inactive'),
}));
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
