import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export  const employees = query({
  args:{
    ProjectId:v.id("Project")
  } ,
  handler: async (ctx , args) => {
    const employees= await ctx.db.query("employees").withIndex('project_id', eq=> eq.eq('Project',args.ProjectId )).collect() ;
return  Promise.all(
  employees.map( async (employee )=>{
      const project = await  ctx.db.get(employee.Project)
      return {
        ...employee ,
        Project_Id: project
      }
  })

)
  },
})

