'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  CheckCircle2,
  Users,
  Share2,
  FolderGit2,
  Mail,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import moment from 'moment'
import 'moment/locale/fr'
import { toast } from 'sonner'
import Image from 'next/image'

moment.locale('fr')

const SubcontractorDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const subId = params.subcontractorId as Id<"subcontractors">
  
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'))
  
  const subcontractor = useQuery(api.functions.subcontractors.getSubcontractor, { id: subId })
  const project = useQuery(api.functions.project.getProject, subcontractor?.projectId ? { id: subcontractor.projectId } : "skip")
  
  const startDate = currentMonth.clone().startOf('month').format('YYYY-MM-DD')
  const endDate = currentMonth.clone().endOf('month').format('YYYY-MM-DD')
  
  const dailyAttendance = useQuery(api.functions.subcontractors.getDailyAttendance, {
    subcontractorId: subId,
    startDate,
    endDate
  })
  
  const setDailyCount = useMutation(api.functions.subcontractors.setDailyCount)

  const [localCounts, setLocalCounts] = useState<Record<string, string>>({})
  const [editingDay, setEditingDay] = useState<string | null>(null)

  useEffect(() => {
    if (Array.isArray(dailyAttendance)) {
      const counts: Record<string, string> = {}
      dailyAttendance.forEach(a => {
        counts[a.date] = a.count.toString()
      })
      setLocalCounts(counts)
    }
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

  const handleCountChange = (date: string, value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setLocalCounts(prev => ({ ...prev, [date]: value }))
    }
  }

  const saveDay = async (date: string) => {
    const count = parseInt(localCounts[date] || '0')
    try {
      await setDailyCount({
        subcontractorId: subId,
        date,
        count
      })
      setEditingDay(null)
      toast.success('effectif mis à jour')
    } catch {
      toast.error('erreur d\'enregistrement')
    }
  }

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/public/sub/${subId}`
    navigator.clipboard.writeText(publicUrl)
    toast.success('lien public copié dans le presse-papier')
  }

  const prevMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'))
  }

  const nextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'))
  }

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
        <Button onClick={() => router.back()}>retour</Button>
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

  const monthlyTotal = Object.values(localCounts).reduce((acc, curr) => acc + parseInt(curr || '0'), 0)

  return (
    <div className="p-8 max-w-7xl mx-auto bg-canvas min-h-screen">
      <div className="flex flex-col gap-10">
        {/* Header & Company Profile */}
        <div className="flex items-start gap-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-surface-bone rounded-full transition-colors text-charcoal mt-1">
            <ChevronLeft className="size-6" />
          </button>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                 <Image className='w-12' src={'/Project.png'} width={1000} height={1000} alt='logo' />
                <div>
                  <h1 className="heading-xl text-ink">
                    {subcontractorDoc.name}
                  </h1>
                  <p className="body-sm text-ash lowercase">Gestion des effectifs et chantiers</p>
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
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar & Stats */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <Card className="p-1  overflow-hidden bg-white ">
              <div className="grid grid-cols-7 border-b border-hairline ">
                {['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(d => (
                  <div key={d} className="p-4 text-center caption-tight text-ash ">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                  const dateStr = day.format('YYYY-MM-DD')
                  const isCurrentMonth = day.isSame(currentMonth, 'month')
                  const isToday = day.isSame(moment(), 'day')
                  const count = localCounts[dateStr] || '0'
                  const isEditing = editingDay === dateStr

                  return (
                    <div 
                      key={idx} 
                      onClick={() => isCurrentMonth && setEditingDay(dateStr)}
                      className={cn(
                        "min-h-[120px] p-3 border-r border-b border-hairline last:border-r-0 relative transition-all",
                        !isCurrentMonth ? "bg-surface-bone/20 opacity-40" : "bg-surface-card hover:bg-canvas cursor-pointer",
                        isToday ? "bg-primary text-white" : ""
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className={cn(
                          "caption-tight",
                          isToday ? " " : "text-ash"
                        )}>
                          {day.format('D')}
                        </span>
                        {parseInt(count) > 0 && !isEditing && (
                          <div className="px-2 py-1  rounded-full text-xs  ">
                            {count}
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="mt-4 flex flex-col gap-2 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                          <input 
                            autoFocus
                            type="text" 
                            value={count}
                            onChange={(e) => handleCountChange(dateStr, e.target.value)}
                            onBlur={() => saveDay(dateStr)}
                            onKeyDown={(e) => e.key === 'Enter' && saveDay(dateStr)}
                            className="w-full h-10 text-center body-md bg-white border-2 border-primary rounded-full focus:outline-none shadow-lg"
                          />
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col gap-1 items-center justify-center">

                        </div>
                      )}
                      
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

              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubcontractorDetailsPage
