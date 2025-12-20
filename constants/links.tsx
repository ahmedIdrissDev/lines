import { linksProps } from "@/types"
import { Archive, Calendar, FileMinus, Home, Inbox, Mail, MonitorCloud, Settings, Users } from "lucide-react"


export const links:linksProps[] =[
    {
icon:<Home/>,
label:"Dashboard",
path:'/dashboard'
    } ,
    {
icon:<Users/>,
label:"Workspace",
path:'/workspace'
    } ,
    {
icon:<Settings/>,
label:"Settings",
path:'/effectifs'
    } 

]