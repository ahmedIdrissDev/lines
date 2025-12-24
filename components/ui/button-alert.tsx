import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import React from 'react'

const Notification = () => {
    const { data } = useSession();
      const args = {
        email: data?.user?.email as string,
        userId: data?.user?._id as Id<"users">,
      };
      const emails = useQuery(api.functions.reception.reception, args);
      const unseens = emails?.filter(({seens})=> seens === false)
      if(unseens) return (
        <div className="w-"></div>
      )
  return (
    <div>Notification</div>
  )
}

export default Notification