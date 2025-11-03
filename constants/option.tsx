import { Book, BookOpen, BookOpenCheck, File, Radar, Zap } from "lucide-react";
import React from "react";
interface optionProps{
    icon:React.ReactNode ,
    label:string ,
    description:string
}
export const option : optionProps[] =[

  {
    icon: <BookOpen/>,
    label: "Providing Data",
    description: "Retrieve accurate employee information, HR records, and other related data when asked."
  },

  {
    icon: <File/>,
    label: "Adding Data",
    description: "Accept new employee information or HR records and store them correctly. Confirm successful updates."
  },

  {
    icon: <Zap/>,
    label: "Answering Specific Queries",
    description: "Respond clearly and concisely to any question about employees, projects, statuses, or HR operations."
  }
]