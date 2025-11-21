'use client'
import React from 'react'
import { SessionProvider } from "next-auth/react"

import type { Session } from 'next-auth'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

interface AuthProviderProps{
    children:React.ReactNode ,
    session:Session | null
}
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const Provider = ({children ,session }:AuthProviderProps) => {
  return (
    <SessionProvider session={session}>
 <ConvexProvider client={convex}>{children}</ConvexProvider>;

    </SessionProvider >
  )
}

export default Provider
