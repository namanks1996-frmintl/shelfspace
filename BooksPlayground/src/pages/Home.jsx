import React from 'react';
import { SlidersHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { Header, StarRating, Tag } from '../components/ui';
import { FlippingBook } from '../components/FlippingBook';

export default function Home() {
  const { books } = useBooks();
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-950 min-h-screen relative font-poppins text-white overflow-hidden">
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 lg:p-12 min-h-screen relative">
        <Header />
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <h1 className="text-3xl font-montagu font-medium tracking-tight">Book Reviews</h1>
          <button className="p-2.5 rounded-full bg-zinc-900 text-zinc-500 hover:text-white transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 pt-4 pb-32 relative z-10">
          {books.map(book => (
            <div
              key={book.id}
              className="flex flex-col gap-5 hover:-translate-y-2 transition-transform duration-300"
              style={{ width: '176px' }}
            >
              {/* Removed layoutId to enforce discrete page jump pattern */}
              <FlippingBook book={book} isExpanded={false} onClick={() => navigate(`/book/${book.id}`)} />
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-white/40 text-[12px] font-light font-poppins italic tracking-tight leading-tight">{book.year}</span>
                <div className="flex flex-col gap-1 mt-1 mb-2 cursor-pointer" onClick={() => navigate(`/book/${book.id}`)}>
                  <h2 className="text-[16px] font-montagu font-medium uppercase truncate leading-[1.2] line-clamp-2 tracking-normal text-white hover:text-purple-400 transition-colors">{book.title}</h2>
                  <p className="text-white/40 text-[14px] font-light font-poppins leading-tight">{book.author}</p>
                </div>
                <StarRating rating={book.rating} size={14} showText={false} />
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {book.tags.slice(0, 2).map(tag => (
                    <Tag key={tag} label={tag} />
                  ))}
                  {book.tags.length > 2 && (
                    <Tag label={`+${book.tags.length - 2}`} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/scan')} className="fixed bottom-8 right-8 w-14 h-14 bg-[#9333EA] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(147,51,234,0.6)] hover:scale-105 transition-transform z-40 active:scale-95">
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
