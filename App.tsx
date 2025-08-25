
import React, { useState, useCallback } from 'react';
import type { PredictionResult } from './types';
import { getDiseasePrediction } from './services/geminiService';
import SymptomSelector from './components/SymptomSelector';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { SYMPTOMS } from './constants';
import { MedicalIcon } from './components/icons';

const App: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckSymptoms = useCallback(async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await getDiseasePrediction(selectedSymptoms);
      setResult(prediction);
    } catch (err) {
      console.error(err);
      setError('Failed to get a prediction. The AI model may be overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSymptoms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-4">
             <MedicalIcon className="h-12 w-12 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              AI Symptom Checker
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Select your symptoms from the list below and our AI will provide potential insights.
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-xl shadow-2xl shadow-slate-950/50 p-6 md:p-8 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Select Your Symptoms</h2>
            <SymptomSelector
              allSymptoms={SYMPTOMS}
              selectedSymptoms={selectedSymptoms}
              setSelectedSymptoms={setSelectedSymptoms}
            />
            <div className="mt-6 text-center">
              <button
                onClick={handleCheckSymptoms}
                disabled={isLoading || selectedSymptoms.length === 0}
                className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 shadow-lg"
              >
                {isLoading ? 'Analyzing...' : 'Check Symptoms'}
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="mt-8 flex justify-center">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <p>{error}</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="mt-10">
              <ResultDisplay result={result} />
            </div>
          )}

          <footer className="mt-12 text-center text-slate-500 text-sm p-4 bg-slate-900/30 rounded-lg">
            <p className="font-bold text-amber-400">Disclaimer:</p>
            <p>This AI Symptom Checker is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
