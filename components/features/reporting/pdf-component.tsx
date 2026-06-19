import { Employee } from '@/types';
import { Text, View } from '@react-pdf/renderer'
import React from 'react'
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  fontFamily: {
    sans: ["Helvetica"],
  },
  colors: {
    primary: "#7E1212",
    ink: "#202020",
    charcoal: "#575757",
    ash: "#8d8d8d",
    canvas: "#f9f7f3",
    surface: "#ffffff",
    bone: "#f3f0e8",
    hairline: "rgba(32, 32, 32, 0.12)",
    success: "#2b9a66",
  },
});

interface customchartProps {
  siteManger: string;
  count: number;
  present: Employee[];
  Absent: Employee[];
}

const PDFtable = ({ count, siteManger, present }: customchartProps) => {
  const func = Object.groupBy(present, ({ function: fun }) => fun);
  const data = Object.entries(func).map(([funcName, employees]) => ({
    func: funcName,
    count: (employees || []).filter(({ status }) => status === "active").length,
    countabsent: (employees || []).filter(({ status }) => status === "inactive").length,
  }));

  return (
    <View style={tw('w-full bg-surface border border-hairline mb-8 overflow-hidden')}>
      {/* Header */}
      <View style={tw('bg-ink p-4 flex-row justify-between items-center')}>
        <Text style={tw('text-canvas text-sm font-bold')}>{siteManger}</Text>
        <Text style={tw('text-ash text-[8px]')}>Rapport d&apos;activité détaillé</Text>
      </View>

      {/* Summary Mini-Stats */}
      <View style={tw('flex-row border-b border-hairline bg-bone')}>
        <View style={tw('flex-1 p-3 items-center border-r border-hairline')}>
          <Text style={tw('text-[9px] text-charcoal mb-1')}>Effectif Total</Text>
          <Text style={tw('text-sm font-bold text-ink')}>{count}</Text>
        </View>
        <View style={tw('flex-1 p-3 items-center border-r border-hairline')}>
          <Text style={tw('text-[9px] text-charcoal mb-1')}>Présents sur site</Text>
          <Text style={tw('text-sm font-bold text-success')}>
            {data.reduce((acc, curr) => acc + curr.count, 0)}
          </Text>
        </View>
        <View style={tw('flex-1 p-3 items-center')}>
          <Text style={tw('text-[9px] text-charcoal mb-1')}>Absences constatées</Text>
          <Text style={tw('text-sm font-bold text-primary')}>
            {data.reduce((acc, curr) => acc + curr.countabsent, 0)}
          </Text>
        </View>
      </View>

      {/* Table Columns Header */}
      <View style={tw('flex-row bg-bone border-b border-hairline')}>
        <View style={tw('flex-[3] p-2')}>
          <Text style={tw('text-[8px] font-bold text-charcoal')}>Fonction</Text>
        </View>
        <View style={tw('flex-1 p-2 items-center border-l border-hairline')}>
          <Text style={tw('text-[8px] font-bold text-charcoal')}>P</Text>
        </View>
        <View style={tw('flex-1 p-2 items-center border-l border-hairline')}>
          <Text style={tw('text-[8px] font-bold text-charcoal')}>A</Text>
        </View>
      </View>

      {/* Table Rows */}
      <View>
        {data.map(({ count: pCount, func: fName, countabsent: aCount }, index) => (
          <View key={index} style={tw(`flex-row border-b border-hairline ${index % 2 === 0 ? 'bg-surface' : 'bg-canvas/50'}`)}>
            <View style={tw('flex-[3] p-2')}>
              <Text style={tw('text-[10px] text-ink')}>{fName || "N/A"}</Text>
            </View>
            <View style={tw('flex-1 p-2 items-center border-l border-hairline')}>
              <Text style={tw('text-[10px] font-bold text-ink')}>{pCount}</Text>
            </View>
            <View style={tw('flex-1 p-2 items-center border-l border-hairline')}>
              <Text style={tw(`text-[10px] font-bold ${aCount > 0 ? 'text-primary' : 'text-ash'}`)}>{aCount}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer / Caption */}
      <View style={tw('p-2 bg-bone/30')}>
        <Text style={tw('text-[6px] text-ash italic')}>Généré le {new Date().toLocaleDateString()} via TGCC Atlas</Text>
      </View>
    </View>
  );
};

export default PDFtable;
