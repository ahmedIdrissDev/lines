import { linksProps } from "@/types"
import { Calendar, FileMinus, Home, Mail, Users } from "lucide-react"


export const links:linksProps[] =[
    {
icon:<Home/>,
label:"Resume general",
path:'/dashboard'
    } ,
    {
icon:<Mail/>,
label:"Boîte",
path:'/taches'
    } ,
    {
icon:<Users/>,
label:"effectifs",
path:'/effectifs'
    } ,
     {
icon:<FileMinus/>,
label:"Rapport",
path:'/rapport'
    }

]