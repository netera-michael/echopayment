"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import 'tailwindcss/tailwind.css';
import { FaTimesCircle } from 'react-icons/fa';

const FailedPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <FaTimesCircle className="text-red-500 text-9xl mb-4" />
      <h1 className="text-4xl font-bold text-red-700 mb-4">Payment Failed</h1>
      <p className="text-lg text-red-700 mb-8">There was an issue processing your payment. Please
      try again.</p>
      <button 
        onClick={() => router.push('/')} 
        className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-800"
      >
        Home
      </button>
    </div>
  );
};

export default FailedPage;
