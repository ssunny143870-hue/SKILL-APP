let materials = [];

const materialsGrid = document.getElementById('materialsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const difficultyFilter = document.getElementById('difficultyFilter');
const languageFilter = document.getElementById('languageFilter');
const sortFilter = document.getElementById('sortFilter');

function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function getYoutubeThumbnail(url) {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function buildSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function assignSlugs() {
  materials.forEach(material => {
    if (!material.slug) {
      material.slug = buildSlug(material.title);
    }
  });
}

function renderMaterials(items) {
  if (!materialsGrid) return;

  materialsGrid.innerHTML = items.map(material => {
    return `
    <article class="material-card" style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0; transition: all 0.3s ease;">
      <div class="card-meta" style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: #64748B; font-size: 0.875rem;">
        <span>📄 PDF Notes</span>
        <span>${material.duration || 'PDF'}</span>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 700; color: #1E293B; margin-bottom: 0.5rem;">${material.title}</h3>
      <p style="color: #64748B; font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.5;">${material.description}</p>
      <div class="badge-row" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <span class="badge" style="padding: 0.5rem 1rem; border-radius: 8px; background: #EFF6FF; color: #3B82F6; font-size: 0.75rem; font-weight: 500;">${material.category}</span>
        <span class="badge" style="padding: 0.5rem 1rem; border-radius: 8px; background: #F0FDF4; color: #22C55E; font-size: 0.75rem; font-weight: 500;">${material.difficulty}</span>
        ${material.language ? `<span class="badge badge-lang" style="padding: 0.5rem 1rem; border-radius: 8px; background: #F3E8FF; color: #8B5CF6; font-size: 0.75rem; font-weight: 500;">🌐 ${material.language}</span>` : ''}
      </div>
      <div class="card-actions" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="openMaterialInline(${material.id})" style="flex: 1; padding: 0.75rem 1.5rem; border-radius: 12px; background: linear-gradient(135deg, #3B82F6, #60A5FA); color: white; border: none; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
            <i class="fas fa-eye"></i> View PDF
          </button>
      </div>
    </article>
  `}).join('');
}

function filterMaterials() {
  if (!materialsGrid) return;

  const category = categoryFilter.value;
  const difficulty = difficultyFilter.value;
  const language = languageFilter ? languageFilter.value : 'all';
  const sort = sortFilter.value;

  let filtered = materials.filter(material => {
    const matchesCategory = category === 'all' || material.category === category;
    const matchesDifficulty = difficulty === 'all' || material.difficulty === difficulty;
    const matchesLanguage = language === 'all' || material.language === language;
    return matchesCategory && matchesDifficulty && matchesLanguage;
  });

  if (sort === 'popular') {
    filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  } else if (sort === 'saved') {
    filtered.sort((a, b) => Number(b.saveForLater) - Number(a.saveForLater));
  } else if (sort === 'completed') {
    filtered.sort((a, b) => Number(b.completed) - Number(a.completed));
  }

  renderMaterials(filtered);
}

function getMaterialById(id) {
  return materials.find(material => material.id === id);
}

function getMaterialBySlug(slug) {
  return materials.find(material => material.slug === slug);
}

// Build a Google Docs Viewer URL that shows the PDF inline (no download)
function getPdfViewerUrl(rawUrl) {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`;
}

window.openMaterialDetail = function(id) {
  const material = getMaterialById(id);
  if (!material) return;
  window.location.href = `material.html?slug=${encodeURIComponent(material.slug)}`;
};

// "View PDF" card button → go to detail page where PDF auto-opens
window.openMaterial = function(id) {
  const material = getMaterialById(id);
  if (!material) return;
  window.location.href = `material.html?slug=${encodeURIComponent(material.slug)}`;
};

function getProgress(slug) {
  try {
    const stored = localStorage.getItem(`learnhub-progress-${slug}`);
    return stored ? JSON.parse(stored) : { percentage: 0, lastRead: null };
  } catch (error) {
    return { percentage: 0, lastRead: null };
  }
}

function saveProgress(slug, progress) {
  localStorage.setItem(`learnhub-progress-${slug}`, JSON.stringify(progress));
}

function updateProgressUI(progress) {
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');

  if (!progressText || !progressFill) return;
  progressText.textContent = `Progress: ${progress.percentage}%`;
  progressFill.style.width = `${progress.percentage}%`;
}

function buildObjectives(material) {
  if (material.learningObjectives && material.learningObjectives.length) {
    return material.learningObjectives;
  }

  const tags = material.tags || [];
  const objectives = [
    `Understand the core concepts of ${material.category}.`,
    `Review the main ideas from ${material.title}.`,
    `Practice the key topics using the provided material.`
  ];

  if (tags.length > 0) {
    objectives.unshift(`Explore ${tags.slice(0, 2).join(' and ')} in more detail.`);
  }

  return objectives;
}

// Store current material for fullscreen viewing
let currentMaterial = null;

function displayMaterialDetail(material) {
  // Store for fullscreen access
  currentMaterial = material;
  
  const titleEl = document.getElementById('materialTitle');
  const descEl = document.getElementById('materialDescription');
  const fullDescEl = document.getElementById('detailFullDescription');
  const categoryEl = document.getElementById('detailCategory');
  const difficultyEl = document.getElementById('detailDifficulty');
  const durationEl = document.getElementById('detailDuration');
  const thumbnailEl = document.getElementById('materialThumbnail');
  const objectivesEl = document.getElementById('detailObjectives');
  const langEl = document.getElementById('detailLanguage');
  const inlinePdfFrame = document.getElementById('inlinePdfFrame');

  if (!titleEl) return;

  titleEl.textContent = material.title;
  descEl.textContent = material.description;
  fullDescEl.textContent = material.description;
  categoryEl.textContent = material.category;
  difficultyEl.textContent = material.difficulty;
  durationEl.textContent = material.duration || 'PDF';
  thumbnailEl.onerror = () => {
    const colors = ["#2563eb", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#14b8a6", "#6366f1"];
    const charCodeSum = material.title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const color = colors[charCodeSum % colors.length];
    const initials = material.title.split(" ").map(w => w[0]).join("").substring(0, 3).toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 260" width="420" height="260">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="'Inter', sans-serif" font-size="48" font-weight="bold">${initials}</text>
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="'Inter', sans-serif" font-size="20" font-weight="500">${material.category}</text>
      </svg>
    `;
    thumbnailEl.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
    thumbnailEl.onerror = null;
  };
  thumbnailEl.src = material.thumbnail || 'https://via.placeholder.com/420x260?text=PDF+Preview';
  thumbnailEl.alt = `${material.title} preview`;

  if (langEl) langEl.textContent = material.language || 'General';

  const objectives = buildObjectives(material);
  objectivesEl.innerHTML = objectives.map(item => `<li>${item}</li>`).join('');

  // Auto-open fullscreen PDF viewer immediately when page loads
  if (material.resourceUrl) {
    // Hide the old inline message/container — we use fullscreen viewer instead
    const pdfMessage = document.getElementById('pdfMessage');
    const inlinePdfContainer = document.getElementById('inlinePdfContainer');
    if (pdfMessage) pdfMessage.style.display = 'none';
    if (inlinePdfContainer) inlinePdfContainer.style.display = 'none';
    // Open PDF in fullscreen viewer automatically
    setTimeout(function() {
      const fullscreenViewer = document.getElementById('fullscreenViewer');
      const fullscreenPdfViewer = document.getElementById('fullscreenPdfViewer');
      const viewerTitle = document.getElementById('viewerTitle');
      if (fullscreenViewer && fullscreenPdfViewer) {
        if (viewerTitle) viewerTitle.textContent = material.title;
        fullscreenPdfViewer.src = getPdfViewerUrl(material.resourceUrl);
        fullscreenViewer.classList.add('active');
      }
    }, 300);
  }

  const progress = getProgress(material.slug);
  updateProgressUI(progress);
}

// Fullscreen viewer functions
window.openFullscreen = function() {
  if (!currentMaterial) return;
  
  const fullscreenViewer = document.getElementById('fullscreenViewer');
  const fullscreenPdfViewer = document.getElementById('fullscreenPdfViewer');
  const viewerTitle = document.getElementById('viewerTitle');
  
  if (fullscreenViewer && fullscreenPdfViewer) {
    if (viewerTitle) viewerTitle.textContent = currentMaterial.title;
    // Use Google Docs viewer — no download, no raw GitHub URL
    fullscreenPdfViewer.src = getPdfViewerUrl(currentMaterial.resourceUrl);
    fullscreenViewer.classList.add('active');
  }
};

window.closeFullscreen = function() {
  const fullscreenViewer = document.getElementById('fullscreenViewer');
  if (fullscreenViewer) {
    fullscreenViewer.classList.remove('active');
  }
};

function loadMaterialDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  const detailSection = document.getElementById('materialDetails');

  if (!slug || !detailSection) return;

  const material = getMaterialBySlug(slug);
  if (!material) {
    detailSection.innerHTML = '<p class="error-message">Material not found. Please go back and select another item.</p>';
    return;
  }

  displayMaterialDetail(material);
}

