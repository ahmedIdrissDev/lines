import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const reception = query({
  args: {
    email: v.string(),
    userId:v.id("users")
  },
  handler: async (ctx, {userId ,email}) => {
    const messages = await ctx.db.query("emails").order('desc').collect();
    const myemails = messages.filter(({ receptionId }) =>
      receptionId.includes(email)
  );
  const  markreadsMessage = Promise.all(myemails.map( async (data , index)=>{
    const anther = await ctx.db.get(data.userId)
const seen = await ctx.db
  .query("seens")
  .filter(q =>
    q.and(
      q.eq(q.field("userId"), userId),
      q.eq(q.field("messageId"), data._id)
    )
  )
  .first();
       if(seen) return {
         ...data ,
         seens:true ,
         anther
       }
       return {
        ...data ,
        seens:false ,
        anther
       }
     }))
    return markreadsMessage;
  },
});


export const createReception = mutation({
  args: {
    receptionId: v.array(v.string()),
    subject: v.string(),
    body: v.string(),
    file: v.optional(v.array(v.string())),
    userId:v.id("users") ,

  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emails", args);
  },
});


export const getRespoition = query({
  args:{
    id:v.id("emails")
  } ,
handler:async (ctx , args)=>{
     const message = await ctx.db.get(args.id)
      if(!message) return []
      const anther =  await ctx.db.get(message.userId)
      return {
        message ,
        anther
      }
}
})


/// handleseens
export const markreadsMessage =mutation({
  args:{
       messageId:v.id("emails") ,
       userId: v.id("users")
  } ,
  handler: async (ctx , args)=>{
     const getMarksMessage = await ctx.db.query("seens").filter(q=> q.and(
          q.eq(q.field('messageId'), args.messageId) ,
          q.eq(q.field('userId'), args.userId)
     ) ).first()

     if(!getMarksMessage){
         await ctx.db.insert("seens",args)
     }
  }
})