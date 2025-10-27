
import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { InputMethod } from '../types';
import type { GeneratedQrCode } from '../types';
import { DEFAULT_MESSAGE } from '../constants';
import { WhatsAppIcon } from './icons';

interface SetupFormProps {
  onGenerate: (codes: GeneratedQrCode[]) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onGenerate }) => {
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.Simple);
  const [numTables, setNumTables] = useState('');
  const [tablePrefix, setTablePrefix] = useState('Table');
  const [tableList, setTableList] = useState('');
  const [customMessage, setCustomMessage] = useState(DEFAULT_MESSAGE);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setError('');

    if (!businessName || !whatsappNumber) {
      setError('Business Name and WhatsApp Number are required.');
      return;
    }

    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    if (cleanedNumber.length < 7) {
        setError('Please enter a valid WhatsApp number with country code.');
        return;
    }

    const generatedCodes: GeneratedQrCode[] = [];

    if (inputMethod === InputMethod.Simple) {
      const count = parseInt(numTables, 10);
      if (isNaN(count) || count <= 0) {
        setError('Please enter a valid number of tables.');
        return;
      }
      for (let i = 1; i <= count; i++) {
        const tableLabel = `${tablePrefix} ${i}`;
        const message = customMessage
          .replace('{table}', tableLabel)
          .replace('{business}', businessName);
        const qrValue = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`;
        generatedCodes.push({ label: tableLabel, qrValue });
      }
    } else {
      const labels = tableList.split('\n').filter(line => line.trim() !== '');
      if (labels.length === 0) {
        setError('Please enter at least one table label.');
        return;
      }
      labels.forEach(tableLabel => {
        const message = customMessage
          .replace('{table}', tableLabel.trim())
          .replace('{business}', businessName);
        const qrValue = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`;
        generatedCodes.push({ label: tableLabel.trim(), qrValue });
      });
    }

    if (generatedCodes.length > 0) {
      onGenerate(generatedCodes);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">Setup Your QR Codes</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">{error}</div>}

      <div className="space-y-6">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
          <input type="text" id="businessName" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g., The Cozy Cafe" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
        </div>
        
        <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <WhatsAppIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input type="tel" id="whatsappNumber" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="+1234567890" className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Include country code (e.g., +1 for USA)</p>
        </div>

        <div>
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button onClick={() => setInputMethod(InputMethod.Simple)} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${inputMethod === InputMethod.Simple ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>Simple</button>
            <button onClick={() => setInputMethod(InputMethod.List)} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${inputMethod === InputMethod.List ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>List</button>
          </div>
        </div>
        
        {inputMethod === InputMethod.Simple ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="numTables" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Number of Tables</label>
                <input type="number" id="numTables" value={numTables} onChange={e => setNumTables(e.target.value)} placeholder="e.g., 20" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="tablePrefix" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Table Label Prefix</label>
                <input type="text" id="tablePrefix" value={tablePrefix} onChange={e => setTablePrefix(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
              </div>
            </div>
             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Will be displayed as "{tablePrefix} 1", "{tablePrefix} 2", etc.</p>
          </div>
        ) : (
          <div>
            <label htmlFor="tableList" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Table Labels (one per line)</label>
            <textarea id="tableList" rows={5} value={tableList} onChange={e => setTableList(e.target.value)} placeholder={"Table 1\nTable 2\nPatio - Booth 5\nBar Seat 1"} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"></textarea>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Each line will generate a unique QR code. Use this for specific names.</p>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="customMessage" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Custom WhatsApp Message</label>
            <button onClick={() => setCustomMessage(DEFAULT_MESSAGE)} className="text-xs font-semibold text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1">
              <RefreshCw size={12} /> Reset Default
            </button>
          </div>
          <textarea id="customMessage" rows={4} value={customMessage} onChange={e => setCustomMessage(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"></textarea>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Use {'{table}'} and {'{business}'}. They will be replaced automatically.</p>
        </div>
      </div>

      <button onClick={handleGenerate} className="mt-8 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105">
        <Sparkles size={20} />
        Generate QR Codes
      </button>
    </div>
  );
};
