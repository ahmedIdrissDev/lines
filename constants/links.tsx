import { linksProps } from "@/types"
import { Archive, Bell, Calendar, CircleDashed, FileMinus, Home, Inbox, Mail, MessageCircle, MonitorCloud, Settings, Users, Video } from "lucide-react"


export const links:linksProps[] =[
   
    {
icon:'move_to_inbox',
label:"Inbox",
path:'/workspace'
    } ,
   

     {
    icon:'duo',
    label:"Meetings",
    path:'/meeting'
    }  ,

     {
    icon:'send',
    label:"Sent",
    path:'/sent'
    }  ,
  

]