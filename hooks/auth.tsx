'use client'
import React from 'react'
import { SessionProvider } from "next-auth/react"

import type { Session } from 'next-auth'

interface AuthProviderProps{
    children:React.ReactNode ,
    session:Session | null
}
const Provider = ({children ,session }:AuthProviderProps) => {
  return (
    <SessionProvider session={session}>
        {children}
    </SessionProvider >
  )
}

export default Provider
