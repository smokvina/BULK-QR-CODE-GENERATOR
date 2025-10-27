import React from 'react';
import * as QRCodeReact from 'qrcode.react';
import { Download, ArrowLeft } from 'lucide-react';
import type { GeneratedQrCode } from '../types';

// Handle potential CJS/ESM module interop issues from CDN
const QRCode = (QRCodeReact as any).default || QRCodeReact;


// Declare global types for libraries loaded from CDN
declare global {
  interface Window {
    JSZip: any;
    saveAs: (blob: Blob, filename: string) => void;
  }
}

interface ResultsScreenProps {
  codes: GeneratedQrCode[];
  onBack: () => void;
}

const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const QrCodeItem: React.FC<{ code: GeneratedQrCode }> = ({ code }) => {
  const downloadId = `qr-canvas-${slugify(code.label)}`;

  const handleSaveIndividual = () => {
    const canvas = document.getElementById(downloadId) as HTMLCanvasElement;
    if (canvas) {
      canvas.toBlob((blob) => {
        if(blob) {
            window.saveAs(blob, `${slugify(code.label)}.png`);
        }
      });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg flex flex-col items-center text-center">
      <div className="bg-white p-2 rounded-md shadow-sm">
        <QRCode id={downloadId} value={code.qrValue} size={160} level="H" renderAs="canvas" />
      </div>
      <p className="mt-3 font-semibold text-slate-800 dark:text-slate-100 break-all">{code.label}</p>
      <button onClick={handleSaveIndividual} className="mt-3 text-sm bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium py-1 px-3 rounded-full flex items-center gap-1.5 transition-colors">
        <Download size={14} /> Save
      </button>
    </div>
  );
};


export const ResultsScreen: React.FC<ResultsScreenProps> = ({ codes, onBack }) => {

  const handleSaveAll = async () => {
    if (!window.JSZip || !window.saveAs) {
      alert("Required libraries for zipping are not loaded.");
      return;
    }

    const zip = new window.JSZip();

    codes.forEach(code => {
      const canvas = document.getElementById(`qr-canvas-${slugify(code.label)}`) as HTMLCanvasElement;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        // We need to strip the `data:image/png;base64,` part
        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        zip.file(`${slugify(code.label)}.png`, base64Data, { base64: true });
      }
    });

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      window.saveAs(content, 'qr-codes.zip');
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Setup
        </button>
        <button onClick={handleSaveAll} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
          <Download size={16} /> Save All
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">Generated QR Codes ({codes.length})</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {codes.map((code) => (
          <QrCodeItem key={code.label} code={code} />
        ))}
      </div>
    </div>
  );
};