import React, { useState, useEffect } from 'react';
import { Article } from '../types/newspaper';
import { ChevronLeft, ChevronRight, Radio } from 'lucide-react';

interface BreakingTickerProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ articles, onSelectArticle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // If no breaking articles flagged, fall back to top stories
  const tickerArticles = articles.filter(a => a.isBreaking).length > 0
    ? articles.filter(a => a.isBreaking)
    : articles.slice(0, 4);

  useEffect(() => {
    if (tickerArticles.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % tickerArticles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [tickerArticles.length, isPaused]);

  if (tickerArticles.length === 0) return null;

  const currentArticle = tickerArticles[currentIndex] || tickerArticles[0];

  return (
    <div 
      className="w-full bg-[#D71920] text-white border-b border-red-800 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-10 text-xs">
        {/* Left Badge: BREAKING NEWS */}
        <div className="flex items-center gap-2 shrink-0 bg-black/25 px-2.5 py-1 font-bold uppercase tracking-wider text-[11px]">
          <span className="flex items-center gap-1.5 text-white">
            <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
            <span>BREAKING NEWS</span>
          </span>
        </div>

        {/* Center: Current Rotating Headline */}
        <div className="flex-1 px-4 overflow-hidden text-left truncate">
          <button
            onClick={() => onSelectArticle(currentArticle.slug)}
            className="hover:underline transition-all text-left truncate max-w-full font-medium inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="font-bold text-red-200 uppercase text-[10px] tracking-wide shrink-0">
              [{currentArticle.county || currentArticle.categoryId}]
            </span>
            <span className="truncate text-white text-xs sm:text-sm">
              {currentArticle.title}
            </span>
          </button>
        </div>

        {/* Right: Controls & Ticker Count */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 pl-2 text-white/80">
          <span className="text-[10px] tabular-nums font-mono opacity-80">
            {currentIndex + 1}/{tickerArticles.length}
          </span>
          <div className="flex items-center border border-white/20 rounded-xs">
            <button
              onClick={() => setCurrentIndex(prev => (prev - 1 + tickerArticles.length) % tickerArticles.length)}
              className="p-1 hover:bg-black/20 text-white transition-colors cursor-pointer"
              aria-label="Previous headline"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => setCurrentIndex(prev => (prev + 1) % tickerArticles.length)}
              className="p-1 hover:bg-black/20 text-white transition-colors cursor-pointer"
              aria-label="Next headline"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
