import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const get = query({
  args: {email:v.string() , password:v.string()},
  handler: async (ctx , args) => {
    const users = await ctx.db.query("users").collect();

    const user = users.find(({email ,password})=> email ===args.email.trim() && password=== args.password.trim())
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

export const updateProfile= mutation({
  args:{
    imgURL: v.string() ,
    id: v.id("users")
  } ,
  handler: async(ctx , args)=>{
      await ctx.db.patch( args.id, {profile:args.imgURL})
  }
})