const VALID_README_NAMES = new Set([
  'readme.md', 'readme.markdown', 'readme.txt', 'readme',
  'readme.rst', 'readme.html', 'readme.adoc', 'readme.asciidoc',
]);

const VALID_LICENSE_NAMES = new Set([
  'license.md', 'license.txt', 'license', 'license.rst',
  'copying', 'copying.txt', 'copying.md', 'unlicense',
  'licence', 'licence.txt', 'licence.md',
]);

const VALID_DEPENDENCY_NAMES = new Set([
  "requirements.txt", "pipfile", "pyproject.toml", "setup.py", "gemfile",
  "package.json", "pom.xml", "build.gradle", "go.mod", "composer.json",
  "cargo.toml", "vcpkg.json", "conanfile.txt", "cmakelists.txt", "spack.yaml",
  ".csproj", "packages.config", "package.swift", "podfile", "pubspec.yaml",
  "description", "mix.exs", "install.sh", "bootstrap.sh", "cpanfile",
  "makefile.pl", "build.pl", "stack.yaml", "cabal.project", "rebar.config",
  "project.toml", "manifest.toml", "build.sbt", ".gemspec", ".npmrc", ".yarnrc",
  ".python-version", "bower.json", ".bowerrc", ".ruby-version", ".nvmrc",
  ".tool-versions", "shard.yml", "deno.json", "deno.jsonc", "tsconfig.json",
  "lerna.json", "gradle.properties", "build.boot", "Cartfile", "Cartfile.resolved",
  "Packages.swift", "default.nix", "WORKSPACE", "BUILD.bazel"
]);

const CITATION_FILES = new Set([
  "citation.cff", "citation", "citation.bib", "bibtex.bib", "references.bib",
  "references.json", "references.yaml", "references.ris", "export.ris",
  "manuscript.bib", "library.bib", "sources.bib", ".bib", ".ris",
  "EndNote.xml", "RefMan.txt", "scopus.bib", "wos.bib", "pubmed.xml"
]);

async function fetchGitHubFileContent(url: string, token?: string): Promise<string | null> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  const res = await fetch(url, { headers });
  const data = await res.json();
  if (data.encoding === 'base64') {
    const buff = Buffer.from(data.content, 'base64');
    return buff.toString('utf-8').replace(/\s+/g, ' ').trim();
  }
  return null;
}

export async function extractGitHubContent(repoUrl: string, token?: string): Promise<string> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repository URL.');

  const [_, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  const res = await fetch(apiUrl, { headers });

  if (!res.ok) {
    throw new Error(`Failed to fetch contents for ${owner}/${repo}`);
  }

  const contents = await res.json();
  const files = Array.isArray(contents) ? contents : [];

  const categories: Record<string, string[]> = {
    readme: [],
    license: [],
    dependency: [],
    citation: []
  };

  for (const file of files) {
    const name = file.name.toLowerCase();
    const url = file.url;

    if (VALID_README_NAMES.has(name) && categories.readme.length < 2) {
      const content = await fetchGitHubFileContent(url, token);
      if (content) categories.readme.push(content);
    } else if (VALID_LICENSE_NAMES.has(name) && categories.license.length < 2) {
      const content = await fetchGitHubFileContent(url, token);
      if (content) categories.license.push(content);
    } else if (VALID_DEPENDENCY_NAMES.has(name) && categories.dependency.length < 2) {
      const content = await fetchGitHubFileContent(url, token);
      if (content) categories.dependency.push(content);
    } else if (CITATION_FILES.has(name) && categories.citation.length < 2) {
      const content = await fetchGitHubFileContent(url, token);
      if (content) categories.citation.push(content);
    }

    if (
      categories.readme.length >= 2 &&
      categories.license.length >= 2 &&
      categories.dependency.length >= 2 &&
      categories.citation.length >= 2
    ) {
      break;
    }
  }

  const allContent = [
    ...categories.readme,
    ...categories.dependency,
    ...categories.license,
    ...categories.citation
  ];

  return allContent.join(' ');
}

async function extractGitLabProjectId(repoUrl: string, token?: string): Promise<string | null> {
  const url = new URL(repoUrl);
  const apiBase = url.origin + '/api/v4';
  const pathname = url.pathname.replace(/^\//, '').replace(/\.git$/, '');
  
  const headers: HeadersInit = {
    'Accept': 'application/json'
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const encodedPath = encodeURIComponent(pathname);
    const projectApiUrl = `${apiBase}/projects/${encodedPath}`;
    
    console.log(`Trying GitLab API: ${projectApiUrl}`);
    const res = await fetch(projectApiUrl, { headers });
    
    if (res.ok) {
      const project = await res.json();
      console.log(`Found project ID: ${project.id}`);
      return project.id.toString();
    } else {
      console.warn(`GitLab API returned ${res.status}: ${res.statusText}`);
      console.log('Using URL-encoded path as project ID');
      return encodedPath;
    }
  } catch (e) {
    console.warn('Strategy 1 failed (direct API call):', e);
    const encodedPath = encodeURIComponent(pathname);
    console.log('Using URL-encoded path as project ID');
    return encodedPath;
  }
}

export async function extractGitLabContent(repoUrl: string, token?: string): Promise<string> {
  const projectId = await extractGitLabProjectId(repoUrl);
  if (!projectId) throw new Error('Could not extract GitLab project ID.');

  const apiBase = new URL(repoUrl).origin + '/api/v4';
  const treeUrl = `${apiBase}/projects/${encodeURIComponent(projectId)}/repository/tree`;

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const treeRes = await fetch(treeUrl, { headers });

  if (!treeRes.ok) throw new Error('Failed to fetch GitLab repo tree');

  const files = await treeRes.json();
  const categories: Record<string, string[]> = {
    readme: [],
    license: [],
    dependency: [],
    citation: []
  };

  for (const file of files) {
    const name = file.name.toLowerCase();
    const encodedPath = encodeURIComponent(file.path);
    const rawUrl = `${apiBase}/projects/${encodeURIComponent(projectId)}/repository/files/${encodedPath}/raw`;

    let category: keyof typeof categories | null = null;
    if (VALID_README_NAMES.has(name)) category = 'readme';
    else if (VALID_LICENSE_NAMES.has(name)) category = 'license';
    else if (VALID_DEPENDENCY_NAMES.has(name)) category = 'dependency';
    else if (CITATION_FILES.has(name)) category = 'citation';

    if (category && categories[category].length < 2) {
      const contentRes = await fetch(rawUrl, { headers });

      if (contentRes.ok) {
        const text = await contentRes.text();
        categories[category].push(text.replace(/\s+/g, ' ').trim());
      }
    }

    if (
      categories.readme.length >= 2 &&
      categories.license.length >= 2 &&
      categories.dependency.length >= 2 &&
      categories.citation.length >= 2
    ) {
      break;
    }
  }

  const allContent = [
    ...categories.readme,
    ...categories.dependency,
    ...categories.license,
    ...categories.citation
  ];

  return allContent.join(' ');
}