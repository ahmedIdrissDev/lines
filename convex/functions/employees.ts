import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export  const employees = query({
   args:{
    Project: v.id("Project"), 
   } ,
  handler: async (ctx , args ) => {
   const emaplyees= await  ctx.db.query("employees").withIndex('project_id' , (q)=> q.eq('Project', args.Project)).collect() ;
    return Promise.all(
      emaplyees.map( async (data )=>{
        const Project = await  ctx.db.get(data.Project)
        return {
          ...data ,
          Project:Project?.name
        }
      })
    )
  },
})
export const addNewEmployyes= mutation({
  args:{
    Matricule: v.number(),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    function:v.optional(v.string()),
    siteManger: v.string() ,
    status: v.union(v.literal("active"), v.literal("inactive")),
    Project:v.id("Project"),
    createdAt: v.string(),
  } ,
  handler:async (ctx ,args)=>{
      try {
        const employees =  await ctx.db.query('employees').filter(q=> q.eq(q.field('Matricule') , args.Matricule)).first()
        if(employees) return  false;
        await ctx.db.insert('employees' , args)
        return true
      } catch (error) {
          console.log(error)
      }

  }
})

