import React from 'react';
import { SunIcon } from '@heroicons/react/solid';

export default function Loading() {
  return (
<div
      className="min-h-screen bg-gradient-to-br from-[#394F68] to-[#183B7E]
    p-10 flex flex-col justify-center text-slate-500 "
    >

        <SunIcon
        className='h-24 w-24 animate-bounce text-yellow-500'
        />
    <h1
    className="text-6xl font-bold text-center mb-10 animate-pulse"
    >Loading City Weather Information</h1>
    <h2
    className="text-xl font-bold text-center mb-10 animate-pulse"
    >Hold on we are are crunching numbers & generating AI summary of the weather</h2>
    </div>
  );
}
