import { useUser } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

const Title = async  () => {
  const user=  await currentUser()
  return(
    <div className='py-4 flex items-center '>
      <div className="">
       <h1 className='text-2xl'>HR {user?.fullName} </h1>
       <p>Manage your team like a pro</p>
      </div>
      
    </div>
  )
}

export default Title
