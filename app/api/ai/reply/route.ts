import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, stepCountIs, streamText , UIMessage, zodSchema } from 'ai';
import { tools } from '@/tools';

export async function POST(req: Request) {
   try {
      const { messages }: { messages: UIMessage[] } = await req.json();
      const result = await generateText({
         model: google('gemini-2.5-flash'),
         messages: convertToModelMessages(messages),
         stopWhen: stepCountIs(10),
         system:'',
         tools 
      });
      
      return n
   } catch (error) {
      return new Response('error', { status: 500 })
   }
}