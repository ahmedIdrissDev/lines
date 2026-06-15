"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { store } from "@/store"
import { Id } from "@/convex/_generated/dataModel"

export const description = "An interactive area chart"
interface ChartProps{
  date:string ,
  desktop:number ,
  mobile:number
}
const chartData = [
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Présence",
    color: "var(--color-chart-1)",
  },
  mobile: {
    label: "Absence",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

export function EffectifGeneral() {
  const {ProjectID} = store()
  const [timeRange, setTimeRange] = React.useState("90d")
  const ProjectId = ProjectID as Id<"Project">;
   

    const fetchData = useQuery(api.functions.present.Presents ,  ProjectId? {Project:ProjectId} :"skip") 
    const {data} =store()

   const convertToReadbleFromt = Array.isArray(fetchData) ? fetchData.map(({date ,employees ,Project})=>{
          const random= Math.floor(Math.random() * 1022)
          return {  
            date ,  
            desktop:employees.length , 
            mobile:  data.length - employees.length   }
    }) as ChartProps[] : [] as ChartProps[]
  const filteredData = convertToReadbleFromt?.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2025-11-01")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })
 
  return (
    <Card className="pt-0 border-hairline shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-hairline py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="font-display text-xl font-bold tracking-tight">Résumé Général de l'Effectif</CardTitle>
          <CardDescription className="text-charcoal">
            Résumé de la présence sur site par jour
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-full sm:ml-auto sm:flex border-hairline"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-hairline">
            <SelectItem value="90d" className="rounded-md">
              Derniers 90 jours
            </SelectItem>
            <SelectItem value="30d" className="rounded-md">
              Derniers 30 jours
            </SelectItem>
            <SelectItem value="7d" className="rounded-md">
              Derniers 7 jours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
