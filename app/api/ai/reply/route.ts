import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, stepCountIs, streamText , UIMessage, zodSchema } from 'ai';
import { tools } from '@/tools';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
   try {
      const { email  } = await req.json();
      const {text} = await generateText({
         model: google('gemini-2.5-flash'),
         system:'you are an email writer write a emails based on this mini exmble',
         prompt:email
          
      });
      
      return NextResponse.json({text})
   } catch (error) {
      return new Response('error', { status: 500 })
   }
}