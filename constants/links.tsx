import { linksProps } from "@/types"
import { Calendar, FileMinus, Home, Users } from "lucide-react"


export const links:linksProps[] =[
    {
icon:<Home/>,
label:"Resume general",
path:'/dashboard'
    } ,
    {
icon:<Calendar/>,
label:"Tâches",
path:'/tasks'
    } ,
    {
icon:<Users/>,
label:"effectifs",
path:'/effectifs'
    } ,
     {
icon:<FileMinus/>,
label:"Rapport",
path:'/Rapport'
    }

]