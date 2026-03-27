import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronRight, ArrowLeft, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { Header, StarRating, Tag } from '../components/ui';
import { FlippingBook } from '../components/FlippingBook';

export default function Home() {
  const { books, setBooks } = useBooks();
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  const handleRatingChange = (newRating) => {
    if (!selectedBook) return;
    setBooks(prev => prev.map(b => b.id === selectedBook.id ? { ...b, rating: newRating } : b));
    setSelectedBook(prev => ({ ...prev, rating: newRating }));
  };

  return (
    <div className="bg-zinc-950 min-h-screen relative font-poppins text-white overflow-hidden">
        <AnimatePresence mode="popLayout">
          {!selectedBook ? (
            <motion.div 
               key="list" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0, scale: 0.98 }} 
               transition={{ duration: 0.3 }}
               className="w-full max-w-7xl mx-auto p-6 md:p-8 lg:p-12 min-h-screen"
            >
              <Header />
              <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <h1 className="text-3xl font-montagu font-medium tracking-tight">Book Reviews</h1>
                <button className="p-2.5 rounded-full bg-zinc-900 text-zinc-500 hover:text-white transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 pt-4 pb-32 relative z-10">
                {books.map(book => (
                  <div key={book.id} className="flex flex-col gap-5 hover:-translate-y-2 transition-transform duration-300" style={{ width: '176px' }}>
                    <FlippingBook layoutId={`book-${book.id}`} book={book} isExpanded={false} onClick={() => setSelectedBook(book)} />
                    <div className="flex flex-col gap-1 pt-1">
                      <span className="text-white/40 text-[14px] font-light font-poppins tracking-tight leading-tight">{book.year}</span>
                      <div className="flex flex-col gap-1 mt-1 mb-2">
                         <h2 className="text-[18px] font-montagu font-medium uppercase leading-[1.2] line-clamp-2 tracking-normal text-white">{book.title}</h2>
                         <p className="text-white/40 text-[16px] font-light font-poppins leading-tight">{book.author}</p>
                      </div>
                      <StarRating rating={book.rating} size={14} showText={false} />
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {book.tags.slice(0, 2).map(tag => (
                          <Tag key={tag} label={tag} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={() => navigate('/scan')} className="fixed bottom-8 right-8 w-14 h-14 bg-[#9333EA] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(147,51,234,0.6)] hover:scale-105 transition-transform z-40 active:scale-95">
                <Plus className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
               key="detail" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               transition={{ duration: 0.4 }}
               className="w-full bg-[#18181A] min-h-screen relative font-poppins text-white overflow-y-auto overflow-x-hidden"
            >
               <div className="w-full max-w-7xl mx-auto min-h-screen pb-32 md:pb-12 flex flex-col relative">
                 {/* Top Bar */}
                 <div className="flex items-center justify-between p-6 lg:p-12 shrink-0">
                   <button onClick={() => setSelectedBook(null)} className="p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50">
                     <ArrowLeft className="w-5 h-5" />
                   </button>
                   <div className="flex-1 max-w-[300px] ml-4 relative">
                     <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                     <input type="text" placeholder="Search using username" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-full py-3 px-5 text-[12px] font-bold tracking-wide text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700" />
                   </div>
                 </div>

                 {/* Main Detail Content */}
                 <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-24 px-6 lg:px-12 flex-1">
                    
                    {/* LEFT COLUMN: THE FLIPPING BOOK */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center justify-start flex-shrink-0 relative z-20 pointer-events-auto">
                        <FlippingBook layoutId={`book-${selectedBook.id}`} book={selectedBook} isExpanded={true} />
                    </div>

                    {/* RIGHT COLUMN: BOOK INFORMATION */}
                    <div className="w-full lg:w-1/2 max-w-lg flex flex-col items-start xl:pt-4 flex-shrink-0 z-30 relative">
                       {/* Profile Row */}
                       <div className="flex items-center gap-4 mb-8">
                         <div className="w-14 h-14 rounded-full overflow-hidden border border-zinc-800 shadow-xl shrink-0">
                           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Naman" alt="Profile" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex flex-col">
                           <h2 className="text-[18px] lg:text-[20px] font-medium uppercase font-montagu text-white">Naman Srivastava</h2>
                           <p className="text-white/40 text-[14px] font-light font-poppins italic tracking-tight">@r3b3l_soul • The Nurturer</p>
                         </div>
                       </div>

                       {/* Book Title & Controls */}
                       <div className="w-full flex items-start justify-between mb-2">
                          <div className="flex-1">
                             <p className="text-white/40 text-[12px] lg:text-[14px] font-bold font-poppins tracking-tight">{selectedBook.year}</p>
                             <h1 className="text-[28px] lg:text-[40px] font-montagu font-bold uppercase shrink-0 leading-[1.1] mt-1 text-white pr-4">{selectedBook.title}</h1>
                             <p className="text-white/40 text-[14px] lg:text-[16px] font-bold font-poppins mt-2">{selectedBook.author}</p>
                          </div>
                          
                          {/* Desktop Only Arrows (Hidden on Mobile if preferred, but kept for parity) */}
                          <div className="hidden lg:flex gap-2 shrink-0 pt-2 items-center">
                             <button className="p-3.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-600 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                             </button>
                             <button className="p-3.5 rounded-full bg-zinc-900 border border-white/10 text-white shadow-lg hover:bg-zinc-800 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                             </button>
                          </div>
                       </div>

                       {/* Interactive Star Rating */}
                       <div className="flex items-center gap-2 mb-8 w-full justify-between lg:justify-start lg:gap-8">
                          <StarRating 
                            rating={selectedBook.rating} 
                            onRatingChange={handleRatingChange} 
                            size={28}
                          />
                          {/* Mobile Only Arrows */}
                          <div className="flex lg:hidden gap-2 shrink-0 items-center">
                             <button className="p-3 rounded-full bg-zinc-900 border border-white/10 text-zinc-600 hover:text-white transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5" />
                             </button>
                             <button className="p-3 rounded-full bg-zinc-900 border border-white/10 text-white shadow-lg hover:bg-zinc-800 transition-colors">
                                <ChevronRight className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       </div>

                       {/* Tags & Action & Description */}
                       <div className="w-full space-y-8">
                          <div className="flex flex-wrap gap-2">
                             {selectedBook.tags.map(tag => (
                               <Tag key={tag} label={tag} />
                             ))}
                          </div>
                          
                          <button className="w-full bg-[#FEA723] hover:bg-amber-500 text-[#090037] font-bold py-4 lg:py-5 rounded-[10px] text-[16px] lg:text-[18px] flex items-center justify-center gap-2 shadow-[inset_-3px_-2px_10px_rgba(0,0,0,0.25),inset_3px_3px_11px_rgba(0,0,0,0.45)] transition-transform active:scale-95 font-poppins">
                             Buy on Amazon
                          </button>
                          
                          <div className="space-y-3 border-t border-white/10 pt-6 mt-6">
                             <h3 className="text-[16px] lg:text-[18px] font-bold font-poppins text-white">About the book</h3>
                             <p className="text-[13px] lg:text-[15px] text-white/60 leading-relaxed font-normal font-poppins">
                               {selectedBook.description}
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Background Watermark */}
                 <div className="absolute bottom-4 left-6 lg:left-12 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
                    <h1 className="text-[100px] lg:text-[220px] font-poppins font-black italic shadow-inner leading-[0.85] tracking-tighter">Book<br/>Nerds</h1>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
