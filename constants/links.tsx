import { linksProps } from "@/types"
import { Archive, Bell, Calendar, FileMinus, Home, Inbox, Mail, MonitorCloud, Settings, Users } from "lucide-react"


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
    icon:<Bell/>,
    label:"Notifiction",
    path:'/effectifs'
    }  ,
    {
icon:<Settings/>,
label:"Settings",
path:'/effectifs'
    } ,

]