import { v } from "convex/values";
import { query } from "../_generated/server";

export const get = query({
  args: {email:v.string() , password:v.string()},
  handler: async (ctx , args) => {
    const users = await ctx.db.query("users").collect();

    const user = users.find(({email ,password})=> email ===args.email && password=== args.password)
    if(!user){
      return null
    }
    const userProject = await Promise.all(
      user?.project.map((id)=>{
          return  ctx.db.get(id)
      })
    )
    return {
      ...user ,
      project: userProject.filter(Boolean) ,
    }
  }
});

export const getUsers= query({
  args:{},
  handler:async (ctx, args)=> {
        const users = await ctx.db.query('users').collect();
        const allusers = users.map(({email ,name ,func})=>{
          return {
             email ,
             name , 
             func
          }

        } )
        return allusers
    },
})