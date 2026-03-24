import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronRight, ArrowLeft, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { Header, StarRating, Tag } from '../components/ui';
import { FlippingBook } from '../components/FlippingBook';

export default function Home() {
  const { books } = useBooks();
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

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
               className="w-full max-w-lg mx-auto p-6 min-h-screen"
            >
              <Header />
              <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <h1 className="text-3xl font-montagu font-medium tracking-tight">Book Reviews</h1>
                <button className="p-2.5 rounded-full bg-zinc-900 text-zinc-500 hover:text-white transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-12 pb-32 relative z-10 flex-shrink-0">
                {books.map(book => (
                  <div key={book.id} className="flex flex-col gap-4">
                    <div className="flex justify-center">
                       <FlippingBook layoutId={`book-${book.id}`} book={book} isExpanded={false} onClick={() => setSelectedBook(book)} />
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-black">{book.year}</span>
                      <h2 className="text-[15px] font-montagu font-bold uppercase leading-tight line-clamp-2 min-h-[2.5rem] tracking-wide">{book.title}</h2>
                      <p className="text-zinc-500 text-[11px] mb-1 font-medium">{book.author}</p>
                      <StarRating rating={book.rating} />
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
               className="w-full max-w-lg mx-auto bg-[#18181A] min-h-screen relative font-poppins text-white pb-32 overflow-hidden"
            >
               {/* Top Bar */}
               <div className="flex items-center justify-between p-6">
                 <button onClick={() => setSelectedBook(null)} className="p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all border border-zinc-800/50">
                   <ArrowLeft className="w-4 h-4" />
                 </button>
                 <div className="flex-1 max-w-[250px] ml-4 relative">
                   <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                   <input type="text" placeholder="Search using username" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-full py-3 px-5 text-[11px] font-bold tracking-wide text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700" />
                 </div>
               </div>

               {/* Profile Summary */}
               <div className="flex flex-col items-center mt-2 mb-8">
                 <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-zinc-800 mb-3 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Naman" alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <h2 className="text-[14px] font-black uppercase tracking-widest font-montagu shadow-sm text-zinc-100">Naman Srivastava</h2>
                 <p className="text-zinc-500 text-[10px] font-bold mt-1 tracking-wider">@r3b3l_soul • The Nurturer</p>
               </div>
               
               {/* Book Info Header */}
               <div className="px-6 flex items-start justify-between mb-2">
                  <div className="flex-1">
                     <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black italic">{selectedBook.year}</p>
                     <h1 className="text-[28px] font-montagu font-black uppercase shrink-0 leading-[1.1] mt-2 shadow-sm tracking-tight text-white pr-4">{selectedBook.title}</h1>
                     <p className="text-zinc-600 text-[14px] font-bold mt-1">{selectedBook.author}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 pt-2 z-30 relative">
                     <button className="p-3.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                     </button>
                     <button className="p-3.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-white shadow-lg hover:bg-zinc-800 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
               
               {/* Star Rating */}
               <div className="px-6 flex items-center gap-2 mb-10">
                  <StarRating rating={selectedBook.rating} />
                  <span className="text-[11px] text-zinc-400 font-bold ml-2">{selectedBook.rating}/5</span>
               </div>
               
               {/* THE FLIPPING BOOK PROPORTIONALLY ANCHORED */}
               <div className="relative z-20 pointer-events-auto overflow-visible py-8 mb-4 flex justify-center">
                   <div className="transform scale-[1.12] shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded">
                       <FlippingBook layoutId={`book-${selectedBook.id}`} book={selectedBook} isExpanded={true} />
                   </div>
               </div>
               
               {/* Footer Details */}
               <div className="px-6 space-y-6 relative z-30 pt-4">
                  <div className="flex gap-2">
                     {selectedBook.tags.slice(0, 2).map(tag => (
                       <Tag key={tag} label={tag} />
                     ))}
                     {selectedBook.tags.length > 2 && <Tag label={`+${selectedBook.tags.length - 2}`} />}
                  </div>
                  
                  <button className="w-full bg-[#F59E0B] hover:bg-amber-500 text-black font-black py-4 rounded-[14px] text-[14px] flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(245,158,11,0.25)] transition-transform active:scale-95">
                     <svg className="w-6 h-6 -mt-1 opacity-90" viewBox="0 0 24 24" fill="currentColor"><path d="M14.996 11.235c-1.396.953-3.21 1.488-5.32 1.488-3.033 0-5.74-1.127-7.794-2.96v-1.724c2.055 1.834 4.76 2.962 7.794 2.962 2.11 0 3.924-.536 5.32-1.488v1.722zm3.623-1.482c-.896-.867-1.874-1.34-2.83-1.34-.457 0-.85.12-1.144.348-.378.293-.578.718-.578 1.23 0 .752.41 1.295 1.15 1.536.568.185 1.344.254 2.214.218 1.196-.05 2.502-.27 3.565-.605v-1.387zM24 10.744v4.512H0v-4.512h24z"/></svg>
                     Buy on Amazon
                  </button>
                  
                  <div className="space-y-2 mt-4 relative z-30">
                     <h3 className="text-[15px] font-black tracking-wide text-white">About the book</h3>
                     <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                       {selectedBook.description}
                     </p>
                  </div>
               </div>
          
               {/* Watermark */}
               <div className="absolute bottom-4 left-6 pointer-events-none opacity-[0.03] z-0">
                  <h1 className="text-[100px] font-poppins font-black italic shadow-inner leading-[0.85] tracking-tighter">Book<br/>Nerds</h1>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
