
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SetupForm } from './components/SetupForm';
import { ResultsScreen } from './components/ResultsScreen';
import { FeatureCard } from './components/FeatureCard';
import type { GeneratedQrCode } from './types';
import { Zap, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedQrCode[] | null>(null);

  const handleGenerate = useCallback((codes: GeneratedQrCode[]) => {
    setGeneratedCodes(codes);
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setGeneratedCodes(null);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <main className="max-w-2xl mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-[-64px] z-10 relative">
          {generatedCodes ? (
            <ResultsScreen codes={generatedCodes} onBack={handleBack} />
          ) : (
            <>
              <SetupForm onGenerate={handleGenerate} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <FeatureCard
                  icon={<Zap className="w-6 h-6 text-purple-500" />}
                  title="Instant Generation"
                  description="Create dozens of unique QR codes in seconds. No waiting, no hassle."
                />
                <FeatureCard
                  icon={<LayoutGrid className="w-6 h-6 text-purple-500" />}
                  title="Flexible & Custom"
                  description="Use simple numbering or define custom names for tables, patios, or bar seats."
                />
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-sm text-slate-500">
        <p>Powered by React & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App;
