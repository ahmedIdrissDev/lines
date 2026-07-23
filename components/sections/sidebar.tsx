'use client'
import Button from './sidebar-button'
import Logo from '../ui/logo'
import { LayoutDashboard, Construction, UserPlus, Settings, HelpCircle, File, Bus, Building2 } from 'lucide-react'


const Sidebar = () => {
  return (
    <div className='w-full bg-canvas border-r border-hairline h-full flex flex-col justify-start gap-5 py-4'>
      <div className="w-full px-5 flex items-center ">
        <Logo />
      </div>
      
      <div className="flex flex-col gap-6 flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-3">
          <div className="px-2">
            <span className='caption-tight text-ash'>Modules métier</span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              icon={<LayoutDashboard size={18} />}
              label='Gestion personnel'
              path='/personnel'
              moduleCode='HCM'
            />
            
            <Button
              icon={<Bus size={18} />}
              label='Gestion Bus'
              path='/bus'
              moduleCode='TRN'
            />
            <Button
              icon={<Building2 size={18} />}
              label='Chantier'
              path='/chantier'
              moduleCode='PRJ'
            />
            <Button
              icon={<Construction size={18} />}
              label='Sous-traitants'
              path='/sous-traitants'
              moduleCode='SUB'
            />
             <Button
              icon={<File size={18} />}
              label='Rapport Général '
              path='/rapport-general'
              moduleCode='RPT'
            />
            <Button
              icon={<UserPlus size={18} />}
              label='Administration'
              path='/add'
              moduleCode='ADM'
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <div className="px-2">
            <span className='caption-tight text-ash'>Support</span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              icon={<Settings size={18} />}
              label='Paramètres'
              path='/settings'
              moduleCode='CFG'
            />
            <Button
              icon={<HelpCircle size={18} />}
              label='Aide'
              path='/help'
              moduleCode='HLP'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
