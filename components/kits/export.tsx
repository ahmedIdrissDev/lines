import { PDFDownloadLink } from '@react-pdf/renderer'
import React from 'react'
import Doc from './doc'
import { FileText } from 'lucide-react'

const Export = ({text}:{text:string}) => {
  return (
                          <div className="w-96 h-70 border gap-2 border-neutral-200 p-3  flex flex-col justify-between rounded-2xl">
                        <div className="flex border border-neutral-200 h-full rounded-xl justify-center items-center">
                          <FileText/>
                        </div>
                        <PDFDownloadLink document={<Doc markdown={text} />}>

                       <button className="w-full cursor-pointer h-12 bg-tgcc-600 text-white rounded-md">save as pdf</button>
      </PDFDownloadLink>
                       </div>
  )
}

export default Export
