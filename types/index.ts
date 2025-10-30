export interface Employee {
  Matricule: string;
  Project: string;
  Responsable: string; 
  lastname: string;
  firstname: string;
  function: string;
  tol:string ,
  id: string; 
  status: 'active' | 'inactive';
}