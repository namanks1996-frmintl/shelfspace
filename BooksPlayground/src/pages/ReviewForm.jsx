import React, { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooks } from '../context/BookContext';

export default function ReviewForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setBooks } = useBooks();

  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');

  const handlePublish = () => {
    const newBook = {
      id: Date.now().toString(),
      title: state?.title || 'Generic Title',
      author: state?.author || 'Author name',
      year: state?.year || '2024',
      rating,
      coverImg: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
      tags: ['New Entry'],
      description: "A newly added book added by you.",
      reviews: [{ title: reviewTitle || 'No Title', text: reviewText || 'No review.' }]
    };
    setBooks(prev => [newBook, ...prev]);
    navigate('/');
  };

  return (
    <div className="bg-zinc-950 min-h-screen relative font-poppins text-white flex flex-col pt-safe">
      <div className="flex items-center justify-between p-6 pb-2">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[16px] font-bold">Add New Book</h1>
        <div className="w-9 h-9" />
      </div>

      <div className="p-4 flex gap-4 bg-zinc-900/30 m-6 mb-8 rounded-2xl border border-zinc-800/50 shadow-inner">
         <div className="w-[4rem] h-24 bg-zinc-800 rounded flex-shrink-0 relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900" />
         </div>
         <div className="flex flex-col justify-center">
           <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-black">{state?.year || '2024'}</span>
           <h2 className="text-[15px] font-montagu font-bold uppercase leading-tight tracking-wide mt-1">{state?.title || 'Generic Title'}</h2>
           <p className="text-zinc-500 text-[11px] font-poppins font-medium mt-0.5">{state?.author || 'Author name'}</p>
         </div>
      </div>

      <div className="px-6 space-y-8 flex-1">
        <div className="space-y-4">
          <label className="text-white text-xl font-bold tracking-tight">Your ratings</label>
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setRating(i + 1)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all transform active:scale-90 ${i < rating ? 'bg-[#9333EA] shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800'}`}
                style={i < rating ? { background: 'conic-gradient(from 180deg at 50% 50%, #A855F7 0deg, #7C3AED 360deg)' } : {}}
              >
                <Star className={`w-5 h-5 ${i < rating ? 'text-white' : 'text-zinc-600'}`} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <label className="text-white text-xl font-bold tracking-tight">Your review</label>
          <input type="text" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} placeholder="Enter Review Title" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all mb-4" />
          
          <textarea 
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Write your thoughts..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all h-32 resize-none leading-relaxed" 
          />
        </div>
      </div>

      <div className="p-6 pb-10 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <button onClick={handlePublish} className="w-full bg-[#F59E0B] hover:bg-amber-500 text-black font-black py-4 rounded-full text-[12px] uppercase tracking-widest transition-transform transform active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          Publish Review
        </button>
      </div>
    </div>
  );
}
