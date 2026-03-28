import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { Header, StarRating, Tag } from '../components/ui';
import { FlippingBook } from '../components/FlippingBook';

export default function BookDetail() {
   const { id } = useParams();
   const navigate = useNavigate();
   const { books, setBooks } = useBooks();
   const selectedBook = books.find(b => b.id === id);
   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      // Wait for the heavy layout computation of react-pageflip to settle
      const timer = setTimeout(() => setIsReady(true), 300);
      return () => clearTimeout(timer);
   }, []);

   if (!selectedBook) return <div className="p-8 text-white">Book not found</div>;

   const handleRatingChange = (newRating) => {
      setBooks(prev => prev.map(b => b.id === selectedBook.id ? { ...b, rating: newRating } : b));
   };

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.2 }}
         className="w-full bg-[#18181A] min-h-screen relative font-poppins text-white overflow-y-auto overflow-x-hidden"
      >
         <div className="w-full max-w-7xl mx-auto min-h-screen p-6 md:p-8 lg:p-12 flex flex-col relative">

            {/* Top Bar with Back Button / Library Return */}
            <div className="flex flex-col shrink-0 relative z-30">
               <button
                  onClick={() => navigate('/')}
                  className="group self-start mb-2 p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50 flex items-center gap-2"
               >
                  <CornerDownLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               </button>
               <Header />
            </div>

            {/* Main Detail Content */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-24 flex-1 pt-4">

               {/* LEFT COLUMN: THE FLIPPING BOOK */}
               <motion.div
                  className={`w-full lg:w-1/2 flex flex-col items-center justify-start flex-shrink-0 relative z-20 pointer-events-auto transition-opacity duration-700 ease-out ${isReady ? 'opacity-100' : 'opacity-0'}`}
                  initial={{ scale: 0.96, y: 15 }}
                  animate={{ scale: isReady ? 1 : 0.96, y: isReady ? 0 : 15 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
               >
                  {/* layoutId explicitly removed for disconnected page architecture */}
                  <FlippingBook book={selectedBook} isExpanded={true} />
               </motion.div>

               {/* RIGHT COLUMN: BOOK INFORMATION */}
               <div className="w-full lg:w-1/2 max-w-lg flex flex-col items-start xl:pt-4 flex-shrink-0 z-30 relative">

                  {/* Book Title & Controls */}
                  <div className="w-full flex items-start justify-between mb-2">
                     <div className="flex-1">
                        <p className="text-white/40 text-[12px] lg:text-[14px] font-bold font-poppins tracking-tight">{selectedBook.year}</p>
                        <h1 className="text-[28px] lg:text-[40px] font-montagu font-bold uppercase shrink-0 leading-[1.1] mt-1 text-white pr-4">{selectedBook.title}</h1>
                        <p className="text-white/40 text-[14px] lg:text-[16px] font-bold font-poppins mt-2">{selectedBook.author}</p>
                     </div>

                     {/* Desktop Only Arrows */}
                     <div className="hidden lg:flex gap-2 shrink-0 pt-2 items-center">
                        <button className="p-3.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-600 hover:text-white transition-colors">
                           <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button className="p-3.5 rounded-full bg-zinc-900 border border-white/10 text-white shadow-lg hover:bg-zinc-800 transition-colors">
                           <ArrowRight className="w-4 h-4" />
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
                           <ArrowRight className="w-3.5 h-3.5" />
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
            <div className="absolute top-1/2 left-6 lg:left-12 pointer-events-none opacity-[0.03] z-0 overflow-hidden transform -translate-y-1/2">
               <h1 className="text-[100px] lg:text-[220px] font-poppins font-black italic shadow-inner leading-[0.85] tracking-tighter">Book<br />Nerds</h1>
            </div>
         </div>
      </motion.div>
   );
}
