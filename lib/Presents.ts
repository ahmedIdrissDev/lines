import { Employee } from "@/types";

interface functionProps{
    data:string,
    exsitedata:Employee[]
}
export  async function handelUsersPresents({data ,exsitedata}:functionProps){
       try {
        await Promise.all(
             exsitedata.filter(async ({id ,Matricule})=>{
                  if(!data.includes(Matricule)){
                      await fetch(`https://sheetdb.io/api/v1/s6vt0lc3cghvn/id/${id}`,{
                        method:'PUT' ,
                        body:JSON.stringify(({
                            status:'inactive'
                        }))
                    });
              }
          })
        )
         
        
       } catch (error) {
         console.log(error)
       }
}