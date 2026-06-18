'use client'
import React, { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { store } from '@/store'
import { Id } from '@/convex/_generated/dataModel'
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  Bus
} from 'lucide-react'
import moment from 'moment'
import 'moment/locale/fr'
import { cn } from '@/lib/utils'

moment.locale('fr')

const RapportTransportPage = () => {
  const { ProjectID } = store()
  const projectId = ProjectID as Id<"Project"> | undefined
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'))
  const [searchTerm, setSearchTerm] = useState('')

  const monthStart = useMemo(() => currentMonth.clone().startOf('month').format('YYYY-MM-DD'), [currentMonth])
  const monthEnd = useMemo(() => currentMonth.clone().endOf('month').format('YYYY-MM-DD'), [currentMonth])

  const transportData = useQuery(
    api.functions.buses.getProjectBusesAttendance,
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
    if (!transportData || !Array.isArray(transportData)) return []
    if (!searchTerm) return transportData
    return transportData.filter(row => 
      row.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [transportData, searchTerm])

  const prevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, 'month'))
  const nextMonth = () => setCurrentMonth(prev => prev.clone().add(1, 'month'))

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-ash">
        <Bus className="w-12 h-12 opacity-20 mb-4" />
        <p className="text-sm">Veuillez sélectionner un projet pour voir le rapport de transport.</p>
      </div>
    )
  }

  if (transportData === undefined) {
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
        <span className="text-xs font-normal text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-20 min-w-[180px] border-b border-r bg-slate-50 px-4 py-3 text-left font-normal text-slate-700">
                Bus / Matricule
              </th>
              {days.map(day => (
                <th key={day.format('DD')} className={cn(
                  "min-w-[50px] border-b border-r border-slate-100 px-2 py-3 text-center text-slate-600 font-normal",
                  day.isoWeekday() > 5 ? "bg-red-50/30" : ""
                )}>
                  {day.format('DD')}
                </th>
              ))}
              <th className="sticky right-0 z-20 min-w-[100px] border-b border-l bg-slate-50 px-4 py-3 text-center font-normal text-slate-900 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                Total Jours
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={days.length + 2} className="p-12 text-center text-neutral-950">
                  Aucun bus trouvé.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                let rowTotal = 0
                return (
                  <tr key={row.busId} className="hover:bg-slate-50 group">
                    <td className="sticky left-0 z-10 bg-white border-b border-r px-4 py-3 font-normal text-slate-700 group-hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col">
                        <span className="uppercase font-normal">{row.matricule}</span>
                        <span className="text-[10px] text-slate-400">{row.busType}</span>
                      </div>
                    </td>
                    {days.map(day => {
                      const dateStr = day.format('YYYY-MM-DD')
                      const entry = row.attendance.find(a => a.date === dateStr)
                      const isWorking = entry?.isWorking || false
                      if (isWorking) rowTotal++
                      
                      return (
                        <td key={dateStr} className={cn(
                          "border-b border-r border-slate-50 text-center px-2 py-3",
                          day.isoWeekday() > 5 ? "bg-red-50/10" : "",
                        )}>
                          {isWorking ? (
                            <div className="flex justify-center">
                              <div className="size-2 rounded-full bg-primary" />
                            </div>
                          ) : (
                            <span className="text-slate-200">-</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="sticky right-0 z-10 bg-white border-b border-l text-center font-normal text-slate-900 group-hover:bg-slate-50 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                      {rowTotal}
                    </td>
                  </tr>
                )
              })
            )}
            
            {filteredData.length > 0 && (
              <tr className="bg-slate-100 font-normal text-slate-900">
                <td className="sticky left-0 z-10 bg-slate-100 border-r px-4 py-3 font-normal">
                  Buses actifs
                </td>
                {days.map(day => {
                  const dateStr = day.format('YYYY-MM-DD')
                  const dayTotal = transportData.reduce((acc, row) => {
                    const entry = row.attendance.find(a => a.date === dateStr)
                    return acc + (entry?.isWorking ? 1 : 0)
                  }, 0)
                  
                  return (
                    <td key={dateStr} className="text-center px-2 py-3 font-normal">
                      {dayTotal > 0 ? dayTotal : '-'}
                    </td>
                  )
                })}
                <td className="sticky right-0 z-10 bg-primary text-white border-l text-center shadow-[-4px_0_8px_rgba(0,0,0,0.02)] font-normal">
                  {transportData.reduce((acc, row) => {
                    return acc + row.attendance.filter(a => a.isWorking && days.some(d => d.format('YYYY-MM-DD') === a.date)).length
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
        
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-normal">
                Suivi global du transport
              </h2>
              <p className="text-sm text-slate-500 capitalize font-normal">
                {currentMonth.format('MMMM YYYY')}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center border border-slate-200 rounded-lg h-10 px-1 bg-white">
                <button onClick={prevMonth} className="size-8 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500">
                  <ChevronLeft className="size-4" />
                </button>
                <div className="px-2 text-sm font-normal text-slate-700 min-w-[120px] text-center capitalize">
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
                  placeholder="Rechercher matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 bg-white rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 font-normal"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-slate-200">
            {renderTable(daysFirst, "Première Quinzaine (01 - 15)")}
            {renderTable(daysSecond, "Deuxième Quinzaine (16 - Fin)")}
          </div>
        </div>

        {/* Detailed Transport Table */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden mt-2">
          <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
            <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider">Détails du Transport</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm font-normal">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="border-b border-r px-4 py-3 text-left font-normal text-slate-600">Matricule</th>
                  <th className="border-b border-r px-4 py-3 text-left font-normal text-slate-600">Type</th>
                  <th className="border-b border-r px-4 py-3 text-left font-normal text-slate-600">Site</th>
                  <th className="border-b border-r px-4 py-3 text-left font-normal text-slate-600">Destination</th>
                  <th className="border-b border-r px-4 py-3 text-left font-normal text-slate-600">KM</th>
                  <th className="border-b px-4 py-3 text-left font-normal text-slate-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-normal">
                      Aucune donnée disponible.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row: any) => (
                    <tr key={row.busId} className="hover:bg-slate-50 transition-colors">
                      <td className="border-b border-r px-4 py-2 font-normal text-slate-700 uppercase">{row.matricule}</td>
                      <td className="border-b border-r px-4 py-2 font-normal text-slate-600">{row.busType}</td>
                      <td className="border-b border-r px-4 py-2 font-normal text-slate-600">{row.siteName}</td>
                      <td className="border-b border-r px-4 py-2 font-normal text-slate-700">
                        {row.destination || "-"}
                      </td>
                      <td className="border-b border-r px-4 py-2 font-normal text-slate-600">{row.km || "-"}</td>
                      <td className="border-b px-4 py-2 font-normal">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px]",
                          row.status === "Active" ? "bg-green-100 text-green-700" : 
                          row.status === "Maintenance" ? "bg-amber-100 text-amber-700" : 
                          "bg-red-100 text-red-700"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-6 px-2 print:hidden">
           <div className="flex items-center gap-2">
             <div className="size-3 bg-red-50 border border-slate-200 rounded-sm" />
             <span className="text-xs text-slate-500">Weekend</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="size-3 rounded-full bg-primary" />
             <span className="text-xs text-slate-500">En service</span>
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

export default RapportTransportPage

