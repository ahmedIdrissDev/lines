export interface Employee {
  Matricule: string;
  Project: string;
  Responsable: string; // could be 'TRUE' | 'FALSE' if it's always like that
  fullname: string;
  function: string;
  id: string; // removed extra space from key "id "
  status: 'active' | 'inactive'; // assuming limited status options
}