import { Employee } from '@/types'
import {create} from 'zustand'

interface StoreProps{
   data: Employee[] ,
   Project:string ,
   setdata:(data:Employee[] )=> void ,
    Updatedata:(argm:string)=> void ,
    PojectID:string , 
    setProjectId:(id:string)=> void  ,
}
export const store = create<StoreProps>((set)=>({
    data:[] ,
    Project:'',
    setdata(data) {
         set({data:data})
    },
    Updatedata(argm) {
        set((state)=>({
            data: []
        }))
    },
    PojectID:"" ,
    setProjectId(id) {
        set({PojectID:id})
    },
   
}))