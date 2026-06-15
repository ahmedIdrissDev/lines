'use client'
import React, { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { store } from '@/store'
import { Id } from '@/convex/_generated/dataModel'
import { 
  ChevronLeft, 
  ChevronRight,
  Printer,
  Building2,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import moment from 'moment'
import 'moment/locale/fr'
import { cn } from '@/lib/utils'

moment.locale('fr')

type Period = 'full' | 'first' | 'second'

const RapportGeneralPage = () => {
  const { ProjectID } = store()
  const projectId = ProjectID as Id<"Project"> | undefined
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'))
  const [searchTerm, setSearchTerm] = useState('')

  const monthStart = useMemo(() => currentMonth.clone().startOf('month').format('YYYY-MM-DD'), [currentMonth])
  const monthEnd = useMemo(() => currentMonth.clone().endOf('month').format('YYYY-MM-DD'), [currentMonth])

  const attendanceData = useQuery(
    api.functions.subcontractors.getProjectSubcontractorsAttendance,
    projectId ? { projectId, startDate: monthStart, endDate: monthEnd } : "skip"
  )

  const daysFirst = useMemo(() => {
    const days = []
    const start = currentMonth.clone().startOf('month')
    const end = currentMonth.clone().date(15)
    const curr = start.clone()
    while (curr.isSameOrBefore(end)) {
      days.push(curr.clone())
      curr.add(1, 'day')
    }
    return days
  }, [currentMonth])

  const daysSecond = useMemo(() => {
    const days = []
    const start = currentMonth.clone().date(16)
    const end = currentMonth.clone().endOf('month')
    const curr = start.clone()
    while (curr.isSameOrBefore(end)) {
      days.push(curr.clone())
      curr.add(1, 'day')
    }
    return days
  }, [currentMonth])

  const filteredData = useMemo(() => {
    if (!attendanceData || !Array.isArray(attendanceData)) return []
    if (!searchTerm) return attendanceData
    return attendanceData.filter(row => 
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [attendanceData, searchTerm])

  const prevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, 'month'))
  const nextMonth = () => setCurrentMonth(prev => prev.clone().add(1, 'month'))

  const handlePrint = () => {
    window.print()
  }

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-ash">
        <Building2 className="size-12 mb-4 opacity-20" />
        <p className="text-sm">Veuillez sélectionner un projet pour voir le rapport général.</p>
      </div>
    )
  }

  if (attendanceData === undefined) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-10 w-64 bg-neutral-200 animate-pulse rounded-md" />
        <div className="h-[400px] w-full bg-neutral-100 animate-pulse rounded-md" />
      </div>
    )
  }

  const renderTable = (days: moment.Moment[], title: string) => (
    <div className="flex flex-col">
      <div className="bg-slate-50/50 px-6 py-2 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-20 min-w-[180px] border-b border-r bg-slate-50 px-4 py-3 text-left font-medium text-slate-700">
                Sous-traitant
              </th>
              {days.map(day => (
                <th key={day.format('DD')} className={cn(
                  "min-w-[50px] border-b border-r border-slate-100 px-2 py-3 text-center text-slate-600 font-medium",
                  day.isoWeekday() > 5 ? "bg-red-50/30" : ""
                )}>
                  {day.format('DD')}
                </th>
              ))}
              <th className="sticky right-0 z-20 min-w-[100px] border-b border-l bg-slate-50 px-4 py-3 text-center font-semibold text-slate-900 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={days.length + 2} className="p-12 text-center   text-neutral-950">
                  Aucun sous-traitant trouvé.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                let rowTotal = 0
                return (
                  <tr key={row.subcontractorId} className="hover:bg-slate-50 group">
                    <td className="sticky left-0 z-10 bg-white border-b border-r px-4 py-3 font-medium text-slate-700 group-hover:bg-slate-50 transition-colors">
                      <span className="capitalize">{row.name.toLowerCase()}</span>
                    </td>
                    {days.map(day => {
                      const dateStr = day.format('YYYY-MM-DD')
                      const entry = row.attendance.find(a => a.date === dateStr)
                      const count = entry?.count || 0
                      rowTotal += count
                      
                      return (
                        <td key={dateStr} className={cn(
                          "border-b border-r border-slate-50 text-center px-2 py-3",
                          day.isoWeekday() > 5 ? "bg-red-50/10" : "",
                          count > 0 ? "text-slate-900" : "text-slate-300"
                        )}>
                          {count > 0 ? count : '-'}
                        </td>
                      )
                    })}
                    <td className="sticky right-0 z-10 bg-white border-b border-l text-center font-semibold text-slate-900 group-hover:bg-slate-50 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                      {rowTotal}
                    </td>
                  </tr>
                )
              })
            )}
            
            {filteredData.length > 0 && (
              <tr className="bg-slate-100 font-semibold text-slate-900">
                <td className="sticky left-0 z-10 bg-slate-100 border-r px-4 py-3">
                  Total journalier
                </td>
                {days.map(day => {
                  const dateStr = day.format('YYYY-MM-DD')
                  const dayTotal = attendanceData.reduce((acc, row) => {
                    const entry = row.attendance.find(a => a.date === dateStr)
                    return acc + (entry?.count || 0)
                  }, 0)
                  
                  return (
                    <td key={dateStr} className="text-center px-2 py-3">
                      {dayTotal > 0 ? dayTotal : '-'}
                    </td>
                  )
                })}
                <td className="sticky right-0 z-10 bg-primary text-white border-l text-center shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                  {attendanceData.reduce((acc, row) => {
                    return acc + row.attendance.filter(a => days.some(d => d.format('YYYY-MM-DD') === a.date)).reduce((sum, a) => sum + a.count, 0)
                  }, 0)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="p-2 w-full print:p-0">
      <div className="flex flex-col gap-6">
        
        {/* Main Styled Container */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-4">
            <div>
              <h2 className="text-xl ">
                Suivi global des sous-traitants
              </h2>
              <p className="text-sm text-slate-500 capitalize">
                {currentMonth.format('MMMM YYYY')}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center border border-slate-200 rounded-lg h-10 px-1 bg-white">
                <button onClick={prevMonth} className="size-8 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500">
                  <ChevronLeft className="size-4" />
                </button>
                <div className="px-2 text-sm font-medium text-slate-700 min-w-[120px] text-center capitalize">
                  {currentMonth.format('MMM YYYY')}
                </div>
                <button onClick={nextMonth} className="size-8 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500">
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 bg-white rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                />
              </div>

              
            </div>
          </div>

          {/* Tables Section */}
          <div className="flex flex-col divide-y divide-slate-200">
            {renderTable(daysFirst, "Première Quinzaine (01 - 15)")}
            {renderTable(daysSecond, "Deuxième Quinzaine (16 - Fin)")}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-2 print:hidden">
           <div className="flex items-center gap-2">
             <div className="size-3 bg-red-50 border border-slate-200 rounded-sm" />
             <span className="text-xs text-slate-500">Weekend</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="size-3 bg-slate-100 border border-slate-200 rounded-sm" />
             <span className="text-xs text-slate-500">Totaux</span>
           </div>
        </div>
      </div>

     
    </div>
  )
}

export default RapportGeneralPage
