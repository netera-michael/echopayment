"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <FaCheckCircle className="text-green-500 text-9xl mb-4" />
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful</h1>
      <p className="text-lg text-green-700 mb-8">Your payment has been processed successfully.</p>
      <button 
        onClick={() => router.push('/')} 
        className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-800"
      >
        Home
      </button>
    </div>
  );
};

export default SuccessPage;
