import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

interface QRResultProps {
  url: string;
  title: string;
}

export const QRResult: React.FC<QRResultProps> = ({ url, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Create a temporary link to download the image
      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 pt-4 border-t border-slate-100 animate-fade-in">
      <div className="bg-white p-2 rounded-lg shadow-inner border border-slate-200">
        <div className="border-8 border-white rounded box-content">
          <QRCodeCanvas
            ref={canvasRef}
            value={url}
            size={200}
            level={"H"}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            includeMargin={false} // Margin handled by parent border
          />
        </div>
      </div>

      <div className="text-center w-full">
        {title && (
          <h3 className="text-lg font-bold text-slate-800 mb-1 px-4 break-words">
            {title}
          </h3>
        )}
        <p className="text-xs text-slate-500 mb-3 break-all px-4">
          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
        </p>

        <button
          onClick={handleDownload}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          画像を保存 (PNG)
        </button>
      </div>
    </div>
  );
};