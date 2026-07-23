'use client'
import { UserButton } from '@clerk/nextjs'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import ProjectSelect from '../features/projects/project-selector'
import Logo from '../ui/logo'
import { Input } from '../ui/input'

const modules = [
  { code: 'HCM', label: 'Gestion personnel', path: '/personnel' },
  { code: 'TRN', label: 'Gestion Bus', path: '/bus' },
  { code: 'PRJ', label: 'Chantier', path: '/chantier' },
  { code: 'SUB', label: 'Sous-traitants', path: '/sous-traitants' },
  { code: 'RPT', label: 'Rapport Général', path: '/rapport-general' },
  { code: 'ADM', label: 'Administration', path: '/add' },
  { code: 'CFG', label: 'Paramètres', path: '/settings' },
]


const Navbar = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const filteredModules = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return modules

    return modules.filter((module) =>
      `${module.code} ${module.label}`.toLowerCase().includes(query),
    )
  }, [search])

  const navigateToModule = (path: string) => {
    setSearch('')
    setIsSearchOpen(false)
    router.push(path)
  }

  return (
    <div className='flex px-4 md:px-8 h-15 justify-between items-center gap-4 w-full'>
      <Logo />
      <div className="relative hidden w-full max-w-2xl md:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ash" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setIsSearchOpen(true)
          }}
          onFocus={() => setIsSearchOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && filteredModules[0]) {
              navigateToModule(filteredModules[0].path)
            }
            if (event.key === 'Escape') {
              setIsSearchOpen(false)
            }
          }}
          className="h-12 rounded-full bg-surface-card pl-12 text-base"
          placeholder="Rechercher un module"
        />
        {isSearchOpen && search.trim() ? (
          <div className="absolute left-0 right-0 top-14 rounded-md border border-hairline bg-surface-card p-2">
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <button
                  key={module.code}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => navigateToModule(module.path)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 text-left hover:bg-canvas"
                >
                  <span className="body-sm text-ink">{module.label}</span>
                  <span className="rounded-sm border border-hairline px-2 py-0.5 code-sm text-ash">
                    {module.code}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-3 body-sm text-ash">
                Aucun module trouvé.
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <ProjectSelect />
       
        <UserButton/>
      </div>
    </div>
  )
}

export default Navbar
