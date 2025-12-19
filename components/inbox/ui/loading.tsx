import React from 'react'

const Loading = () => {
  return (
<div className="flex animate-pulse items-center w-full gap-1.5">
                <div className="w-11 h-11 rounded-full bg-neutral-100"></div>
                <div className="w-full flex flex-col gap-1">
                            <div className="w-full h-4 bg-neutral-100 rounded-2xl"></div>
                            <div className="w-1/2 h-2 bg-neutral-100 rounded-2xl"></div>

                </div>

            </div>  )
}

export default Loading