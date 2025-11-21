export interface Employee {
  Matricule: string;
  Project: string;
  Responsable: string; 
  lastname: string;
  firstname: string;
  function: string;
  lot:string ,
  id: string; 
  status: 'active' | 'inactive';
  date:Date 
}
export interface linksProps{
    icon: React.ReactNode ,
    path:string ,
    label:string
}