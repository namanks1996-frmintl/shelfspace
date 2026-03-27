import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';

const Page = forwardRef((props, ref) => {
  return (
    <div
      className={`bg-white overflow-hidden h-full outline outline-[1px] outline-white/10 ${props.className || ''}`}
      ref={ref}
      style={props.style}
    >
      {props.children}
    </div>
  );
});

Page.displayName = 'Page';

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
};

export const FlippingBook = ({ book, isExpanded, layoutId, onClick }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (isExpanded && bookRef.current && bookRef.current.pageFlip) {
      const timer = setTimeout(() => {
        const flipObj = bookRef.current?.pageFlip();
        if (flipObj && flipObj.getPageCount() > 1) {
          flipObj.flip(1);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const getTransform = () => {
    if (!isExpanded) return 'none';

    // 1. When the book is closed (cover), the cover is on the right side.
    // Shift left by half a page (-128px) to center the cover identically on all viewports.
    if (currentPage === 0) {
      return 'translateX(-128px)';
    }

    // 2. When the book is completely closed on the BACK cover (page 5):
    // The back cover is drawn on the left side of the spread.
    // Shift right by half a page (+128px) to perfectly center it in the viewport.
    if (currentPage >= 5) {
      return 'translateX(128px)';
    }

    // 3. When the book is open (pages 1-4):
    if (windowWidth < 560) {
      // Mobile: Keep the shift so the Right Page is exactly centered in the viewport.
      return 'translateX(-128px)';
    }

    // Desktop: No shift, which perfectly centers the entire open 2-page spread.
    return 'translateX(0px)';
  };

  return (
    <motion.div
      layoutId={layoutId}
      // Only allow onClick in list/grid view. In detail view, back button is the only exit.
      onClick={!isExpanded ? onClick : undefined}
      className={`relative z-50 flex items-center justify-center ${!isExpanded ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-default'}`}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
      style={{
        width: isExpanded ? '512px' : '176px',
        height: isExpanded ? '384px' : '256px'
      }}
    >
      {!isExpanded ? (
        /* GRID VIEW DESIGN — Matching 176x256 from user constraints */
        <div
          className="bg-gradient-to-l from-white to-black pr-2 overflow-hidden flex justify-between items-stretch outline outline-[1px] outline-white/10 rounded-[4px] shadow-[0_12px_20px_rgba(0,0,0,0.35)] shadow-[inset_-8px_-4px_12px_rgba(255,255,255,0.21)]"
          style={{ width: '176px', height: '256px' }}
        >
          <div className="w-[8px] h-full bg-black flex-shrink-0" />
          <div className="flex-1 relative h-full">
            {book.coverImg ? (
              <img
                className="w-full h-full object-cover rounded-tr rounded-br-md shadow-[2px_0px_6px_rgba(0,0,0,0.5)]"
                src={book.coverImg}
                alt={book.title}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-950 to-neutral-800 rounded-tr rounded-br-md flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-[2px_0px_6px_rgba(0,0,0,0.5)]">
                {/* Procedural texture overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay" />
                <h2 className="text-white/90 text-[14px] font-bold font-montagu capitalize tracking-widest leading-snug text-center line-clamp-4 relative z-10 px-1">{book.title}</h2>
                <p className="text-white/40 text-[9px] font-medium font-poppins tracking-widest relative z-10 text-center">{book.author}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* DETAIL VIEW DESIGN — Balanced with source code values */
        <div
          className="w-full h-full flex justify-center items-center"
          style={{
            transform: getTransform(),
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <HTMLFlipBook
            ref={bookRef}
            width={256}
            height={384}
            size="fixed"
            minWidth={256}
            maxWidth={256}
            minHeight={384}
            maxHeight={384}
            maxShadowOpacity={0.5}
            showCover={true}
            autoCenter={false}
            drawShadow={true}
            onFlip={(e) => setCurrentPage(e.data)}
            flippingTime={1000}
            className="book-container rounded-[4px]"
            startPage={0}
            usePortrait={false}
          >
            {/* PAGE 0: FRONT COVER */}
            <Page className="rounded-md">
              <div className="w-64 h-96 pr-2 bg-gradient-to-l from-white to-black shadow-[0px_18px_30px_0px_rgba(0,0,0,0.35)] shadow-[inset_-12px_-6px_18px_0px_rgba(255,255,255,0.21)] inline-flex justify-between items-center overflow-hidden">
                <div className="w-3 self-stretch bg-black" />
                {book.coverImg ? (
                  <img className="flex-1 self-stretch rounded-tr rounded-br-md shadow-[3px_0px_9px_0px_rgba(0,0,0,0.50)] object-cover" src={book.coverImg} alt={book.title} />
                ) : (
                  <div className="flex-1 self-stretch rounded-tr rounded-br-md bg-gradient-to-br from-neutral-950 to-neutral-800 flex flex-col justify-center items-center p-8 shadow-[2px_0px_6px_0px_rgba(0,0,0,0.80)] relative overflow-hidden">
                    {/* Procedural texture overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay" />
                    <h2 className="text-white/90 text-xl font-bold font-montagu uppercase tracking-widest leading-snug line-clamp-5 text-center relative z-10">{book.title}</h2>
                    <p className="text-white/40 text-xs font-medium font-poppins uppercase tracking-[0.2em] relative z-10 text-center">{book.author}</p>

                    <div className="absolute bottom-6 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-50">
                      <span className="text-white font-montagu text-[10px]">BN</span>
                    </div>
                  </div>
                )}
              </div>
            </Page>

            {/* PAGE 1: INSIDE LEFT (INFO) */}
            <Page className="rounded-l-md">
              <div className="w-64 h-96 bg-[radial-gradient(ellipse_164.24%_170.92%_at_0.00%_0.00%,_#F2EEDF_36%,_#AFAA96_100%)] shadow-[inset_2.9680850505828857px_0px_4.452127456665039px_0px_rgba(0,0,0,0.35)] shadow-[inset_5.9361701011657715px_-5.9361701011657715px_17.808509826660156px_0px_rgba(255,255,255,0.12)] flex justify-between items-center overflow-hidden">
                <div className="flex-1 p-6 flex flex-col justify-center items-center gap-1">
                  <h2 className="text-black text-2xl font-bold font-montagu text-center uppercase tracking-tight leading-tight">{book.title}</h2>
                  <p className="text-black/40 text-base font-bold font-poppins text-center">{book.author}</p>
                </div>
                <div className="w-2 self-stretch bg-gradient-to-b from-neutral-800 to-black" />
              </div>
            </Page>

            {/* PAGE 2: INSIDE RIGHT (CONTENT 1) */}
            <Page className="rounded-r-md">
              <div className="w-64 h-96 pr-1.5 bg-[radial-gradient(ellipse_141.46%_195.26%_at_100.00%_-0.00%,_white_57%,_#C1C1C1_100%)] shadow-[inset_-2.9680850505828857px_0px_4.452127456665039px_0px_rgba(0,0,0,0.35)] shadow-[inset_-11.872340202331543px_-5.9361701011657715px_17.808509826660156px_0px_rgba(255,255,255,0.20)] flex justify-between items-center overflow-hidden">
                <div className="w-2 self-stretch bg-gradient-to-b from-neutral-800 to-black" />
                <div className="flex-1 px-6 pt-8 pb-4 flex flex-col items-center gap-3">
                  <h3 className="text-black text-base font-semibold font-poppins leading-tight">{book.reviews[0]?.title || 'Review'}</h3>
                  <div className="flex-1 flex flex-col justify-start items-center gap-1">
                    <span className="text-black/10 text-4xl font-bold font-montagu">“</span>
                    <p className="text-black text-[10px] font-bold font-poppins leading-relaxed text-center">{book.reviews[0]?.text}</p>
                    <span className="text-black/10 text-4xl font-bold font-montagu rotate-180">“</span>
                  </div>
                  <div className="text-right text-black/40 text-[10px] font-bold font-poppins w-full">Next →</div>
                </div>
              </div>
            </Page>

            {/* PAGE 3: INSIDE LEFT (BLANK per request) */}
            <Page className="rounded-l-md">
              <div className="w-64 h-96 bg-[radial-gradient(ellipse_164.24%_170.92%_at_0.00%_0.00%,_#F2EEDF_36%,_#AFAA96_100%)] shadow-[inset_2.9680850505828857px_0px_4.452127456665039px_0px_rgba(0,0,0,0.35)] flex justify-end">
                <div className="w-2 self-stretch bg-gradient-to-b from-neutral-800 to-black" />
              </div>
            </Page>

            {/* PAGE 4: INSIDE RIGHT (CONTENT 2 or placeholder) */}
            <Page className="rounded-r-md">
              <div className="w-64 h-96 bg-white shadow-[inset_-2.9680850505828857px_0px_4.452127456665039px_0px_rgba(0,0,0,0.35)] flex items-stretch">
                <div className="w-2 self-stretch bg-gradient-to-b from-neutral-800 to-black" />
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-black/10 font-montagu text-lg uppercase tracking-widest text-center">Final Chapter</p>
                </div>
              </div>
            </Page>

            {/* PAGE 5: BACK COVER */}
            <Page className="rounded-l-md">
              <div className="w-64 h-96 bg-black flex items-center justify-center shadow-[0px_18px_30px_0px_rgba(0,0,0,0.35)]">
                <div className="text-white/20 font-montagu text-sm uppercase tracking-widest">THE END</div>
              </div>
            </Page>
          </HTMLFlipBook>
        </div>
      )}
    </motion.div>
  );
};
