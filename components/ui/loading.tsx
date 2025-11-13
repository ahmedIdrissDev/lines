import React from 'react'

const Loading = () => {
  return (
    <div className='w-60 h-30 rounded-2xl flex justify-center items-center'>
        <div className="w-5 h-5 bg-black rounded-full animate-caret-blink"/>
        <span>waiting ...</span>
    </div>
  )
}

export default Loading
