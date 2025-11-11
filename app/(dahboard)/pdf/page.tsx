'use client'
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
const styles = StyleSheet.create({
  page: { padding: 30 , border:'1px #bcbcbc solid' , borderRadius:12  , height:100 },
  section: {padding: 30 , border:'1px #bcbcbc solid' , borderRadius:12  , height:100 , paddingHorizontal:4 , paddingVertical:4},
  title: { fontSize: 20, fontWeight: 'bold' },
  text: { fontSize: 12 },
  tables:{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 10,
  padding: 10,
  backgroundColor: '#f0f0f0',
}
});


const page = () => {
  return (
    <div className='w-full h-dvh'>
      <PDFDownloadLink document={<MyDocument/>} fileName='effictis.pdf' >
        <span>save</span>
      </PDFDownloadLink>

    </div>
  )
}

export default page


const MyDocument = () => (

  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Créer un PDF facilement</Text>
        <Text style={styles.text}>
          Découvrez comment créer un fichier PDF en quelques étapes simples et le télécharger.
        </Text>
      </View>
      <View style={styles.tables}>

      </View>
    </Page>
  </Document>
);

