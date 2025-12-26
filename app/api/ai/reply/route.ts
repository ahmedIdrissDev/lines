import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, stepCountIs, streamText , UIMessage, zodSchema } from 'ai';
import { tools } from '@/tools';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
   try {
      const { email} = await req.json()
      const {text} = await generateText({
         model: google('gemini-2.5-flash-preview-04-17'),
         system:`Write a natural, human-sounding email reply.
Keep the tone friendly, clear, and professional.
Do not use markdown or formatting.
Sound like a real person, not an AI.
Use a few relevant emojis to make the message warm and natural 
Keep it concise and easy to read , reply with the same langauge  , short`,
         prompt:email
          
      });
      
      return NextResponse.json({text})
   } catch (error) {
      return new Response('error', { status: 500 })
   }
}