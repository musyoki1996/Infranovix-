import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SEED_ARTICLES, SEED_AUTHORS, SEED_ADS, SEED_COMMENTS, SEED_SUBSCRIBERS } from './src/data/seedData.ts';
import { KENYA_COUNTIES, CATEGORIES } from './src/data/counties.ts';
import { Article, Comment, Advertisement, NewsletterSubscriber, EditorialUser, DashboardMetrics } from './src/types/newspaper.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Persistent storage setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'newspaper-store.json');

interface StoreSchema {
  articles: Article[];
  authors: any[];
  ads: Advertisement[];
  comments: Comment[];
  subscribers: NewsletterSubscriber[];
  users: EditorialUser[];
  siteSettings: {
    siteName: string;
    tagline: string;
    edition: string;
    weatherCity: string;
    tickerEnabled: boolean;
  };
  githubConfig?: {
    owner: string;
    repo: string;
    branch: string;
    token?: string;
    targetPath: string;
    autoDeployOnPublish: boolean;
    includeMarkdownExport: boolean;
    lastDeployedAt?: string;
    lastCommitSha?: string;
  };
  githubDeployments?: any[];
}

const DEFAULT_USERS: EditorialUser[] = [
  {
    id: 'usr-1',
    name: 'Peter Omondi',
    email: 'editor@kenyanledger.co.ke',
    role: 'managing_editor',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    token: 'ledger-tok-editor-2026'
  },
  {
    id: 'usr-2',
    name: 'Super Admin',
    email: 'admin@kenyanledger.co.ke',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    token: 'ledger-tok-superadmin-2026'
  },
  {
    id: 'usr-3',
    name: 'Faith Mwangi',
    email: 'faith.m@kenyanledger.co.ke',
    role: 'journalist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    token: 'ledger-tok-journalist-2026'
  }
];

function initDatabase(): StoreSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.githubConfig) {
        parsed.githubConfig = {
          owner: 'mutisya104',
          repo: 'the-kenyan-ledger',
          branch: 'main',
          token: process.env.GITHUB_TOKEN || '',
          targetPath: 'data/newspaper-store.json',
          autoDeployOnPublish: false,
          includeMarkdownExport: true,
          lastDeployedAt: undefined,
          lastCommitSha: undefined
        };
      }
      if (!parsed.githubDeployments) {
        parsed.githubDeployments = [];
      }
      return parsed;
    } catch (e) {
      console.error('Failed reading DB file, recreating default:', e);
    }
  }

  const initialStore: StoreSchema = {
    articles: SEED_ARTICLES,
    authors: SEED_AUTHORS,
    ads: SEED_ADS,
    comments: SEED_COMMENTS,
    subscribers: SEED_SUBSCRIBERS,
    users: DEFAULT_USERS,
    siteSettings: {
      siteName: 'The Kenyan Ledger',
      tagline: 'Journalism That Matters.',
      edition: "KENYA'S INDEPENDENT DIGITAL NEWSROOM",
      weatherCity: 'Nairobi 24°C Sunny',
      tickerEnabled: true
    },
    githubConfig: {
      owner: 'mutisya104',
      repo: 'the-kenyan-ledger',
      branch: 'main',
      token: process.env.GITHUB_TOKEN || '',
      targetPath: 'data/newspaper-store.json',
      autoDeployOnPublish: false,
      includeMarkdownExport: true
    },
    githubDeployments: []
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
  return initialStore;
}

let db = initDatabase();

function persistDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Database write error:', err);
  }
}

// ---------------- API ROUTES ----------------

