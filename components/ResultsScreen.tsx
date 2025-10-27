import React from 'react';
import * as QRCodeReact from 'qrcode.react';
import { Download, ArrowLeft } from 'lucide-react';
import type { GeneratedQrCode } from '../types';
import { WHATSAPP_LOGO_BASE64 } from './icons';

// The qrcode.react library exports specific components like QRCodeCanvas.
// This directly accesses the correct component from the imported module.
const QRCodeCanvas = (QRCodeReact as any).QRCodeCanvas;


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
  businessName: string;
}

const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// Helper function to draw the elegant frame
const drawElegantFrame = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const cornerRadius = 20;
    const inset = 10;
    
    ctx.strokeStyle = '#4A5568'; // Darker, more professional slate gray
    ctx.lineWidth = 2; // Slightly thicker for more presence

    ctx.beginPath();
    
    // Top-left
    ctx.moveTo(x + cornerRadius + inset, y);
    ctx.lineTo(x + cornerRadius, y);
    ctx.arcTo(x, y, x, y + cornerRadius, cornerRadius);
    ctx.lineTo(x, y + cornerRadius + inset);

    // Top-right
    ctx.moveTo(x + width - cornerRadius - inset, y);
    ctx.lineTo(x + width - cornerRadius, y);
    ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
    ctx.lineTo(x + width, y + cornerRadius + inset);

    // Bottom-left
    ctx.moveTo(x, y + height - cornerRadius - inset);
    ctx.lineTo(x, y + height - cornerRadius);
    ctx.arcTo(x, y + height, x + cornerRadius, y + height, cornerRadius);
    ctx.lineTo(x + cornerRadius + inset, y + height);

    // Bottom-right
    ctx.moveTo(x + width, y + height - cornerRadius - inset);
    ctx.lineTo(x + width, y + height - cornerRadius);
    ctx.arcTo(x + width, y + height, x + width - cornerRadius, y + height, cornerRadius);
    ctx.lineTo(x + width - cornerRadius - inset, y + height);

    ctx.stroke();
};


const QrCodeItem: React.FC<{ code: GeneratedQrCode; businessName: string; }> = ({ code, businessName }) => {
    const compositeCanvasId = `composite-canvas-${slugify(code.label)}`;
    const qrCanvasId = `qr-canvas-${slugify(code.label)}`;
    const compositeCanvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            const compositeCanvas = compositeCanvasRef.current;
            const qrCanvas = document.getElementById(qrCanvasId) as HTMLCanvasElement;

            if (compositeCanvas && qrCanvas) {
                const ctx = compositeCanvas.getContext('2d');
                if (!ctx) return;

                const width = 280;
                const height = 360;
                
                // Layout configuration
                const qrSize = 180;
                const framePadding = 10;
                const frameWidth = qrSize + framePadding * 2;
                const frameHeight = qrSize + framePadding * 2;
                const frameX = (width - frameWidth) / 2;
                const frameY = 70;
                const qrX = frameX + framePadding;
                const qrY = frameY + framePadding;

                compositeCanvas.width = width;
                compositeCanvas.height = height;

                // 1. Draw background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);

                // 2. Draw Business Name (Top)
                ctx.fillStyle = '#1E293B'; // Dark Slate
                ctx.font = 'bold 24px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(businessName, width / 2, 45, width - 40);
                
                // 3. Add a subtle shadow for depth
                ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetY = 5;
                
                // Draw a white rectangle for the frame to sit on, this will cast the shadow
                ctx.fillStyle = 'white';
                ctx.fillRect(frameX, frameY, frameWidth, frameHeight);

                // Reset shadow for other elements
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                // 4. Draw Elegant Frame on top of the white rectangle
                drawElegantFrame(ctx, frameX, frameY, frameWidth, frameHeight);

                // 5. Draw QR Code (Center) inside the frame
                ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

                // 6. Draw Table Label (Bottom)
                ctx.fillStyle = '#1E293B'; // Dark Slate
                ctx.font = 'bold 20px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(code.label, width / 2, height - 35, width - 40);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [code, businessName, qrCanvasId]);

    const handleSaveIndividual = () => {
        const canvas = compositeCanvasRef.current;
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob) {
                    window.saveAs(blob, `${slugify(businessName)}-${slugify(code.label)}.png`);
                }
            });
        }
    };

    // Props for the hidden QRCodeCanvas, configured for optimal scannability
    const qrCodeProps = {
        id: qrCanvasId,
        value: code.qrValue,
        size: 180, // Match the qrSize used in canvas drawing
        level: 'H' as const, // Highest error correction level
        imageSettings: {
            src: WHATSAPP_LOGO_BASE64,
            height: 36, // Scaled logo size
            width: 36,
            excavate: true, // Ensures space is cleared for the logo
        },
    };

    return (
        <div className="flex flex-col items-center text-center">
            <canvas ref={compositeCanvasRef} id={compositeCanvasId} className="bg-white rounded-lg shadow-sm w-full h-auto aspect-[280/360]" />

            {/* Hidden QRCodeCanvas to generate the QR data */}
            <div style={{ display: 'none' }}>
                {QRCodeCanvas ? <QRCodeCanvas {...qrCodeProps} /> : null}
            </div>
            
            <p className="mt-3 font-semibold text-slate-800 dark:text-slate-100 break-all">{code.label}</p>
            <button onClick={handleSaveIndividual} className="mt-2 text-sm bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium py-1 px-3 rounded-full flex items-center gap-1.5 transition-colors">
                <Download size={14} /> Save
            </button>
        </div>
    );
};


export const ResultsScreen: React.FC<ResultsScreenProps> = ({ codes, onBack, businessName }) => {

  const handleSaveAll = async () => {
    if (!window.JSZip || !window.saveAs) {
      alert("Required libraries for zipping are not loaded.");
      return;
    }

    const zip = new window.JSZip();
    const sanitizedBusinessName = slugify(businessName);

    codes.forEach(code => {
      const canvas = document.getElementById(`composite-canvas-${slugify(code.label)}`) as HTMLCanvasElement;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        zip.file(`${sanitizedBusinessName}-${slugify(code.label)}.png`, base64Data, { base64: true });
      }
    });

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      window.saveAs(content, `${sanitizedBusinessName}-qr-codes.zip`);
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {codes.map((code) => (
          <QrCodeItem key={code.label} code={code} businessName={businessName} />
        ))}
      </div>
    </div>
  );
};