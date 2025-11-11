import { Employee } from '@/types';
import { Text, View } from '@react-pdf/renderer'
import { i } from 'motion/react-client';
import React from 'react'
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  fontFamily: {
    sans: ["Papyrus"],
  },
  colors: {
    custom: "#bada55",
  },
});

interface  customchartProps{
  lot : string,
  count: number,
  present: Employee[] ,
  Absent  :Employee[] ,
}


const PDFtable = ({Absent ,count ,lot , present}:customchartProps) => {
      const  func = Object.groupBy(present , ({function:fun})=> fun )
  const data = Object.entries(func).map(([func ,data]) => ({
  func,
  count: data?.filter(({status})=> status==='active' ).length,
   
  
}));

  const Absentdata = Object.entries(func).map(([func ,data]) => ({
  func,
  count: data?.filter(({status})=> status!='active' ).length,
   
  
}));
  return (
 <View  style={tw('border    w-96 ')}>
    <View style={tw('bg-yellow-300 border-b  flex-row h-12 px-4 items-center')}>
    <Text style={tw('text-lg font-bold   text-center')}>{lot} </Text>

    </View>

    <View style={tw('flex flex-row border-b  ')}>
      <Text style={tw('flex-1 text-center  py-1 border-r border-gray-300')}>P</Text>
      <Text style={tw('flex-1 text-center   py-1')}>A</Text>
    </View>
    <View style={tw('flex flex-row border-b  bg-gray-200')}>
        <View style={tw('w-full border-r')}>

      {data.map(({count ,func } , index)=>(
          <View style={tw('flex-row  border-b  h-6 p-3 gap-3 items-center')} key={index} > 
          <Text style={tw('text-sm')}>
              {count} 
            </Text>
                 <Text style={tw('text-sm')}>
              {func} 
            </Text>
            </View>
            ))}
        </View>
    <View style={tw('w-full')}>
      {Absentdata.map(({count ,func } , index)=>(
          <View style={tw('flex-row  border-b h-6 p-3 gap-3 items-center')} key={index} > 
          <Text style={tw('text-sm')}>
              {count} 
            </Text>
                 <Text style={tw('text-sm ')}>
              {func} 
            </Text>
            </View>
            ))}
        </View>
    </View>

    
  </View>
  )
}

export default PDFtable