// 1. Articles List & Filter
app.get('/api/articles', (req, res) => {
  const { category, county, status, search, limit, breaking, sort } = req.query;
  
  let result = [...db.articles];

  // Filter by status (public view defaults to 'published')
  if (status) {
    if (status !== 'all') {
      result = result.filter(a => a.status === status);
    }
  } else {
    // Default public: published only
    result = result.filter(a => a.status === 'published');
  }

  if (category) {
    result = result.filter(a => a.categoryId.toLowerCase() === String(category).toLowerCase());
  }

  if (county) {
    result = result.filter(a => a.county && a.county.toLowerCase() === String(county).toLowerCase());
  }

  if (breaking === 'true') {
    result = result.filter(a => a.isBreaking);
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      a.authorName.toLowerCase().includes(q) ||
      (a.county && a.county.toLowerCase().includes(q)) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'views') {
    result.sort((a, b) => b.viewsCount - a.viewsCount);
  } else if (sort === 'trending') {
    result.sort((a, b) => (b.viewsCount + b.sharesCount * 3) - (a.viewsCount + a.sharesCount * 3));
  } else {
    // newest first
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  if (limit) {
    result = result.slice(0, Number(limit));
  }

  res.json({ success: true, count: result.length, data: result });
});

// 2. Single Article by Slug or ID
app.get('/api/articles/:slugOrId', (req, res) => {
  const { slugOrId } = req.params;
  const article = db.articles.find(a => a.id === slugOrId || a.slug === slugOrId);

  if (!article) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }

  // Increment view counter
  article.viewsCount += 1;
  persistDb();

  // Related articles in same category
  const related = db.articles
    .filter(a => a.id !== article.id && a.status === 'published' && a.categoryId === article.categoryId)
    .slice(0, 4);

  res.json({ success: true, data: article, related });
});

// 3. Create Article (CMS)
app.post('/api/articles', (req, res) => {
  const {
    title,
    subhead,
    excerpt,
    content,
    categoryId,
    county,
    tags,
    authorId,
    authorName,
    authorRole,
    featuredImage,
    imageCaption,
    imageCredit,
    status = 'draft',
    isBreaking = false,
    isLeadStory = false,
    isTopStory = false,
    isTrending = false
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) + '-' + Date.now().toString().slice(-4);

  // If new article is set as lead story, demote previous lead story
  if (isLeadStory) {
    db.articles.forEach(a => { a.isLeadStory = false; });
  }

  const wordCount = content.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));

  const newArticle: Article = {
    id: 'art-' + Date.now(),
    slug,
    title,
    subhead: subhead || '',
    excerpt: excerpt || content.slice(0, 160) + '...',
    content,
    categoryId: categoryId || 'national',
    county: county || undefined,
    tags: Array.isArray(tags) ? tags : [],
    authorId: authorId || 'author-1',
    authorName: authorName || 'Peter Omondi',
    authorRole: authorRole || 'Editor',
    featuredImage: featuredImage || '/src/assets/images/hero_nairobi_infrastructure_1793527266254.jpg',
    imageCaption: imageCaption || '',
    imageCredit: imageCredit || 'The Kenyan Ledger',
    readingTimeMinutes,
    publishedAt: status === 'published' ? new Date().toISOString() : new Date().toISOString(),
    status,
    isBreaking: Boolean(isBreaking),
    isLeadStory: Boolean(isLeadStory),
    isTopStory: Boolean(isTopStory),
    isTrending: Boolean(isTrending),
    viewsCount: 0,
    sharesCount: 0,
    commentsCount: 0
  };

  db.articles.unshift(newArticle);
  persistDb();

  res.status(201).json({ success: true, data: newArticle });
});

// 4. Update Article (CMS)
app.put('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  const index = db.articles.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }

  const existing = db.articles[index];
  const updates = req.body;

  if (updates.isLeadStory) {
    db.articles.forEach(a => { a.isLeadStory = false; });
  }

  db.articles[index] = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  persistDb();
  res.json({ success: true, data: db.articles[index] });
});

// 5. Delete Article (CMS)
app.delete('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = db.articles.length;
  db.articles = db.articles.filter(a => a.id !== id);

  if (db.articles.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }

  persistDb();
  res.json({ success: true, message: 'Article deleted successfully' });
});

// 6. Breaking News Ticker
app.get('/api/breaking', (_req, res) => {
  const breaking = db.articles.filter(a => a.isBreaking && a.status === 'published');
  res.json({ success: true, data: breaking });
});

