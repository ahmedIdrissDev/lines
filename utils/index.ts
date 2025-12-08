
import { Employee } from "@/types";

interface handlePrentsProps{
    text?:string  ,
    data: Employee []
}

interface handlePresentsUpdateProps extends handlePrentsProps{
    Matricule: number[] 
}

export function handlePrents({text  , data}:handlePrentsProps){
    const today= getToday()
    const Matricule = text?.match(/\d+/g)?.map(Number).filter(Boolean)
    const employees = new Set(data.map(({Matricule})=>Matricule))
    const output = Matricule?.filter((id)=> employees.has(id) )
     return {  
     date: today,                                                                                                                                                           
     employees: output ,
     Project:'' ,
     }
}

export function getToday(){
    const date= new Date() ;
     const day = date.getDate() 
     const Month = date.getMonth() + 1
     const Year = date.getFullYear()
     return `${Year}-${Month}-${day}`

}
export function handlePresentsUpdate({Matricule  , data}:handlePresentsUpdateProps){
    const today= getToday()
    const employees = new Set(Matricule.map((id)=>id))
    const output = data?.map((user)=> employees.has(user.Matricule) ? {...user ,status:'active'} : {...user ,status:'inactive'} )
    return output
}
