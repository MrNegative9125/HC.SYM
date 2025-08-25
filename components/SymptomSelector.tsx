
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, XIcon } from './icons';

interface SymptomSelectorProps {
  allSymptoms: string[];
  selectedSymptoms: string[];
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ allSymptoms, selectedSymptoms, setSelectedSymptoms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredSymptoms = allSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex flex-wrap gap-2 p-2 border-2 border-slate-600 rounded-lg bg-slate-900 min-h-[50px] cursor-text" onClick={() => setIsOpen(true)}>
        {selectedSymptoms.map(symptom => (
          <span key={symptom} className="flex items-center bg-cyan-800/50 text-cyan-200 text-sm font-medium px-3 py-1 rounded-full">
            {symptom}
            <button onClick={(e) => { e.stopPropagation(); removeSymptom(symptom); }} className="ml-2 text-cyan-200 hover:text-white">
              <XIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
        {!selectedSymptoms.length && (
            <span className="text-slate-500 self-center px-2">Click to select symptoms...</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
          <div className="p-2 sticky top-0 bg-slate-800">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="Search symptoms..."
                className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto p-2">
            {filteredSymptoms.map(symptom => (
              <li
                key={symptom}
                className="px-4 py-2 hover:bg-slate-700 rounded-md cursor-pointer flex items-center"
                onClick={() => handleSelectSymptom(symptom)}
              >
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  readOnly
                  className="h-4 w-4 bg-slate-700 border-slate-500 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
                <span className="ml-3">{symptom}</span>
              </li>
            ))}
            {filteredSymptoms.length === 0 && (
                <li className="px-4 py-2 text-slate-500">No symptoms found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SymptomSelector;
