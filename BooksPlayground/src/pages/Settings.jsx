import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  return (
    <div className="bg-zinc-950 min-h-screen relative font-poppins text-white flex flex-col pt-safe">
      <div className="flex items-center justify-between p-6">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[16px] font-bold tracking-wide">Profile Settings</h1>
        <div className="w-9 h-9" />
      </div>

      <div className="p-6 flex flex-col gap-6 items-center">
         <div className="relative">
           <div className="w-28 h-28 rounded-full bg-zinc-800 border-4 border-zinc-900 overflow-hidden ring-1 ring-zinc-700 shadow-2xl">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Naman" alt="Profile" className="w-full h-full object-cover opacity-60" />
           </div>
           <button className="absolute bottom-0 right-0 bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform active:scale-95">Change</button>
         </div>
         <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-[-12px]">max 2 mb</span>
      </div>

      <div className="p-6 space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider ml-1">Name</label>
          <input type="text" defaultValue="Naman Srivastava" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider ml-1">Username</label>
          <div className="relative">
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">@</span>
             <input type="text" defaultValue="r3b3l_soul" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-9 pr-5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider ml-1">Email</label>
          <input type="email" defaultValue="naman.srivastava@example.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
        </div>
      </div>
      
      <div className="p-6 pb-10 border-t border-zinc-900/80 bg-zinc-950/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-full text-[12px] uppercase tracking-widest transition-transform transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Save Settings
        </button>
      </div>
    </div>
  );
}
