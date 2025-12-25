import React, { useEffect, useState } from 'react';

// Types for GitHub stats
interface RepoStats {
  commits: number;
  contributors: number;
  openIssues: number;
  closedIssues: number;
  pullRequests: number;
  lastDeployStatus: string;
}

const GITHUB_OWNER = 'LiTree89';
const GITHUB_REPO = 'azuredev-009a';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

const LiveStats: React.FC = () => {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch repo info
        const repoRes = await fetch(GITHUB_API);
        const repoData = await repoRes.json();
        // Fetch contributors
        const contribRes = await fetch(`${GITHUB_API}/contributors`);
        const contribData = await contribRes.json();
        // Fetch issues
        const issuesRes = await fetch(`${GITHUB_API}/issues?state=all&per_page=100`);
        const issuesData = await issuesRes.json();
        // Fetch PRs
        const prsRes = await fetch(`${GITHUB_API}/pulls?state=all&per_page=100`);
        const prsData = await prsRes.json();
        // Fetch last deploy status (GitHub Actions)
        const actionsRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs?per_page=1`);
        const actionsData = await actionsRes.json();
        const lastDeployStatus = actionsData.workflow_runs?.[0]?.conclusion || 'unknown';
        setStats({
          commits: repoData.open_issues_count + prsData.length, // Approximation
          contributors: contribData.length,
          openIssues: issuesData.filter((i:any) => i.state === 'open' && !i.pull_request).length,
          closedIssues: issuesData.filter((i:any) => i.state === 'closed' && !i.pull_request).length,
          pullRequests: prsData.length,
          lastDeployStatus,
        });
      } catch (err) {
        setStats(null);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading live stats...</div>;
  if (!stats) return <div>Failed to load stats.</div>;

  return (
    <div className="bg-[#1a1333] text-white rounded-xl p-6 shadow-lg w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Live Project Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-lg">Commits (approx):</div>
          <div className="text-3xl font-extrabold">{stats.commits}</div>
        </div>
        <div>
          <div className="text-lg">Contributors:</div>
          <div className="text-3xl font-extrabold">{stats.contributors}</div>
        </div>
        <div>
          <div className="text-lg">Open Issues:</div>
          <div className="text-3xl font-extrabold text-yellow-400">{stats.openIssues}</div>
        </div>
        <div>
          <div className="text-lg">Closed Issues:</div>
          <div className="text-3xl font-extrabold text-green-400">{stats.closedIssues}</div>
        </div>
        <div>
          <div className="text-lg">Pull Requests:</div>
          <div className="text-3xl font-extrabold text-blue-400">{stats.pullRequests}</div>
        </div>
        <div>
          <div className="text-lg">Last Deploy Status:</div>
          <div className={`text-3xl font-extrabold ${stats.lastDeployStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>{stats.lastDeployStatus}</div>
        </div>
      </div>
    </div>
  );
};

export default LiveStats;
