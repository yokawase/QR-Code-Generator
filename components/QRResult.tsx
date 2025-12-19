import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, Check } from 'lucide-react';

interface QRResultProps {
  url: string;
  title: string;
}

export const QRResult: React.FC<QRResultProps> = ({ url, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = title ? `${title}\n${url}` : url;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  const getBlobFromCanvas = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSharing(true);

    try {
      // Check if Web Share API is supported
      if (!navigator.share) {
        throw new Error('Web Share API not supported');
      }

      const blob = await getBlobFromCanvas(canvas);
      if (!blob) throw new Error('Failed to create image blob');

      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      const shareText = title ? `${title}\n${url}` : url;
      
      const shareDataWithFile: ShareData = {
        title: title || 'QR Code',
        text: shareText,
        files: [file],
      };

      const shareDataTextOnly: ShareData = {
        title: title || 'QR Code',
        text: shareText,
        url: url,
      };

      // Try sharing with file first
      if (navigator.canShare && navigator.canShare(shareDataWithFile)) {
        await navigator.share(shareDataWithFile);
      } else {
        // Fallback to text only if file sharing is not supported
        await navigator.share(shareDataTextOnly);
      }
    } catch (error) {
      // Ignore user abort (when user cancels the share dialog)
      if ((error as Error).name === 'AbortError') {
        return;
      }

      console.log('Share failed or not supported, falling back to clipboard', error);
      
      // Fallback: Copy to clipboard if sharing fails or is not supported
      const copied = await copyToClipboard();
      if (copied) {
        // Only alert if it was an explicit failure of share API, to inform user of the fallback
        if (navigator.share) {
           alert('共有に失敗したため、情報をクリップボードにコピーしました。');
        } else {
           alert('お使いの環境では共有メニューを開けないため、情報をクリップボードにコピーしました。');
        }
      } else {
        alert('共有およびコピーに失敗しました。');
      }
    } finally {
      setIsSharing(false);
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
            includeMargin={false}
          />
        </div>
      </div>

      <div className="text-center w-full">
        {title && (
          <h3 className="text-lg font-bold text-slate-800 mb-1 px-4 break-words">
            {title}
          </h3>
        )}
        <p className="text-xs text-slate-500 mb-6 break-all px-4">
          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full px-2">
          <button
            onClick={handleDownload}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            保存 (PNG)
          </button>
          
          <button
            onClick={handleShare}
            disabled={isSharing}
            className={`flex-1 font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm ${
              copySuccess 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } ${isSharing ? 'opacity-70 cursor-wait' : ''}`}
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4" />
                コピー完了
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                {isSharing ? '処理中...' : '共有'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};