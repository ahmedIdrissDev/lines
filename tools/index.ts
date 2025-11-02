import { baseUrl } from '@/constants';
import { Employee } from '@/types';
import { tool as createTool } from 'ai';
import { z } from 'zod';

export const ProductCallTool = createTool({
  description: 'Show me all employees , tolal etc... ',
  inputSchema: z.object({
    keywords: z.string().describe('the keyour from the function of the contasrtor').optional(),
    isall:z.boolean().describe('if true if the keywords is not provided').optional()
  }),
  execute: async function ({ keywords  , isall }) {
    const response = await fetch(baseUrl,{cache:'no-cache'});
    const data = await response.json()
    return data
  },
});

export const BookingCall = createTool({
  description: 'Answering Specific Queries ',
  inputSchema: z.object({
       keywords: z.string().describe('Answering Specific Queries get the data and them look to keys').optional(),
  }),
  execute: async function ({keywords}) {
  const response = await fetch(baseUrl,{cache:'no-cache'});
    const data : Employee [] = await response.json()
    const getbyfunction = data.filter(({function:fun })=> fun=== keywords )
    return getbyfunction
  },
});
export const tools = {
  show: ProductCallTool,
  booking: BookingCall , 
};