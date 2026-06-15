'use client'
import React from 'react'
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ConvexReactClient } from "convex/react"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ 
      theme: 'simple',
      variables: {
        colorPrimary: '#c01c28',
      }
    }}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
