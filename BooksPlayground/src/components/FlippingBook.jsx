import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';

export const Page = forwardRef((props, ref) => {
  return (
    <div className="bg-white p-6 h-full relative overflow-hidden flex flex-col" ref={ref}>
      <div className="absolute top-0 left-0 w-6 h-full bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 left-0 w-[1px] h-full bg-black/5 z-10" />
      
      <div className="h-full flex flex-col pt-1 font-poppins relative z-20">
        <h4 className="text-black font-semibold text-base mb-2">{props.review.title}</h4>
        <div className="flex flex-col flex-1 pl-1">
          <span className="text-3xl leading-none text-black font-montagu font-bold">“</span>
          <p className="text-black text-[12px] font-bold leading-[1.4] tracking-tight -mt-1 z-10">
            {props.review.text}
          </p>
          <span className="text-3xl leading-none text-black font-montagu font-bold self-start mt-1">”</span>
        </div>
        <div className="mt-auto flex justify-end items-center pt-2">
             <span className="text-[13px] text-black font-bold italic tracking-tight">Next &rarr;</span>
        </div>
      </div>
    </div>
  );
});

export const FlippingBook = ({ book, isExpanded, layoutId, onClick }) => {
  return (
    <motion.div 
       layoutId={layoutId}
       onClick={!isExpanded ? onClick : undefined}
       className={`relative w-44 h-64 shrink-0 z-50 transform-style-3d perspective-1000 ${!isExpanded ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
       transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      {/* Right page base layer - The stationary body under the cover */}
      {isExpanded && (
        <motion.div 
           className="absolute top-0 left-0 w-44 h-64 rounded-r overflow-hidden shadow-2xl z-0 bg-white"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.2, delay: 0.1 }}
        >
           <HTMLFlipBook width={176} height={256} showCover={false} flippingTime={800}>
             {book.reviews.map((review, index) => (
               <Page key={index} review={review} index={index} />
             ))}
           </HTMLFlipBook>
        </motion.div>
      )}

      {/* The Hinging Cover */}
      <motion.div 
         className="w-full h-full relative origin-left z-10 drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)]"
         initial={false}
         animate={{ rotateY: isExpanded ? -180 : 0 }}
         transition={{ type: 'spring', stiffness: 150, damping: 20 }}
         style={{ transformStyle: 'preserve-3d' }}
      >
         {/* Front Face */}
         <div 
           className="absolute inset-0 bg-white rounded-r overflow-hidden"
           style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
         >
           <div className="absolute inset-0 shadow-[inset_-8px_-4px_12px_0px_rgba(255,255,255,0.21)] outline outline-1 outline-offset-[-1px] outline-white/10 pointer-events-none" />
           <div className="w-2 self-stretch bg-black absolute left-0 h-full z-10" />
           <img className="w-full h-full object-cover pl-[2px]" src={book.coverImg} alt={book.title} />
         </div>

         {/* Back Face (Inner Cover) */}
         <div 
           className="absolute inset-0 bg-[#F2EEDF] rounded-l flex flex-col items-center justify-center p-4 px-6 border-l border-y border-black/5"
           style={{ 
             backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
             transform: 'rotateY(180deg)'
           }}
         >
            <h2 className="font-montagu font-bold text-2xl text-black text-center leading-[1.2] mb-1">{book.title}</h2>
            <p className="font-poppins font-bold text-[16px] text-black text-center">{book.author}</p>
            <div className="absolute top-0 right-0 w-6 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-20" />
            <div className="absolute top-0 right-0 w-[1px] h-full bg-black/10 z-20" />
         </div>
      </motion.div>
    </motion.div>
  );
};
