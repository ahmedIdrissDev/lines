'use client'
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
const Testpdf = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const element = targetRef.current;
    const canvas = await html2canvas(element)
    // const data = canvas.toDataURL('image/png')
    console.log(canvas)
  };

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download PDF</button>

      <div
        ref={targetRef}
        style={{
          padding: 20,
          backgroundColor: '#f9f9f9',
          width: 500,
          marginTop: 20,
        }}
      >
        <h1>Hello, PDF!</h1>
        <p>This content will be included in the generated PDF.</p>
      </div>
    </div>
  );
};

export default Testpdf;
