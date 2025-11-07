'use client'
import { FileChartLine } from 'lucide-react'
import Moderh from './kits/hrmode'

const Title = async  () => {
  return(
    <div className='py-4 flex justify-between items-center '>
      <div className="">
       <h1 className=''>Présence</h1>
       <p>Effectif total actuellement disponible </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Moderh/>
      <button className='w-40 h-11 bg-white border border-neutral-200 rounded-md flex justify-center items-center gap-2'> <FileChartLine/> Export pdf</button>
      </div>
    </div>
  )
}

export default Title
