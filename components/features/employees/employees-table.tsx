'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge";
import { store } from '@/store';

const Employees = () => {
  const  {data} = store()
  return (
    <div className="border border-hairline bg-surface-card rounded-md overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-bone/30">
            <TableHead className="w-[120px] caption-tight text-ash font-normal">Matricule</TableHead>
            <TableHead className="caption-tight text-ash font-normal">Fonction</TableHead>
            <TableHead className="caption-tight text-ash font-normal">Prénom</TableHead>
            <TableHead className="caption-tight text-ash font-normal">Nom</TableHead>
            <TableHead className="caption-tight text-ash text-center font-normal">Statut</TableHead>
            <TableHead className="caption-tight text-ash font-normal">Chantier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({Matricule ,Project ,function:fun ,status ,firstname ,lastname} , index)=>(
            <TableRow key={index} className="hover:bg-canvas/50">
              <TableCell className="font-mono text-sm text-ink">{Matricule}</TableCell>
              <TableCell className="body-sm text-charcoal">{fun}</TableCell>
              <TableCell className="body-sm text-ink">{firstname}</TableCell>
              <TableCell className="body-sm text-ink">{lastname}</TableCell>
              <TableCell className="text-center">
                <Badge variant={status === 'active' ? 'success' : 'secondary'} className="capitalize">
                  {status === 'active' ? 'Présent' : 'Absent'}
                </Badge>
              </TableCell>
              <TableCell className="body-sm text-charcoal">{Project}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Employees
