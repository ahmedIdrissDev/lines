import { clerkClient } from '@clerk/nextjs/server'
import React from 'react'

const UsersList = async () => {

    const client = await clerkClient()
    const users = await client.users.getUserList()
  return (
    <div>
      
    </div>
  )
}

export default UsersList
