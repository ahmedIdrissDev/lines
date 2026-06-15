import { ChatPanel } from '@/components/features/ai/chat-panel'

const page = () => {
  
  return (
   <div className='flex flex-col gap-4 p-4 h-[calc(100dvh-100px)]'>
            <ChatPanel />
   </div>
  )
}

export default page
