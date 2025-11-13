
'use client'
import React from "react";
import ReactMarkdown from "react-markdown";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import remarkGfm from "remark-gfm";
import Image from "next/image";

const styles = StyleSheet.create({
  page: { padding: 30 },
  heading: { fontSize: 16, marginBottom: 14 , color:'#000' },
  paragraph: { fontSize: 13, marginBottom: 6 },
  table: { display: "flex", width: "auto", marginBottom: 10 },
  row: { flexDirection: "row" },
  cell: { width: "25%", border: "1pt solid #ccc", padding: 4, fontSize: 10 },
   bold: {  fontSize:8},
  italic: { fontStyle: "italic" },
  paragraph: { fontSize: 10, marginBottom: 6 },
     image: { width: 120, height: 60, marginVertical: 8, objectFit: "contain" },

});

const Doc = ({ markdown }: { markdown: string }) => {
  const components = {
    h1: ({ children }: any) => <Text style={styles.heading}>{children}</Text>,
    h2: ({ children }: any) => <Text style={[styles.heading, { fontSize: 16 }]}>{children}</Text>,
    p: ({ children }: any) => <Text style={styles.paragraph}>{children}</Text>,
    table: ({ children }: any) => <View style={styles.table}>{children}</View>,
    tr: ({ children }: any) => <View style={styles.row}>{children}</View>,
    td: ({ children }: any) => <Text style={styles.cell}>{children}</Text>,
    th: ({ children }: any) => <Text style={[styles.cell, { fontWeight: "bold" }]}>{children}</Text>,
    li: ({ children }: any) => <Text style={styles.paragraph}> {children}</Text>,
    strong: ({ children }: any) => <Text style={styles.bold}>{children}</Text>,
  em: ({ children }: any) => <Text style={styles.italic}>{children}</Text>,
  p: ({ children }: any) => <Text style={styles.paragraph}>{children}</Text>,
  };

  return (
    <Document>
      <Page style={styles.page}>
        <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </Page>
    </Document>
  );
};

export default  Doc