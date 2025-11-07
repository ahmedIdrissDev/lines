'use client'
import { FileChartLine } from 'lucide-react'

const Title = async  () => {
  return(
    <div className='py-4 flex justify-between items-center '>
      <div className="">
       <h1 className=''>Présence</h1>
       <p>Effectif total actuellement disponible </p>
      </div>
      <button className='w-40 h-11 bg-white border border-neutral-200 rounded-2xl flex justify-center items-center gap-2'> <FileChartLine/> Export pdf</button>
    </div>
  )
}

export default Title
