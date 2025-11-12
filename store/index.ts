import { Employee } from '@/types'
import {create} from 'zustand'

interface StoreProps{
   data: Employee[] ,
   Project:string ,
   setdata:(data:Employee[] )=> void ,
   setProject:(argm:Employee[])=> void
}
export const store = create<StoreProps>((set)=>({
    data:[] ,
    Project:'',
    setProject(argm) {
        set((state)=>({data :[...argm]}))
    },
    setdata(data) {
         set(()=>({data: data}))
    },
   
}))