export function validateRepoUrl(url: string): boolean {
  const repoRegex = /^https?:\/\/(github\.com|gitlab\.com)\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+\/?$/;
  return repoRegex.test(url);
}


export function validateGithubToken(token: string): boolean {
  const tokenRegex = /^ghp_[a-zA-Z0-9]{36}$/;
  return tokenRegex.test(token);
}


export function validateGitlabToken(token: string): boolean {
  const tokenRegex = /^glpat-[a-zA-Z0-9-_]{20}$/;
  return tokenRegex.test(token);
}


export function getPlatformFromUrl(url: string): 'github' | 'gitlab' | null {
  if (!url) return null;
  if (url.includes('github.com')) return 'github';
  if (url.includes('gitlab.com')) return 'gitlab';
  return null;
}