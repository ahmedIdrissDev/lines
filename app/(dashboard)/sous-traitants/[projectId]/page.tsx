'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { 
  ChevronLeft, 
  Loader2, 
  User as UserIcon,
  ChevronRight,
  Download,
  Save,
  Building2,
  Calendar as CalendarIcon,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import moment from 'moment'
import 'moment/locale/fr'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

moment.locale('fr')

const ProjectDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as Id<"Project">
  
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'))
  const monthStr = currentMonth.format('YYYY-MM')
  
  const project = useQuery(api.functions.project.getProject, { id: projectId })
  const employees = useQuery(api.functions.employees.employees, { Project: projectId })
  const subcontractors = useQuery(api.functions.subcontractors.getSubcontractorsByProject, { projectId })
  const attendance = useQuery(api.functions.attendance.getMonthlyAttendanceByProject, { 
    projectId, 
    month: monthStr 
  })
  
  const setMonthlyTotal = useMutation(api.functions.attendance.setMonthlyTotal)
  
  const [localTotals, setLocalTotals] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  // Initialize local totals from DB
  useEffect(() => {
    if (Array.isArray(attendance)) {
      const totals: Record<string, string> = {}
      attendance.forEach(a => {
        totals[a.employeeId] = a.totalPresent.toString()
      })
      setLocalTotals(totals)
    }
  }, [attendance])

  const handleTotalChange = (employeeId: string, value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setLocalTotals(prev => ({ ...prev, [employeeId]: value }))
    }
  }

  const handleSave = async (employeeId: Id<"employees">) => {
    const value = localTotals[employeeId]
    if (value === undefined || value === '') return

    setSaving(prev => ({ ...prev, [employeeId]: true }))
    try {
      await setMonthlyTotal({
        employeeId,
        projectId,
        month: monthStr,
        totalPresent: parseInt(value)
      })
      toast.success('total enregistré')
    } catch (error) {
      toast.error('erreur lors de l\'enregistrement')
    } finally {
      setSaving(prev => ({ ...prev, [employeeId]: false }))
    }
  }

  const prevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, 'month'))
  const nextMonth = () => setCurrentMonth(prev => prev.clone().add(1, 'month'))

  if (project === undefined || employees === undefined || attendance === undefined || subcontractors === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  const hasError = [project, employees, attendance, subcontractors].some(
    (q) => typeof q === 'object' && q !== null && 'error' in q
  )

  if (hasError) {
    const errorMsg = [project, employees, attendance, subcontractors]
      .filter((q): q is { error: string } => typeof q === 'object' && q !== null && 'error' in q)
      .map(q => q.error)
      .join(', ')

    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
        <div className="p-3 bg-red-50 text-red-500 rounded-full">
          <Building2 className="size-8" />
        </div>
        <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
        <p className="text-neutral-500 max-w-md">{errorMsg}</p>
        <Button onClick={() => router.back()}>retour</Button>
      </div>
    )
  }

  if (!project || 'error' in project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-semibold">projet non trouvé</h2>
        <Button onClick={() => router.back()}>retour</Button>
      </div>
    )
  }

  // Cast to correct types after error checks
  const projectDoc = project as any
  const employeesList = Array.isArray(employees) ? employees : []
  const subcontractorsList = Array.isArray(subcontractors) ? subcontractors : []
  const attendanceList = Array.isArray(attendance) ? attendance : []

  return (
    <div className="p-8 max-w-6xl mx-auto bg-canvas min-h-screen">
      <div className="flex flex-col gap-10 mb-12">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-surface-bone rounded-full transition-colors text-charcoal">
            <ChevronLeft className="size-6" />
          </button>
          <div className="flex flex-col flex-1">
            <h1 className="heading-lg text-ink">{projectDoc.name.toLowerCase()}</h1>
            <div className="flex items-center gap-4 mt-2">
              {projectDoc.site && (
                <div className="flex items-center gap-1.5 body-sm text-ash">
                  <MapPin className="size-4" />
                  <span className="lowercase">{projectDoc.site.toLowerCase()}</span>
                </div>
              )}
              <div className="flex items-center gap-2 body-sm text-ash">
                <span className={cn(
                  "size-2 rounded-full",
                  projectDoc.status === 'active' ? "bg-badge-success" : "bg-stone"
                )} />
                <span>{projectDoc.status || 'Actif'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-surface-card border border-hairline rounded-full p-1 shadow-sm h-11">
              <button onClick={prevMonth} className="size-9 rounded-full hover:bg-canvas transition-colors flex items-center justify-center">
                <ChevronLeft className="size-4" />
              </button>
              <div className="px-6 button-sm min-w-[160px] text-center capitalize text-ink">
                {currentMonth.format('MMMM YYYY')}
              </div>
              <button onClick={nextMonth} className="size-9 rounded-full hover:bg-canvas transition-colors flex items-center justify-center">
                <ChevronRight className="size-4" />
              </button>
            </div>
            <button className="btn-outline gap-2 h-11">
              <Download className="size-4" />
              <span className="button-sm">Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {subcontractorsList.length > 0 && (
        <div className="flex flex-col gap-6 mb-12">
          <h2 className="heading-sm text-ink flex items-center gap-3">
            <Building2 className="size-5 text-primary" />
            <span>Sous-traitants sur ce chantier</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subcontractorsList.map(sub => (
              <Link href={`/sous-traitants/sub/${sub._id}`} key={sub._id}>
                <Card className="p-5 border-hairline shadow-sm hover:border-primary/50 transition-all cursor-pointer bg-surface-card group rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-canvas rounded-full flex items-center justify-center text-charcoal border border-hairline group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                      <Building2 className="size-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="body-md font-bold text-ink">{sub.name.toLowerCase()}</span>
                      <span className="caption text-ash lowercase">{sub.email || 'Pas d\'email'}</span>
                    </div>
                    <ChevronRight className="size-5 ml-auto text-stone group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Card className="overflow-hidden border-hairline shadow-sm rounded-md bg-surface-card">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-surface-bone/30 border-b border-hairline">
              <th className="p-5 text-left caption-tight text-ash uppercase tracking-wider">Employé</th>
              <th className="p-5 text-center caption-tight text-ash uppercase tracking-wider w-48">Total jours</th>
              <th className="p-5 text-right caption-tight text-ash uppercase tracking-wider w-40">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {employeesList.map((employee) => {
              const employeeId = employee._id as string
              const isSaving = saving[employeeId]
              const currentVal = localTotals[employeeId] || ''
              const dbVal = attendanceList.find(a => a.employeeId === employeeId)?.totalPresent.toString() || ''
              const hasChanged = currentVal !== dbVal

              return (
                <tr key={employeeId} className="hover:bg-canvas/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-canvas rounded-full flex items-center justify-center text-charcoal border border-hairline">
                        <UserIcon className="size-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="body-md font-bold text-ink">
                          {`${employee.firstname || ''} ${employee.lastname || ''}`.toLowerCase().trim() || 'Sans nom'}
                        </span>
                        <span className="caption text-ash font-mono">#{employee.Matricule}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <input 
                        type="text" 
                        value={currentVal}
                        onChange={(e) => handleTotalChange(employeeId, e.target.value)}
                        placeholder="0"
                        className="w-24 h-11 text-center rounded-full border border-hairline bg-canvas focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all body-md font-bold text-ink"
                      />
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleSave(employee._id as Id<"employees">)}
                      disabled={!hasChanged || isSaving || currentVal === ''}
                      className={cn(
                        "h-10 px-5 rounded-full button-sm flex items-center gap-2 ml-auto transition-all shadow-sm",
                        hasChanged 
                          ? "bg-primary text-on-primary hover:bg-primary-deep" 
                          : "bg-surface-bone text-stone cursor-not-allowed"
                      )}
                    >
                      {isSaving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Save className="size-4" />
                      )}
                      <span>Enregistrer</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {employeesList.length === 0 && (
          <div className="flex flex-col items-center justify-center p-24 text-stone">
            <UserIcon className="size-16 mb-4 opacity-10" />
            <p className="body-md">Aucun employé assigné à ce chantier</p>
          </div>
        )}
      </Card>

      <div className="mt-8 flex justify-between items-center px-4">
        <p className="caption text-ash italic">* Les totaux sont enregistrés par mois pour chaque employé.</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary" />
            <span className="caption-tight text-charcoal uppercase tracking-tighter">Modifications en attente</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailsPage
