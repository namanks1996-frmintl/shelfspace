import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import custom star assets
import fullStar from '../Icons/Property 1=full.png';
import halfStar from '../Icons/Property 1=half.png';
import zeroStar from '../Icons/Property 1=zero.png';

const StarIcon = ({ type = 'zero', size = 16, onClick }) => {
  const getIcon = () => {
    if (type === 'full') return fullStar;
    if (type === 'half') return halfStar;
    return zeroStar;
  };

  return (
    <img
      src={getIcon()}
      alt={`${type} star`}
      className={`transition-transform active:scale-90 ${onClick ? 'cursor-pointer' : 'default'}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
      onClick={onClick}
    />
  );
};

export const StarRating = ({ rating = 0, onRatingChange, size = 20, showText = true }) => {
  const handleClick = (index) => {
    if (!onRatingChange) return;

    const starVal = index + 1;
    // Interaction principle: Tap once for half (if not already half), tap again for full.
    if (rating === starVal - 0.5) {
      onRatingChange(starVal);
    } else {
      onRatingChange(starVal - 0.5);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => {
          let type = 'zero';
          if (rating >= i + 1) type = 'full';
          else if (rating === i + 0.5) type = 'half';

          return (
            <StarIcon
              key={i}
              type={type}
              size={size}
              onClick={onRatingChange ? () => handleClick(i) : undefined}
            />
          );
        })}
      </div>
      {showText && (
        <div className="flex items-baseline font-poppins">
          <span className="text-[16px] font-medium text-white">{rating}</span>
          <span className="text-white/40 text-[14px] font-light ml-0.5">/5</span>
        </div>
      )}
    </div>
  );
};

export const Tag = ({ label }) => (
  <span className="px-2.5 py-1.5 bg-[#272727] text-white/40 text-[10px] rounded-full font-poppins font-light leading-none">
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
