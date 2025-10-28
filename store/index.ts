import {create} from 'zustand'
interface Employee {
  Matricule: string;
  Project: string;
  Responsable: string;
  fullname: string;
  function: string;
  id: string;
  status: 'active' | 'inactive';
  
}
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
         set(()=>({data: [...data]}))
    },
   
}))