"use client";
import { FileDown, FileText, X, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import Image from "next/image";
import { store } from "@/store";
import { Document, Page, PDFDownloadLink } from "@react-pdf/renderer";
import PDFtable from "./pdf-component";
import { createTw } from "react-pdf-tailwind";
import { Button } from "@/components/ui/button";

const tw = createTw({
  fontFamily: {
    sans: ["Helvetica"],
  },
  colors: {
    primary: "#7E1212",
    ink: "#202020",
    canvas: "#f9f7f3",
    hairline: "rgba(32, 32, 32, 0.12)",
    charcoal: "#575757",
  },
});

const PDF = () => {
  const [open, setOpen] = useState(false);
  const [generate, setgenerate] = useState<boolean>(false);

  const openclose = () => {
    setgenerate(false);
    setOpen(!open);
  };

  return (
    <>
      <button 
        onClick={openclose} 
        className='w-11 h-11 flex justify-center items-center rounded-sm hover:bg-surface-bone transition-colors cursor-pointer text-ink'
        title="Exporter en PDF"
      > 
        <FileText className="w-5 h-5" /> 
      </button>

      <AnimatePresence>
        {open && (
          <div className="w-full bg-neutral-950/15 flex justify-center items-center z-40 h-full fixed inset-0">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-surface-card overflow-hidden rounded-md w-[440px] shadow-2xl border border-hairline"
            >
              <div className="flex justify-between items-center p-6 border-b border-hairline bg-canvas">
                <h2 className="heading-sm text-ink">Exporter le rapport</h2>
                <button onClick={openclose} className="p-2 hover:bg-surface-bone rounded-full transition-colors text-charcoal cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 flex flex-col items-center text-center gap-8">
                <div className="relative w-56 h-56 flex justify-center items-center bg-canvas rounded-full">
                   <Image 
                    src={'/teamwork.png'} 
                    width={500} 
                    height={500} 
                    alt="preview" 
                    className="w-40 drop-shadow-xl" 
                  />
                </div>

                <div className="space-y-3 px-4">
                  <h3 className="heading-md text-ink">Prêt à générer</h3>
                  <p className="body-sm text-charcoal leading-relaxed">
                    Le document contiendra le résumé complet des effectifs par responsable de site et par fonction pour la période sélectionnée.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-canvas border-t border-hairline flex gap-4">
                <button 
                  onClick={openclose} 
                  className="btn-outline flex-1"
                >
                  Annuler
                </button>
                {generate ? (
                  <PDFDownloadLink 
                    document={<Doc />} 
                    className="btn-primary flex-1 no-underline" 
                    fileName={`Rapport_Effectif_${new Date().toLocaleDateString()}.pdf`}
                  >
                    {({ loading }) => loading ? "Préparation..." : "Télécharger"}
                  </PDFDownloadLink>
                ) : (
                  <button 
                    onClick={() => setgenerate(true)} 
                    className="btn-primary flex-1"
                  >
                    Générer le PDF
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PDF;

function Doc() {
  const { data } = store();
  const newdata = Object.groupBy(data, ({ siteManger }) => siteManger);
  const mapped = Object.entries(newdata).map(([siteManger, data]) => ({
    siteManger,
    count: data?.length || 0,
    present: data || [],
    Absent: (data || []).filter(({ status }) => status === 'inactive'),
  }));

  return (
    <Document title="Rapport d'Effectif TGCC">
      <Page size="A3" style={tw('bg-canvas p-12 flex flex-col gap-8')}>
        {mapped.slice(0, 10).map((data, index) => (
          <PDFtable key={index} {...data} />
        ))}
      </Page>
    </Document>
  );
}