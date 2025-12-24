import { linksProps } from "@/types"
import { Archive, Bell, Calendar, CircleDashed, FileMinus, Home, Inbox, Mail, MonitorCloud, Settings, Users, Video } from "lucide-react"


export const links:linksProps[] =[
   
    {
icon:<Inbox/>,
label:"Inbox",
path:'/workspace'
    } ,
    {
    icon:<Bell/>,
    label:"Notifiction",
    path:'/effectifs'
    }  ,
    {
    icon:<CircleDashed/>,
    label:"unseen",
    path:'/effectifs'
    }  ,
     {
    icon:<Video/>,
    label:"Meeting",
    path:'/Meeting'
    }  ,
  

]