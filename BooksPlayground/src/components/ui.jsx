import React from 'react';
import { Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={`w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center ${i < rating ? 'bg-[#9333EA]' : 'bg-zinc-700'}`}
          style={i < rating ? { 
            background: 'conic-gradient(from 180deg at 50% 50%, #A855F7 0deg, #7C3AED 360deg)' 
          } : {}}
        >
          <Star className={`w-2.5 h-2.5 ${i < rating ? 'text-white' : 'text-zinc-500'}`} fill="currentColor" />
        </div>
      ))}
    </div>
  );
};

export const Tag = ({ label }) => (
  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] rounded-full uppercase tracking-wider font-semibold font-poppins">
    {label}
  </span>
);

export const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-10 mt-4">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/profile')}>
        <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden ring-2 ring-transparent group-hover:ring-purple-500 transition-all">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Naman" alt="Profile" />
        </div>
        <div>
          <h3 className="text-white text-sm font-bold leading-tight font-poppins group-hover:text-purple-400 transition-colors">Naman Srivastava</h3>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">@r3b3l_soul</p>
        </div>
      </div>
      <div className="flex-1 max-w-[180px] ml-4 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
      <input 
        type="text" 
        placeholder="Search reviews"
        className="w-full bg-black/30 border-none rounded-full py-2.5 pl-9 pr-4 text-[11px] text-white placeholder-zinc-600 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none font-poppins"
      />
      </div>
    </div>
  );
};
