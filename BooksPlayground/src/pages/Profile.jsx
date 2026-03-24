import React, { useState } from 'react';
import { ArrowLeft, Award, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Read'); // 'Read' or 'Wishlist'

  return (
    <div className="bg-zinc-950 min-h-screen relative font-poppins text-white flex flex-col pb-safe">
      <div className="flex items-center justify-between p-6">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={() => navigate('/settings')} className="p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-center px-6 mt-4">
        <div className="relative mb-4">
           <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden ring-[4px] ring-zinc-900 shadow-2xl">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Naman" alt="Profile" className="w-full h-full object-cover" />
           </div>
        </div>
        <h2 className="text-2xl font-bold font-montagu tracking-tight">Naman Srivastava</h2>
        <p className="text-zinc-500 text-sm font-semibold tracking-wide">@r3b3l_soul</p>
        <div className="mt-3 px-4 py-1.5 bg-zinc-900/80 border border-zinc-800/50 rounded-full">
           <span className="text-xs font-bold text-[#F59E0B] tracking-wide">The Nurturer</span>
        </div>
      </div>

      {/* Achievements Horizontal Scroll */}
      <div className="mt-8 px-6 overflow-x-auto flex gap-4 no-scrollbar py-2">
         <div className="min-w-[150px] bg-gradient-to-b from-zinc-900/50 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-lg">
            <div className="bg-purple-500/10 p-3 rounded-full mb-1">
               <Award className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-xs font-bold text-center">Shelf Connoisseur</span>
            <span className="text-[10px] text-zinc-500 text-center leading-relaxed">Added 50 books to the Read List.</span>
         </div>
         <div className="min-w-[150px] bg-gradient-to-b from-zinc-900/50 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-lg">
            <div className="bg-amber-500/10 p-3 rounded-full mb-1">
               <Award className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-xs font-bold text-center">The Century Club</span>
            <span className="text-[10px] text-zinc-500 text-center leading-relaxed">Added 100 books to the Read List.</span>
         </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 px-6 flex gap-6 border-b border-zinc-800/80">
         <button onClick={() => setTab('Read')} className={`pb-3 text-sm font-bold transition-colors relative tracking-wide ${tab === 'Read' ? 'text-white' : 'text-zinc-500'}`}>
            Read
            {tab === 'Read' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-t" />}
         </button>
         <button onClick={() => setTab('Wishlist')} className={`pb-3 text-sm font-bold transition-colors relative tracking-wide ${tab === 'Wishlist' ? 'text-white' : 'text-zinc-500'}`}>
            Wishlist
            {tab === 'Wishlist' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-t" />}
         </button>
      </div>

      {/* Empty State */}
      <div className="flex-1 px-6 py-16 flex flex-col items-center justify-center">
         {tab === 'Wishlist' ? (
           <div className="text-center flex flex-col items-center opacity-70">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center mb-4">
                 <span className="text-zinc-600 font-montagu text-2xl font-medium">?</span>
              </div>
              <p className="text-zinc-500 text-sm font-bold tracking-wide">Ohh so empty...</p>
           </div>
         ) : (
           <div className="w-full text-center">
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4">You have 6 books in this list</p>
              <button onClick={() => navigate('/')} className="text-xs text-[#F59E0B] font-bold border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-2 rounded-full">
                View your library
              </button>
           </div>
         )}
      </div>
    </div>
  );
}