async function loadMaterials() {
  try {
    const response = await fetch('materials.json');
    materials = await response.json();
    assignSlugs();

    // Apply URL query params as filters automatically
    const params = new URLSearchParams(window.location.search);
    const paramCategory = params.get('category');
    const paramLanguage = params.get('language');

    if (paramCategory && categoryFilter) {
      // Find matching option value (handles spaces/special chars)
      const opts = Array.from(categoryFilter.options).map(o => o.value);
      const match = opts.find(v => v.toLowerCase() === paramCategory.toLowerCase());
      if (match) categoryFilter.value = match;
    }
    if (paramLanguage && languageFilter) {
      const langOpts = Array.from(languageFilter.options).map(o => o.value);
      const langMatch = langOpts.find(v => v.toLowerCase() === paramLanguage.toLowerCase());
      if (langMatch) languageFilter.value = langMatch;
    }

    filterMaterials();
    loadMaterialDetail();
  } catch (error) {
    if (materialsGrid) {
      materialsGrid.innerHTML = '<p class="error-message">Unable to load materials. Please make sure materials.json is available.</p>';
    }
    console.error(error);
  }
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', filterMaterials);
}
if (difficultyFilter) {
  difficultyFilter.addEventListener('change', filterMaterials);
}
if (languageFilter) {
  languageFilter.addEventListener('change', filterMaterials);
}
if (sortFilter) {
  sortFilter.addEventListener('change', filterMaterials);
}

loadMaterials();

// Open material PDF inline from materials list
window.openMaterialInline = function(id) {
  const material = getMaterialById(id);
  if (!material || !material.resourceUrl) return;
  const viewer = document.getElementById('materialsViewer');
  const iframe = document.getElementById('materialsPdfViewer');
  if (iframe) iframe.src = getPdfViewerUrl(material.resourceUrl);
  if (viewer) viewer.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('materialsViewerClose');
  const viewer = document.getElementById('materialsViewer');
  const iframe = document.getElementById('materialsPdfViewer');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    if (viewer) viewer.style.display = 'none';
    if (iframe) iframe.src = '';
  });
});
