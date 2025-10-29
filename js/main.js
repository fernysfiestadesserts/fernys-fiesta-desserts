document.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
  initTabs();
  initLightbox();  // uses ff- names to avoid collisions

  // Tab -> show the matching section (.cake-menu / .cookies-menu / .other-menu)
    document.querySelectorAll('.menu-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // update tab visual/aria state
        document.querySelectorAll('.menu-tabs .tab-btn').forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        // hide all sections
        ['.cake-menu', '.cookies-menu', '.other-menu'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.classList.remove('active');
        });

        // show the target section
        const targetSel = btn.dataset.target;
        const target = targetSel ? document.querySelector(targetSel) : null;
        if (target) target.classList.add('active');
    });
    });

});

/* ===== Mobile menu toggle ===== */
function initMenuToggle() {
  const menuToggle = document.querySelector('.menu-icon'); // <a class="menu-icon"><i class='bx bx-menu'></i></a>
  const miniNav = document.querySelector('.nav-list');
  if (!menuToggle || !miniNav) return;

  menuToggle.setAttribute('role', 'button');
  menuToggle.setAttribute('aria-expanded', 'false');

  menuToggle.addEventListener('click', (e) => {
    e.preventDefault(); // prevent "#" jump
    const open = miniNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
}

/* ===== Tabs (Cakes / Cookies / Other) ===== */
function initTabs() {
  const tabs = document.querySelectorAll('.menu-tabs .tab-btn');
  if (!tabs.length) return;

  function activateTab(tab) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.classList.toggle('is-active', selected);
      t.setAttribute('aria-selected', String(selected));
      const id = t.getAttribute('aria-controls');
      const panel = id ? document.getElementById(id) : null;
      if (panel) {
        panel.hidden = !selected;
        panel.classList.toggle('is-active', selected);
      }
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        activateTab(next);
      }
    });
  });

  activateTab(document.getElementById('tab-cakes') || tabs[0]);
}

/* ===== Lightbox (namespaced: ff-) ===== */
function initLightbox() {
  // auto-inject markup if missing
  if (!document.querySelector('.ff-lightbox')) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="ff-lightbox" hidden>
        <div class="ff-backdrop"></div>
        <div class="ff-modal" role="dialog" aria-modal="true" aria-label="Image preview">
          <button class="ff-close" aria-label="Close preview">×</button>
          <img id="ff-lightbox-img" alt="Expanded dessert image">
        </div>
      </div>`;
    document.body.appendChild(wrap.firstElementChild);
  }

  const overlay  = document.querySelector('.ff-lightbox');
  const backdrop = document.querySelector('.ff-backdrop');
  const modalImg = document.getElementById('ff-lightbox-img');
  const closeBtn = document.querySelector('.ff-close');

  const open = (src) => { if (src) { modalImg.src = src; overlay.hidden = false; } };
  const close = () => { overlay.hidden = true; modalImg.src = ''; };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.menu-card');
    if (!card) return;
    if (card.tagName === 'A') e.preventDefault(); // stop "#" jump
    const src = card.dataset.full || card.querySelector('img')?.src;
    open(src);
  });

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
