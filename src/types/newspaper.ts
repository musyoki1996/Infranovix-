export type ContentStatus = 'draft' | 'pending' | 'approved' | 'scheduled' | 'published' | 'archived';

export type UserRole = 'super_admin' | 'managing_editor' | 'editor' | 'journalist' | 'contributor';

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  twitter?: string;
  email: string;
  articlesCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  badge?: string;
}

export interface CountyInfo {
  code: string;
  name: string;
  capital: string;
  region: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subhead?: string;
  excerpt: string;
  content: string;
  categoryId: string;
  county?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  featuredImage: string;
  imageCaption?: string;
  imageCredit?: string;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  status: ContentStatus;
  isBreaking: boolean;
  isLeadStory: boolean;
  isTopStory: boolean;
  isTrending: boolean;
  viewsCount: number;
  sharesCount: number;
  commentsCount?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  articleTitle?: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  likesCount: number;
}

export type AdPlacement = 
  | 'header_leaderboard'
  | 'sidebar_mpu'
  | 'in_article'
  | 'between_sections'
  | 'footer_leaderboard';

export interface Advertisement {
  id: string;
  title: string;
  placement: AdPlacement;
  type: 'direct' | 'adsense' | 'sponsored';
  imageUrl?: string;
  destinationUrl?: string;
  clientName: string;
  codeSnippet?: string;
  active: boolean;
  impressions: number;
  clicks: number;
  dimensions: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  edition: string;
}

export interface EditorialUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  token?: string;
}

export interface DashboardMetrics {
  totalPublished: number;
  totalDrafts: number;
  totalPending: number;
  totalViews: number;
  totalComments: number;
  pendingComments: number;
  totalSubscribers: number;
  activeAds: number;
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
  targetPath: string;
  autoDeployOnPublish: boolean;
  includeMarkdownExport: boolean;
  lastDeployedAt?: string;
  lastCommitSha?: string;
}

export interface GitHubDeploymentRecord {
  id: string;
  timestamp: string;
  commitSha: string;
  commitMessage: string;
  branch: string;
  deployedBy: string;
  status: 'success' | 'failed';
  filesCount: number;
  payloadSizeKb: number;
  githubUrl?: string;
  errorMessage?: string;
}
