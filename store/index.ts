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
   setProject:(argm:string)=> void
}
export const store = create<StoreProps>((set)=>({
    data:[] ,
    Project:'' ,
    setProject(argm) {
        set((state)=>({data:[ ...state.data.filter(({Project})=> Project===argm)]}))
    },
    setdata(data) {

         set((state)=>({data: [...data]}))
    },
   
}))