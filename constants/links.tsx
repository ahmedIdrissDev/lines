import { linksProps } from "@/types"
import { Archive, Calendar, FileMinus, Home, Inbox, Mail, MonitorCloud, Settings, Users } from "lucide-react"


export const links:linksProps[] =[
    {
icon:<Home/>,
label:"Tableau de bord",
path:'/dashboard'
    } ,
    {
icon:<Mail/>,
label:"Espace de travail",
path:'/workspace'
    } ,
    {
icon:<Settings/>,
label:"Settings",
path:'/effectifs'
    } 

]