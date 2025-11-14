import { FileChartLine } from 'lucide-react'
import Moderh from './kits/hrmode'
import PDF from './kits/pdf'

const Title = async  () => {
  return(
    <div className='py-4 flex justify-between items-center '>
      <div className="">
       <h1 className=''>Présence</h1>
       <p>Effectif total actuellement disponible </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Moderh/>
        <PDF/>
      </div>
    </div>
  )
}

export default Title
