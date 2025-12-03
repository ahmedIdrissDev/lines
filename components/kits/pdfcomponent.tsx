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
  siteManger : string,
  count: number,
  present: Employee[] ,
  Absent  :Employee[] ,
}


const PDFtable = ({Absent ,count ,siteManger , present}:customchartProps) => {
     const func = Object.groupBy(present, ({ function: fun }) => fun);
  const data = Object.entries(func).map(([func, data]) => ({
    func,
    count: data?.filter(({ status }) => status === "active").length,
    countabsent: data?.filter(({ status }) => status === "inactive").length,
  }));

  return (
 <View  style={tw('border    w-96 ')}>
    <View style={tw('bg-tgcc-300 border-b  flex-row h-12 px-4 items-center')}>
    <Text style={tw('text-lg font-bold   text-center')}>{siteManger} </Text>

    </View>

    <View style={tw('flex flex-row border-b  ')}>
 <View style={tw('flex-row   items-center justify-between   h-8 ')}  > 

             <View style={tw('flex-row h-full px-1 w-full border-r items-center justify-center')}>
                 <Text style={tw('text-sm')}>
               function 
            </Text>

            </View>
            <View style={tw('flex-row h-full w-full border-r items-center justify-center')}>
          <Text style={tw('text-sm')}>
                P
            </Text>

            </View>
                        <View style={tw('flex-row h-full w-full  items-center justify-center')}>
                      <Text style={tw('text-sm')} >
                            A

            </Text>

            </View>

            </View>
    </View>
    <View style={tw('flex  flex-row  bg-gray-200')}>
        <View style={tw('w-full')}>
<div className="border-b last:border-0 flex items-center justify-between px-"></div>
      {data.map(({count ,func ,countabsent } , index)=>(
          <View style={tw('flex-row  border-b items-center justify-between   h-8 ')} key={index} > 

             <View style={tw('flex-row h-full px-1 w-full border-r items-center justify-center')}>
                 <Text style={tw('text-sm')}>
              {func} 

            </Text>

            </View>
            <View style={tw('flex-row h-full  w-full border-r items-center justify-center')}>
          <Text style={tw('text-sm')}>
              {count} 
            </Text>

            </View>
                        <View style={tw('flex-row h-full w-full  items-center justify-center')}>
                      <Text style={tw('text-sm')} >
                            {countabsent}

            </Text>

            </View>

            </View>
            ))}
        </View>
   
    </View>

    
  </View>
  )
}

export default PDFtable
