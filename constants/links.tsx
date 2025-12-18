import { linksProps } from "@/types"
import { Archive, Calendar, FileMinus, Home, Inbox, Mail, Users } from "lucide-react"


export const links:linksProps[] =[
    {
icon:<Home/>,
label:"Tableau de bord",
path:'/dashboard'
    } ,
    {
icon:<Inbox/>,
label:"Inbox",
path:'/taches'
    } ,
    {
icon:<Users/>,
label:"Pointage",
path:'/effectifs'
    } 

]