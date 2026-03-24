import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomEntry() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  return (
    <div className="bg-zinc-950 min-h-screen relative font-poppins text-white flex flex-col">
      <div className="flex items-center justify-between p-6">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[16px] font-bold">Add New Book</h1>
        <div className="w-9 h-9" />
      </div>

      <div className="flex justify-center mb-8 px-6">
        <div className="bg-zinc-900 rounded-full p-1 flex">
          <button onClick={() => navigate('/scan')} className="px-6 py-2 text-xs font-semibold rounded-full text-zinc-400 hover:text-white transition-colors">
            Scan ISBN
          </button>
          <button className="px-6 py-2 text-xs font-semibold rounded-full bg-zinc-800 text-white border border-zinc-700 shadow-sm">
            Custom Entry
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Add a title" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
        </div>

        <div className="space-y-2">
          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1">Author</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Add author name" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
        </div>

        <div className="space-y-2">
          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1">Year</label>
          <input type="text" value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2024" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
        </div>
        
        <button 
          onClick={() => navigate('/review', { state: { title, author, year } })} 
          className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-full text-[12px] uppercase tracking-widest transition-transform transform active:scale-95 mt-4 shadow-xl shadow-white/10"
        >
          Add Review details
        </button>
      </div>
    </div>
  );
}
