const root = document.documentElement;
const treeContainer = document.getElementById('file-tree');
const searchInput = document.getElementById('site-search');

function createLink(href, text, isActive = false) {
  const anchor = document.createElement('a');
  const rootPrefix = window.ROOT_PREFIX || '';
  anchor.href = `${rootPrefix}${href}`;
  anchor.textContent = text;
  anchor.className = isActive ? 'active' : '';
  return anchor;
}

function buildTree(node, list, currentPath) {
  if (node.type === 'dir') {
    const item = document.createElement('li');
    item.className = 'tree-directory';
    const label = document.createElement('span');
    label.textContent = node.name;
    item.append(label);
    const nested = document.createElement('ul');
    nested.append(...node.children.map((child) => buildTree(child, list, currentPath)));
    item.append(nested);
    return item;
  }

  const item = document.createElement('li');
  item.className = 'tree-file';
  const link = createLink(node.htmlPath, node.title || node.name, node.htmlPath === currentPath);
  item.append(link);
  return item;
}

function renderFileTree(tree, currentPath) {
  if (!treeContainer) return;
  treeContainer.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'tree-root';
  list.append(...tree.map((node) => buildTree(node, list, currentPath)));
  treeContainer.append(list);
}

function getSearchResults(docs, query) {
  const lower = query.trim().toLowerCase();
  if (!lower) return docs;
  return docs.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(lower) ||
      doc.sourcePath.toLowerCase().includes(lower) ||
      doc.excerpt.toLowerCase().includes(lower)
    );
  });
}

function renderSearchResults(results) {
  const resultsSection = document.querySelector('.search-results');
  if (!resultsSection) {
    const section = document.createElement('section');
    section.className = 'search-results';
    section.innerHTML = '<h2>Search results</h2><ul class="search-list"></ul>';
    document.querySelector('.content').append(section);
  }

  const list = document.querySelector('.search-results .search-list');
  list.innerHTML = '';

  if (results.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'No matching documents found.';
    list.append(item);
    return;
  }

  for (const doc of results) {
    const item = document.createElement('li');
    const link = createLink(doc.htmlPath, doc.title || doc.name);
    const excerpt = document.createElement('p');
    excerpt.textContent = doc.excerpt;
    item.append(link, excerpt);
    list.append(item);
  }
}

function setupSearch(docs) {
  if (!searchInput) return;
  const update = () => {
    const query = searchInput.value;
    renderSearchResults(getSearchResults(docs, query));
  };
  searchInput.addEventListener('input', update);
  update();
}

function init() {
  const data = window.SITE_DATA || { tree: [], docs: [] };
  const currentPath = window.CURRENT_HTML_PATH || 'index.html';

  renderFileTree(data.tree, currentPath);
  setupSearch(data.docs);
}

init();
