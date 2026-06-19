import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, stepCountIs, streamText , UIMessage, zodSchema } from 'ai';
import { tools } from '@/tools';
import { prompt } from '@/constants';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
   try {
      // Reject direct browser access — only our app includes this header
      if (req.headers.get('X-App-Source') !== 'tgcc-app') {
         return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }

      const { userId } = await auth();
      if (!userId) {
         return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }

      const { messages, projectId }: { messages: UIMessage[], projectId?: string } = await req.json();
      
      const systemPrompt = projectId 
         ? `${prompt}\n\nCURRENT CONTEXT: The user is currently viewing project with ID: ${projectId}. Use this ID for attendance and workforce queries unless specified otherwise.`
         : prompt;

      const result = streamText({
         model: google('gemini-2.5-flash-lite'),
         messages: convertToModelMessages(messages),
         stopWhen: stepCountIs(10),
         system: systemPrompt,
         tools 
      });
      return result.toUIMessageStreamResponse();
   } catch (error) {
      console.error('AI Route Error:', error);
      return new Response('error', { status: 500 })
   }
}