'use client'
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { createTw } from "react-pdf-tailwind";
import PDFtable from '@/components/kits/pdfcomponent';

const tw = createTw({
  fontFamily: {
    sans: ["Papyrus"],
  },
  colors: {
    custom: "#bada55",
  },
});



const page = () => {
  return (
    <div className='w-full h-dvh'>
      <PDFViewer width={'100%'} height={'100%'}>
      <MyDocument/>
      </PDFViewer>
        
      <PDFDownloadLink document={<MyDocument/>} fileName='effictis.pdf' >
        <span>save</span>
      </PDFDownloadLink>

    </div>
  )
}

export default page


const MyDocument = () => (

  <Document  style={tw('w-full h-dvh')}>

<Page style={tw('w-full h-full border p-3 border-blue-500 rounded-md')}>
  <View
    style={tw(
      // Flex layout that wraps into multiple rows
      'w-full h-full flex flex-row flex-wrap justify-between items-start gap-2 rounded-md'
    )}
  >
    <PDFtable />
    <PDFtable />
    <PDFtable />
    <PDFtable />
    <PDFtable />
    <PDFtable />


  </View>
</Page>

  </Document>
);

