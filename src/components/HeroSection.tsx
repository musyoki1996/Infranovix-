import React from 'react';
import { Article } from '../types/newspaper';
import { Clock, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  if (articles.length === 0) return null;

  // Identify Lead Story (or first article)
  const leadStory = articles.find(a => a.isLeadStory) || articles[0];
  
  // Secondary stories (2-3 items)
  const secondaryStories = articles
    .filter(a => a.id !== leadStory.id && a.status === 'published')
    .slice(0, 2);

  // Latest news column (4-5 items)
  const latestStories = articles
    .filter(a => a.id !== leadStory.id && !secondaryStories.some(s => s.id === a.id))
    .slice(0, 5);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 60) return `${Math.max(5, diff)}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <section className="w-full py-6 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* COLUMN 1: LEAD STORY (Col span 6 on desktop) */}
          <div className="lg:col-span-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 lg:pr-8 pb-6 lg:pb-0">
            <article className="group">
              {/* Category & Region Kicker */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                <button
                  onClick={() => onSelectCategory(leadStory.categoryId)}
                  className="text-[#D71920] hover:underline cursor-pointer"
                >
                  {leadStory.categoryId}
                </button>
                {leadStory.county && (
                  <>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 font-medium">{leadStory.county}</span>
                  </>
                )}
                <span className="text-stone-300">·</span>
                <span className="text-stone-400 font-normal lowercase">{leadStory.readingTimeMinutes} min read</span>
              </div>

              {/* Large Bold Serif Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-950 leading-tight mb-3 group-hover:text-[#D71920] transition-colors">
                <button
                  onClick={() => onSelectArticle(leadStory.slug)}
                  className="text-left cursor-pointer focus:outline-none"
                >
                  {leadStory.title}
                </button>
              </h2>

              {/* High-Resolution Landscape Image */}
              <div 
                className="relative aspect-16/9 w-full overflow-hidden bg-stone-100 my-4 cursor-pointer"
                onClick={() => onSelectArticle(leadStory.slug)}
              >
                <img
                  src={leadStory.featuredImage}
                  alt={leadStory.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                {leadStory.isBreaking && (
                  <span className="absolute top-3 left-3 bg-[#D71920] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-md">
                    Developing Story
                  </span>
                )}
              </div>

              {/* Excerpt / Subhead */}
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4 font-sans">
                {leadStory.excerpt}
              </p>

              {/* Author, Timestamp & Read More */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900">By {leadStory.authorName}</span>
                  <span className="text-stone-300">|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {formatTimeAgo(leadStory.publishedAt)}
                  </span>
                </div>

                <button
                  onClick={() => onSelectArticle(leadStory.slug)}
                  className="font-bold text-[#D71920] hover:text-red-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Coverage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          </div>

          {/* COLUMN 2: SECONDARY HEADLINES (Col span 3 on desktop) */}
          <div className="lg:col-span-3 flex flex-col space-y-6 border-b lg:border-b-0 lg:border-r border-stone-200 lg:pr-6 pb-6 lg:pb-0">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-1.5 border-b-2 border-stone-900 mb-2 flex items-center justify-between">
              <span>Selected Analysis</span>
              <span className="text-[10px] text-stone-500 lowercase font-normal">Newsroom Picks</span>
            </div>

            {secondaryStories.map(story => (
              <article key={story.id} className="group border-b border-stone-100 pb-5 last:border-b-0 last:pb-0">
                <div 
                  className="aspect-4/3 w-full overflow-hidden bg-stone-100 mb-2.5 cursor-pointer"
                  onClick={() => onSelectArticle(story.slug)}
                >
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#D71920] mb-1">
                  <span>{story.categoryId}</span>
                  {story.county && (
                    <>
                      <span className="text-stone-300">·</span>
                      <span className="text-stone-500 font-normal">{story.county}</span>
                    </>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug group-hover:text-[#D71920] transition-colors mb-2">
                  <button
                    onClick={() => onSelectArticle(story.slug)}
                    className="text-left cursor-pointer focus:outline-none"
                  >
                    {story.title}
                  </button>
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2 font-sans">
                  {story.excerpt}
                </p>

                <div className="text-[11px] text-stone-400 flex items-center gap-2">
                  <span>{story.authorName}</span>
                  <span>·</span>
                  <span>{formatTimeAgo(story.publishedAt)}</span>
                </div>
              </article>
            ))}
          </div>

          {/* COLUMN 3: LATEST NEWS TICKER (Col span 3 on desktop) */}
          <div className="lg:col-span-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-1.5 border-b-2 border-stone-900 mb-3 flex items-center justify-between">
              <span>Latest Wire</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#00843D]"></span>
            </div>

            <div className="divide-y divide-stone-200">
              {latestStories.map((story, idx) => (
                <div key={story.id} className="py-3 first:pt-0 group">
                  <div className="flex items-center justify-between text-[10px] font-semibold tracking-wide text-stone-500 uppercase mb-1">
                    <span className="text-[#D71920]">{story.categoryId}</span>
                    <span className="font-mono text-stone-400">{formatTimeAgo(story.publishedAt)}</span>
                  </div>

                  <h4 className="text-sm font-serif font-bold text-stone-900 group-hover:text-[#D71920] leading-snug transition-colors">
                    <button
                      onClick={() => onSelectArticle(story.slug)}
                      className="text-left cursor-pointer focus:outline-none"
                    >
                      {story.title}
                    </button>
                  </h4>

                  {idx === 0 && (
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 font-sans">
                      {story.excerpt}
                    </p>
                  )}

                  <div className="text-[10px] text-stone-400 mt-1">
                    {story.county ? `${story.county} Bureau · ` : ''}By {story.authorName}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick newsletter subscription micro-form */}
            <div className="mt-4 p-3 bg-stone-100 border border-stone-200 rounded-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                The Ledger Morning Brief
              </span>
              <p className="text-xs text-stone-700 mb-2">
                Get priority dispatch to your email daily at 6:00 AM.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you! You are subscribed to The Ledger Morning Brief.');
                }}
                className="flex gap-1"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="text-xs px-2 py-1.5 bg-white border border-stone-300 w-full focus:outline-none focus:border-stone-900"
                />
                <button
                  type="submit"
                  className="text-xs font-bold px-3 py-1.5 bg-stone-900 text-white hover:bg-[#D71920] transition-colors shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
