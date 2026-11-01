import React, { useState, useEffect } from 'react';
import { Article, Comment, Advertisement, EditorialUser, DashboardMetrics, ContentStatus } from '../types/newspaper';
import { api } from '../services/api';
import { CATEGORIES, KENYA_COUNTIES } from '../data/counties';
import { 
  FileText, LayoutDashboard, PlusCircle, CheckCircle, Edit, Trash2, 
  Eye, MessageSquare, Megaphone, Users, LogOut, Search, Clock, Save, 
  X, Check, AlertCircle, ArrowLeft, RefreshCw, GitPullRequest
} from 'lucide-react';
import { GitHubDeployUtility } from './GitHubDeployUtility';

interface AdminDashboardProps {
  user: EditorialUser | null;
  onLogout: () => void;
  onClose: () => void;
  onSelectArticle: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onClose,
  onSelectArticle
}) => {
  // Tabs: overview, articles, create_edit, comments, ads, subscribers, github_deploy
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'create_edit' | 'comments' | 'ads' | 'subscribers' | 'github_deploy'>('overview');
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter for Article List
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Editing state
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isEditingNew, setIsEditingNew] = useState(false);
  const [savingArticle, setSavingArticle] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available image presets for easy editorial insertion
  const sampleImages = [
    { label: 'Nairobi Skyline & Expressway (Hero)', path: '/src/assets/images/hero_nairobi_infrastructure_1793527266254.jpg' },
    { label: 'Kenyan Parliament & State Flags', path: '/src/assets/images/politics_kenya_parliament_1793527267313.jpg' },
    { label: 'Nairobi Financial District Trading Room', path: '/src/assets/images/business_nairobi_exchange_1793527267719.jpg' },
    { label: 'Kenyan Athletics Track & Runners', path: '/src/assets/images/sports_kenya_athletics_1793527268972.jpg' },
    { label: 'Silicon Savannah Tech Incubator Hub', path: '/src/assets/images/tech_silicon_savannah_1793527376692.jpg' },
  ];

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [m, arts, comms, adList, subs] = await Promise.all([
        api.getDashboardStats(),
        api.getArticles({ status: 'all' }),
        api.getAdminComments(),
        api.getAdminAds(),
        api.getSubscribers()
      ]);
      setMetrics(m);
      setArticles(arts);
      setComments(comms);
      setAds(adList);
      setSubscribers(subs);
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleStartNewArticle = () => {
    setEditingArticle({
      title: '',
      subhead: '',
      excerpt: '',
      content: '',
      categoryId: 'national',
      county: '',
      tags: [],
      authorName: user?.name || 'Peter Omondi',
      authorRole: 'Senior Correspondent',
      featuredImage: sampleImages[0].path,
      imageCaption: '',
      imageCredit: 'The Kenyan Ledger Press Photo',
      status: 'published',
      isBreaking: false,
      isLeadStory: false,
      isTopStory: false,
      isTrending: false
    });
    setIsEditingNew(true);
    setActiveTab('create_edit');
  };

  const handleEditExisting = (art: Article) => {
    setEditingArticle({ ...art });
    setIsEditingNew(false);
    setActiveTab('create_edit');
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.content) {
      alert('Please fill in both the title and content.');
      return;
    }

    setSavingArticle(true);
    try {
      if (isEditingNew) {
        await api.createArticle(editingArticle);
      } else if (editingArticle.id) {
        await api.updateArticle(editingArticle.id, editingArticle);
      }
      setSaveSuccess(true);
      await loadAllData();
      setTimeout(() => {
        setSaveSuccess(false);
        setActiveTab('articles');
      }, 1200);
    } catch (err: any) {
      alert('Error saving article: ' + (err.message || 'Server error'));
    } finally {
      setSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this article from The Kenyan Ledger?')) {
      await api.deleteArticle(id);
      await loadAllData();
    }
  };

  const handleToggleAd = async (ad: Advertisement) => {
    await api.updateAd(ad.id, { active: !ad.active });
    await loadAllData();
  };

  const handleModerateComment = async (id: string, status: 'approved' | 'rejected') => {
    await api.updateCommentStatus(id, status);
    await loadAllData();
  };

  // Filtered articles list
  const filteredArticles = articles.filter(art => {
    const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
    const matchesSearch = !searchTerm || (
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.categoryId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-stone-100 font-sans pb-16">
      
      {/* Top Admin Bar */}
      <header className="bg-stone-900 text-white border-b-2 border-[#D71920] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#D71920] rounded-full"></span>
            <div>
              <span className="font-serif font-bold text-base sm:text-lg tracking-tight">
                The Kenyan Ledger · Editorial Publishing System
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">
                Newsroom Portal · Role: {user?.role || 'Managing Editor'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadAllData}
              className="p-1.5 text-stone-400 hover:text-white transition-colors"
              title="Refresh Newsroom Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="text-xs bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-stone-300 hover:text-white rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Newspaper</span>
            </button>

            <button
              onClick={onLogout}
              className="text-xs bg-[#D71920] hover:bg-red-700 px-3 py-1.5 text-white font-bold rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 border-t border-stone-800 flex items-center space-x-1 sm:space-x-4 overflow-x-auto text-xs font-bold uppercase tracking-wider scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview' ? 'border-[#D71920] text-white' : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'articles' ? 'border-[#D71920] text-white' : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Articles ({articles.length})</span>
          </button>

          <button
            onClick={handleStartNewArticle}
            className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'create_edit' ? 'border-[#D71920] text-white' : 'border-transparent text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Write New Story</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'comments' ? 'border-[#D71920] text-white' : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comments ({comments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ads' ? 'border-[#D71920] text-white' : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Ad Campaigns ({ads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'subscribers' ? 'border-[#D71920] text-white' : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Subscribers ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('github_deploy')}
            className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap bg-stone-800/60 rounded-t-xs ${
              activeTab === 'github_deploy' ? 'border-[#D71920] text-white font-black' : 'border-transparent text-stone-200 hover:text-white'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Deploy to GitHub</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
                Newsroom Command Center
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Real-time editorial status, reader analytics, and publishing cadence.
              </p>
            </div>

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200 p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Published Articles
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
                  {metrics?.totalPublished || articles.length}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
                  Live on public wire
                </span>
              </div>

              <div className="bg-white border border-stone-200 p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Drafts & In-Progress
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
                  {metrics?.totalDrafts || 0}
                </div>
                <span className="text-[11px] text-stone-500 mt-1 inline-block">
                  Desk assignments
                </span>
              </div>

              <div className="bg-white border border-stone-200 p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Total Article Reads
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
                  {metrics?.totalViews.toLocaleString() || '74,800'}
                </div>
                <span className="text-[11px] text-[#D71920] font-medium mt-1 inline-block">
                  Verified audience reach
                </span>
              </div>

              <div className="bg-white border border-stone-200 p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Newsletter Readers
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
                  {metrics?.totalSubscribers || subscribers.length}
                </div>
                <span className="text-[11px] text-stone-500 mt-1 inline-block">
                  Daily Morning subscribers
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Top Performing Stories */}
              <div className="lg:col-span-8 bg-white border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Highest Impact Published Dispatches
                  </h3>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="text-xs text-[#D71920] font-bold hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {articles.slice(0, 5).map(art => (
                    <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#D71920] mb-0.5">
                          <span>{art.categoryId}</span>
                          {art.county && <span>· {art.county}</span>}
                          {art.isLeadStory && <span className="bg-red-100 text-red-800 px-1">Lead</span>}
                        </div>
                        <h4 className="text-sm font-serif font-bold text-stone-900 truncate">
                          {art.title}
                        </h4>
                        <div className="text-[11px] text-stone-500">
                          By {art.authorName} · {new Date(art.publishedAt).toLocaleDateString('en-GB')}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-stone-600 tabular-nums">
                          {art.viewsCount.toLocaleString()} reads
                        </span>
                        <button
                          onClick={() => handleEditExisting(art)}
                          className="p-1 hover:bg-stone-100 text-stone-600 rounded-xs"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Editorial Quick Tools */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-stone-900 text-white p-5 rounded-xs">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D71920] block mb-1">
                    Editorial Workflow
                  </span>
                  <h4 className="text-base font-serif font-bold mb-2">
                    Publish Breaking News
                  </h4>
                  <p className="text-xs text-stone-300 mb-4 leading-relaxed">
                    Instantly broadcast priority breaking headlines directly to the public red ticker and homepage hero.
                  </p>
                  <button
                    onClick={handleStartNewArticle}
                    className="w-full py-2 bg-[#D71920] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    + Compose Wire Dispatch
                  </button>
                </div>

                {/* GitHub Sync Card */}
                <div className="bg-white border-2 border-stone-900 p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <GitPullRequest className="w-4 h-4 text-[#D71920]" />
                    <span className="text-xs font-serif font-black uppercase text-stone-900">
                      GitHub State Sync
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                    Deploy current article database and newsroom states directly to your connected GitHub repository.
                  </p>
                  <button
                    onClick={() => setActiveTab('github_deploy')}
                    className="w-full py-2 bg-stone-900 hover:bg-[#D71920] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Open Deploy Utility &rarr;
                  </button>
                </div>

                <div className="bg-white border border-stone-200 p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                    Newsroom Guidelines
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-2 list-disc pl-4">
                    <li>Always cross-check primary sources before checking the &ldquo;Breaking News&rdquo; flag.</li>
                    <li>Specify Kenyan County when reporting on devolved matters to power the 47 Counties Explorer.</li>
                    <li>Ensure photo credits match licensed newsroom archives or official pool attribution.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ARTICLES MANAGEMENT LIST */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
                  Articles & Editorial Archive
                </h2>
                <p className="text-xs text-stone-600">
                  Manage publication statuses, assign beats, and edit stories.
                </p>
              </div>

              <button
                onClick={handleStartNewArticle}
                className="px-4 py-2 bg-[#D71920] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Article</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-stone-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-stone-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-300 px-2 py-1 focus:outline-none"
                >
                  <option value="all">All Content</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="pending">Pending Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 w-full bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white border border-stone-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-4 py-3">Headline / Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Views</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredArticles.map(art => (
                    <tr key={art.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-4 py-3 max-w-sm">
                        <div className="font-serif font-bold text-stone-900 line-clamp-1">
                          {art.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {art.isLeadStory && (
                            <span className="text-[9px] font-bold uppercase bg-red-100 text-[#D71920] px-1.5 py-0.2">
                              Lead Story
                            </span>
                          )}
                          {art.isBreaking && (
                            <span className="text-[9px] font-bold uppercase bg-stone-900 text-white px-1.5 py-0.2">
                              Breaking
                            </span>
                          )}
                          {art.county && (
                            <span className="text-[9px] text-[#00843D] font-bold">
                              {art.county}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 uppercase font-bold text-[#D71920]">
                        {art.categoryId}
                      </td>

                      <td className="px-4 py-3 text-stone-700 font-medium">
                        {art.authorName}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                          art.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                          art.status === 'draft' ? 'bg-stone-200 text-stone-700' :
                          art.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {art.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono tabular-nums text-stone-600">
                        {art.viewsCount.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-stone-500 font-mono text-[11px]">
                        {new Date(art.publishedAt).toLocaleDateString('en-GB')}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              onSelectArticle(art.slug);
                              onClose();
                            }}
                            className="p-1 text-stone-400 hover:text-stone-900"
                            title="Preview On Website"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleEditExisting(art)}
                            className="p-1 text-stone-600 hover:text-[#D71920]"
                            title="Edit Article"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1 text-stone-400 hover:text-red-700"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RICH ARTICLE EDITOR */}
        {activeTab === 'create_edit' && editingArticle && (
          <div className="bg-white border border-stone-300 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {isEditingNew ? 'Write & Publish New Article' : `Editing: ${editingArticle.title || 'Untitled'}`}
                </h3>
                <span className="text-xs text-stone-500">
                  Newsroom Editor · The Kenyan Ledger CMS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className="px-3 py-1.5 border border-stone-300 text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-6">
              
              {/* Title & Subhead */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Main Headline *
                  </label>
                  <input
                    type="text"
                    value={editingArticle.title || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    required
                    placeholder="Enter authoritative headline..."
                    className="w-full text-lg sm:text-xl font-serif font-bold px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Subhead / Standfirst Deck
                  </label>
                  <input
                    type="text"
                    value={editingArticle.subhead || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, subhead: e.target.value })}
                    placeholder="Brief 1-line explanatory deck..."
                    className="w-full text-sm font-serif italic px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Category, County, Author & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    Desk / Category *
                  </label>
                  <select
                    value={editingArticle.categoryId || 'national'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, categoryId: e.target.value })}
                    className="w-full text-xs px-2 py-1.5 bg-white border border-stone-300 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    Kenyan County (Optional)
                  </label>
                  <select
                    value={editingArticle.county || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, county: e.target.value })}
                    className="w-full text-xs px-2 py-1.5 bg-white border border-stone-300 focus:outline-none"
                  >
                    <option value="">National / Pan-African</option>
                    {KENYA_COUNTIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    Author Byline *
                  </label>
                  <input
                    type="text"
                    value={editingArticle.authorName || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, authorName: e.target.value })}
                    required
                    className="w-full text-xs px-2 py-1.5 bg-white border border-stone-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    Editorial Status *
                  </label>
                  <select
                    value={editingArticle.status || 'published'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as ContentStatus })}
                    className="w-full text-xs px-2 py-1.5 bg-white border border-stone-300 focus:outline-none font-bold"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="pending">Pending Review</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Editorial Placement Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 p-3 bg-stone-100/70 border border-stone-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#D71920]">
                  <input
                    type="checkbox"
                    checked={editingArticle.isBreaking || false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isBreaking: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Breaking News Ticker</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900">
                  <input
                    type="checkbox"
                    checked={editingArticle.isLeadStory || false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isLeadStory: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Frontpage Lead Story</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={editingArticle.isTopStory || false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isTopStory: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Top Stories Section</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={editingArticle.isTrending || false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isTrending: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Trending Spotlight</span>
                </label>
              </div>

              {/* Featured Image Selector & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    Featured Photograph
                  </label>
                  <select
                    value={editingArticle.featuredImage}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featuredImage: e.target.value })}
                    className="w-full text-xs px-2 py-1.5 bg-white border border-stone-300 mb-2 focus:outline-none"
                  >
                    {sampleImages.map(img => (
                      <option key={img.path} value={img.path}>{img.label}</option>
                    ))}
                  </select>

                  <div className="aspect-16/9 bg-stone-100 overflow-hidden border border-stone-200">
                    <img
                      src={editingArticle.featuredImage || sampleImages[0].path}
                      alt="Featured Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                      Photojournalism Caption
                    </label>
                    <textarea
                      value={editingArticle.imageCaption || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, imageCaption: e.target.value })}
                      rows={3}
                      placeholder="Contextual description of the photograph..."
                      className="w-full text-xs px-2 py-1.5 bg-white border border-stone-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                      Photo Attribution / Credit
                    </label>
                    <input
                      type="text"
                      value={editingArticle.imageCredit || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, imageCredit: e.target.value })}
                      placeholder="e.g. The Kenyan Ledger / Photo Bureau"
                      className="w-full text-xs px-2 py-1.5 bg-white border border-stone-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Article Excerpt / Summary (Used on card previews & social meta)
                </label>
                <textarea
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  rows={2}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Rich Body Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Article Body * (Markdown supported: ## Headings, - Lists, &gt; Quotes)
                  </label>
                  
                  {/* Quick Format Helpers */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingArticle({ ...editingArticle, content: (editingArticle.content || '') + '\n\n### Subheading Title\n\n' })}
                      className="text-[10px] bg-stone-200 hover:bg-stone-300 px-2 py-0.5 font-bold"
                    >
                      + H3 Section
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingArticle({ ...editingArticle, content: (editingArticle.content || '') + '\n\n- Key development 1\n- Key development 2\n\n' })}
                      className="text-[10px] bg-stone-200 hover:bg-stone-300 px-2 py-0.5 font-bold"
                    >
                      + Bullet List
                    </button>
                  </div>
                </div>

                <textarea
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  required
                  rows={12}
                  placeholder="Enter full news report body..."
                  className="w-full text-sm font-sans p-3 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className="px-4 py-2 border border-stone-300 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-100"
                >
                  Discard Changes
                </button>

                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Saved & Published!
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={savingArticle}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-[#D71920] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingArticle ? 'Publishing...' : 'Save & Deploy to Wire'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* TAB 4: COMMENTS MODERATION */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
                Reader Dialogue Moderation
              </h2>
              <p className="text-xs text-stone-600">
                Review and approve civic discourse from verified readers.
              </p>
            </div>

            <div className="bg-white border border-stone-200 divide-y divide-stone-200 shadow-xs">
              {comments.map(c => (
                <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-bold text-stone-900">{c.authorName}</span>
                      <span className="text-stone-400 font-mono text-[10px]">{c.authorEmail}</span>
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                        c.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed mb-1">
                      &ldquo;{c.content}&rdquo;
                    </p>
                    <div className="text-[10px] text-stone-400">
                      Story: {c.articleTitle || 'National Dispatch'} · {new Date(c.createdAt).toLocaleDateString('en-GB')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {c.status !== 'approved' && (
                      <button
                        onClick={() => handleModerateComment(c.id, 'approved')}
                        className="px-2.5 py-1 bg-[#00843D] text-white text-[11px] font-bold uppercase rounded-xs"
                      >
                        Approve
                      </button>
                    )}
                    {c.status !== 'rejected' && (
                      <button
                        onClick={() => handleModerateComment(c.id, 'rejected')}
                        className="px-2.5 py-1 bg-stone-200 hover:bg-red-100 hover:text-red-800 text-stone-700 text-[11px] font-bold uppercase rounded-xs"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ADVERTISEMENT SLOTS MANAGEMENT */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
                Advertising & Sponsorship Placements
              </h2>
              <p className="text-xs text-stone-600">
                Configure partner campaigns, Google AdSense inventory, and sponsored features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.map(ad => (
                <div key={ad.id} className="bg-white border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D71920] bg-red-50 px-2 py-0.5 border border-red-100">
                        {ad.placement}
                      </span>
                      <button
                        onClick={() => handleToggleAd(ad)}
                        className={`text-xs px-2 py-0.5 font-bold uppercase rounded-xs cursor-pointer ${
                          ad.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {ad.active ? 'Active' : 'Paused'}
                      </button>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-stone-900 mb-1">
                      {ad.title}
                    </h4>
                    <p className="text-xs text-stone-600 mb-2">
                      Client: <span className="font-bold text-stone-800">{ad.clientName}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mono">
                    <span>{ad.impressions.toLocaleString()} views</span>
                    <span>{ad.clicks.toLocaleString()} clicks</span>
                    <span>CTR: {((ad.clicks / Math.max(1, ad.impressions)) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
                Newsletter Subscribers Database
              </h2>
              <p className="text-xs text-stone-600">
                Registered audience members receiving the daily newsroom dispatches.
              </p>
            </div>

            <div className="bg-white border border-stone-200 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-bold">
                  <tr>
                    <th className="px-4 py-3">Subscriber Email</th>
                    <th className="px-4 py-3">Edition</th>
                    <th className="px-4 py-3">Subscribed Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {subscribers.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td className="px-4 py-3 font-mono font-medium text-stone-900">{s.email}</td>
                      <td className="px-4 py-3 text-stone-600">{s.edition || 'Daily Morning Brief'}</td>
                      <td className="px-4 py-3 font-mono text-stone-500">
                        {new Date(s.subscribedAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: GITHUB DEPLOY UTILITY */}
        {activeTab === 'github_deploy' && (
          <GitHubDeployUtility
            articles={articles}
            currentUser={user}
          />
        )}

      </main>

    </div>
  );
};
