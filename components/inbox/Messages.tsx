import React from 'react'

const Messages = () => {
  return (
    <div className='w-full rounded-xl h-full bg-white border border-neutral-100'>
        <div className="p-2">
            <h2>Inbox</h2>
        </div>
        <div className="border-t p-2 flex flex-col gap-2 border-neutral-100">
            <div className="flex items-center w-full gap-1.5">
                <div className="w-11 h-11 rounded-full bg-neutral-100"></div>
                <div className="w-full flex flex-col gap-1">
                            <div className="w-full h-4 bg-neutral-100 rounded-2xl"></div>
                            <div className="w-1/2 h-2 bg-neutral-100 rounded-2xl"></div>

                </div>

            </div>
                        <div className="flex items-center w-full gap-1.5">
                <div className="w-11 h-11 rounded-full bg-neutral-100"></div>
                <div className="w-full flex flex-col gap-1">
                            <div className="w-full h-4 bg-neutral-100 rounded-2xl"></div>
                            <div className="w-1/2 h-2 bg-neutral-100 rounded-2xl"></div>

                </div>

            </div>

        </div>
    </div>
  )
}

export default Messages