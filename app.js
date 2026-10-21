const PASSWORDS = {
      atreides: [
        { level: 2, code: 'DIPLOMATIC' },
        { level: 3, code: 'SPICEDANCE' },
        { level: 4, code: 'ETERNALSUN' },
        { level: 5, code: 'DEFTHUNTER' },
        { level: 6, code: 'FAIRMENTAT' },
        { level: 7, code: 'ASHLIKENNY' },
        { level: 8, code: 'SONICBLAST' },
        { level: 9, code: 'DUNERUNNER' },
        { level: 'Final', code: 'DUNEFINALE' }
      ],
      harkonnen: [
        { level: 2, code: 'DEMOLITION' },
        { level: 3, code: 'SPICESATYR' },
        { level: 4, code: 'BURNINGSUN' },
        { level: 5, code: 'DARKHUNTER' },
        { level: 6, code: 'EVILMENTAT' },
        { level: 7, code: 'ITSJOEBWAN' },
        { level: 8, code: 'DEVASTATOR' },
        { level: 9, code: 'DEATHRULER' },
        { level: 'Final', code: 'DUNEFINALE' }
      ],
      ordos: [
        { level: 2, code: 'DOMINATION' },
        { level: 3, code: 'SPICESABRE' },
        { level: 4, code: 'ARRAKISSUN' },
        { level: 5, code: 'COLDHUNTER' },
        { level: 6, code: 'WILYMENTAT' },
        { level: 7, code: 'SLYMELANIE' },
        { level: 8, code: 'STEALTHWAR' },
        { level: 9, code: 'POWERCRUSH' },
        { level: 'Final', code: 'DUNEFINALE' }
      ]
    };

    let currentHouse = 'atreides';

    function renderPasswords(house) {
      const container = document.getElementById('passwords-box');
      const list = PASSWORDS[house] || [];
      container.innerHTML = list.map(item => `
        <div class="pass-item">
          <span>${typeof item.level === 'number' ? 'Mission ' + item.level : item.level + ' Mission'}</span>
          <span class="pass-code">${item.code}</span>
          <button class="btn-copy" onclick="copyText('${item.code}')">Copy</button>
        </div>
      `).join('');
    }

    function renderFullPasswords() {
      const fullList = document.getElementById('full-passwords-list');
      let html = '';
      for (const [house, items] of Object.entries(PASSWORDS)) {
        html += `<h5 style="color: var(--accent-gold); text-transform: uppercase; margin-top: 12px;">House ${house}</h5>`;
        items.forEach(item => {
          html += `
            <div class="pass-item">
              <span>${typeof item.level === 'number' ? 'Mission ' + item.level : item.level + ' Mission'}</span>
              <span class="pass-code">${item.code}</span>
              <button class="btn-copy" onclick="copyText('${item.code}')">Copy 📋</button>
            </div>
          `;
        });
      }
      fullList.innerHTML = html;
    }

    function copyText(text) {
      navigator.clipboard?.writeText(text);
      showToast(`🔑 Password "${text}" copied!`);
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function openModal(id) {
      document.getElementById(id)?.classList.add('open');
    }
    function closeModal(id) {
      document.getElementById(id)?.classList.remove('open');
    }

    // Event Listeners
    document.querySelectorAll('.house-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.house-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentHouse = btn.dataset.house;
        renderPasswords(currentHouse);
      });
    });

    document.getElementById('btn-cheats')?.addEventListener('click', () => openModal('modal-cheats'));
    document.getElementById('btn-manual')?.addEventListener('click', () => openModal('modal-manual'));

    // CRT Toggle
    let crtActive = false;
    document.getElementById('btn-crt-toggle')?.addEventListener('click', () => {
      crtActive = !crtActive;
      document.getElementById('game-card').classList.toggle('crt-active', crtActive);
      const crtBtn = document.getElementById('btn-crt-toggle');
      if (crtBtn) crtBtn.innerHTML = crtActive ? '<span>📺</span> <span class="btn-text">CRT: ON</span>' : '<span>📺</span> <span class="btn-text">CRT: OFF</span>';
      showToast(crtActive ? '📺 Vintage CRT Scanlines Enabled' : 'CRT Shader Disabled');
    });

    // Sidebar Drawer Toggle
    function toggleSidebar(open) {
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      const isOpen = open !== undefined ? open : !sidebar.classList.contains('open');
      sidebar.classList.toggle('open', isOpen);
      backdrop.classList.toggle('open', isOpen);
    }
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => toggleSidebar());
    document.getElementById('btn-close-sidebar')?.addEventListener('click', () => toggleSidebar(false));
    document.getElementById('sidebar-backdrop')?.addEventListener('click', () => toggleSidebar(false));

    // Sound Mute / Unmute
    let isMuted = false;
    function toggleMute(forceState) {
      isMuted = forceState !== undefined ? forceState : !isMuted;
      try {
        const frame = document.getElementById('game-frame');
        frame?.contentWindow?.setAudioMuted?.(isMuted);
      } catch (e) {
        console.warn('Audio mute error:', e);
      }
      const btn = document.getElementById('btn-mute-toggle');
      if (btn) {
        btn.innerHTML = isMuted ? '<span>🔇</span> <span class="btn-text">Muted</span>' : '<span>🔊</span> <span class="btn-text">Sound</span>';
        btn.classList.toggle('btn-muted', isMuted);
      }
      showToast(isMuted ? '🔇 Sound Muted' : '🔊 Sound Unmuted');
    }
    document.getElementById('btn-mute-toggle')?.addEventListener('click', () => toggleMute());

    // Restore mute state if game reloads
    document.getElementById('game-frame')?.addEventListener('load', () => {
      if (isMuted) {
        setTimeout(() => {
          try {
            document.getElementById('game-frame')?.contentWindow?.setAudioMuted?.(true);
          } catch(e) {}
        }, 150);
      }
    });

    // Fullscreen
    document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
      const card = document.getElementById('game-card');
      if (!document.fullscreenElement) {
        card.requestFullscreen?.().catch(err => {
          console.error("Fullscreen error:", err);
        });
      } else {
        document.exitFullscreen?.();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      const isFs = !!document.fullscreenElement;
      const btn = document.getElementById('btn-fullscreen');
      if (btn) btn.innerHTML = isFs ? '<span>🗗</span> <span class="btn-text hide-sm">Exit FS</span>' : '<span>⛶</span> <span class="btn-text hide-sm">Fullscreen</span>';
    });

    // Reload
    document.getElementById('btn-reload')?.addEventListener('click', () => {
      showPreloader();
      document.getElementById('game-frame').src = 'rearrakis_src/build/dune_web.html?t=' + Date.now();
      showToast('🔄 Restarting Game...');
    });

    // Close modals on background click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    });

    // Preloader Management
    const preloaderEl = document.getElementById('game-preloader');
    const preloaderFill = document.getElementById('preloader-bar-fill');
    const preloaderStatus = document.getElementById('preloader-status-text');
    const preloaderPct = document.getElementById('preloader-pct');
    let preloaderDismissed = false;
    let preloaderProgress = 8;

    const tips = [
      "Tactical Mouse Controls: Left Click to select/move • Right Click to cancel • Wheel to Zoom",
      "Quick Savestates: Press F5 anytime to Quick Save, and F8 to Quick Load your campaign!",
      "Spice Harvesting: Deploy Harvesters on spice fields to fund your battle conquest",
      "Screen Edge Scrolling: Move mouse towards screen edges to pan battlefield camera",
      "Fast-Forward Speed: Press TAB key in-game to toggle 3x turbo simulation speed",
      "Mentat Advisors: Press SPACE or ENTER anytime for tactical briefings & game options"
    ];
    let tipIdx = 0;
    setInterval(() => {
      const tipEl = document.getElementById('preloader-tip');
      if (tipEl && !preloaderDismissed) {
        tipIdx = (tipIdx + 1) % tips.length;
        tipEl.innerHTML = `<span>💡</span> <span>${tips[tipIdx]}</span>`;
      }
    }, 3500);

    function updatePreloader(text, pct) {
      if (preloaderDismissed) return;
      if (typeof pct === 'number' && !isNaN(pct)) {
        preloaderProgress = Math.max(preloaderProgress, Math.min(100, pct));
      }
      if (preloaderFill) preloaderFill.style.width = preloaderProgress + '%';
      if (preloaderPct) preloaderPct.textContent = preloaderProgress + '%';
      if (text && preloaderStatus) {
        preloaderStatus.textContent = text;
      }
    }

    let preloaderStartTime = Date.now();
    const MIN_PRELOADER_TIME = 1600;

    function hidePreloader() {
      if (preloaderDismissed) return;
      preloaderProgress = 100;
      if (preloaderFill) preloaderFill.style.width = '100%';
      if (preloaderPct) preloaderPct.textContent = '100%';
      if (preloaderStatus) preloaderStatus.textContent = 'Battlefield Ready. Good luck, Commander!';

      const elapsed = Date.now() - preloaderStartTime;
      const delay = Math.max(0, MIN_PRELOADER_TIME - elapsed) + 400;

      setTimeout(() => {
        preloaderDismissed = true;
        if (preloaderEl) preloaderEl.classList.add('fade-out');
      }, delay);
    }

    function showPreloader() {
      preloaderDismissed = false;
      preloaderStartTime = Date.now();
      preloaderProgress = 10;
      if (preloaderFill) preloaderFill.style.width = '10%';
      if (preloaderPct) preloaderPct.textContent = '10%';
      if (preloaderStatus) preloaderStatus.textContent = 'Connecting Arrakis Core...';
      if (preloaderEl) preloaderEl.classList.remove('fade-out');
    }

    // Savestate System Management
    const SLOTS = [
      { id: 'quick', name: 'Quick Save Slot', hotkey: 'F5 / F8' },
      { id: '1', name: 'Campaign Slot 1', hotkey: '' },
      { id: '2', name: 'Campaign Slot 2', hotkey: '' },
      { id: '3', name: 'Campaign Slot 3', hotkey: '' }
    ];

    function triggerSave(slot = 'quick') {
      const frame = document.getElementById('game-frame');
      if (!frame || !frame.contentWindow) return;
      frame.contentWindow.postMessage({ action: 'dune-save-state', slot: slot }, '*');
      showToast('💾 Saving battlefield state...');
    }

    function triggerLoad(slot = 'quick') {
      const key = 'dune2_save_' + slot;
      const data = localStorage.getItem(key);
      if (!data) {
        showToast('⚠️ No save found in ' + (slot === 'quick' ? 'Quick Save (F5)' : 'Slot ' + slot) + '! Press F5 to save.');
        return;
      }
      const frame = document.getElementById('game-frame');
      if (!frame || !frame.contentWindow) return;
      frame.contentWindow.postMessage({ action: 'dune-load-state', slot: slot, data: data }, '*');
      showToast('📂 Restoring battlefield state...');
    }

    function deleteSave(slot) {
      localStorage.removeItem('dune2_save_' + slot);
      localStorage.removeItem('dune2_save_' + slot + '_date');
      localStorage.removeItem('dune2_save_' + slot + '_size');
      showToast('🗑️ Cleared ' + (slot === 'quick' ? 'Quick Save' : 'Slot ' + slot));
      renderSlotsUI();
    }

    function renderSlotsUI() {
      const container = document.getElementById('slots-list');
      if (!container) return;
      container.innerHTML = SLOTS.map(s => {
        const data = localStorage.getItem('dune2_save_' + s.id);
        const date = localStorage.getItem('dune2_save_' + s.id + '_date');
        const size = localStorage.getItem('dune2_save_' + s.id + '_size');
        const hasData = !!data;
        return `
          <div class="slot-row">
            <div class="slot-info">
              <div class="slot-title">
                ${s.name} ${s.hotkey ? `<span class="slot-badge">${s.hotkey}</span>` : ''}
              </div>
              <div class="slot-meta">
                ${hasData ? `<span>🕒 ${date}</span> &bull; <span>${size || ''}</span>` : `<span style="color: rgba(255,255,255,0.3);">&mdash; Empty Slot &mdash;</span>`}
              </div>
            </div>
            <div class="slot-actions">
              <button class="btn-slot btn-slot-save" onclick="triggerSave('${s.id}')">💾 Save</button>
              <button class="btn-slot btn-slot-load" onclick="triggerLoad('${s.id}')" ${!hasData ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''}>📂 Load</button>
              ${hasData ? `<button class="btn-slot" onclick="deleteSave('${s.id}')" title="Delete Slot">🗑️</button>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    // Global Hotkeys (F5 for Quick Save, F8 for Quick Load)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F5') {
        e.preventDefault();
        triggerSave('quick');
      } else if (e.key === 'F8') {
        e.preventDefault();
        triggerLoad('quick');
      }
    });

    document.getElementById('btn-quicksave')?.addEventListener('click', () => triggerSave('quick'));
    document.getElementById('btn-quickload')?.addEventListener('click', () => triggerLoad('quick'));
    document.getElementById('btn-slots')?.addEventListener('click', () => {
      renderSlotsUI();
      openModal('modal-slots');
    });

    // File Export & Import
    document.getElementById('btn-export-save')?.addEventListener('click', () => {
      const data = localStorage.getItem('dune2_save_quick') || localStorage.getItem('dune2_save_1');
      if (!data) {
        showToast('⚠️ No save data found to export! Save with F5 first.');
        return;
      }
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dune2_arrakis_${Date.now()}.sav`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 Save state downloaded to file!');
    });

    const fileImportInput = document.getElementById('file-import-save');
    document.getElementById('btn-import-save')?.addEventListener('click', () => {
      fileImportInput?.click();
    });
    fileImportInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        const text = evt.target?.result;
        if (typeof text === 'string' && text.length > 50) {
          localStorage.setItem('dune2_save_quick', text);
          localStorage.setItem('dune2_save_quick_date', new Date().toLocaleString());
          localStorage.setItem('dune2_save_quick_size', (text.length * 0.75 / 1024).toFixed(1) + ' KB');
          triggerLoad('quick');
          renderSlotsUI();
          showToast('📤 State imported from file and loaded!');
        } else {
          showToast('❌ Invalid or empty save file');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // Message receiver from iframe
    window.addEventListener('message', (event) => {
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'dune-status') {
        updatePreloader(event.data.text, event.data.percent);
      } else if (event.data.type === 'dune-ready') {
        hidePreloader();
      } else if (event.data.type === 'dune-save-result') {
        if (event.data.success && event.data.data) {
          const slot = event.data.slot || 'quick';
          const sizeKb = (event.data.size / 1024).toFixed(1);
          localStorage.setItem('dune2_save_' + slot, event.data.data);
          localStorage.setItem('dune2_save_' + slot + '_date', new Date().toLocaleString());
          localStorage.setItem('dune2_save_' + slot + '_size', sizeKb + ' KB');
          showToast(`💾 State Saved! (${slot === 'quick' ? 'Quick Save F5' : 'Slot ' + slot} • ${sizeKb} KB)`);
          renderSlotsUI();
        } else {
          showToast('❌ Save failed: ' + (event.data.error || 'Engine busy'));
        }
      } else if (event.data.type === 'dune-load-result') {
        if (event.data.success) {
          const slot = event.data.slot || 'quick';
          showToast(`📂 State Loaded! (${slot === 'quick' ? 'Quick Slot F8' : 'Slot ' + slot})`);
        } else {
          showToast('❌ Load failed: corrupted or incompatible state');
        }
      }
    });

    // Safety fallback: only if network completely hangs after 60 seconds
    setTimeout(() => {
      hidePreloader();
    }, 60000);

    // Forward mouse leave to engine when cursor leaves game viewport
    function sendMouseLeave() {
      const frame = document.getElementById('game-frame');
      frame?.contentWindow?.postMessage({ action: 'dune-mouse-leave' }, '*');
    }
    document.querySelector('.header')?.addEventListener('mouseenter', sendMouseLeave);
    document.querySelector('.viewport-controls')?.addEventListener('mouseenter', sendMouseLeave);
    document.addEventListener('mouseleave', sendMouseLeave);
    window.addEventListener('blur', sendMouseLeave);

    // Initial render
    renderPasswords('atreides');
    renderFullPasswords();
