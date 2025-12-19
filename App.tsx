import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QRGenerator } from './components/QRGenerator';
import { ErrorBoundary } from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <QRGenerator />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;