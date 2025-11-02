import { tool as createTool } from 'ai';
import { z } from 'zod';

export const ProductCallTool = createTool({
  description: 'add new works ',
  inputSchema: z.object({
    keywords: z.string().describe('the keyour from the function of the contasrtor'),
    isall:z.boolean().describe('if true if the keywords is not provided')
  }),
  execute: async function ({ keywords  , isall }) {
    return { products:'h' };
  },
});

export const BookingCall = createTool({
  description: 'book a call with our sales team to discuss your prodcuts needs ',
  inputSchema: z.object({
    fullname: z.string().describe('take the user full name'),
    email: z.string().describe('take the user email'),
    phone: z.string().describe('take the user full name'),
    company:z.string().describe('this is the company email wecom@gmail.com'),
    message: z.string().describe('you well write a message'),

  }),
  execute: async function (data) {
    return { data};
  },
});
export const tools = {
  prodcut: ProductCallTool,
  booking: BookingCall , 
};