export interface Employee {
  _id:string ,
  Matricule: number;
  Project: string;
  lastname: string;
  firstname: string;
  function: string;
  siteManger:string ,
  status: 'active' | 'inactive';
  createdAt:string ,
  _creationTime:number
}
export interface linksProps{
    icon: string ,
    path:string ,
    label:string
}
export interface Proejct{
  _id:string ,
  name:string ,
  type:string
}
export interface reception{
       receptionId: string[],
       subject:string,
       body:string ,
       file?:string[] ,
       userId:string ,
       type?:Boolean
}