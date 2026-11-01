import React from 'react';
import { Article } from '../types/newspaper';
import { Clock } from 'lucide-react';

interface TopStoriesProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: string) => void;
}

export const TopStories: React.FC<TopStoriesProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  const topList = articles
    .filter(a => a.isTopStory && a.status === 'published')
    .slice(0, 4);

  if (topList.length === 0) return null;

  return (
    <section className="w-full py-8 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#D71920]"></span>
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-stone-900 uppercase">
              Top Stories
            </h2>
          </div>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest hidden sm:inline-block">
            Curated National & Regional Reports
          </span>
        </div>

        {/* 4-Column Editorial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topList.map(story => (
            <article key={story.id} className="group flex flex-col justify-between bg-white border border-stone-200 p-3.5 shadow-xs hover:border-stone-400 transition-colors">
              <div>
                {/* Visual */}
                <div 
                  className="aspect-16/10 w-full overflow-hidden bg-stone-100 mb-3 cursor-pointer"
                  onClick={() => onSelectArticle(story.slug)}
                >
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                {/* Kicker */}
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  <button
                    onClick={() => onSelectCategory(story.categoryId)}
                    className="text-[#D71920] hover:underline cursor-pointer"
                  >
                    {story.categoryId}
                  </button>
                  {story.county && (
                    <>
                      <span className="text-stone-300">·</span>
                      <span className="text-stone-500 font-medium">{story.county}</span>
                    </>
                  )}
                </div>

                {/* Headline */}
                <h3 className="text-base font-serif font-bold text-stone-900 leading-snug group-hover:text-[#D71920] transition-colors mb-2">
                  <button
                    onClick={() => onSelectArticle(story.slug)}
                    className="text-left cursor-pointer focus:outline-none"
                  >
                    {story.title}
                  </button>
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-3 font-sans">
                  {story.excerpt}
                </p>
              </div>

              {/* Card Base Metadata */}
              <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span className="truncate max-w-[120px] font-medium text-stone-600">
                  {story.authorName}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-stone-300" />
                  {story.readingTimeMinutes} min
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
