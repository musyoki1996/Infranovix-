import { Article, Comment, Advertisement, EditorialUser, DashboardMetrics, GitHubConfig, GitHubDeploymentRecord } from '../types/newspaper';
import { SEED_ARTICLES, SEED_ADS, SEED_COMMENTS } from '../data/seedData';
import { CATEGORIES, KENYA_COUNTIES } from '../data/counties';

const BASE_URL = '/api';

export const api = {
  // Articles
  async getArticles(params?: {
    category?: string;
    county?: string;
    status?: string;
    search?: string;
    limit?: number;
    sort?: string;
    breaking?: boolean;
  }): Promise<Article[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.county) searchParams.set('county', params.county);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.sort) searchParams.set('sort', params.sort);
      if (params?.breaking) searchParams.set('breaking', 'true');

      const res = await fetch(`${BASE_URL}/articles?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API error, falling back to seed articles:', err);
      let list = [...SEED_ARTICLES];
      if (params?.category) {
        list = list.filter(a => a.categoryId.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.county) {
        list = list.filter(a => a.county?.toLowerCase() === params.county?.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
      }
      if (params?.breaking) {
        list = list.filter(a => a.isBreaking);
      }
      if (params?.limit) {
        list = list.slice(0, params.limit);
      }
      return list;
    }
  },

  async getArticleBySlug(slug: string): Promise<{ article: Article; related: Article[] } | null> {
    try {
      const res = await fetch(`${BASE_URL}/articles/${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error('Failed to load article');
      const json = await res.json();
      return { article: json.data, related: json.related || [] };
    } catch (err) {
      console.warn('API error fetching single article, finding in seed data:', err);
      const article = SEED_ARTICLES.find(a => a.slug === slug || a.id === slug) || SEED_ARTICLES[0];
      const related = SEED_ARTICLES.filter(a => a.id !== article.id && a.categoryId === article.categoryId).slice(0, 4);
      return { article, related };
    }
  },

  async createArticle(articleData: Partial<Article>): Promise<Article> {
    const res = await fetch(`${BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create article');
    }
    const json = await res.json();
    return json.data;
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const res = await fetch(`${BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update article');
    const json = await res.json();
    return json.data;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/articles/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getBreakingNews(): Promise<Article[]> {
    try {
      const res = await fetch(`${BASE_URL}/breaking`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return SEED_ARTICLES.filter(a => a.isBreaking);
    }
  },

  // Comments
  async getComments(articleId: string): Promise<Comment[]> {
    try {
      const res = await fetch(`${BASE_URL}/comments/${articleId}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return SEED_COMMENTS.filter(c => c.articleId === articleId && c.status === 'approved');
    }
  },

  async postComment(comment: { articleId: string; authorName: string; authorEmail: string; content: string }): Promise<Comment> {
    const res = await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    if (!res.ok) throw new Error('Failed to post comment');
    const json = await res.json();
    return json.data;
  },

  async getAdminComments(): Promise<Comment[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/comments`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return SEED_COMMENTS;
    }
  },

  async updateCommentStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    await fetch(`${BASE_URL}/admin/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  // Ads
  async getAds(placement?: string): Promise<Advertisement[]> {
    try {
      const url = placement ? `${BASE_URL}/ads?placement=${placement}` : `${BASE_URL}/ads`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return SEED_ADS.filter(a => a.active && (!placement || a.placement === placement));
    }
  },

  async getAdminAds(): Promise<Advertisement[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/ads`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return SEED_ADS;
    }
  },

  async updateAd(id: string, updates: Partial<Advertisement>): Promise<Advertisement> {
    const res = await fetch(`${BASE_URL}/admin/ads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    return json.data;
  },

  async createAd(ad: Partial<Advertisement>): Promise<Advertisement> {
    const res = await fetch(`${BASE_URL}/admin/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ad)
    });
    const json = await res.json();
    return json.data;
  },

  // Newsletter
  async subscribeNewsletter(email: string, edition?: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, edition })
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Subscribed successfully to The Kenyan Ledger updates.' };
    }
  },

  async getSubscribers(): Promise<any[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/subscribers`);
      const json = await res.json();
      return json.data;
    } catch {
      return [];
    }
  },

  // Admin Auth & Stats
  async loginAdmin(credentials: { email: string; password: string }): Promise<{ token: string; user: EditorialUser }> {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Authentication failed');
    }
    return await res.json();
  },

  async getDashboardStats(): Promise<DashboardMetrics> {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return {
        totalPublished: SEED_ARTICLES.length,
        totalDrafts: 2,
        totalPending: 1,
        totalViews: 84200,
        totalComments: SEED_COMMENTS.length,
        pendingComments: 0,
        totalSubscribers: 3420,
        activeAds: 5
      };
    }
  },

  // GitHub Integration & Deploy Utility
  async getGitHubConfig(): Promise<GitHubConfig> {
    try {
      const res = await fetch(`${BASE_URL}/admin/github/config`);
      const json = await res.json();
      return json.data;
    } catch {
      return {
        owner: 'mutisya104',
        repo: 'the-kenyan-ledger',
        branch: 'main',
        targetPath: 'data/newspaper-store.json',
        autoDeployOnPublish: false,
        includeMarkdownExport: true
      };
    }
  },

  async saveGitHubConfig(config: Partial<GitHubConfig>): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/admin/github/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await res.json();
  },

  async testGitHubConnection(params: { owner: string; repo: string; token?: string }): Promise<{ success: boolean; message: string; details?: any }> {
    const res = await fetch(`${BASE_URL}/admin/github/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  },

  async deployToGitHub(payload: {
    commitMessage: string;
    branch?: string;
    targetPath?: string;
    authorName?: string;
    deployedBy?: string;
    owner?: string;
    repo?: string;
    token?: string;
  }): Promise<{ success: boolean; message: string; deployment: GitHubDeploymentRecord }> {
    const res = await fetch(`${BASE_URL}/admin/github/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Deployment to GitHub failed');
    }
    return await res.json();
  },

  async getGitHubDeployHistory(): Promise<GitHubDeploymentRecord[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/github/history`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  getCategories() {
    return CATEGORIES;
  },

  getCounties() {
    return KENYA_COUNTIES;
  }
};
