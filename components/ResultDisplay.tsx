
import React from 'react';
import type { PredictionResult } from '../types';
import { DescriptionIcon, DietIcon, MedicationIcon, PrecautionIcon, WorkoutIcon } from './icons';

interface ResultDisplayProps {
  result: PredictionResult;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="text-xl font-semibold text-cyan-300 ml-3">{title}</h3>
    </div>
    {children}
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center p-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-700">
        <h2 className="text-2xl font-bold text-slate-200">Potential Condition</h2>
        <p className="text-4xl font-extrabold mt-2 text-white">{result.disease}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InfoCard title="Description" icon={<DescriptionIcon className="h-7 w-7 text-cyan-400" />}>
            <p className="text-slate-300">{result.description}</p>
        </InfoCard>

        <InfoCard title="Precautions" icon={<PrecautionIcon className="h-7 w-7 text-cyan-400" />}>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                {result.precautions.map((precaution, index) => <li key={index}>{precaution}</li>)}
            </ul>
        </InfoCard>
        
        <InfoCard title="Medications" icon={<MedicationIcon className="h-7 w-7 text-cyan-400" />}>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                {result.medications.map((med, index) => <li key={index}>{med}</li>)}
            </ul>
        </InfoCard>

        <InfoCard title="Dietary Recommendations" icon={<DietIcon className="h-7 w-7 text-cyan-400" />}>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                {result.diet.map((d, index) => <li key={index}>{d}</li>)}
            </ul>
        </InfoCard>

        <InfoCard title="Workout Suggestions" icon={<WorkoutIcon className="h-7 w-7 text-cyan-400" />}>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                {result.workout.map((w, index) => <li key={index}>{w}</li>)}
            </ul>
        </InfoCard>

      </div>
    </div>
  );
};

export default ResultDisplay;
