import React, { useState, useEffect } from 'react';
import { Article, Comment, Advertisement } from '../types/newspaper';
import { api } from '../services/api';
import { AdSlot } from './AdSlot';
import { 
  Clock, Share2, Printer, Bookmark, MessageSquare, ChevronLeft, ChevronRight, 
  Send, CheckCircle, ThumbsUp, ShieldCheck, MapPin, Copy, Check
} from 'lucide-react';

interface ArticleDetailProps {
  slug: string;
  onBack: () => void;
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: string) => void;
  ads: Advertisement[];
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  slug,
  onBack,
  onSelectArticle,
  onSelectCategory,
  ads
}) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);

  // New comment form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getArticleBySlug(slug).then(res => {
      if (!isMounted) return;
      if (res) {
        setArticle(res.article);
        setRelated(res.related);

        // Fetch comments for this article
        api.getComments(res.article.id).then(c => {
          if (isMounted) setComments(c);
        });
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-[#D71920] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-serif text-stone-600">Retrieving article dispatch from The Kenyan Ledger wire...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Article Not Found</h2>
        <p className="text-sm text-stone-600 mb-6">The requested dispatch may have been updated or archived.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase"
        >
          Return to Newsroom
        </button>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const currentUrl = window.location.href;
    const shareText = encodeURIComponent(`${article.title} - The Kenyan Ledger`);
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(currentUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentContent) return;

    setSubmittingComment(true);
    try {
      const newComment = await api.postComment({
        articleId: article.id,
        authorName: commentName,
        authorEmail: commentEmail || 'reader@kenyanledger.co.ke',
        content: commentContent
      });

      setComments(prev => [newComment, ...prev]);
      setCommentSubmitted(true);
      setCommentContent('');
      setCommentName('');
      setCommentEmail('');
    } catch (err) {
      alert('Unable to submit comment at this time.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = new Date(article.publishedAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <article className="w-full bg-white py-6">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-4 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-1.5 font-medium">
            <button onClick={onBack} className="hover:text-[#D71920] flex items-center gap-1 cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Wire</span>
            </button>
            <span className="text-stone-300">/</span>
            <button
              onClick={() => onSelectCategory(article.categoryId)}
              className="text-[#D71920] font-bold uppercase tracking-wider hover:underline"
            >
              {article.categoryId}
            </button>
            {article.county && (
              <>
                <span className="text-stone-300">/</span>
                <span className="text-stone-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00843D]" />
                  {article.county}
                </span>
              </>
            )}
          </div>

          {/* Reading tools: Font Size & Print */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-stone-200 rounded-xs text-xs font-semibold">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 ${fontSize === 'normal' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'}`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 border-l border-stone-200 ${fontSize === 'large' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'}`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 border-l border-stone-200 ${fontSize === 'xlarge' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'}`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="hover:text-stone-900 text-stone-400 p-1 transition-colors cursor-pointer"
              title="Print Article"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Article Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-black text-stone-950 leading-tight mb-4 tracking-tight">
          {article.title}
        </h1>

        {/* 2. Subhead / Standfirst */}
        {article.subhead && (
          <p className="text-base sm:text-lg md:text-xl font-serif italic text-stone-700 leading-relaxed mb-6 pb-4 border-b border-stone-200">
            {article.subhead}
          </p>
        )}

        {/* 3. Byline, Timestamps & Sharing Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 mb-6 border-b border-stone-200 text-xs">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
              <img
                src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.authorName)}&background=111111&color=ffffff&size=100`}
                alt={article.authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">
                By {article.authorName}
              </div>
              <div className="text-stone-500 text-[11px]">
                {article.authorRole} · The Kenyan Ledger
              </div>
            </div>
          </div>

          {/* Date, updated & reading time */}
          <div className="text-stone-500 flex flex-col sm:items-end text-[11px]">
            <div className="font-medium text-stone-700">
              Published: {formattedDate} at {formattedTime} EAT
            </div>
            {article.updatedAt && (
              <div className="text-stone-400 italic">
                Last updated: {new Date(article.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} EAT
              </div>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 font-mono text-[#D71920]">
                <Clock className="w-3 h-3" />
                {article.readingTimeMinutes} min read
              </span>
              <span>·</span>
              <span>{article.viewsCount.toLocaleString()} reads</span>
            </div>
          </div>
        </div>

        {/* 4. Social Sharing Toolbar */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-stone-50 border border-stone-200 mb-6 text-xs">
          <span className="font-bold uppercase tracking-wider text-stone-600 text-[11px] flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#D71920]" />
            Share This Story:
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="px-2.5 py-1 bg-[#00843D] text-white font-bold rounded-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="px-2.5 py-1 bg-stone-900 text-white font-bold rounded-xs hover:bg-stone-800 transition-colors cursor-pointer"
            >
              X (Twitter)
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="px-2.5 py-1 bg-blue-700 text-white font-bold rounded-xs hover:bg-blue-800 transition-colors cursor-pointer hidden sm:inline-block"
            >
              Facebook
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="px-2.5 py-1 bg-[#0A66C2] text-white font-bold rounded-xs hover:opacity-90 transition-opacity cursor-pointer hidden sm:inline-block"
            >
              LinkedIn
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="px-2.5 py-1 bg-stone-200 text-stone-800 font-medium rounded-xs hover:bg-stone-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Copy article link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Link'}</span>
            </button>
          </div>
        </div>

        {/* 5. Featured Image Presentation */}
        <figure className="mb-8">
          <div className="aspect-16/9 w-full overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {article.imageCaption && (
            <figcaption className="text-xs text-stone-500 font-serif italic mt-2 px-1 border-b border-stone-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>{article.imageCaption}</span>
              {article.imageCredit && (
                <span className="not-italic font-sans text-[10px] uppercase text-stone-400 font-medium tracking-wide">
                  Photo: {article.imageCredit}
                </span>
              )}
            </figcaption>
          )}
        </figure>

        {/* 6. Article Body Column */}
        <div className={`font-sans text-stone-800 leading-relaxed max-w-none ${
          fontSize === 'large' ? 'text-lg leading-loose' : fontSize === 'xlarge' ? 'text-xl leading-loose' : 'text-base leading-relaxed'
        }`}>
          {/* Paragraphs with Dropcap on first */}
          {article.content.split('\n\n').map((paragraph, index) => {
            // Check for markdown headers
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-8 mb-3 pt-4 border-t border-stone-200">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl sm:text-3xl font-serif font-black text-stone-900 mt-8 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n- ').map(i => i.replace('- ', ''));
              return (
                <ul key={index} className="list-disc pl-6 my-4 space-y-2 text-stone-700">
                  {items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              );
            }

            // In-article advertisement insert after paragraph 2
            if (index === 2) {
              return (
                <React.Fragment key={index}>
                  <p className="mb-5">{paragraph}</p>
                  <AdSlot placement="in_article" ads={ads} />
                </React.Fragment>
              );
            }

            return (
              <p 
                key={index} 
                className={`mb-5 ${index === 0 ? 'editorial-dropcap text-stone-900' : 'text-stone-800'}`}
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* 7. Tags / Keywords */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 mt-8 border-t border-stone-200">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-1">Filed Under:</span>
            {article.tags.map(t => (
              <span
                key={t}
                className="text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 transition-colors"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* 8. Editorial Correction & Policy Notice */}
        <div className="mt-8 p-4 bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#00843D] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-900 block mb-1">
              Editorial Standards & Verification Policy
            </span>
            <p className="leading-relaxed">
              *The Kenyan Ledger* adheres strictly to the Media Council of Kenya Code of Conduct for the Practice of Journalism. If you detect a factual inaccuracy, please contact our Readers&apos; Representative at <span className="underline font-mono">ombudsman@kenyanledger.co.ke</span> for transparent review and public correction.
            </p>
          </div>
        </div>

        {/* 9. Author Bio Card */}
        <div className="mt-8 p-6 bg-white border border-stone-300 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
            <img
              src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.authorName)}&background=111111&color=ffffff&size=120`}
              alt={article.authorName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-base font-serif font-bold text-stone-900 mb-0.5">
              About {article.authorName}
            </h4>
            <span className="text-xs text-[#D71920] font-semibold uppercase tracking-wider block mb-2">
              {article.authorRole}
            </span>
            <p className="text-xs text-stone-600 leading-relaxed font-sans mb-3">
              Investigative correspondent for The Kenyan Ledger. Dedicated to holding public institutions accountable through rigorous fact-finding and deep community engagement across Kenya.
            </p>
            <div className="text-[11px] text-stone-500 font-mono">
              Contact: press.desk@kenyanledger.co.ke
            </div>
          </div>
        </div>

        {/* 10. Moderated Comments Section */}
        <div className="mt-12 pt-8 border-t-2 border-stone-900">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#D71920]" />
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Reader Dialogue ({comments.length})
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              Civic & Moderated Discussion
            </span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="p-4 bg-stone-50 border border-stone-200 mb-8 rounded-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
              Leave a Verified Perspective
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Your Full Name *"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
                className="px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none focus:border-stone-900"
              />
              <input
                type="email"
                placeholder="Email Address (Private, not published)"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none focus:border-stone-900"
              />
            </div>

            <textarea
              placeholder="Contribute your analysis or civil critique of this report..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none focus:border-stone-900 mb-3"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-stone-500">
                Comments are reviewed in accordance with our community editorial standards.
              </span>
              <button
                type="submit"
                disabled={submittingComment}
                className="px-4 py-2 bg-stone-900 hover:bg-[#D71920] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{submittingComment ? 'Submitting...' : 'Post Comment'}</span>
              </button>
            </div>

            {commentSubmitted && (
              <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your perspective has been received and added to the ledger discourse.</span>
              </div>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map(c => (
                <div key={c.id} className="p-4 bg-white border border-stone-200 rounded-xs">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-stone-900">{c.authorName}</span>
                    <span className="text-stone-400 font-mono text-[10px]">
                      {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans mb-2">
                    {c.content}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
                    <button 
                      onClick={() => alert('Thank you for reacting to this reader comment.')}
                      className="hover:text-[#D71920] flex items-center gap-1 cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Support ({c.likesCount || 0})</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 italic text-center py-4">
                Be the first reader to comment on this report.
              </p>
            )}
          </div>
        </div>

        {/* 11. Related Stories in Same Category */}
        {related.length > 0 && (
          <div className="mt-14 pt-8 border-t-2 border-stone-900">
            <h3 className="text-xl font-serif font-black uppercase tracking-tight text-stone-900 mb-6">
              Related Coverage In {article.categoryId}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(rel => (
                <div 
                  key={rel.id} 
                  className="group cursor-pointer flex flex-col justify-between p-3 border border-stone-200 hover:border-stone-400 transition-colors bg-stone-50"
                  onClick={() => onSelectArticle(rel.slug)}
                >
                  <div>
                    <div className="aspect-16/10 w-full overflow-hidden bg-stone-200 mb-2">
                      <img
                        src={rel.featuredImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#D71920] block mb-1">
                      {rel.county || rel.categoryId}
                    </span>
                    <h4 className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-2 font-mono">
                    {rel.readingTimeMinutes} min read
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
