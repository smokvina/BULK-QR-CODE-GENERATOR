
import React from 'react';
import { QrCode } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl text-white text-center relative overflow-hidden h-64 flex flex-col items-center justify-center">
        <div className="absolute -top-10 -left-10 text-white/10">
            <QrCode size={180} strokeWidth={1}/>
        </div>
        <div className="absolute -bottom-12 -right-8 text-white/10 rotate-12">
            <QrCode size={150} strokeWidth={1}/>
        </div>
        <div className="z-10">
            <h1 className="text-4xl font-bold tracking-tight">QR Code Generator</h1>
            <p className="mt-2 text-purple-200 max-w-md mx-auto">
                Create unique WhatsApp QR codes for every table in your restaurant or bar.
            </p>
        </div>
    </header>
  );
};
