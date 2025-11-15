import { Employee } from '@/types'
import { ArrowDown, ArrowUp, ChartNoAxesColumn, ChartSpline, TrendingDown, TrendingUp, User2 } from 'lucide-react'
import { object, span } from 'motion/react-client'
import React from 'react'
interface  customchartProps{
  lot : string,
  count: number,
  present: Employee[] ,
}
const Customchart = ({count ,lot , present }:customchartProps) => {
     const  func = Object.groupBy(present , ({function:fun})=> fun )
     const Absent = present.filter((items)=>  items.status ==='inactive')
  const data = Object.entries(func).map(([func ,data]) => ({
  func,
  count: data?.filter(({status})=> status==='active' ).length,
  countabsent: data?.filter(({status})=> status==='inactive' ).length,

  
}));
  const  newfun = Object.groupBy(present , ({function:fun})=> fun )
  const Absents = Object.entries(newfun).map(([func ,data]) => ({
  func,
  count: data?.filter(({status})=> status==='inactive' ).length,
   
  
}));
  return (
    <div className={`'w-full flex rounded-md cursor-pointer duration-150 hover:border-tgcc-400 flex-col gap-1.5 border border-neutral-200  bg-white p-2 h-full  `}>
      <div className="w-full rounded-md flex items-center px-2 bg-tgcc-300/5 h-10">
         <h1 className='font-semibold'>{lot ? lot : 'Project'} </h1>
      </div>
      <div className="w-full items-center h-30 border border-neutral-200 rounded-md flex justify-center">
         <ChartNoAxesColumn/>
         <p  className='text-2xl'>{count} </p>

      </div>
         <div className="w-full grid grid-cols-2 gap-2 h-10">
            <div className=" rounded-md flex justify-center items-center w-full bg-tgcc-200/50 text-tgcc-700 gap-2 h-full">
                <TrendingUp/>
                {present.length} Présence
            </div>
             <div className=" rounded-md  gap-2 flex justify-center border border-neutral-200 items-center w-full text-tgcc-950 h-full">
                 <TrendingDown/>
                {Absent.length} Absence
            </div>
         </div>
         <div className="w-full grid grid-cols-2 h-full p-2 rounded-md border border-neutral-200">
          <div className="w-full h-full">
            {data.map(({count ,func ,countabsent } , index)=>(
          <div key={index} className=""> 
               {count}  {func} {countabsent}
          </div>
            ))}
          </div>
         </div>
    </div>
  )
}

export default Customchart
