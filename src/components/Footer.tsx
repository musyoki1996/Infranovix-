import React, { useState } from 'react';
import { api } from '../services/api';
import { CATEGORIES, KENYA_COUNTIES } from '../data/counties';
import { Shield, ArrowUp, Mail, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onSelectCounty: (county: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onSelectCounty }) => {
  const [footerEmail, setFooterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail) return;
    await api.subscribeNewsletter(footerEmail);
    setSubscribed(true);
    setFooterEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const majorCounties = [
    'Nairobi City', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 
    'Machakos', 'Uasin Gishu', 'Kakamega', 'Kilifi', 'Meru', 
    'Nyeri', 'Garissa', 'Kitui', 'Kajiado', 'Turkana'
  ];

  return (
    <footer className="w-full bg-[#111111] text-stone-300 font-sans border-t-4 border-[#D71920]">
      
      {/* 1. TOP BRAND & NEWSLETTER STRIP */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-b border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/assets/aistudio/file_0000000021fc824388ca5e8d211b9a03_db6a5bbd.png"
                alt="The Kenyan Ledger Logo"
                className="h-16 object-contain bg-white p-2 rounded-xs"
              />
            </div>
            <p className="text-xs text-stone-400 max-w-lg leading-relaxed">
              Kenya&apos;s independent digital newsroom delivering fearless investigative reporting, comprehensive devolution analysis across 47 counties, financial markets intelligence, and national dialogue.
            </p>
          </div>

          <div className="lg:col-span-6 bg-stone-900/80 p-6 border border-stone-800 rounded-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D71920] block mb-1">
              Direct Newsroom Dispatch
            </span>
            <h4 className="text-base font-serif font-bold text-white mb-2">
              Get Kenya&apos;s Most Essential News Delivered Daily
            </h4>

            {subscribed ? (
              <div className="text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for subscribing to The Kenyan Ledger news alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleFooterSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@domain.co.ke"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 bg-stone-800 text-white placeholder:text-stone-500 text-xs border border-stone-700 focus:outline-none focus:border-[#D71920]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D71920] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* 2. NAVIGATION COLUMNS */}
      <div className="max-w-7xl mx-auto px-4 py-10 border-b border-stone-800 text-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Editorial Desks */}
          <div>
            <h5 className="font-serif font-bold text-white text-sm uppercase tracking-wider pb-2 border-b border-stone-800 mb-3">
              Editorial Desks
            </h5>
            <ul className="space-y-1.5 text-stone-400">
              {CATEGORIES.slice(0, 6).map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectCategory(c.slug)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {c.name} Desk
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: More Desks */}
          <div>
            <h5 className="font-serif font-bold text-white text-sm uppercase tracking-wider pb-2 border-b border-stone-800 mb-3">
              Specialized Sections
            </h5>
            <ul className="space-y-1.5 text-stone-400">
              {CATEGORIES.slice(6).map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectCategory(c.slug)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => alert('The Kenyan Ledger Digital E-Paper: Daily digital broadsheet replica available for online reading.')}
                  className="hover:text-white text-[#D71920] font-bold"
                >
                  Daily E-Paper Edition
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: County Coverage */}
          <div>
            <h5 className="font-serif font-bold text-white text-sm uppercase tracking-wider pb-2 border-b border-stone-800 mb-3">
              County Bureaus
            </h5>
            <ul className="space-y-1.5 text-stone-400">
              {majorCounties.slice(0, 6).map(name => (
                <li key={name}>
                  <button
                    onClick={() => onSelectCounty(name)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onSelectCategory('counties')}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  All 47 Counties Index &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Standards */}
          <div>
            <h5 className="font-serif font-bold text-white text-sm uppercase tracking-wider pb-2 border-b border-stone-800 mb-3">
              Editorial Charter
            </h5>
            <ul className="space-y-1.5 text-stone-400">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); alert('About The Kenyan Ledger: An independent publication dedicated to holding power accountable and serving the public interest across Kenya.'); }} className="hover:text-white">About Us</a></li>
              <li><a href="#editorial" onClick={(e) => { e.preventDefault(); alert('Editorial Policy: Fact-checking, source verification, and independent reporting without political or commercial bias.'); }} className="hover:text-white">Editorial Charter</a></li>
              <li><a href="#corrections" onClick={(e) => { e.preventDefault(); alert('Corrections Policy: When errors occur, The Kenyan Ledger corrects them promptly and transparently with an editor\'s note.'); }} className="hover:text-white">Corrections Policy</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); alert('Newsroom Contact: Tel: +254 (0)20 780 0000 | Email: newsdesk@kenyanledger.co.ke | City Square, Nairobi, Kenya'); }} className="hover:text-white">Contact Newsroom</a></li>
              <li><a href="#advertise" onClick={(e) => { e.preventDefault(); alert('Advertising with The Kenyan Ledger: Leaderboards, sponsored thought leadership, and digital audience packages. Email: commercial@kenyanledger.co.ke'); }} className="hover:text-white">Advertise With Us</a></li>
            </ul>
          </div>

          {/* Col 5: Legal & Regulatory */}
          <div>
            <h5 className="font-serif font-bold text-white text-sm uppercase tracking-wider pb-2 border-b border-stone-800 mb-3">
              Legal & Compliance
            </h5>
            <ul className="space-y-1.5 text-stone-400">
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: We protect reader personal information in compliance with the Kenya Data Protection Act 2019.'); }} className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Respect copyright, fair use, and civil commenting guidelines on all digital properties.'); }} className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#whistleblower" onClick={(e) => { e.preventDefault(); alert('Encrypted Whistleblower Drop: Send confidential tips to investigative@kenyanledger.co.ke using PGP encryption.'); }} className="hover:text-white">Confidential Tip Line</a></li>
            </ul>

            <div className="mt-4 p-3 bg-stone-900 border border-stone-800 text-[10px] text-stone-400">
              <Shield className="w-4 h-4 text-[#00843D] mb-1" />
              <span>Regulated under the Media Council of Kenya Act (No. 46 of 2013).</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. 47 COUNTIES COMPLETE HORIZONTAL DIRECTORY */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-stone-800 text-[11px] text-stone-500">
        <div className="font-bold uppercase tracking-wider text-stone-400 mb-2">
          Republic of Kenya · 47 Devolved Counties Directory:
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {KENYA_COUNTIES.map((c, i) => (
            <React.Fragment key={c.code}>
              <button
                onClick={() => onSelectCounty(c.name)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {c.name}
              </button>
              {i < KENYA_COUNTIES.length - 1 && <span className="text-stone-700">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4. BASELINE COPYRIGHT & ATTRIBUTION */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <div>
          &copy; {new Date().getFullYear()} The Kenyan Ledger Media Group. All Rights Reserved. &ldquo;Journalism That Matters.&rdquo;
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </footer>
  );
};
