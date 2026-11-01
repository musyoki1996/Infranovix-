import React from 'react';
import { Article } from '../types/newspaper';
import { ArrowRight, Flame } from 'lucide-react';

interface PoliticsSectionProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: string) => void;
}

export const PoliticsSection: React.FC<PoliticsSectionProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  const politicalArticles = articles.filter(a => a.categoryId === 'politics' && a.status === 'published');
  
  if (politicalArticles.length === 0) return null;

  const leadPolitics = politicalArticles[0];
  const sidePolitics = politicalArticles.slice(1, 4);

  return (
    <section className="w-full py-8 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#D71920]"></span>
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-stone-900 uppercase">
              Politics & Power
            </h2>
            <span className="hidden md:inline-flex items-center gap-1 text-xs text-[#D71920] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 border border-red-200">
              <Flame className="w-3 h-3 text-[#D71920]" />
              Parliament & State House
            </span>
          </div>

          <button
            onClick={() => onSelectCategory('politics')}
            className="text-xs font-bold text-stone-800 hover:text-[#D71920] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <span>All Politics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Layout: Split Grid with Large Feature + Side Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Feature */}
          <div className="lg:col-span-7 group">
            <div 
              className="aspect-16/9 w-full overflow-hidden bg-stone-100 mb-4 cursor-pointer relative"
              onClick={() => onSelectArticle(leadPolitics.slug)}
            >
              <img
                src={leadPolitics.featuredImage}
                alt={leadPolitics.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <span className="absolute bottom-3 left-3 bg-stone-900/90 text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider">
                Capitol & Senate Dispatch
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D71920] mb-2">
              <span>National Assembly</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 font-medium">Bipartisan Legislation</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-stone-900 leading-tight mb-3 group-hover:text-[#D71920] transition-colors">
              <button
                onClick={() => onSelectArticle(leadPolitics.slug)}
                className="text-left cursor-pointer focus:outline-none"
              >
                {leadPolitics.title}
              </button>
            </h3>

            {leadPolitics.subhead && (
              <p className="text-stone-800 font-serif italic text-sm sm:text-base leading-relaxed mb-3">
                &ldquo;{leadPolitics.subhead}&rdquo;
              </p>
            )}

            <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-4 font-sans">
              {leadPolitics.excerpt}
            </p>

            <div className="text-xs text-stone-500 font-medium flex items-center gap-2 pt-2 border-t border-stone-100">
              <span className="font-bold text-stone-800">By {leadPolitics.authorName}</span>
              <span className="text-stone-300">|</span>
              <span>Chief Political Desk</span>
            </div>
          </div>

          {/* Side Political Column & Analysis */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200 pt-6 lg:pt-0 lg:pl-8">
            <div className="space-y-5">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
                Behind The Legislative Scenes
              </div>

              {sidePolitics.length > 0 ? (
                sidePolitics.map(item => (
                  <article key={item.id} className="group border-b border-stone-100 pb-4 last:border-b-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D71920] block mb-1">
                      Political Analysis
                    </span>
                    <h4 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#D71920] leading-snug transition-colors mb-1.5">
                      <button
                        onClick={() => onSelectArticle(item.slug)}
                        className="text-left cursor-pointer focus:outline-none"
                      >
                        {item.title}
                      </button>
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </article>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">
                      Political Diary
                    </span>
                    <h5 className="text-sm font-serif font-bold text-stone-900 mb-1">
                      Senate Committee on Devolution to Convene County Speakers in Naivasha
                    </h5>
                    <p className="text-xs text-stone-600">
                      Discussions focus on model county budget legislation and public participation guidelines.
                    </p>
                  </div>
                  <div className="p-4 bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">
                      Electoral Reforms
                    </span>
                    <h5 className="text-sm font-serif font-bold text-stone-900 mb-1">
                      IEBC Boundary Delimitation Technical Working Group Concludes Field Consultations
                    </h5>
                    <p className="text-xs text-stone-600">
                      Constituency population quotas in coastal and western corridors under review.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Political Newsletter Banner */}
            <div className="mt-6 p-4 bg-stone-900 text-white rounded-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D71920] block mb-1">
                The Capital Insider
              </span>
              <h5 className="text-sm font-serif font-bold mb-1">
                Deep Political Intelligence Delivered Weekly
              </h5>
              <p className="text-xs text-stone-300 mb-3">
                Uncompromising analysis from parliamentary corridors and political backrooms.
              </p>
              <button
                onClick={() => onSelectCategory('politics')}
                className="text-xs font-bold uppercase px-3 py-1.5 bg-[#D71920] text-white hover:bg-red-700 transition-colors w-full cursor-pointer text-center"
              >
                Explore Political Desk
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
