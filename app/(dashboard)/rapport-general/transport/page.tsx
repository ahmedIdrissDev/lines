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
  Bus,
  FileDown,
  Loader2,
} from 'lucide-react'
import moment from 'moment'
import 'moment/locale/fr'
import { cn } from '@/lib/utils'
import { downloadTransportPDF } from './transport-pdf'

moment.locale('fr')

const RapportTransportPage = () => {
  const { ProjectID } = store()
  const projectId = ProjectID as Id<"Project"> | undefined
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'))
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const monthStart = useMemo(() => currentMonth.clone().startOf('month').format('YYYY-MM-DD'), [currentMonth])
  const monthEnd = useMemo(() => currentMonth.clone().endOf('month').format('YYYY-MM-DD'), [currentMonth])

  const transportData = useQuery(
    api.functions.buses.getProjectBusesAttendance,
    projectId ? { projectId, startDate: monthStart, endDate: monthEnd } : "skip"
  )

  const tripsQueryResult = useQuery(
    api.functions.buses.getSupplementaires,
    projectId ? { siteId: projectId } : "skip"
  )
  const trips = Array.isArray(tripsQueryResult) ? tripsQueryResult : []

  const filteredTrips = useMemo(() => {
    if (!trips) return []
    return trips.filter(trip => {
      const tripDate = moment(trip.date)
      return tripDate.isSameOrAfter(currentMonth.clone().startOf('month')) && 
             tripDate.isSameOrBefore(currentMonth.clone().endOf('month'))
    })
  }, [trips, currentMonth])

  const tripsByDay = useMemo(() => {
    const map: Record<string, number> = {}
    filteredTrips.forEach(trip => {
      map[trip.date] = (map[trip.date] || 0) + 1
    })
    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredTrips])

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

  const destinationStats = useMemo(() => {
    if (!transportData || !Array.isArray(transportData)) return []

    const matriculeToDest: Record<string, string> = {}
    transportData.forEach((row: any) => {
      if (row.matricule) {
        matriculeToDest[row.matricule] = row.destination?.trim() || "Non spécifié"
      }
    })

    const stats: Record<string, number> = {}
    const allDays = [...daysFirst, ...daysSecond]

    transportData.forEach((row: any) => {
      const dest = row.destination?.trim() || "Non spécifié"
      const totalDays = row.attendance.filter((a: any) => a.isWorking && allDays.some(d => d.format('YYYY-MM-DD') === a.date)).length
      stats[dest] = (stats[dest] || 0) + totalDays
    })

    filteredTrips.forEach((trip: any) => {
      const dest = matriculeToDest[trip.matricule] || "Non spécifié"
      stats[dest] = (stats[dest] || 0) + 1
    })

    return Object.entries(stats)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
  }, [transportData, daysFirst, daysSecond, filteredTrips])

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
<svg
          className="w-12 h-11 opacity-20"
          width="457"
          height="268"
          viewBox="0 0 457 268"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.7523 221.748C130.997 224.167 159.239 246.1 197.289 177.128C217.19 141.056 187.597 107.922 208.143 72.214C253.226 -6.13942 438.972 85.3512 438.972 85.3512"
            stroke="currentColor"
            strokeWidth="81"
          />
        </svg>        <p className="text-sm">Veuillez sélectionner un projet pour voir le rapport de transport.</p>
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
            <tr className="bg-primary">
              <th className="sticky left-0 z-20 min-w-[180px] border-b border-r bg-primary px-4 py-3 text-left font-normal text-white">
                Destination
              </th>
              {days.map(day => (
                <th key={day.format('DD')} className={cn(
                  "min-w-[50px] border-b border-r border-primary/30 px-2 py-3 text-center text-white font-normal",
                  day.isoWeekday() > 5 ? "bg-primary/80" : ""
                )}>
                  {day.format('DD')}
                </th>
              ))}
              <th className="sticky right-0 z-20 min-w-[100px] border-b border-l bg-primary px-4 py-3 text-center font-normal text-white shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
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
                    <td className="sticky left-0 z-10 bg-white border-b border-r px-4 py-3 text-slate-700 group-hover:bg-slate-50 transition-colors">
                      <span>{row.destination?.trim() || "-"}</span>
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

              {/* PDF Export Button */}
              <button
                onClick={async () => {
                  if (!transportData || !Array.isArray(transportData)) return
                  setIsExporting(true)
                  try {
                    await downloadTransportPDF({
                      month: currentMonth,
                      buses: transportData,
                      trips: filteredTrips,
                      daysFirst,
                      daysSecond,
                    })
                  } finally {
                    setIsExporting(false)
                  }
                }}
                disabled={isExporting || !transportData || !Array.isArray(transportData)}
                className="h-10 px-4 flex items-center gap-2 rounded-lg border border-primary bg-primary text-white text-sm font-normal hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting
                  ? <Loader2 className="size-4 animate-spin" />
                  : <FileDown className="size-4" />
                }
                {isExporting ? 'Export...' : 'Exporter PDF'}
              </button>
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
                <tr className="bg-primary">
                  <th className="border-b border-r border-primary/30 px-4 py-3 text-left font-normal text-white">Matricule</th>
                  <th className="border-b border-r border-primary/30 px-4 py-3 text-left font-normal text-white">Type</th>
                  <th className="border-b border-r border-primary/30 px-4 py-3 text-left font-normal text-white">Site</th>
                  <th className="border-b border-r border-primary/30 px-4 py-3 text-left font-normal text-white">Destination</th>
                  <th className="border-b border-r border-primary/30 px-4 py-3 text-left font-normal text-white">KM</th>
                  <th className="border-b border-primary/30 px-4 py-3 text-left font-normal text-white">Statut</th>
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

        {/* Destination Statistics & Supplementary Trips */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden mt-2">
          <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
            <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider">Statistiques par Destination</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm font-normal">
              <thead>
                <tr className="bg-primary">
                  <th className="border-b border-r border-primary/30 px-4 py-3 text-left font-normal text-white">Destination</th>
                  <th className="border-b border-primary/30 px-4 py-3 text-right font-normal text-white">Total du Mois</th>
                </tr>
              </thead>
              <tbody>
                {destinationStats.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-slate-400 font-normal">
                      Aucune donnée disponible.
                    </td>
                  </tr>
                ) : (
                  destinationStats.map((stat, idx) => (
                    <tr key={stat.destination} className={cn(
                      "hover:bg-slate-50 transition-colors",
                      idx === destinationStats.length - 1 ? "border-b-0" : ""
                    )}>
                      <td className="border-b border-r px-4 py-2.5 font-normal text-slate-700">{stat.destination}</td>
                      <td className="border-b px-4 py-2.5 text-right font-normal">
                        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                          {stat.count}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {destinationStats.length > 0 && (
                  <tr className="bg-slate-50 font-normal">
                    <td className="border-t px-4 py-2.5 font-medium text-slate-800">Total</td>
                    <td className="border-t px-4 py-2.5 text-right font-medium">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {destinationStats.reduce((acc, s) => acc + s.count, 0)}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200">
            <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
              <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider">Trajets Supplémentaires</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm font-normal">
                <thead>
                  <tr className="bg-primary">
                    <th className="border-b border-r border-primary/30 px-4 py-3 text-left font-normal text-white">Date</th>
                    <th className="border-b border-primary/30 px-4 py-3 text-right font-normal text-white">Nombre de Trajets</th>
                  </tr>
                </thead>
                <tbody>
                  {tripsByDay.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-slate-400 font-normal">
                        Aucun trajet supplémentaire pour ce mois.
                      </td>
                    </tr>
                  ) : (
                    tripsByDay.map((day, idx) => (
                      <tr key={day.date} className={cn(
                        "hover:bg-slate-50 transition-colors",
                        idx === tripsByDay.length - 1 ? "border-b-0" : ""
                      )}>
                        <td className="border-b border-r px-4 py-2.5 font-normal text-slate-700">
                          {moment(day.date).format("DD/MM/YYYY")}
                        </td>
                        <td className="border-b px-4 py-2.5 text-right font-normal">
                          <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-primary/5 text-primary text-sm font-medium">
                            {day.count}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                  {tripsByDay.length > 0 && (
                    <tr className="bg-slate-50 font-normal">
                      <td className="border-t px-4 py-2.5 font-medium text-slate-800">Total</td>
                      <td className="border-t px-4 py-2.5 text-right font-medium">
                        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {tripsByDay.reduce((acc, d) => acc + d.count, 0)}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

