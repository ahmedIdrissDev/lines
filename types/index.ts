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
    icon: React.ReactNode ,
    path:string ,
    label:string
}
export interface Proejct{
  _id:string ,
  name:string
}