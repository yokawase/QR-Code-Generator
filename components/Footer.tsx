import React from 'react';

export const Footer = () => {
  return (
    <footer className="p-4 text-center text-slate-400 text-xs">
      <p>&copy; {new Date().getFullYear()} QR Generator App. Runs locally in your browser.</p>
    </footer>
  );
};