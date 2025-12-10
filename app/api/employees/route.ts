import { api } from "@/convex/_generated/api";
import { Employee } from "@/types";
import { getToday, handlePresentsUpdate } from "@/utils";
import { fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const {PojectID} = await req.json()
        console.log(PojectID)

        const getEmployees = await fetchQuery(api.functions.employees.employees , {Project:PojectID}) as Employee[] || []
        const getPresents = await fetchQuery(api.functions.present.Presents ,{Project:PojectID} )
        const today = getToday()
         const Matricule = getPresents?.find(({ date }) => date === today) ||getPresents?.find((item) => item);
                const Updated = handlePresentsUpdate({
                Matricule: Matricule?.employees,
                data: getEmployees,
              });
       
        return NextResponse.json(Updated)
    } catch (error) {
        
    }
}