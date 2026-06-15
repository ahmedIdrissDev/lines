'use client'
import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { 
  Building2, 
  ChevronRight,
  ChevronLeft,
  Users,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  FolderGit2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import moment from 'moment'
import 'moment/locale/fr'

moment.locale('fr')

const PublicSubcontractorPage = () => {
  const params = useParams()
  const subId = params.subcontractorId as Id<"subcontractors">
  
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'))
  
  const subcontractor = useQuery(api.functions.subcontractors.getSubcontractorPublic, { id: subId })
  const project = useQuery(api.functions.project.getProjectPublic, subcontractor?.projectId ? { id: subcontractor.projectId } : "skip")
  
  const startDate = currentMonth.clone().startOf('month').format('YYYY-MM-DD')
  const endDate = currentMonth.clone().endOf('month').format('YYYY-MM-DD')
  
  const dailyAttendance = useQuery(api.functions.subcontractors.getDailyAttendancePublic, {
    subcontractorId: subId,
    startDate,
    endDate
  })

  const attendanceMap = useMemo(() => {
    const map: Record<string, number> = {}
    if (Array.isArray(dailyAttendance)) {
      dailyAttendance.forEach(a => {
        map[a.date] = a.count
      })
    }
    return map
  }, [dailyAttendance])

  const calendarDays = useMemo(() => {
    const days = []
    const start = currentMonth.clone().startOf('month').startOf('week')
    const end = currentMonth.clone().endOf('month').endOf('week')
    
    const curr = start.clone()
    while (curr.isBefore(end)) {
      days.push(curr.clone())
      curr.add(1, 'day')
    }
    return days
  }, [currentMonth])

  const prevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, 'month'))
  const nextMonth = () => setCurrentMonth(prev => prev.clone().add(1, 'month'))

  if (subcontractor === undefined || dailyAttendance === undefined || (subcontractor?.projectId && project === undefined)) {
    return (
      <div className=" items-center  grid grid-cols-5 gap-1 justify-center min-h-screen">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-full bg-neutral-200/90 rounded-md animate-pulse h-full"></div>
        ))}
      </div>
    )
  }

  const hasError = [subcontractor, project, dailyAttendance].some(
    (q) => typeof q === 'object' && q !== null && 'error' in q
  )

  if (hasError) {
    const errorMsg = [subcontractor, project, dailyAttendance]
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
      </div>
    )
  }

  if (!subcontractor || 'error' in subcontractor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>entreprise non trouvée</p>
      </div>
    )
  }

  // Cast after error checks
  const subcontractorDoc = subcontractor as any
  const projectDoc = project as any
  const attendanceList = Array.isArray(dailyAttendance) ? dailyAttendance : []

  const monthlyTotal = Object.values(attendanceMap).reduce((acc, curr) => acc + curr, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto bg-canvas min-h-screen">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex items-start gap-6">
          <div className="size-14 bg-surface-card border border-hairline rounded-full flex items-center justify-center text-primary shadow-sm">
            <Building2 className="size-7" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="heading-lg text-ink">
                    {subcontractorDoc.name.toLowerCase()}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="body-sm text-ash lowercase">Gestion des effectifs et chantiers</p>
                    <div className="px-3 py-1 bg-blue-50 text-primary text-[10px] font-bold uppercase rounded-full border border-blue-100 flex items-center gap-1.5 shadow-sm">
                      <Globe className="size-3" />
                      <span>Vue publique</span>
                    </div>
                  </div>
                </div>
              </div>
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar & Stats */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card className="p-1 border-hairline shadow-sm rounded-md overflow-hidden bg-surface-card">
              <div className="grid grid-cols-7 border-b border-hairline bg-surface-bone/30">
                {['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(d => (
                  <div key={d} className="p-4 text-center caption-tight text-ash uppercase tracking-widest">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                  const dateStr = day.format('YYYY-MM-DD')
                  const isCurrentMonth = day.isSame(currentMonth, 'month')
                  const isToday = day.isSame(moment(), 'day')
                  const count = attendanceMap[dateStr] || 0

                  return (
                    <div 
                      key={idx} 
                      className={cn(
                        "min-h-[120px] p-3 border-r border-b border-hairline last:border-r-0 relative transition-all",
                        !isCurrentMonth ? "bg-surface-bone/20 opacity-40" : "bg-surface-card hover:bg-canvas",
                        isToday ? "bg-blue-50/30" : ""
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className={cn(
                          "caption-tight",
                          isToday ? "text-primary font-bold" : "text-ash"
                        )}>
                          {day.format('D')}
                        </span>
                        {count > 0 && (
                          <div className={cn(
                            "px-2 py-1 text-xs font-bold rounded-full shadow-sm",
                            isToday ? "bg-primary text-on-primary" : "bg-blue-50 text-primary"
                          )}>
                            {count}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-1 items-center justify-center">
                        {count > 0 && (
                          <div className={cn(
                            "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter",
                            isToday ? "text-primary/60" : "text-ash"
                          )}>
                            <Users className="size-3" />
                            <span>Effectif</span>
                          </div>
                        )}
                      </div>

                      {isToday && (
                        <div className="absolute bottom-2 right-2 size-1.5 bg-primary rounded-full" />
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 border-hairline rounded-md bg-surface-card shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="caption-tight text-ash uppercase tracking-wider">Cumul mensuel</span>
                  <h4 className="display-md text-ink">{monthlyTotal}</h4>
                  <p className="body-sm text-ash mt-1">Total jours travaillés ce mois</p>
                </div>
                <div className="p-4 bg-blue-50 text-primary rounded-full">
                  <CheckCircle2 className="size-8" />
                </div>
              </Card>

              <Card className="p-8 border-hairline rounded-md bg-surface-card shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="caption-tight text-ash uppercase tracking-wider">Moyenne quotidienne</span>
                  <h4 className="display-md text-ink">
                    {(monthlyTotal / currentMonth.daysInMonth()).toFixed(1)}
                  </h4>
                  <p className="body-sm text-ash mt-1">Personnes / jour en moyenne</p>
                </div>
                <div className="p-4 bg-canvas text-charcoal rounded-full">
                  <Clock className="size-8" />
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column: Projects & Contact */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="heading-sm text-ink flex items-center gap-3 px-2">
                <FolderGit2 className="size-5 text-primary" />
                <span>Chantier associé</span>
              </h2>
              
              {project ? (
                <Card key={project._id} className="p-6 border-hairline rounded-md bg-surface-card shadow-sm hover:border-primary/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-canvas rounded-full flex items-center justify-center text-charcoal border border-hairline group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                      <FolderGit2 className="size-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="body-md font-semibold text-ink">
                        {project.name.toLowerCase()}
                      </span>
                      <span className="body-sm text-ash lowercase">{project.site || 'Chantier actif'}</span>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="p-10 text-center bg-surface-card rounded-md border border-hairline border-dashed">
                  <p className="body-sm text-ash italic">Aucun chantier associé</p>
                </div>
              )}
            </div>

            <Card className="p-8 border-hairline rounded-md bg-surface-dark text-on-dark shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Mail className="size-16" />
              </div>
              <h3 className="heading-sm mb-6 flex items-center gap-3">
                <Mail className="size-5 text-primary" />
                <span>Contact entreprise</span>
              </h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="caption-tight text-on-dark-mute uppercase tracking-widest">Email</span>
                  <span className="body-md font-medium text-on-dark truncate">{subcontractorDoc.email || 'Non spécifié'}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="caption-tight text-on-dark-mute uppercase tracking-widest">Téléphone</span>
                  <span className="body-md font-medium text-on-dark">{subcontractorDoc.phone || 'Non spécifié'}</span>
                </div>
              </div>
            </Card>
            
            <p className="caption text-ash text-center px-6 leading-relaxed mt-4">
              Cette page est une vue publique en lecture seule. Pour toute modification, veuillez contacter l&apos;administration de TGCC.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicSubcontractorPage
