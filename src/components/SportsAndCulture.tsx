import React from 'react';
import { Article } from '../types/newspaper';
import { ArrowRight, Trophy, Cpu, Film, PlayCircle, Eye } from 'lucide-react';

interface SportsAndCultureProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: string) => void;
}

export const SportsAndCulture: React.FC<SportsAndCultureProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  const sports = articles.filter(a => a.categoryId === 'sports' && a.status === 'published');
  const tech = articles.filter(a => a.categoryId === 'technology' && a.status === 'published');
  const entertainment = articles.filter(a => a.categoryId === 'entertainment' || a.categoryId === 'lifestyle');

  return (
    <section className="w-full py-8 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ROW 1: SPORTS & TECH DUAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* SPORTS DESK (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between pb-2 border-b-2 border-stone-900 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#D71920]" />
                <h3 className="text-lg sm:text-xl font-serif font-black uppercase tracking-tight text-stone-900">
                  Sports Arena
                </h3>
              </div>
              <button
                onClick={() => onSelectCategory('sports')}
                className="text-xs font-bold text-stone-700 hover:text-[#D71920] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
              >
                <span>Full Sports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {sports.length > 0 && (
              <div className="space-y-4">
                {/* Lead Sports Story */}
                <article className="group">
                  <div 
                    className="aspect-16/9 w-full overflow-hidden bg-stone-100 mb-3 cursor-pointer relative"
                    onClick={() => onSelectArticle(sports[0].slug)}
                  >
                    <img
                      src={sports[0].featuredImage}
                      alt={sports[0].title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 left-2 bg-stone-900/90 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {sports[0].tags[0] || 'Kenyan Athletics'}
                    </span>
                  </div>

                  <h4 className="text-lg font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug mb-1">
                    <button
                      onClick={() => onSelectArticle(sports[0].slug)}
                      className="text-left cursor-pointer focus:outline-none"
                    >
                      {sports[0].title}
                    </button>
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2 font-sans">
                    {sports[0].excerpt}
                  </p>
                  <div className="text-[11px] text-stone-400">
                    By {sports[0].authorName} · Sports Desk
                  </div>
                </article>

                {/* Secondary Sports List */}
                {sports.slice(1, 3).map(s => (
                  <div key={s.id} className="pt-3 border-t border-stone-100 group flex gap-3">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase text-[#D71920] block mb-0.5">
                        {s.tags[0] || 'Football'}
                      </span>
                      <h5 className="text-sm font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug">
                        <button
                          onClick={() => onSelectArticle(s.slug)}
                          className="text-left cursor-pointer"
                        >
                          {s.title}
                        </button>
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TECHNOLOGY & SILICON SAVANNAH (5 Columns) */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-stone-200 pt-6 lg:pt-0 lg:pl-8">
            <div className="flex items-center justify-between pb-2 border-b-2 border-stone-900 mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00843D]" />
                <h3 className="text-lg sm:text-xl font-serif font-black uppercase tracking-tight text-stone-900">
                  Silicon Savannah & Tech
                </h3>
              </div>
              <button
                onClick={() => onSelectCategory('technology')}
                className="text-xs font-bold text-stone-700 hover:text-[#00843D] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
              >
                <span>Tech</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {tech.length > 0 && (
              <div className="space-y-4">
                <article className="group">
                  <div 
                    className="aspect-4/3 w-full overflow-hidden bg-stone-100 mb-3 cursor-pointer"
                    onClick={() => onSelectArticle(tech[0].slug)}
                  >
                    <img
                      src={tech[0].featuredImage}
                      alt={tech[0].title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00843D] block mb-1">
                    AI & Agritech Innovation
                  </span>
                  <h4 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug mb-1">
                    <button
                      onClick={() => onSelectArticle(tech[0].slug)}
                      className="text-left cursor-pointer"
                    >
                      {tech[0].title}
                    </button>
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {tech[0].excerpt}
                  </p>
                </article>

                {/* Tech Startup Highlights */}
                <div className="p-3 bg-stone-50 border border-stone-200 text-xs">
                  <span className="font-bold text-stone-900 block mb-1">
                    Venture Watch Kenya:
                  </span>
                  <p className="text-stone-600">
                    Nairobi fintech hubs continue to lead East Africa in seed financing rounds, with green mobility and solar payments attracting record institutional commitments.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ROW 2: VIDEO NEWSROOM & MULTIMEDIA */}
        <div className="pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900 mb-6">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-[#D71920]" />
              <h3 className="text-xl font-serif font-black uppercase tracking-tight text-stone-900">
                Ledger Video & Multimedia
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline-block">
              Daily Press Briefings · Field Documentaries · Special Interviews
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Video Item 1 */}
            <div 
              className="group cursor-pointer bg-stone-900 text-white overflow-hidden rounded-xs border border-stone-800"
              onClick={() => alert('Streaming Ledger Video: Parliamentary Budget Analysis - Live Briefing')}
            >
              <div className="relative aspect-16/9 bg-stone-800 overflow-hidden">
                <img
                  src="/src/assets/images/politics_kenya_parliament_1793527267313.jpg"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#D71920]/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded-xs">
                  06:45
                </span>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D71920] block mb-1">
                  Capitol Briefing
                </span>
                <h4 className="text-sm font-serif font-bold leading-snug group-hover:text-red-300 transition-colors">
                  Inside the Bicameral Debate: How Devolution Formula Was Unlocked
                </h4>
              </div>
            </div>

            {/* Video Item 2 */}
            <div 
              className="group cursor-pointer bg-stone-900 text-white overflow-hidden rounded-xs border border-stone-800"
              onClick={() => alert('Streaming Ledger Video: High-Altitude Training in Iten')}
            >
              <div className="relative aspect-16/9 bg-stone-800 overflow-hidden">
                <img
                  src="/src/assets/images/sports_kenya_athletics_1793527268972.jpg"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#D71920]/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded-xs">
                  09:12
                </span>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00843D] block mb-1">
                  Sports Feature
                </span>
                <h4 className="text-sm font-serif font-bold leading-snug group-hover:text-emerald-300 transition-colors">
                  Chasing Greatness: A Day in the Life of Iten Marathon Champions
                </h4>
              </div>
            </div>

            {/* Video Item 3 */}
            <div 
              className="group cursor-pointer bg-stone-900 text-white overflow-hidden rounded-xs border border-stone-800"
              onClick={() => alert('Streaming Ledger Video: Silicon Savannah Innovation Showcase')}
            >
              <div className="relative aspect-16/9 bg-stone-800 overflow-hidden">
                <img
                  src="/src/assets/images/tech_silicon_savannah_1793527376692.jpg"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#D71920]/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded-xs">
                  04:50
                </span>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Innovation Explainer
                </span>
                <h4 className="text-sm font-serif font-bold leading-snug group-hover:text-amber-200 transition-colors">
                  How Kenyan Developers are Designing AI for Solar-Powered Cold Stores
                </h4>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
