"use client";
import { ArrowUpFromLine, FileChartLine } from "lucide-react";
import { AnimatePresence  , motion} from "motion/react";
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import { store } from "@/store";
import { Document, Page, PDFDownloadLink, View } from "@react-pdf/renderer";
import PDFtable from "./pdfcomponent";
import { createTw } from "react-pdf-tailwind";
import { button } from "motion/react-client";
import { fa } from "zod/v4/locales";

const tw = createTw({
  fontFamily: {
    sans: ["Papyrus"],
  },
  colors: {
    custom: "#bada55",
  },
});

const PDF = () => {
  const [open, setOpen] = useState(false);
  const openclose = () =>{
    setgenerate(false)
    open ? setOpen(false) : setOpen(true)
  } 
  const [ generate , setgenerate ]= useState<Boolean>(false)
    
  return (
    <>
      <button onClick={openclose} className='w-40 h-11 bg-white border border-neutral-200  flex justify-center items-center gap-2'> <ArrowUpFromLine/> Export pdf</button>

      <AnimatePresence>


      {open && (
        <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
          <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
           className="bg-white flex justify-center  items-center overflow-y-auto py-3 flex-col gap-1.5  p-2 w-90 h-max rounded-md border border-neutral-200">
            <Image src={'/teamwork.png'} width={1000} height={1000} alt="logo" className="w-60" />
            <h1>Créer un PDF facilement</h1>
            <div className="flex justify-center gap-2.5 items-center">
              <button onClick={openclose} className="w-30 h-10 border border-neutral-200 rounded-md">annuler</button>
              {
                generate ?
              <PDFDownloadLink document={<Doc/>} className="w-40 h-10 flex justify-center items-center bg-tgcc-500 text-white rounded-md cursor-pointer" fileName="effi.pdf">
                                    {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}

              
              </PDFDownloadLink> :

              <button onClick={e=> setgenerate(true)} className="w-40 h-10 flex justify-center items-center bg-tgcc-500 text-white rounded-md cursor-pointer" >
                Créer un PDF 
              </button>
              }

 
            </div>
          </motion.div>
        </div>
      )}
  </AnimatePresence>

    </>
  );
};

export default PDF;


function Doc(){
   const {data} = store()
    const newdata = Object.groupBy(data , ({siteManger})=> siteManger )
    const mapped = Object.entries(newdata).map(([siteManger, data]) => ({
  siteManger,
  count: data?.length,
  present: data ,
  Absent: data?.filter( ({status}) => status==='inactive'),
}));
  
  return <>
  <Document  style={tw('w-full h-max')}>

<Page  size="A3" style={tw('w-full h-max  w-full h-full flex flex-row flex-wrap  items-start gap-2 rounded-md p-3 rounded-md')}>
           {mapped.splice(0 , 8).map((data , index)=>(
            <PDFtable key={index} {...data} />
        ) )}

</Page>

  </Document>
  </>
}