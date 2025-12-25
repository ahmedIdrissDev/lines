import { api } from "@/convex/_generated/api";
import {  fetchQuery } from "convex/nextjs";
interface AuthProps{
      email:string ,
      password:string
}
export default async function  Login(data :AuthProps) {
    try {
        return  await fetchQuery(api.functions.login.get , data);
    } catch (error) {
        console.log(error)
    }
}

export async function CallAIReplyTools({text}:{text:string}){
       try {
          const url = '/api/ai/reply'
          const request = await fetch(url , {
            method:'POST' ,
            headers:{
            "Content-Type":"application/json"
            } ,
            body:JSON.stringify({email:text})
          })
            const data =  await request.json()
            return data.text
       } catch (error) {
             console.log(error)
       }
}