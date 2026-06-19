'use client'
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  pdf,
  Image,
} from '@react-pdf/renderer'
import { createTw } from 'react-pdf-tailwind'
import moment from 'moment'
import 'moment/locale/fr'

moment.locale('fr')

const tw = createTw({
  fontFamily: { sans: ['Helvetica'] },
  colors: {
    primary: '#7E1212',
    ink: '#202020',
    charcoal: '#575757',
    ash: '#8d8d8d',
    canvas: '#f9f7f3',
    surface: '#ffffff',
    bone: '#f3f0e8',
    hairline: 'rgba(32,32,32,0.12)',
  },
})

// ─── Types ────────────────────────────────────────────────────────────────────

interface AttendanceEntry {
  date: string
  count: number
}

interface SubcontractorRow {
  subcontractorId: string
  name: string
  attendance: AttendanceEntry[]
}

interface PersonnelPDFProps {
  month: moment.Moment
  data: SubcontractorRow[]
  daysFirst: moment.Moment[]
  daysSecond: moment.Moment[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY = '#7E1212'
const BONE = '#f3f0e8'
const HAIRLINE = '#e2e2e2'
const CANVAS = '#f9f7f3'
const ASH = '#8d8d8d'
const INK = '#202020'
const CHARCOAL = '#575757'

const TGCC_LOGO = 'data:image/png;base64,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'

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({ children }: { children: string }) => (
  <View style={{ backgroundColor: BONE, borderBottom: `1px solid ${HAIRLINE}`, padding: '6px 10px', marginBottom: 0 }}>
    <Text style={{ fontSize: 7, color: CHARCOAL, textTransform: 'uppercase', letterSpacing: 1 }}>{children}</Text>
  </View>
)

const AttendanceTable = ({
  days,
  data,
  title,
  allDays,
  isLast,
}: {
  days: moment.Moment[]
  data: SubcontractorRow[]
  title: string
  allDays?: moment.Moment[]
  isLast?: boolean
}) => {
  const colW = Math.max(16, Math.floor(440 / (days.length + 2)))
  const labelW = 110

  return (
    <View style={{ marginBottom: 12 }}>
      <SectionHeader>{title}</SectionHeader>

      {/* Header row */}
      <View style={{ flexDirection: 'row', backgroundColor: PRIMARY }}>
        <View style={{ width: labelW, padding: '4px 6px', borderRight: `1px solid rgba(255,255,255,0.2)` }}>
          <Text style={{ fontSize: 7, color: '#fff' }}>Sous-traitant</Text>
        </View>
        {days.map(day => (
          <View
            key={day.format('DD')}
            style={{
              width: colW,
              padding: '4px 2px',
              alignItems: 'center',
              borderRight: `1px solid rgba(255,255,255,0.2)`,
              backgroundColor: day.isoWeekday() > 5 ? 'rgba(255,255,255,0.15)' : undefined,
            }}
          >
            <Text style={{ fontSize: 6, color: '#fff' }}>{day.format('DD')}</Text>
          </View>
        ))}
        <View style={{ width: colW, padding: '4px 2px', alignItems: 'center' }}>
          <Text style={{ fontSize: 7, color: '#fff' }}>Total</Text>
        </View>
      </View>

      {/* Subcontractor rows */}
      {data.map((row, idx) => {
        let rowTotal = 0
        return (
          <View
            key={row.subcontractorId}
            style={{ flexDirection: 'row', backgroundColor: idx % 2 === 0 ? '#ffffff' : CANVAS, borderBottom: `1px solid ${HAIRLINE}` }}
          >
            <View style={{ width: labelW, padding: '4px 6px', borderRight: `1px solid ${HAIRLINE}` }}>
              <Text style={{ fontSize: 7, color: INK, textTransform: 'capitalize' }}>{row.name.toLowerCase()}</Text>
            </View>
            {days.map(day => {
              const dateStr = day.format('YYYY-MM-DD')
              const entry = row.attendance.find((a: AttendanceEntry) => a.date === dateStr)
              const count = entry?.count || 0
              rowTotal += count
              return (
                <View
                  key={dateStr}
                  style={{
                    width: colW,
                    padding: '4px 2px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: `1px solid ${HAIRLINE}`,
                    backgroundColor: day.isoWeekday() > 5 ? '#fff5f5' : undefined,
                  }}
                >
                  <Text style={{ fontSize: 7, color: count > 0 ? INK : '#ccc' }}>
                    {count > 0 ? String(count) : '-'}
                  </Text>
                </View>
              )
            })}
            <View style={{ width: colW, padding: '4px 2px', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 7, color: INK }}>{rowTotal}</Text>
            </View>
          </View>
        )
      })}

      {/* Daily totals row */}
      {data.length > 0 && (
        <View style={{ flexDirection: 'row', backgroundColor: BONE, borderTop: `1px solid ${HAIRLINE}` }}>
          <View style={{ width: labelW, padding: '4px 6px', borderRight: `1px solid ${HAIRLINE}` }}>
            <Text style={{ fontSize: 7, color: CHARCOAL }}>Total journalier</Text>
          </View>
          {days.map(day => {
            const dateStr = day.format('YYYY-MM-DD')
            const dayTotal = data.reduce((acc, row) => {
              const entry = row.attendance.find((a: AttendanceEntry) => a.date === dateStr)
              return acc + (entry?.count || 0)
            }, 0)
            return (
              <View key={dateStr} style={{ width: colW, padding: '4px 2px', alignItems: 'center', borderRight: `1px solid ${HAIRLINE}` }}>
                <Text style={{ fontSize: 7, color: dayTotal > 0 ? INK : ASH }}>{dayTotal > 0 ? String(dayTotal) : '-'}</Text>
              </View>
            )
          })}
          <View style={{ width: colW, padding: '4px 2px', alignItems: 'center', backgroundColor: PRIMARY }}>
            <Text style={{ fontSize: 7, color: '#fff' }}>
              {data.reduce((acc, row) => {
                return acc + row.attendance.filter((a: AttendanceEntry) => days.some(d => d.format('YYYY-MM-DD') === a.date)).reduce((sum, a) => sum + (a.count || 0), 0)
              }, 0)}
            </Text>
          </View>
        </View>
      )}

      {/* Total Mensuel — only on last table */}
      {isLast && allDays && data.length > 0 && (
        <View style={{ flexDirection: 'row', backgroundColor: PRIMARY, borderTop: `2px solid ${PRIMARY}` }}>
          <View style={{ width: labelW, padding: '5px 6px', borderRight: `1px solid rgba(255,255,255,0.2)` }}>
            <Text style={{ fontSize: 8, color: '#fff' }}>Total Mensuel</Text>
          </View>
          {days.map(day => (
            <View key={day.format('DD')} style={{ width: colW, padding: '4px 2px', alignItems: 'center', borderRight: `1px solid rgba(255,255,255,0.2)` }}>
              <Text style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)' }}> </Text>
            </View>
          ))}
          <View style={{ width: colW, padding: '4px 2px', alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: '#fff' }}>
              {data.reduce((acc, row) => acc + allDays.reduce((sum, day) => {
                const d = day.format('YYYY-MM-DD')
                const entry = row.attendance.find((a: AttendanceEntry) => a.date === d)
                return sum + (entry?.count || 0)
              }, 0), 0)}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

// ─── Main PDF Document ────────────────────────────────────────────────────────

const PersonnelPDFDocument = ({ month, data, daysFirst, daysSecond }: PersonnelPDFProps) => {
  return (
    <Document title={`Rapport Personnel - ${month.format('MMMM YYYY')}`} author="TGCC Atlas">
      <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', padding: 24, backgroundColor: '#ffffff' }}>

        {/* ── Page Header ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingBottom: 10, borderBottom: `2px solid ${PRIMARY}` }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image src={TGCC_LOGO} style={{ width: 120, height: 48 }} />
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Text style={{ fontSize: 16, color: INK, marginBottom: 2 }}>Suivi Global des Sous-traitants</Text>
            <Text style={{ fontSize: 10, color: PRIMARY, textTransform: 'capitalize' }}>{month.format('MMMM YYYY')}</Text>
            <Text style={{ fontSize: 7, color: ASH }}>Généré le {moment().format('DD/MM/YYYY [à] HH:mm')}</Text>
          </View>
        </View>

        {/* ── Attendance Tables ── */}
        <AttendanceTable days={daysFirst} data={data} title="Première Quinzaine (01 – 15)" allDays={[...daysFirst, ...daysSecond]} />
        <AttendanceTable days={daysSecond} data={data} title="Deuxième Quinzaine (16 – Fin)" allDays={[...daysFirst, ...daysSecond]} isLast />

        {/* ── Footer ── */}
        <View style={{ position: 'absolute', bottom: 16, left: 24, right: 24, borderTop: `1px solid ${HAIRLINE}`, paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 6, color: ASH }}>TGCC Atlas — Rapport confidentiel</Text>
          <Text style={{ fontSize: 6, color: ASH }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

// ─── Export helper ────────────────────────────────────────────────────────────

export async function downloadPersonnelPDF(props: PersonnelPDFProps) {
  const blob = await pdf(<PersonnelPDFDocument {...props} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rapport-personnel-${props.month.format('YYYY-MM')}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

export default PersonnelPDFDocument
