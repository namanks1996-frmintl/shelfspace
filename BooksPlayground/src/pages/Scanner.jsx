import React from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Scanner() {
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-950 min-h-screen relative font-poppins text-white flex flex-col">
      <div className="flex items-center justify-between p-6">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[16px] font-bold">Add New Book</h1>
        <div className="w-9 h-9" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-zinc-400 text-sm mb-12 text-center max-w-[250px]">
          Position the barcode within the frame
        </p>

        {/* Camera Viewfinder Mock */}
        <div className="relative w-64 h-40 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center bg-zinc-900/50 ovweflow-hidden mb-12">
          {/* Scanning line animation */}
          <div className="absolute top-0 w-full h-[2px] bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
          
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-lg -m-[2px]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-lg -m-[2px]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-lg -m-[2px]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-lg -m-[2px]" />
        </div>

        <p className="text-zinc-500 text-[11px] mb-12 text-center max-w-[200px]">
          Point your camera at the ISBN barcode on the back of the book
        </p>

        <button 
          onClick={() => navigate('/add-manual')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
        >
          <ImageIcon className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-bold">Add from gallery</span>
        </button>
      </div>

      {/* Define global keyframes inline for scanning line */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
