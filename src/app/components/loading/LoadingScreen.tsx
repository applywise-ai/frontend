'use client';

import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-900 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900 z-0"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <Image 
          src="/images/logo_icon.png"
          alt="Logo"
          width={80}
          height={80}
          className="animate-pulse"
        />
        <div className="h-2 w-32 bg-white/20 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
} 