import React, { useState } from 'react';
import { Search, Menu, X, Newspaper, Lock, ChevronDown, MapPin, Sun, Globe } from 'lucide-react';
import { CATEGORIES, KENYA_COUNTIES } from '../data/counties';

interface HeaderProps {
  currentCategory?: string;
  currentCounty?: string;
  onSelectCategory: (category: string) => void;
  onSelectCounty: (county: string) => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenNewsletter: () => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  currentCounty,
  onSelectCategory,
  onSelectCounty,
  onOpenSearch,
  onOpenAdmin,
  onOpenNewsletter,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countiesDropdownOpen, setCountiesDropdownOpen] = useState(false);

  // Format today's date in Kenya time
  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const popularCounties = ['Nairobi City', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Machakos', 'Uasin Gishu', 'Kakamega', 'Kilifi', 'Meru'];

  return (
    <header className="w-full bg-white border-b border-stone-200">
      {/* 1. TOP UTILITY STRIP */}
      <div className="border-b border-stone-200/80 bg-stone-50 text-[11px] text-stone-600 font-sans">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Date & Nairobi Indicator */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-stone-800">{todayFormatted}</span>
            <span className="hidden sm:inline-block text-stone-300">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
              <span>Nairobi, Kenya</span>
              <span className="text-stone-300">·</span>
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>24°C Sunny</span>
            </div>
          </div>

          {/* Right: E-Paper, Newsletter & CMS access */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => {
                alert('The Kenyan Ledger Digital E-Paper Edition is updated daily at 4:00 AM EAT. Today\'s digital broadsheet replica is available.');
              }}
              className="hover:text-[#D71920] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <Newspaper className="w-3.5 h-3.5 text-[#D71920]" />
              <span>E-Paper</span>
            </button>

            <button
              onClick={onOpenNewsletter}
              className="hidden md:inline-block hover:text-[#D71920] transition-colors cursor-pointer"
            >
              Newsletter
            </button>

            <div className="hidden lg:flex items-center gap-3 text-stone-500 border-l border-stone-200 pl-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">X</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">FB</a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-[#00843D] transition-colors">WA</a>
            </div>

            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-[#00843D] text-white hover:bg-emerald-700'
                  : 'bg-stone-900 text-white hover:bg-[#D71920]'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>{isAdminLoggedIn ? 'CMS Active' : 'Newsroom CMS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN EDITORIAL MASTHEAD */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col items-center justify-center text-center relative">
          {/* Logo click returns to Home */}
          <button
            onClick={() => {
              onSelectCategory('');
              onSelectCounty('');
            }}
            className="group inline-block focus:outline-none transition-transform hover:opacity-95"
            aria-label="The Kenyan Ledger Home"
          >
            <img
              src="/assets/aistudio/file_0000000021fc824388ca5e8d211b9a03_db6a5bbd.png"
              alt="The Kenyan Ledger - Journalism That Matters"
              className="h-14 sm:h-20 md:h-24 object-contain mx-auto"
            />
          </button>

          {/* Official Edition Subhead & Tri-color National Line */}
          <div className="mt-2 text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-stone-700">
            KENYA&apos;S INDEPENDENT DIGITAL NEWSROOM
          </div>

          {/* Kenyan Flag Inspired Accent Hairline */}
          <div className="w-full max-w-2xl mt-3 flex items-center justify-center h-[3px]">
            <span className="w-1/3 h-full bg-[#111111]"></span>
            <span className="w-1/3 h-full bg-[#D71920]"></span>
            <span className="w-1/3 h-full bg-[#00843D]"></span>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION BAR (Sticky) */}
      <div className="sticky top-0 z-40 bg-white border-t border-b-2 border-stone-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-900 hover:text-[#D71920] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Categories Menu */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs lg:text-[13px] font-bold tracking-tight text-stone-800 uppercase py-1">
            <button
              onClick={() => {
                onSelectCategory('');
                onSelectCounty('');
              }}
              className={`px-2.5 py-2 transition-colors border-b-2 cursor-pointer ${
                !currentCategory && !currentCounty
                  ? 'border-[#D71920] text-[#D71920]'
                  : 'border-transparent hover:text-[#D71920] hover:border-stone-300'
              }`}
            >
              Home
            </button>

            {CATEGORIES.map(cat => {
              const isActive = currentCategory === cat.slug;

              if (cat.id === 'counties') {
                return (
                  <div key={cat.id} className="relative group">
                    <button
                      onClick={() => {
                        onSelectCategory('counties');
                        setCountiesDropdownOpen(!countiesDropdownOpen);
                      }}
                      onMouseEnter={() => setCountiesDropdownOpen(true)}
                      className={`px-2.5 py-2 transition-colors border-b-2 flex items-center gap-1 cursor-pointer ${
                        currentCategory === 'counties' || currentCounty
                          ? 'border-[#D71920] text-[#D71920]'
                          : 'border-transparent hover:text-[#D71920] hover:border-stone-300'
                      }`}
                    >
                      <span>Counties</span>
                      <ChevronDown className="w-3 h-3 text-stone-500 group-hover:text-[#D71920]" />
                    </button>

                    {/* Counties Dropdown Menu */}
                    <div 
                      onMouseLeave={() => setCountiesDropdownOpen(false)}
                      className={`absolute top-full left-0 w-80 bg-white border border-stone-300 shadow-xl p-4 z-50 text-left normal-case ${
                        countiesDropdownOpen ? 'block' : 'hidden'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                          Kenya 47 Counties
                        </span>
                        <button
                          onClick={() => {
                            onSelectCategory('counties');
                            onSelectCounty('');
                            setCountiesDropdownOpen(false);
                          }}
                          className="text-[11px] text-[#D71920] font-semibold hover:underline"
                        >
                          All Counties &rarr;
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 mb-2 font-medium">Quick Regional Select:</div>
                      <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
                        {KENYA_COUNTIES.slice(0, 24).map(c => (
                          <button
                            key={c.code}
                            onClick={() => {
                              onSelectCounty(c.name);
                              setCountiesDropdownOpen(false);
                            }}
                            className={`text-left px-2 py-1 text-xs truncate rounded-xs hover:bg-stone-100 ${
                              currentCounty === c.name ? 'text-[#D71920] font-bold bg-red-50' : 'text-stone-700'
                            }`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-stone-100 text-center">
                        <button
                          onClick={() => {
                            onSelectCategory('counties');
                            setCountiesDropdownOpen(false);
                          }}
                          className="text-xs font-bold text-[#00843D] hover:underline"
                        >
                          View Full 47 County Directory
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCounty('');
                    onSelectCategory(cat.slug);
                  }}
                  className={`px-2.5 py-2 transition-colors border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-[#D71920] text-[#D71920]'
                      : 'border-transparent hover:text-[#D71920] hover:border-stone-300'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Quick Search Action */}
          <div className="flex items-center space-x-2 py-1">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors cursor-pointer rounded-xs"
              title="Search news, archives, authors..."
            >
              <Search className="w-3.5 h-3.5 text-stone-700" />
              <span className="hidden sm:inline font-medium">Search</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400 pb-1 border-b border-stone-100">
              News Desks
            </div>
            <button
              onClick={() => {
                onSelectCategory('');
                onSelectCounty('');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-bold text-sm ${
                !currentCategory && !currentCounty ? 'text-[#D71920]' : 'text-stone-800'
              }`}
            >
              Home
            </button>

            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCounty('');
                  onSelectCategory(cat.slug);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-1.5 text-sm font-semibold ${
                  currentCategory === cat.slug ? 'text-[#D71920]' : 'text-stone-700'
                }`}
              >
                {cat.name}
              </button>
            ))}

            <div className="pt-3 border-t border-stone-200">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Popular Counties
              </div>
              <div className="grid grid-cols-2 gap-1">
                {popularCounties.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCounty(c);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left text-xs py-1 px-1.5 truncate ${
                      currentCounty === c ? 'text-[#D71920] font-bold' : 'text-stone-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-stone-900 text-white text-xs font-bold uppercase text-center rounded-xs"
              >
                {isAdminLoggedIn ? 'Enter CMS Dashboard' : 'Newsroom Editorial Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
