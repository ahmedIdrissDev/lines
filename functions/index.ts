import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { da } from "zod/v4/locales";
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