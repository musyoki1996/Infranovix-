import React, { useState, useEffect } from 'react';
import { GitHubConfig, GitHubDeploymentRecord, Article, EditorialUser } from '../types/newspaper';
import { api } from '../services/api';
import { 
  GitBranch, GitCommit, GitPullRequest, ExternalLink, RefreshCw, 
  CheckCircle2, AlertCircle, Save, Download, Key, ShieldCheck, 
  Terminal, ArrowRight, Layers, Database, Lock
} from 'lucide-react';

interface GitHubDeployUtilityProps {
  articles: Article[];
  currentUser: EditorialUser | null;
}

export const GitHubDeployUtility: React.FC<GitHubDeployUtilityProps> = ({
  articles,
  currentUser
}) => {
  const [config, setConfig] = useState<GitHubConfig>({
    owner: 'mutisya104',
    repo: 'the-kenyan-ledger',
    branch: 'main',
    token: '',
    targetPath: 'data/newspaper-store.json',
    autoDeployOnPublish: false,
    includeMarkdownExport: true
  });

  const [history, setHistory] = useState<GitHubDeploymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Deploy Action State
  const [commitMessage, setCommitMessage] = useState(
    `chore(cms): update article database states [${new Date().toLocaleDateString('en-GB')}]`
  );
  const [deploying, setDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState<GitHubDeploymentRecord | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  // Settings State
  const [tokenInput, setTokenInput] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Test Connection State
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cfg, hist] = await Promise.all([
        api.getGitHubConfig(),
        api.getGitHubDeployHistory()
      ]);
      setConfig(cfg);
      setHistory(hist);
    } catch (err) {
      console.error('Failed loading GitHub deployment config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await api.testGitHubConnection({
        owner: config.owner,
        repo: config.repo,
        token: tokenInput || undefined
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed. Check repository name and token permissions.'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload: Partial<GitHubConfig> = {
        owner: config.owner,
        repo: config.repo,
        branch: config.branch,
        targetPath: config.targetPath,
        autoDeployOnPublish: config.autoDeployOnPublish,
        includeMarkdownExport: config.includeMarkdownExport
      };

      if (tokenInput.trim()) {
        payload.token = tokenInput.trim();
      }

      const res = await api.saveGitHubConfig(payload);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
      await loadData();
    } catch (err) {
      alert('Failed saving GitHub configuration');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeployNow = async () => {
    setDeploying(true);
    setDeployError(null);
    setDeploySuccess(null);

    try {
      const res = await api.deployToGitHub({
        commitMessage,
        branch: config.branch,
        targetPath: config.targetPath,
        authorName: currentUser?.name || 'Peter Omondi',
        deployedBy: currentUser?.role || 'Managing Editor',
        owner: config.owner,
        repo: config.repo,
        token: tokenInput || undefined
      });

      setDeploySuccess(res.deployment);
      await loadData();
    } catch (err: any) {
      setDeployError(err.message || 'Deployment error');
    } finally {
      setDeploying(false);
    }
  };

  const handleDownloadDatabaseBackup = () => {
    window.location.href = '/api/admin/github/download-database';
  };

  return (
    <div className="space-y-8">
      {/* Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-stone-900 text-white rounded-xs">
              <GitPullRequest className="w-4 h-4 text-[#D71920]" />
            </span>
            <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
              Deploy to GitHub
            </h2>
          </div>
          <p className="text-xs text-stone-600">
            Publish current article database states, newsroom configs, and archives directly to your GitHub repository.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadDatabaseBackup}
            className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download full JSON database snapshot"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Database JSON</span>
          </button>

          <button
            onClick={loadData}
            className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
            title="Refresh deployment state"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Target Repository
          </span>
          <div className="text-sm font-mono font-bold text-stone-900 truncate">
            {config.owner}/{config.repo}
          </div>
          <span className="text-[11px] text-stone-500 font-mono mt-0.5 inline-block">
            Branch: <span className="font-bold text-[#D71920]">{config.branch}</span>
          </span>
        </div>

        <div className="bg-white border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Database Content In State
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {articles.length} <span className="text-xs font-normal text-stone-500">Articles</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            Ready for instant repository sync
          </span>
        </div>

        <div className="bg-white border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Target Sync Path
          </span>
          <div className="text-xs font-mono text-stone-800 truncate font-semibold">
            {config.targetPath}
          </div>
          <span className="text-[11px] text-stone-400">
            JSON format · Git version controlled
          </span>
        </div>

        <div className="bg-white border border-stone-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Last Deployed
          </span>
          <div className="text-xs font-mono text-stone-900 font-bold truncate">
            {config.lastDeployedAt ? new Date(config.lastDeployedAt).toLocaleTimeString('en-GB') + ' ' + new Date(config.lastDeployedAt).toLocaleDateString('en-GB') : 'Ready to deploy'}
          </div>
          {config.lastCommitSha && (
            <span className="text-[11px] text-[#00843D] font-mono font-bold">
              Commit: {config.lastCommitSha}
            </span>
          )}
        </div>
      </div>

      {/* Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: DEPLOY ACTION (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-stone-300 p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-200 mb-4">
              <GitCommit className="w-4 h-4 text-[#D71920]" />
              <h3 className="text-base font-serif font-bold text-stone-900">
                Execute Instant GitHub Deployment
              </h3>
            </div>

            {/* Success Message Banner */}
            {deploySuccess && (
              <div className="mb-5 p-4 bg-emerald-50 border border-emerald-300 rounded-xs text-emerald-900 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Successfully Deployed to GitHub!</span>
                </div>
                <p className="mb-2">
                  The current article database and website configurations were pushed to{' '}
                  <span className="font-mono font-bold">{config.owner}/{config.repo}</span> on branch{' '}
                  <span className="font-mono font-bold">{deploySuccess.branch}</span>.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-200 font-mono text-[11px]">
                  <span>SHA: <strong>{deploySuccess.commitSha}</strong></span>
                  <span>Size: <strong>{deploySuccess.payloadSizeKb} KB</strong></span>
                  {deploySuccess.githubUrl && (
                    <a
                      href={deploySuccess.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold flex items-center gap-1 ml-auto"
                    >
                      <span>View Commit On GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {deployError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xs text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Deployment Warning:</span>
                  <span>{deployError}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Commit Message
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                  placeholder="chore(cms): update newsroom articles database..."
                />
              </div>

              {/* Deployment Scope */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs text-xs space-y-2">
                <span className="font-bold uppercase tracking-wider text-stone-600 text-[10px] block mb-1">
                  Included In This Deployment Payload:
                </span>
                <div className="flex items-center gap-2 text-stone-800">
                  <Database className="w-3.5 h-3.5 text-[#D71920]" />
                  <span><strong>Full Article State:</strong> {articles.length} articles across all categories & counties</span>
                </div>
                <div className="flex items-center gap-2 text-stone-800">
                  <Layers className="w-3.5 h-3.5 text-[#00843D]" />
                  <span><strong>Editorial Data:</strong> Authors, 47 Kenyan Counties, Advertisements, Moderated Comments</span>
                </div>
                <div className="flex items-center gap-2 text-stone-800">
                  <Terminal className="w-3.5 h-3.5 text-stone-600" />
                  <span><strong>Target File:</strong> <code className="bg-stone-200 px-1 py-0.5 rounded">{config.targetPath}</code></span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDeployNow}
                  disabled={deploying}
                  className="w-full py-3 bg-stone-900 hover:bg-[#D71920] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  <GitPullRequest className={`w-4 h-4 ${deploying ? 'animate-spin' : ''}`} />
                  <span>{deploying ? 'Pushing Current State to GitHub...' : 'Deploy Database to GitHub Now'}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                This triggers an automated commit and syncs your latest articles directly to your connected GitHub repository branch.
              </p>
            </div>
          </div>

          {/* Past Deployment History */}
          <div className="bg-white border border-stone-300 p-5 shadow-xs">
            <h3 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200 mb-3">
              Deployment Audit Log ({history.length})
            </h3>

            {history.length > 0 ? (
              <div className="divide-y divide-stone-100 text-xs">
                {history.map(rec => (
                  <div key={rec.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-stone-500 mb-0.5">
                        <span className="font-bold text-[#D71920]">SHA: {rec.commitSha}</span>
                        <span>·</span>
                        <span>{new Date(rec.timestamp).toLocaleDateString('en-GB')} {new Date(rec.timestamp).toLocaleTimeString('en-GB')}</span>
                        <span>·</span>
                        <span>{rec.branch}</span>
                      </div>
                      <div className="font-semibold text-stone-800 truncate">
                        {rec.commitMessage}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-xs">
                        {rec.status}
                      </span>
                      {rec.githubUrl && (
                        <a
                          href={rec.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-400 hover:text-stone-900 p-1"
                          title="Open commit on GitHub"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic text-center py-4">
                No past deployments recorded yet. Click &ldquo;Deploy Database to GitHub Now&rdquo; to execute your first push.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: GITHUB CONNECTION SETTINGS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-300 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00843D]" />
                <h3 className="text-base font-serif font-bold text-stone-900">
                  GitHub App & Repo Config
                </h3>
              </div>
              {settingsSaved && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  GitHub Owner / Organization *
                </label>
                <input
                  type="text"
                  value={config.owner}
                  onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                  required
                  placeholder="e.g. mutisya104 or organisation"
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  Repository Name *
                </label>
                <input
                  type="text"
                  value={config.repo}
                  onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                  required
                  placeholder="the-kenyan-ledger"
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    Target Branch
                  </label>
                  <input
                    type="text"
                    value={config.branch}
                    onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                    required
                    className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    File Storage Path
                  </label>
                  <input
                    type="text"
                    value={config.targetPath}
                    onChange={(e) => setConfig({ ...config, targetPath: e.target.value })}
                    required
                    className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  GitHub Personal Access Token / App Secret
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={config.token ? `Current: ${config.token} (enter new to change)` : 'Paste ghp_... token'}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Requires <code className="bg-stone-100 px-1 py-0.2">repo</code> scope or GitHub App with repository permissions.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold rounded-xs transition-colors cursor-pointer"
                >
                  {testingConnection ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-4 py-1.5 bg-stone-900 hover:bg-[#D71920] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div className={`p-3 text-xs rounded-xs border ${
                  testResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.details && (
                    <div className="font-mono text-[11px] text-stone-600 space-y-0.5 mt-1">
                      <div>Default Branch: {testResult.details.defaultBranch}</div>
                      <div>Visibility: {testResult.details.isPrivate ? 'Private' : 'Public'}</div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Quick Guide Card */}
          <div className="bg-stone-50 border border-stone-300 p-4 text-xs text-stone-600 space-y-2">
            <span className="font-bold uppercase tracking-wider text-stone-900 text-[10px] block">
              Quick Setup Instructions:
            </span>
            <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-[11px]">
              <li>Create a new repository on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="underline font-bold text-stone-800">GitHub.com</a> (e.g. <code>the-kenyan-ledger</code>).</li>
              <li>Generate a Fine-Grained Personal Access Token or Classic Token at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="underline font-bold text-stone-800">github.com/settings/tokens</a> with <code>Contents: Read and write</code> permission.</li>
              <li>Enter your token above and click <strong>Test Connection</strong>.</li>
              <li>Once verified, click <strong>Deploy Database to GitHub Now</strong> to sync your newsroom.</li>
            </ol>
          </div>
        </div>

      </div>

    </div>
  );
};
