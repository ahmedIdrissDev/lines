import { linksProps } from "@/types"
import { Calendar, FileMinus, Home, Mail, Users } from "lucide-react"


export const links:linksProps[] =[
    {
icon:<Home/>,
label:"Tableau de bord",
path:'/dashboard'
    } ,
    {
icon:<Mail/>,
label:"Boîte",
path:'/taches'
    } ,
    {
icon:<Users/>,
label:"tache",
path:'/effectifs'
    } 

]