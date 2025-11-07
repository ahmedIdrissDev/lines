import { Employee } from '@/types'
import { ArrowDown, ArrowUp, ChartNoAxesColumn, ChartSpline, TrendingDown, TrendingUp, User2 } from 'lucide-react'
import { object, span } from 'motion/react-client'
import React from 'react'
interface  customchartProps{
  lot : string,
  count: number,
  present: Employee[] ,
  Absent  :Employee[] ,
}
const Customchart = ({Absent ,count ,lot , present }:customchartProps) => {
     const  func = Object.groupBy(present , ({function:fun})=> fun )
  const data = Object.entries(func).map(([func ,data]) => ({
  func,
  count: data?.filter(({status})=> status==='active' ).length,
   
  
}));
  return (
    <div className='w-full flex rounded-2xl cursor-pointer duration-150 hover:border-tgcc-400 flex-col gap-1.5 border border-neutral-200 bg-white p-2 min-h-80  h-max'>
      <div className="w-full rounded-md flex items-center px-2 bg-tgcc-300 h-10">
         <h1 className='font-semibold'>{lot ? lot : 'Project'} </h1>
      </div>
      <div className="w-full items-center h-30 border border-neutral-200 rounded-2xl flex justify-center">
         <ChartNoAxesColumn/>
         <p  className='text-2xl'>{count} </p>

      </div>
         <div className="w-full grid grid-cols-2 gap-2 h-10">
            <div className=" rounded-md flex justify-center items-center w-full bg-tgcc-200/50 text-tgcc-700 gap-2 h-full">
                <TrendingUp/>
                {present.length}
            </div>
             <div className=" rounded-md  gap-2 flex justify-center border border-neutral-200 items-center w-full text-tgcc-950 h-full">
                 <TrendingDown/>

                {Absent.length} Absent
            </div>
         </div>
         <div className="w-full h-full p-2 rounded-2xl border border-neutral-200">
            {data.splice(0 , 3).map(({count ,func } , index)=>(
          <div key={index} className="">  {count}  {func} </div>
            ))}
            <button className='text-red-500 '> show all</button>

         </div>
    </div>
  )
}

export default Customchart
