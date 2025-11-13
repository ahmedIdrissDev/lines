import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, stepCountIs, streamText , UIMessage, zodSchema } from 'ai';
import { tools } from '@/tools';
import { prompt } from '@/constants';
export async function POST(req: Request) {
   try {
      const { messages }: { messages: UIMessage[] } = await req.json();
      const result = streamText({
         model: google('gemini-1.5-pro-002'),
         messages: convertToModelMessages(messages),
         stopWhen: stepCountIs(10),
         system:prompt,
         tools 
      });
      return result.toUIMessageStreamResponse();
   } catch (error) {
      return new Response('error', { status: 500 })
   }
}