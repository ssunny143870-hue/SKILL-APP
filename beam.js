// ─── Beam: Global Spotlight Search ───
(function() {
  let beamData = [];
  let beamSelectedIndex = 0;
  let beamResults = [];
  let beamOpen = false;

  // Quick navigation links
  const navLinks = [
    { title: 'Home', desc: 'Go to the main dashboard', icon: '🏠', url: 'index.html' },
    { title: 'Materials', desc: 'Browse all learning materials', icon: '📚', url: 'materials.html' },
    { title: 'Videos', desc: 'Watch video tutorials', icon: '📺', url: 'videos.html' },
    { title: 'About', desc: 'Learn about SUN Skills Hub', icon: 'ℹ️', url: 'about.html' },
    { title: 'Mock Tests', desc: 'Practice Python, Java & SQL tests', icon: '📝', url: 'mock_tests.html' },
    { title: 'Profile', desc: 'View your profile', icon: '👤', url: 'profile.html' }
  ];

  function buildSlug(title) {
    return title.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Load materials data
  async function loadBeamData() {
    try {
      const res = await fetch('materials.json');
      beamData = await res.json();
      beamData.forEach(m => {
        if (!m.slug) m.slug = buildSlug(m.title);
      });
    } catch (e) {
      console.warn('Beam: Could not load materials data');
    }
  }

  function openBeam() {
    const overlay = document.getElementById('beamOverlay');
    if (!overlay) return;
    overlay.classList.add('active');
    beamOpen = true;
    beamSelectedIndex = 0;
    const input = document.getElementById('beamInput');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
    }
    showDefaultResults();
    document.body.style.overflow = 'hidden';
  }

  function closeBeam() {
    const overlay = document.getElementById('beamOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    beamOpen = false;
    document.body.style.overflow = '';
  }

  function showDefaultResults() {
    const container = document.getElementById('beamResults');
    if (!container) return;
    
    let html = '<div class="beam-section-label">Quick Navigation</div>';
    html += navLinks.map((link, i) => `
      <a href="${link.url}" class="beam-result-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
        <span class="beam-result-icon">${link.icon}</span>
        <div class="beam-result-info">
          <span class="beam-result-title">${link.title}</span>
          <span class="beam-result-desc">${link.desc}</span>
        </div>
        <span class="beam-result-hint">Page</span>
      </a>
    `).join('');
    
    container.innerHTML = html;
    beamResults = navLinks;
    beamSelectedIndex = 0;
  }

  function searchBeam(query) {
    const container = document.getElementById('beamResults');
    if (!container) return;

    if (!query.trim()) {
      showDefaultResults();
      return;
    }

    const q = query.toLowerCase();

    // Search materials
    const materialResults = beamData.filter(m => {
      const text = [m.title, m.description, m.category, m.language, ...(m.tags || [])]
        .join(' ').toLowerCase();
      return text.includes(q);
    }).slice(0, 8);

    // Search nav links
    const navResults = navLinks.filter(l =>
      l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q)
    );

    beamResults = [...navResults.map(r => ({ ...r, type: 'nav' })), ...materialResults.map(r => ({ ...r, type: 'material' }))];
    beamSelectedIndex = 0;

    if (beamResults.length === 0) {
      container.innerHTML = `
        <div class="beam-empty">
          <span class="beam-empty-icon">🔍</span>
          <p>No results for "<strong>${escapeHtml(query)}</strong>"</p>
          <span class="beam-empty-hint">Try different keywords or browse materials</span>
        </div>`;
      return;
    }

    let html = '';
    
    if (navResults.length > 0) {
      html += '<div class="beam-section-label">Navigation</div>';
      html += navResults.map((link, i) => `
        <a href="${link.url}" class="beam-result-item ${i === 0 ? 'selected' : ''}" data-index="${i}" data-type="nav">
          <span class="beam-result-icon">${link.icon}</span>
          <div class="beam-result-info">
            <span class="beam-result-title">${highlightMatch(link.title, query)}</span>
            <span class="beam-result-desc">${link.desc}</span>
          </div>
          <span class="beam-result-hint">Page</span>
        </a>
      `).join('');
    }

    if (materialResults.length > 0) {
      const offset = navResults.length;
      html += '<div class="beam-section-label">Materials</div>';
      html += materialResults.map((m, i) => `
        <a href="material.html?slug=${encodeURIComponent(m.slug)}" class="beam-result-item ${offset + i === 0 ? 'selected' : ''}" data-index="${offset + i}" data-type="material">
          <span class="beam-result-icon">📄</span>
          <div class="beam-result-info">
            <span class="beam-result-title">${highlightMatch(m.title, query)}</span>
            <span class="beam-result-desc">${m.category}${m.language ? ' · ' + m.language : ''}</span>
          </div>
          <span class="beam-result-hint">${m.difficulty || ''}</span>
        </a>
      `).join('');
    }

    container.innerHTML = html;
  }

  function highlightMatch(text, query) {
    if (!query.trim()) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escaped.replace(regex, '<mark class="beam-highlight">$1</mark>');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function navigateToSelected() {
    const items = document.querySelectorAll('.beam-result-item');
    if (items[beamSelectedIndex]) {
      items[beamSelectedIndex].click();
    }
  }

  function updateSelection() {
    const items = document.querySelectorAll('.beam-result-item');
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === beamSelectedIndex);
    });
    // Scroll into view
    if (items[beamSelectedIndex]) {
      items[beamSelectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  // ─── Event Listeners ───

  // Ctrl+K / Cmd+K to open
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (beamOpen) closeBeam();
      else openBeam();
    }
    if (e.key === 'Escape' && beamOpen) {
      e.preventDefault();
      closeBeam();
    }
  });

  // Keyboard navigation inside beam
  document.addEventListener('keydown', (e) => {
    if (!beamOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      beamSelectedIndex = Math.min(beamSelectedIndex + 1, beamResults.length - 1);
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      beamSelectedIndex = Math.max(beamSelectedIndex - 1, 0);
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigateToSelected();
    }
  });

  // Expose open/close functions globally
  window.openBeam = openBeam;
  window.closeBeam = closeBeam;

  // Initialize when DOM is ready
  function initBeam() {
    loadBeamData();

    // Overlay click to close
    const overlay = document.getElementById('beamOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeBeam();
      });
    }

    // Search input
    const input = document.getElementById('beamInput');
    if (input) {
      input.addEventListener('input', (e) => {
        searchBeam(e.target.value);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBeam);
  } else {
    initBeam();
  }
})();
