import React, { useState, useRef } from 'react';
import { Wand2, X, AlertCircle } from 'lucide-react';
import { QRResult } from './QRResult';

// Default values as per original code
const DEFAULT_URL = "https://note.com/health_strategy/n/n682c18916045";
const DEFAULT_TITLE = "ヘルスケア・DXの戦略ノート";

export const QRGenerator: React.FC = () => {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [error, setError] = useState(false);
  const [generatedData, setGeneratedData] = useState<{ url: string; title: string } | null>(null);

  // Focus ref for accessibility
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError(true);
      // Reset animation
      const container = document.getElementById('url-input-container');
      if (container) {
        container.classList.remove('animate-shake');
        void container.offsetWidth; // trigger reflow
        container.classList.add('animate-shake');
      }
      return;
    }

    setGeneratedData({
      url: trimmedUrl,
      title: title.trim(),
    });
  };

  const handleClear = () => {
    setUrl('');
    setTitle('');
    setError(false);
    setGeneratedData(null);
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
      {/* Description Header */}
      <div className="p-6 bg-indigo-600 text-white text-center">
        <p className="text-sm opacity-90">URLとタイトルを入力してQRコードを作成</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="titleInput" className="block text-sm font-medium text-slate-600 mb-1">
            タイトル（任意）
          </label>
          <input
            id="titleInput"
            type="text"
            className="block w-full rounded-md border-slate-300 bg-slate-50 border px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800"
            placeholder="例：ヘルスケア戦略ノート"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
        </div>

        {/* URL Input */}
        <div id="url-input-container" className="relative">
          <label htmlFor="urlInput" className="block text-sm font-medium text-slate-600 mb-1">
            変換したいURL
          </label>
          <div className={`flex shadow-sm rounded-md overflow-hidden ${error ? 'ring-2 ring-red-500 ring-offset-1' : ''}`}>
            <input
              id="urlInput"
              ref={urlInputRef}
              type="text"
              className="flex-1 block w-full border-slate-300 bg-slate-50 border-y border-l px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800 rounded-l-md"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (e.target.value.trim() !== '') setError(false);
              }}
              onKeyDown={handleInputKeyDown}
            />
            <button
              onClick={handleClear}
              className="bg-slate-100 border border-slate-300 border-l-0 text-slate-500 px-4 hover:text-red-500 hover:bg-slate-200 transition flex items-center justify-center rounded-r-md"
              title="クリア"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1 flex items-center animate-fade-in">
              <AlertCircle className="w-3 h-3 mr-1" />
              URLを入力してください
            </p>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Wand2 className="w-5 h-5" />
          QRコードを生成
        </button>

        {/* Result Area */}
        {generatedData && (
          <QRResult
            url={generatedData.url}
            title={generatedData.title}
          />
        )}
      </div>
    </div>
  );
};