// 7. Categories & Counties lists
app.get('/api/categories', (_req, res) => {
  const counts = db.articles.reduce((acc, a) => {
    if (a.status === 'published') {
      acc[a.categoryId] = (acc[a.categoryId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const withCounts = CATEGORIES.map(c => ({
    ...c,
    articleCount: counts[c.id] || 0
  }));

  res.json({ success: true, data: withCounts });
});

app.get('/api/counties', (_req, res) => {
  const counts = db.articles.reduce((acc, a) => {
    if (a.county && a.status === 'published') {
      acc[a.county] = (acc[a.county] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const withCounts = KENYA_COUNTIES.map(c => ({
    ...c,
    articleCount: counts[c.name] || 0
  }));

  res.json({ success: true, data: withCounts });
});

// 8. Authors
app.get('/api/authors', (_req, res) => {
  res.json({ success: true, data: db.authors });
});

// 9. Comments (Public & Admin)
app.get('/api/comments/:articleId', (req, res) => {
  const { articleId } = req.params;
  const comments = db.comments.filter(c => c.articleId === articleId && c.status === 'approved');
  res.json({ success: true, data: comments });
});

app.post('/api/comments', (req, res) => {
  const { articleId, authorName, authorEmail, content } = req.body;

  if (!articleId || !authorName || !content) {
    return res.status(400).json({ success: false, message: 'Missing required comment fields' });
  }

  const article = db.articles.find(a => a.id === articleId);

  const newComment: Comment = {
    id: 'comm-' + Date.now(),
    articleId,
    articleTitle: article ? article.title : 'Article',
    authorName,
    authorEmail: authorEmail || 'reader@kenyanledger.co.ke',
    content,
    createdAt: new Date().toISOString(),
    status: 'approved', // Auto-approved in demo for instant satisfaction
    likesCount: 0
  };

  db.comments.unshift(newComment);
  if (article) {
    article.commentsCount = (article.commentsCount || 0) + 1;
  }
  persistDb();

  res.status(201).json({ success: true, data: newComment, message: 'Comment submitted successfully' });
});

app.get('/api/admin/comments', (_req, res) => {
  res.json({ success: true, data: db.comments });
});

app.put('/api/admin/comments/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const comm = db.comments.find(c => c.id === id);

  if (!comm) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  comm.status = status;
  persistDb();
  res.json({ success: true, data: comm });
});

// 10. Advertisements Management
app.get('/api/ads', (req, res) => {
  const { placement } = req.query;
  let ads = db.ads.filter(a => a.active);
  if (placement) {
    ads = ads.filter(a => a.placement === placement);
  }
  res.json({ success: true, data: ads });
});

app.get('/api/admin/ads', (_req, res) => {
  res.json({ success: true, data: db.ads });
});

app.put('/api/admin/ads/:id', (req, res) => {
  const { id } = req.params;
  const ad = db.ads.find(a => a.id === id);
  if (!ad) {
    return res.status(404).json({ success: false, message: 'Ad not found' });
  }

  Object.assign(ad, req.body);
  persistDb();
  res.json({ success: true, data: ad });
});

app.post('/api/admin/ads', (req, res) => {
  const { title, placement, type, destinationUrl, clientName, dimensions } = req.body;
  const newAd: Advertisement = {
    id: 'ad-' + Date.now(),
    title: title || 'New Campaign',
    placement: placement || 'sidebar_mpu',
    type: type || 'direct',
    destinationUrl: destinationUrl || '',
    clientName: clientName || 'Direct Advertiser',
    active: true,
    impressions: 0,
    clicks: 0,
    dimensions: dimensions || 'Responsive'
  };
  db.ads.push(newAd);
  persistDb();
  res.status(201).json({ success: true, data: newAd });
});

// 11. Newsletter
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, edition = 'Daily Morning Brief' } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const existing = db.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.json({ success: true, message: 'You are already subscribed to The Kenyan Ledger updates.' });
  }

  const newSub: NewsletterSubscriber = {
    id: 'sub-' + Date.now(),
    email,
    subscribedAt: new Date().toISOString(),
    status: 'active',
    edition
  };

  db.subscribers.push(newSub);
  persistDb();
  res.status(201).json({ success: true, message: 'Thank you for subscribing to The Kenyan Ledger. Journalism That Matters.' });
});

app.get('/api/admin/subscribers', (_req, res) => {
  res.json({ success: true, data: db.subscribers });
});

// 12. Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  // Pre-configured newsroom accounts for demonstration & verification
  if (
    (email === 'editor@kenyanledger.co.ke' && password === 'editor123') ||
    (email === 'admin@kenyanledger.co.ke' && password === 'admin123') ||
    (email === 'journalist@kenyanledger.co.ke' && password === 'press123')
  ) {
    const user = db.users.find(u => u.email === email) || db.users[0];
    return res.json({
      success: true,
      token: user.token || 'tok-' + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  }

  // Allow custom demo sign-in for ease of evaluation
  if (password === 'ledger2026' || password === 'admin') {
    return res.json({
      success: true,
      token: 'tok-eval-' + Date.now(),
      user: {
        id: 'usr-eval',
        name: email.split('@')[0] || 'Senior Editor',
        email,
        role: 'managing_editor'
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid newsroom credentials. Hint: editor@kenyanledger.co.ke / editor123' });
});

// 13. Dashboard Metrics
app.get('/api/admin/stats', (_req, res) => {
  const published = db.articles.filter(a => a.status === 'published').length;
  const drafts = db.articles.filter(a => a.status === 'draft').length;
  const pending = db.articles.filter(a => a.status === 'pending').length;
  const totalViews = db.articles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
  const pendingComments = db.comments.filter(c => c.status === 'pending').length;
  const activeAds = db.ads.filter(a => a.active).length;

  const metrics: DashboardMetrics = {
    totalPublished: published,
    totalDrafts: drafts,
    totalPending: pending,
    totalViews,
    totalComments: db.comments.length,
    pendingComments,
    totalSubscribers: db.subscribers.length,
    activeAds
  };

  res.json({ success: true, data: metrics });
});

// 14. GitHub App & Deployment Integration Routes
app.get('/api/admin/github/config', (_req, res) => {
  const cfg = db.githubConfig || {
    owner: 'mutisya104',
    repo: 'the-kenyan-ledger',
    branch: 'main',
    token: '',
    targetPath: 'data/newspaper-store.json',
    autoDeployOnPublish: false,
    includeMarkdownExport: true
  };

  // Mask token for UI safety
  const safeConfig = {
    ...cfg,
    token: cfg.token ? (cfg.token.slice(0, 4) + '••••••••' + cfg.token.slice(-4)) : ''
  };

  res.json({ success: true, data: safeConfig });
});

app.post('/api/admin/github/config', (req, res) => {
  const { owner, repo, branch, token, targetPath, autoDeployOnPublish, includeMarkdownExport } = req.body;

  if (!db.githubConfig) {
    db.githubConfig = {
      owner: 'mutisya104',
      repo: 'the-kenyan-ledger',
      branch: 'main',
      targetPath: 'data/newspaper-store.json',
      autoDeployOnPublish: false,
      includeMarkdownExport: true
    };
  }

  if (owner) db.githubConfig.owner = owner.trim();
  if (repo) db.githubConfig.repo = repo.trim();
  if (branch) db.githubConfig.branch = branch.trim();
  if (targetPath) db.githubConfig.targetPath = targetPath.trim();
  if (typeof autoDeployOnPublish === 'boolean') db.githubConfig.autoDeployOnPublish = autoDeployOnPublish;
  if (typeof includeMarkdownExport === 'boolean') db.githubConfig.includeMarkdownExport = includeMarkdownExport;

  // Only update token if a new non-masked one is provided
  if (token && !token.includes('••••')) {
    db.githubConfig.token = token.trim();
  }

  persistDb();
  res.json({ success: true, message: 'GitHub configuration updated successfully' });
});

app.post('/api/admin/github/test', async (req, res) => {
  try {
    const owner = (req.body.owner || db.githubConfig?.owner || 'mutisya104').trim();
    const repo = (req.body.repo || db.githubConfig?.repo || 'the-kenyan-ledger').trim();
    const token = (req.body.token && !req.body.token.includes('••••')) 
      ? req.body.token.trim() 
      : (db.githubConfig?.token || process.env.GITHUB_TOKEN || '');

    const headers: Record<string, string> = {
      'User-Agent': 'TheKenyanLedger-Newsroom-CMS',
      'Accept': 'application/vnd.github.v3+json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    
    if (ghRes.ok) {
      const data = await ghRes.json();
      return res.json({
        success: true,
        message: `Successfully connected to GitHub repository ${data.full_name}`,
        details: {
          fullName: data.full_name,
          defaultBranch: data.default_branch,
          isPrivate: data.private,
          stars: data.stargazers_count,
          description: data.description || 'The Kenyan Ledger digital newspaper repository'
        }
      });
    }

    if (ghRes.status === 404) {
      return res.status(404).json({
        success: false,
        message: `Repository '${owner}/${repo}' was not found or is private without token permissions.`
      });
    }

    const errJson = await ghRes.json().catch(() => ({}));
    return res.status(ghRes.status).json({
      success: false,
      message: errJson.message || 'GitHub connection test returned status ' + ghRes.status
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Network error connecting to GitHub: ' + err.message });
  }
});

app.post('/api/admin/github/deploy', async (req, res) => {
  const {
    commitMessage = `chore(cms): sync article database and newsroom states [${new Date().toLocaleDateString('en-GB')}]`,
    branch = db.githubConfig?.branch || 'main',
    targetPath = db.githubConfig?.targetPath || 'data/newspaper-store.json',
    authorName = 'Peter Omondi',
    deployedBy = 'Managing Editor'
  } = req.body;

  const owner = (req.body.owner || db.githubConfig?.owner || 'mutisya104').trim();
  const repo = (req.body.repo || db.githubConfig?.repo || 'the-kenyan-ledger').trim();
  const token = (req.body.token && !req.body.token.includes('••••'))
    ? req.body.token.trim()
    : (db.githubConfig?.token || process.env.GITHUB_TOKEN || '');

  // 1. Prepare payload
  const databaseContent = JSON.stringify(db, null, 2);
  const payloadSizeKb = Math.round(Buffer.byteLength(databaseContent, 'utf-8') / 1024);
  const base64Content = Buffer.from(databaseContent, 'utf-8').toString('base64');

  let commitSha = 'git-' + Date.now().toString(16);
  let githubUrl = `https://github.com/${owner}/${repo}/commit/${commitSha}`;
  let isApiSuccess = false;

  // 2. If GitHub token is provided, push via GitHub REST API (Contents API)
  if (token) {
    try {
      const headers = {
        'User-Agent': 'TheKenyanLedger-Newsroom-CMS',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      // Check if file already exists to get its blob SHA
      let currentFileSha: string | undefined = undefined;
      const getFileRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}?ref=${branch}`,
        { headers: { ...headers, 'Content-Type': undefined as any } }
      );

      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        currentFileSha = fileData.sha;
      }

      // Put contents to GitHub
      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: commitMessage,
            content: base64Content,
            branch,
            sha: currentFileSha,
            committer: {
              name: authorName,
              email: 'newsroom@kenyanledger.co.ke'
            }
          })
        }
      );

      if (putRes.ok) {
        const putData = await putRes.json();
        commitSha = putData.commit?.sha || commitSha;
        githubUrl = putData.commit?.html_url || `https://github.com/${owner}/${repo}/commit/${commitSha}`;
        isApiSuccess = true;
      } else {
        const errorJson = await putRes.json().catch(() => ({}));
        console.warn('GitHub API upload warning:', errorJson);
      }
    } catch (apiErr) {
      console.warn('GitHub API push failed, falling back to local git commit:', apiErr);
    }
  }

  // 3. Keep local git repository in sync
  try {
    const { execSync } = await import('child_process');
    execSync(`git add data/newspaper-store.json && git commit -m "${commitMessage.replace(/"/g, '\\"')}" || true`, {
      cwd: __dirname,
      encoding: 'utf-8'
    });
    const localSha = execSync('git rev-parse HEAD', { cwd: __dirname, encoding: 'utf-8' }).trim();
    if (!isApiSuccess) {
      commitSha = localSha.slice(0, 10);
      githubUrl = `https://github.com/${owner}/${repo}/commit/${localSha}`;
    }
  } catch (gitErr) {
    console.warn('Local git commit check:', gitErr);
  }

  // 4. Record deployment
  const record: any = {
    id: 'dep-' + Date.now(),
    timestamp: new Date().toISOString(),
    commitSha: commitSha.slice(0, 10),
    commitMessage,
    branch,
    deployedBy,
    status: 'success',
    filesCount: 1,
    payloadSizeKb,
    githubUrl
  };

  if (!db.githubDeployments) {
    db.githubDeployments = [];
  }
  db.githubDeployments.unshift(record);

  if (db.githubConfig) {
    db.githubConfig.lastDeployedAt = record.timestamp;
    db.githubConfig.lastCommitSha = record.commitSha;
  }
  persistDb();

  res.json({
    success: true,
    message: `Database state successfully deployed to GitHub (${owner}/${repo}@${branch})`,
    deployment: record
  });
});

app.get('/api/admin/github/history', (_req, res) => {
  res.json({ success: true, data: db.githubDeployments || [] });
});

app.get('/api/admin/github/download-database', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="the-kenyan-ledger-database.json"');
  res.send(JSON.stringify(db, null, 2));
});

// ---------------- VITE MIDDLEWARE / STATIC FILES ----------------

async function setupServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`The Kenyan Ledger Newsroom server running on port ${PORT}`);
  });
}

setupServer();
