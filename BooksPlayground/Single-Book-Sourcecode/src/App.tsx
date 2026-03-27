/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className={`bg-white overflow-hidden ${props.className || ''}`} ref={ref}>
      {props.children}
    </div>
  );
});

Page.displayName = 'Page';

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 4; // Front cover, 2 inside pages, back cover

  const getTransform = () => {
    if (currentPage === 0) {
      return 'translateX(-128px)';
    }
    if (currentPage === totalPages - 1) {
      return 'translateX(128px)'; // Shifting right to center the back cover which is on the left
    }
    return 'translateX(0px)';
  };

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] flex items-center justify-center p-8 overflow-hidden">
      <div 
        className="relative flex items-center justify-center"
        style={{ 
          transform: getTransform(),
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {/* @ts-ignore - react-pageflip types can be tricky */}
        <HTMLFlipBook
          width={256}
          height={384}
          size="fixed"
          minWidth={256}
          maxWidth={256}
          minHeight={384}
          maxHeight={384}
          maxShadowOpacity={0.5}
          showCover={true}
          autoCenter={false} // Disabling native autoCenter as requested
          drawShadow={false}
          onFlip={(e) => setCurrentPage(e.data)}
          mobileScrollSupport={true}
          className="book-container"
          style={{ display: 'block' }}
          startPage={0}
          flippingTime={1000}
          usePortrait={false}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* PAGE 1: FRONT COVER */}
          <Page className="rounded-r-md">
            <div className="w-64 h-96 pr-2 bg-white shadow-[0px_18px_30px_0px_rgba(0,0,0,0.35)] shadow-[inset_-12px_-6px_18px_0px_rgba(255,255,255,0.21)] outline outline-[1.50px] outline-offset-[-1.50px] outline-white/10 inline-flex justify-between items-center overflow-hidden">
              <div className="w-3 self-stretch bg-black" />
              <img 
                className="flex-1 self-stretch rounded-tr rounded-br-md shadow-[3px_0px_9px_0px_rgba(0,0,0,0.50)] object-cover" 
                src="https://books.google.co.in/books/content?id=5fyuj9x9UZIC&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U0iwrhTENPXQNuf6ozlf0O7X0Vn3A&w=1280" 
                alt="The Idiot Cover" 
                referrerPolicy="no-referrer"
              />
            </div>
          </Page>

          {/* PAGE 2: INSIDE LEFT */}
          <Page className="rounded-l-md">
            <div className="w-64 h-96 bg-[radial-gradient(ellipse_164.24%_170.92%_at_0.00%_0.00%,_#F2EEDF_36%,_#AFAA96_100%)] shadow-[inset_2.9680850505828857px_0px_4.452127456665039px_0px_rgba(0,0,0,0.35)] shadow-[inset_5.9361701011657715px_-5.9361701011657715px_17.808509826660156px_0px_rgba(255,255,255,0.12)] outline outline-[0.50px] outline-offset-[-0.50px] outline-white/10 flex justify-between items-center overflow-hidden">
              <div className="flex-1 self-stretch p-6 inline-flex flex-col justify-center items-center gap-[2.97px]">
                <div className="self-stretch text-center justify-center text-black text-2xl font-bold font-['Montagu_Slab'] leading-7 uppercase">THE IDIOT</div>
                <div className="self-stretch text-center justify-center text-black/40 text-base font-bold font-['Poppins'] leading-5">Fyodor Dostoevsky</div>
              </div>
              <div className="w-2 self-stretch bg-gradient-to-b from-neutral-800 to-black" />
            </div>
          </Page>

          {/* PAGE 3: INSIDE RIGHT */}
          <Page className="rounded-r-md">
            <div className="w-64 h-96 pr-1.5 bg-[radial-gradient(ellipse_141.46%_195.26%_at_100.00%_-0.00%,_white_57%,_#C1C1C1_100%)] shadow-[inset_-2.9680850505828857px_0px_4.452127456665039px_0px_rgba(0,0,0,0.35)] shadow-[inset_-11.872340202331543px_-5.9361701011657715px_17.808509826660156px_0px_rgba(255,255,255,0.20)] outline outline-[0.50px] outline-offset-[-0.50px] outline-white/10 flex justify-between items-center overflow-hidden">
              <div className="w-2 self-stretch bg-gradient-to-b from-neutral-800 to-black" />
              <div className="flex-1 self-stretch px-6 pt-8 pb-4 bg-[radial-gradient(ellipse_141.46%_195.26%_at_100.00%_-0.00%,_white_56%,_rgba(176.69,_176.69,_176.69,_0.80)_100%)] shadow-[2px_0px_6px_0px_rgba(0,0,0,0.50)] inline-flex flex-col justify-start items-center gap-3">
                <div className="self-stretch justify-center text-black text-base font-semibold font-['Poppins'] leading-5">Killer drama</div>
                <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-center text-black/10 text-4xl font-bold font-['Montagu_Slab'] leading-3">“</div>
                  </div>
                  <div className="self-stretch flex-1 justify-start text-black text-[10px] font-bold font-['Poppins'] leading-4">I’ve been trying to review this book for over a week now, but I can’t. I’m struggling with something: How do I review a Russian literature classic? Better yet, how do I review a Russian literature classic without sounding like a total dumbass? (Hint: It’s probably not going to happen.)</div>
                  <div className="self-stretch inline-flex justify-end items-center gap-2">
                    <div className="justify-center text-black/10 text-4xl font-bold font-['Montagu_Slab'] leading-3">”</div>
                  </div>
                </div>
                <div className="self-stretch text-right justify-center text-black/40 text-[10px] font-bold font-['Poppins'] leading-4">Next →</div>
              </div>
            </div>
          </Page>

          {/* PAGE 4: BACK COVER */}
          <Page className="rounded-l-md">
            <div className="w-64 h-96 bg-black flex items-center justify-center shadow-[0px_18px_30px_0px_rgba(0,0,0,0.35)]">
               <div className="text-white/20 font-['Montagu_Slab'] text-sm">THE END</div>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>
    </div>
  );
}
