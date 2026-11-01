import React, { useState, useMemo } from 'react';
import { Article } from '../types/newspaper';
import { CATEGORIES, KENYA_COUNTIES } from '../data/counties';
import { Search, X, Clock, MapPin, Tag, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle
}) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedCounty, setSelectedCounty] = useState('all');

  const popularTags = ['Budget 2026', 'Devolution', 'NSE', 'Athletics', 'Silicon Savannah', 'Mombasa', 'Iten', 'Parliament'];

  const results = useMemo(() => {
    if (!query.trim() && selectedCat === 'all' && selectedCounty === 'all') {
      return [];
    }

    const q = query.toLowerCase().trim();

    return articles.filter(art => {
      const matchesQuery = !q || (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        art.authorName.toLowerCase().includes(q) ||
        (art.county && art.county.toLowerCase().includes(q)) ||
        art.tags.some(t => t.toLowerCase().includes(q))
      );

      const matchesCat = selectedCat === 'all' || art.categoryId.toLowerCase() === selectedCat.toLowerCase();
      const matchesCounty = selectedCounty === 'all' || (art.county && art.county.toLowerCase() === selectedCounty.toLowerCase());

      return matchesQuery && matchesCat && matchesCounty;
    });
  }, [query, selectedCat, selectedCounty, articles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-xs shadow-2xl border border-stone-300 overflow-hidden my-8">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-500 shrink-0" />
          <input
            type="text"
            placeholder="Search news, archives, journalists, counties, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-base sm:text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none font-serif"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-stone-200 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold uppercase text-stone-500 hover:text-stone-900 border border-stone-300 hover:bg-stone-100 shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Filter Strip */}
        <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-600 uppercase tracking-wider text-[10px]">Category:</span>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-white border border-stone-300 px-2 py-1 text-xs focus:outline-none"
            >
              <option value="all">All Desks</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-600 uppercase tracking-wider text-[10px]">County:</span>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="bg-white border border-stone-300 px-2 py-1 text-xs focus:outline-none max-w-[150px]"
            >
              <option value="all">All 47 Counties</option>
              {KENYA_COUNTIES.map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {(query || selectedCat !== 'all' || selectedCounty !== 'all') && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedCat('all');
                setSelectedCounty('all');
              }}
              className="text-[#D71920] hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Results / Suggestions Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {query || selectedCat !== 'all' || selectedCounty !== 'all' ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Found {results.length} Dispatches Matching Criteria
              </div>

              {results.length > 0 ? (
                <div className="divide-y divide-stone-200">
                  {results.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectArticle(item.slug);
                        onClose();
                      }}
                      className="py-3 group cursor-pointer flex gap-3 hover:bg-stone-50 p-2 -mx-2 transition-colors"
                    >
                      <div className="w-20 h-16 bg-stone-200 shrink-0 overflow-hidden">
                        <img
                          src={item.featuredImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#D71920] mb-0.5">
                          <span>{item.categoryId}</span>
                          {item.county && (
                            <>
                              <span className="text-stone-300">·</span>
                              <span className="text-stone-500">{item.county}</span>
                            </>
                          )}
                          <span className="text-stone-300">·</span>
                          <span className="text-stone-400 font-mono">
                            {new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <h4 className="text-sm font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-stone-500 text-sm">
                  No articles found for &ldquo;{query}&rdquo;. Try another keyword or reset county filters.
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Trending Search Topics Across Kenya:
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Tag className="w-3 h-3 text-[#D71920]" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Recent National Headliners:
              </div>
              <div className="space-y-2">
                {articles.slice(0, 3).map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art.slug);
                      onClose();
                    }}
                    className="p-2 border border-stone-200 hover:border-stone-400 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="font-serif font-bold text-stone-900 truncate max-w-lg">
                      {art.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-right text-xs text-stone-500">
          Press <kbd className="bg-white border px-1.5 py-0.5 text-[10px] rounded">ESC</kbd> or click background to close.
        </div>

      </div>
    </div>
  );
};
