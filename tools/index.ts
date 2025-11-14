import { baseUrl } from '@/constants';
import { Employee } from '@/types';
import { tool as createTool } from 'ai';
import { z } from 'zod';


export const handelProvideData = createTool({
  description: `
  Retrieve workforce information including employee lists, total counts, 
  and relevant HR data. Use this tool to fetch a complete overview or 
  search results filtered by specific keywords (such as project names or roles).
  `,
  inputSchema: z.object({
    keywords: z.string().describe('Keyword or term used to filter employee data (e.g. project name, role)').optional(),
  }),
  execute: async function ({ keywords}) {
    const response = await fetch(baseUrl, { cache: 'no-cache' });
    const data = await response.json();
    return data;
  },
});


export const Answering = createTool({
  description: `
  Analyze and respond to specific queries about employees, roles, or departments.
  It searches for data that matches the given keyword and provides concise, accurate answers.
  `,
  inputSchema: z.object({
    keywords: z.string().describe('Keyword related to the employee function or HR field to search for'),
  }),
  execute: async function ({ keywords }) {
    const response = await fetch(baseUrl, { cache: 'no-cache' });
    const data: Employee[] = await response.json();
    const getByFunction = data.filter(({ function: fun }) => fun === keywords);
    return getByFunction;
  },
});
export const DocBuilder = createTool({
  description: ` this function build to fill the doc models with data to make it fast , you shoull fill the model of the book with data
  `,
  inputSchema: z.object({
    data: z.string().describe('get the data'),
    docModel: z.string().describe('this can be a data without fill '),
    fulldoc:  z.string().describe('mix the data and doc model and return the full text doc  the show be a nice doc use markdown to clone the origin model'),
  }),
  execute: async function ({ data ,docModel ,fulldoc }) {
    return  fulldoc
  },
});


export const Adding = createTool({
  description: `
  Add new employee information or update existing HR records. 
  This tool ensures data integrity and confirms every update or insertion made to the system.
  `,
  inputSchema: z.object({
data: z.array(
  z.object({
    Matricule: z.string().describe('Unique employee identification number'),
    Project: z.string().describe('The project the employee is assigned to'),
    lastname: z.string().describe('Employee’s last name'),
    firstname: z.string().describe('Employee’s first name'),
    function: z.string().describe('Employee’s role or position in the company'),
    lot: z.string().describe('Work lot or section the employee belongs to'),
    status: z.enum(['active', 'inactive']).describe('Current employment status'),
  })
)

  }),
  execute: async function ({data}) {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return { message: 'Employee data added successfully.', result };
  },
});


export const tools = {
  show:  handelProvideData,
  specific: Answering,
  add: Adding,
  generateDoc:DocBuilder
};
