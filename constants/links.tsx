import { linksProps } from "@/types"
import { Archive, Bell, Calendar, CircleDashed, FileMinus, Home, Inbox, Mail, MessageCircle, MonitorCloud, Settings, Users, Video } from "lucide-react"


export const links:linksProps[] =[
   
    {
icon:<Inbox/>,
label:"Inbox",
path:'/workspace'
    } ,
   

     {
    icon:<Video/>,
    label:"Meetings",
    path:'/meeting'
    }  ,
  

]