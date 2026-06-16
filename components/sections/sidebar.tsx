'use client'
import Button from './sidebar-button'
import Logo from '../ui/logo'
import { LayoutDashboard, Users, Construction, ShieldCheck, UserPlus, Settings, HelpCircle, MessageSquareDashed, File } from 'lucide-react'
import dynamic from 'next/dynamic'
import { store } from '@/store'


const Sidebar = () => {
  const { ProjectID } = store()

  return (
    <div className='w-full bg-white border-r border-hairline h-full flex flex-col justify-start gap-6 py-2'>
      <div className="w-full px-6 flex items-center ">
        <Logo />
      </div>
      
      <div className="flex flex-col gap-8 flex-1">
        <div className="flex flex-col gap-3">
          
          <div className="flex px-3 flex-col gap-1">
            <Button
              icon={<LayoutDashboard size={18} />}
              label='AI Agent'
              path='/dashboard'
            />
            
            <Button
              icon={<Users size={18} />}
              label='Gestion Bus'
              path='/bus'
            />
            <Button
              icon={<Construction size={18} />}
              label='Sous-traitants'
              path='/sous-traitants'
            />
             <Button
              icon={<File size={18} />}
              label='Rapport Général '
              path='/rapport-general'
            />
            <Button
              icon={<UserPlus size={18} />}
              label='Administration'
              path='/add'
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <div className="px-6">
            <span className='caption-tight text-ash uppercase tracking-widest'>Support</span>
          </div>
          <div className="flex px-3 flex-col gap-1">
            <Button
              icon={<Settings size={18} />}
              label='Paramètres'
              path='/settings'
            />
            <Button
              icon={<HelpCircle size={18} />}
              label='Aide'
              path='/help'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
