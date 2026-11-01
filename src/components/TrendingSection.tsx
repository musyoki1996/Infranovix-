import React from 'react';
import { Article } from '../types/newspaper';
import { TrendingUp, Eye, Share2 } from 'lucide-react';

interface TrendingSectionProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ articles, onSelectArticle }) => {
  // Sort articles by actual engagement score: views + shares * 3
  const ranked = [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => (b.viewsCount + b.sharesCount * 3) - (a.viewsCount + a.sharesCount * 3))
    .slice(0, 5);

  if (ranked.length === 0) return null;

  return (
    <section className="w-full py-8 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D71920]" />
            <h3 className="text-xl font-serif font-black uppercase tracking-tight text-stone-900">
              Trending Stories · Most Read
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Live Reader Engagement Index
          </span>
        </div>

        {/* 5-Column Ranked Number Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {ranked.map((story, index) => (
            <div 
              key={story.id} 
              className="flex flex-col justify-between p-3.5 bg-white border border-stone-200 hover:border-stone-400 transition-colors group cursor-pointer"
              onClick={() => onSelectArticle(story.slug)}
            >
              <div>
                {/* Ranking Number */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-serif font-black text-stone-300 group-hover:text-[#D71920] transition-colors tabular-nums">
                    #{index + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#D71920] tracking-wider">
                    {story.categoryId}
                  </span>
                </div>

                <h4 className="text-sm font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug line-clamp-3 mb-2">
                  {story.title}
                </h4>
              </div>

              {/* Engagement metrics */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-stone-300" />
                  {story.viewsCount.toLocaleString()} reads
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-3 h-3 text-stone-300" />
                  {story.sharesCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
