import React from 'react';
import { QrCode } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
      <div className="max-w-md mx-auto flex items-center justify-center gap-2">
        <QrCode className="text-indigo-600 w-8 h-8" />
        <h1 className="text-xl font-bold tracking-tight">QR Generator</h1>
      </div>
    </header>
  );
};