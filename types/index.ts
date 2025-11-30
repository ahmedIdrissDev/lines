export interface Employee {
  _id:string ,
  Matricule: number;
  Project: string;
  Responsable: string; 
  lastname: string;
  firstname: string;
  function: string;
  lot:string ,
  status: 'active' | 'inactive';
  createdAt:number ,
  _creationTime:number
}
export interface linksProps{
    icon: React.ReactNode ,
    path:string ,
    label:string
}