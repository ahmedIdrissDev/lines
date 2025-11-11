'use client'
import { store } from '@/store'
import React, { useRef } from 'react'
import Customchart from './customchart'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

const Pdfgenerate = () => {
    const {data} = store()
    const newdata = Object.groupBy(data , ({lot})=> lot )
    const mapped = Object.entries(newdata).map(([lot, data]) => ({
  lot,
  count: data?.length,
  present: data?.filter( ({status}) => status==='active') ,
  Absent: data?.filter( ({status}) => status==='inactive'),
}));
const ref = useRef<HTMLDivElement>(null);

  const convertToPDF = async () => {
    try {
      if (ref.current) {
        const element = ref.current;

        const canvas = await html2canvas(element, {
          backgroundColor: null, 
          scale: 10,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        const x = (pdfWidth - imgWidth * ratio) / 2;
        const y = 20; // small top margin

        pdf.addImage(
          imgData,
          "PNG",
          x,
          y,
          imgWidth * ratio,
          imgHeight * ratio
        );

        pdf.save("download.pdf");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
    console.log(newdata)
  return (
    <>
    <button onClick={convertToPDF}>gene</button>
    <div ref={ref} className='w-full p-3 rounded-2xl h-full gap-2.5   grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-2'>
        {mapped.map((data , index)=>(
          <Customchart key={index} {...data} />
        ) )}
    </div>
    </>
  )
}

export default Pdfgenerate
