// FIT24 - Admin ERP & Client Management System Logic

let convertingLeadId = null;

document.addEventListener("DOMContentLoaded", () => {
  initAdminTabs();
  initDashboard();
  initAttendanceDesk();
  initMemberCRM();
  initLeadCRM();
  initFacilityPassbook();
  initPauseEngine();
  initCafePOS();
  initTrainerManagement();
  initClassTimetableManagement();
  initBlogManagement();
  initInvoicesModule();
  initDataBackup();
  renderAllData();
});

// Tab Switcher
function initAdminTabs() {
  const navBtns = document.querySelectorAll(".admin-nav-btn");
  const tabPanels = document.querySelectorAll(".admin-tab-panel");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;
      navBtns.forEach(b => {
        b.classList.remove("bg-[#ff0033]", "bg-red-600", "text-white");
        b.classList.add("text-zinc-400", "hover:bg-white/5", "hover:text-white");
      });
      btn.classList.add("bg-[#ff0033]", "text-white");
      btn.classList.remove("text-zinc-400", "hover:bg-white/5");

      tabPanels.forEach(p => p.classList.add("hidden"));
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.remove("hidden");
        if (targetId === "tab-leads") {
          renderLeadsTable();
        } else if (targetId === "tab-trainers") {
          renderTrainersTable();
        } else if (targetId === "tab-classes") {
          renderClassesTable();
        } else if (targetId === "tab-blog") {
          renderBlogTable();
        } else if (targetId === "tab-invoices") {
          renderInvoicesTable();
        }
      }
    });
  });
}

// Master refresh
function renderAllData() {
  renderDashboardMetrics();
  renderCashbookAndChurnRadar();
  renderAttendanceTable();
  renderMemberTable();
  renderLeadsTable();
  renderFacilityLogs();
  renderPauseOverview();
  renderCafeLogs();
  renderTrainersTable();
  renderClassesTable();
  renderBlogTable();
  renderInvoicesTable();
  populateMemberSelectDropdowns();
}

// 1. Dashboard Metrics
function initDashboard() {
  renderDashboardMetrics();
}

function renderDashboardMetrics() {
  const store = window.fit24Store.getStore();
  const members = store.members || [];
  const attendances = store.attendances || [];
  const facilityLogs = store.facilityLogs || [];

  // Active / Paused count
  const activeCount = members.filter(m => m.status === "ACTIVE").length;
  const pausedCount = members.filter(m => m.status === "PAUSED").length;
  const eliteCount = members.filter(m => m.tier === "ELITE").length;
  const primeCount = members.filter(m => m.tier === "PRIME").length;
  const proCount = members.filter(m => m.tier === "PRO").length;

  // Counts
  const elTotal = document.getElementById("metric-total-members");
  const elActive = document.getElementById("metric-active-members");
  const elPaused = document.getElementById("metric-paused-members");
  const elCheckins = document.getElementById("metric-today-checkins");
  const elOccupancy = document.getElementById("metric-live-occupancy");
  const elFacilityCount = document.getElementById("metric-facility-used");

  if (elTotal) elTotal.innerText = members.length;
  if (elActive) elActive.innerText = activeCount;
  if (elPaused) elPaused.innerText = pausedCount;
  if (elCheckins) elCheckins.innerText = attendances.length;
  if (elOccupancy) elOccupancy.innerText = Math.max(1, attendances.length); // simulated floor occupancy
  if (elFacilityCount) elFacilityCount.innerText = facilityLogs.length;

  // Tier counts
  const elTiers = document.getElementById("metric-tier-breakdown");
  if (elTiers) {
    elTiers.innerText = `Elite: ${eliteCount} · Prime: ${primeCount} · Pro: ${proCount}`;
  }

  // Recent feed
  const feedContainer = document.getElementById("dashboard-recent-feed");
  if (feedContainer) {
    feedContainer.innerHTML = attendances.slice(0, 5).map(att => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 font-bold font-mono text-xs flex items-center justify-center">
            ${att.memberId.replace('F24-', '')}
          </div>
          <div>
            <h5 class="text-xs font-bold text-white">${att.name}</h5>
            <span class="text-[10px] text-zinc-400">${att.tier} · ${att.method}</span>
          </div>
        </div>
        <span class="text-xs font-mono text-zinc-400 font-semibold">${att.time}</span>
      </div>
    `).join("") || `<div class="text-xs text-zinc-500 text-center py-4">No check-ins logged yet today</div>`;
  }
}

// 2. Attendance & Reception Check-in Desk
function initAttendanceDesk() {
  const searchInput = document.getElementById("checkin-search-input");
  const suggestionsBox = document.getElementById("checkin-suggestions");
  const checkinBtn = document.getElementById("do-checkin-btn");
  let selectedMemberForCheckin = null;

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        suggestionsBox.classList.add("hidden");
        return;
      }

      const members = window.fit24Store.getMembers();
      const matches = members.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.phone.includes(q) || 
        m.id.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        suggestionsBox.innerHTML = `<div class="p-3 text-xs text-zinc-500">No member found with "${q}"</div>`;
        suggestionsBox.classList.remove("hidden");
        return;
      }

      suggestionsBox.innerHTML = matches.map(m => `
        <div class="p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 flex items-center justify-between suggestion-item" data-id="${m.id}">
          <div>
            <div class="text-xs font-bold text-white flex items-center gap-2">
              ${m.name}
              <span class="text-[10px] px-1.5 py-0.5 rounded font-mono ${m.tier === 'ELITE' ? 'bg-yellow-500/20 text-yellow-400' : m.tier === 'PRIME' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}">${m.tier}</span>
            </div>
            <div class="text-[11px] text-zinc-400 font-mono">${m.id} · ${m.phone}</div>
          </div>
          <div class="text-right">
            <span class="text-[11px] font-bold ${m.isPaused ? 'text-amber-400' : 'text-emerald-400'}">${m.isPaused ? 'PAUSED' : 'ACTIVE'}</span>
          </div>
        </div>
      `).join("");

      suggestionsBox.classList.remove("hidden");

      document.querySelectorAll(".suggestion-item").forEach(item => {
        item.addEventListener("click", () => {
          const m = window.fit24Store.getMember(item.dataset.id);
          selectedMemberForCheckin = m;
          searchInput.value = `${m.name} (${m.id})`;
          suggestionsBox.classList.add("hidden");
          displayCheckinPreview(m);
        });
      });
    });
  }

  if (checkinBtn) {
    checkinBtn.addEventListener("click", () => {
      if (!selectedMemberForCheckin) {
        alert("Please search and select a member first.");
        return;
      }

      const res = window.fit24Store.checkInMember(selectedMemberForCheckin.id, "Front Desk Search");
      if (!res.success) {
        alert(`Cannot Check In: ${res.message}`);
        return;
      }

      alert(`✓ Checked In: ${res.member.name} (${res.member.tier}) at ${res.record.time}`);
      searchInput.value = "";
      selectedMemberForCheckin = null;
      document.getElementById("checkin-preview-card").classList.add("hidden");
      renderAllData();
    });
  }

  // Simulated QR Check-in scanner
  const qrSimulateBtn = document.getElementById("simulate-qr-btn");
  if (qrSimulateBtn) {
    qrSimulateBtn.addEventListener("click", () => {
      const code = prompt("Scan / Enter Member Code (e.g. F24-1001, F24-1002):", "F24-1001");
      if (code) {
        const res = window.fit24Store.checkInMember(code.trim(), "QR Pass Scanner");
        if (!res.success) {
          alert(`QR Scan Error: ${res.message}`);
        } else {
          alert(`✓ QR Scan Success: ${res.member.name} checked into FIT24 Kanhangad!`);
          renderAllData();
        }
      }
    });
  }
}

function displayCheckinPreview(m) {
  const card = document.getElementById("checkin-preview-card");
  if (!card) return;

  card.classList.remove("hidden");
  card.innerHTML = `
    <div class="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 font-bold font-display text-lg flex items-center justify-center">
          ${m.tier[0]}
        </div>
        <div>
          <h4 class="text-sm font-bold text-white flex items-center gap-2">
            ${m.name}
            <span class="text-xs px-2 py-0.5 rounded ${m.tier === 'ELITE' ? 'bg-yellow-500/20 text-yellow-400' : m.tier === 'PRIME' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}">${m.tier}</span>
          </h4>
          <div class="text-xs text-zinc-400 font-mono">${m.id} · ${m.phone}</div>
          <div class="text-xs mt-1">
            <span class="text-zinc-500">Plan Expiry:</span> <strong class="text-zinc-200">${m.endDate}</strong>
            <span class="mx-2 text-zinc-600">|</span>
            <span class="text-zinc-500">Visits:</span> <strong class="text-zinc-200">${m.totalVisits || 0}</strong>
          </div>
        </div>
      </div>
      <div class="text-right">
        ${m.isPaused 
          ? `<span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">⏸ PAUSED</span>` 
          : `<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">● ACTIVE</span>`
        }
      </div>
    </div>
  `;
}

function renderAttendanceTable() {
  const table = document.getElementById("attendance-log-tbody");
  if (!table) return;

  const attendances = window.fit24Store.getStore().attendances || [];
  table.innerHTML = attendances.map(a => `
    <tr class="border-b border-white/5 hover:bg-white/[0.02]">
      <td class="py-3 px-4 text-xs font-mono font-bold text-red-400">${a.memberId}</td>
      <td class="py-3 px-4 text-xs font-bold text-white">${a.name}</td>
      <td class="py-3 px-4 text-xs">
        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${a.tier === 'ELITE' ? 'bg-yellow-500/20 text-yellow-400' : a.tier === 'PRIME' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}">${a.tier}</span>
      </td>
      <td class="py-3 px-4 text-xs font-mono text-zinc-300">${a.time}</td>
      <td class="py-3 px-4 text-xs text-zinc-400">${a.method}</td>
      <td class="py-3 px-4 text-xs text-right">
        <span class="text-[11px] text-emerald-400 font-mono">Inside Floor</span>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="6" class="text-center py-6 text-zinc-500 text-xs">No attendance entries recorded today.</td></tr>`;
}

// 3. Member CRM Directory
function initMemberCRM() {
  const addMemberForm = document.getElementById("add-member-form");
  const modal = document.getElementById("add-member-modal");
  const openBtn = document.getElementById("open-add-member-modal");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (modal) modal.classList.remove("hidden");
    });
  }

  if (addMemberForm) {
    addMemberForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newMember = window.fit24Store.addMember({
        name: document.getElementById("new-member-name").value,
        phone: document.getElementById("new-member-phone").value,
        email: document.getElementById("new-member-email").value,
        gender: document.getElementById("new-member-gender").value,
        tier: document.getElementById("new-member-tier").value,
        durationMonths: document.getElementById("new-member-duration").value
      });

      if (convertingLeadId) {
        window.fit24Store.updateLeadStatus(convertingLeadId, "Converted", `Converted to athlete ${newMember.id} (${newMember.tier})`);
        alert(`✓ PROSPECT CONVERTED! ${newMember.name} is now registered as Member ${newMember.id} (${newMember.tier} Tier). Digital pass issued & quotas allotted.`);
        convertingLeadId = null;
      } else {
        alert(`✓ Member created: ${newMember.name} (Code: ${newMember.id}, Tier: ${newMember.tier}). Allotted ₹${newMember.cafeCredit} Café credit.`);
      }
      addMemberForm.reset();
      if (modal) modal.classList.add("hidden");
      renderAllData();
    });
  }

  // Search & Filter
  const searchInput = document.getElementById("member-table-search");
  const filterTier = document.getElementById("member-filter-tier");
  const filterStatus = document.getElementById("member-filter-status");

  function filterMembers() {
    renderMemberTable(searchInput ? searchInput.value : "", filterTier ? filterTier.value : "ALL", filterStatus ? filterStatus.value : "ALL");
  }

  if (searchInput) searchInput.addEventListener("input", filterMembers);
  if (filterTier) filterTier.addEventListener("change", filterMembers);
  if (filterStatus) filterStatus.addEventListener("change", filterMembers);
}

function renderMemberTable(searchQuery = "", filterTier = "ALL", filterStatus = "ALL") {
  const tbody = document.getElementById("members-table-tbody");
  if (!tbody) return;

  let members = window.fit24Store.getMembers();

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    members = members.filter(m => m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.id.toLowerCase().includes(q));
  }
  if (filterTier !== "ALL") {
    members = members.filter(m => m.tier === filterTier);
  }
  if (filterStatus !== "ALL") {
    members = members.filter(m => m.status === filterStatus);
  }

  tbody.innerHTML = members.map(m => {
    const saunaRem = m.saunaTotal - m.saunaUsed;
    const iceBathRem = m.iceBathTotal - m.iceBathUsed;
    const guestRem = m.guestPassesTotal - m.guestPassesUsed;

    return `
      <tr class="border-b border-white/5 hover:bg-white/[0.02]">
        <td class="py-3 px-4 text-xs font-mono font-bold text-red-400">${m.id}</td>
        <td class="py-3 px-4">
          <div class="text-xs font-bold text-white">${m.name}</div>
          <div class="text-[11px] text-zinc-400 font-mono">${m.phone}</div>
        </td>
        <td class="py-3 px-4 text-xs">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${m.tier === 'ELITE' ? 'bg-yellow-500/20 text-yellow-400' : m.tier === 'PRIME' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}">${m.tier}</span>
          <div class="text-[10px] text-zinc-500 mt-0.5">${m.durationMonths} Months (₹${m.amountPaid.toLocaleString('en-IN')})</div>
        </td>
        <td class="py-3 px-4 text-xs font-mono text-zinc-300">
          <div>${m.startDate}</div>
          <div class="text-[10px] text-zinc-500">to ${m.endDate}</div>
        </td>
        <td class="py-3 px-4 text-xs">
          <div class="text-[11px] font-mono text-zinc-300">
            <span class="text-orange-400">🧖 Sauna: ${saunaRem}/${m.saunaTotal}</span><br>
            <span class="text-cyan-400">🧊 Ice Bath: ${iceBathRem}/${m.iceBathTotal}</span><br>
            <span class="text-emerald-400">🎟 Guest: ${guestRem}/${m.guestPassesTotal}</span>
          </div>
        </td>
        <td class="py-3 px-4 text-xs font-mono text-amber-400 font-bold">
          ₹${m.cafeCredit.toFixed(2)}
        </td>
        <td class="py-3 px-4 text-xs">
          ${m.isPaused 
            ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">PAUSED</span>` 
            : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">ACTIVE</span>`
          }
        </td>
        <td class="py-3 px-4 text-xs text-right space-x-1 whitespace-nowrap">
          <button onclick="window.openMemberDossier('${m.id}')" class="px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-[11px]" title="360° Health & Biometrics Dossier">Dossier</button>
          <button onclick="window.issueInvoiceForMember('${m.id}')" class="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px]" title="GST Tax Receipt">Receipt</button>
          <button onclick="viewMemberPass('${m.id}')" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-white">Pass</button>
          <button onclick="openQuotaModal('${m.id}')" class="px-2 py-1 rounded bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-[11px]">Quota</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8" class="text-center py-6 text-zinc-500 text-xs">No members found matching filters.</td></tr>`;
}

// 3.1 Lead Pipeline / CRM Management
function initLeadCRM() {
  const addLeadForm = document.getElementById("add-lead-form");
  const modal = document.getElementById("add-lead-modal");
  const openBtn = document.getElementById("open-add-lead-modal");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (modal) modal.classList.remove("hidden");
    });
  }

  if (addLeadForm) {
    addLeadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("new-lead-name").value.trim();
      const phone = document.getElementById("new-lead-phone").value.trim();
      const email = document.getElementById("new-lead-email") ? document.getElementById("new-lead-email").value.trim() : "";
      const interest = document.getElementById("new-lead-interest") ? document.getElementById("new-lead-interest").value : "General Inquiry";
      const source = document.getElementById("new-lead-source") ? document.getElementById("new-lead-source").value : "Walk-In Front Desk";
      const status = document.getElementById("new-lead-status") ? document.getElementById("new-lead-status").value : "New";
      const notes = document.getElementById("new-lead-notes") ? document.getElementById("new-lead-notes").value.trim() : "";

      const created = window.fit24Store.addLead({
        name,
        phone,
        email,
        interest,
        source,
        status,
        notes
      });

      alert(`✓ Prospect recorded: ${created.name} (${created.phone}). Logged in pipeline under status: ${created.status}.`);
      addLeadForm.reset();
      if (modal) modal.classList.add("hidden");
      renderLeadsTable();
    });
  }

  // Search & Filters
  const searchInput = document.getElementById("lead-table-search");
  const filterStatus = document.getElementById("lead-filter-status");
  const filterSource = document.getElementById("lead-filter-source");

  function filterLeads() {
    renderLeadsTable(
      searchInput ? searchInput.value : "",
      filterStatus ? filterStatus.value : "ALL",
      filterSource ? filterSource.value : "ALL"
    );
  }

  if (searchInput) searchInput.addEventListener("input", filterLeads);
  if (filterStatus) filterStatus.addEventListener("change", filterLeads);
  if (filterSource) filterSource.addEventListener("change", filterLeads);
}

function renderLeadsTable(searchQuery = "", filterStatus = "ALL", filterSource = "ALL") {
  const tbody = document.getElementById("leads-table-tbody");
  if (!tbody) return;

  const leads = window.fit24Store.getLeads() || [];

  // Metrics calculation
  const totalCount = leads.length;
  const newCount = leads.filter(l => l.status === "New").length;
  const tourCount = leads.filter(l => l.status === "Tour Scheduled").length;
  const convertedCount = leads.filter(l => l.status === "Converted").length;
  const conversionRate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0;

  // Update KPI counters
  const elTotal = document.getElementById("metric-total-leads");
  const elNew = document.getElementById("metric-new-leads");
  const elTours = document.getElementById("metric-tours-leads");
  const elConverted = document.getElementById("metric-converted-leads");
  const elRate = document.getElementById("metric-conversion-rate");
  const elBadge = document.getElementById("nav-new-leads-badge");
  const elCount = document.getElementById("lead-table-count");

  if (elTotal) elTotal.innerText = totalCount;
  if (elNew) elNew.innerText = newCount;
  if (elTours) elTours.innerText = tourCount;
  if (elConverted) elConverted.innerText = convertedCount;
  if (elRate) elRate.innerText = `${conversionRate}% conversion rate`;

  if (elBadge) {
    if (newCount > 0) {
      elBadge.innerText = newCount;
      elBadge.classList.remove("hidden");
    } else {
      elBadge.classList.add("hidden");
    }
  }

  // Filtering
  const q = searchQuery.toLowerCase().trim();
  const filtered = leads.filter(l => {
    const matchQuery = !q || 
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.phone && l.phone.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.interest && l.interest.toLowerCase().includes(q)) ||
      (l.notes && l.notes.toLowerCase().includes(q));

    const matchStatus = filterStatus === "ALL" || l.status === filterStatus;
    const matchSource = filterSource === "ALL" || l.source === filterSource;

    return matchQuery && matchStatus && matchSource;
  });

  if (elCount) {
    elCount.innerText = `${filtered.length} of ${totalCount} inquiries`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-10 text-zinc-500 text-xs font-mono">
          No inquiries found matching current filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(lead => {
    // Status styling
    let statusBorder = "border-rose-500 text-rose-400";
    if (lead.status === "Contacted") statusBorder = "border-blue-500 text-blue-400";
    else if (lead.status === "Tour Scheduled") statusBorder = "border-cyan-500 text-cyan-400";
    else if (lead.status === "Trial Attended") statusBorder = "border-purple-500 text-purple-400";
    else if (lead.status === "Converted") statusBorder = "border-emerald-500 text-emerald-400 font-bold";
    else if (lead.status === "Lost") statusBorder = "border-zinc-700 text-zinc-500";

    // Clean phone for WhatsApp link
    const cleanPhone = (lead.phone || "").replace(/[^0-9]/g, "");
    const waText = encodeURIComponent(
      `Hi ${lead.name}! Greetings from FIT24 Premium Fitness Club, TB Road, Hosdurg, Kanhangad.\n\nWe received your inquiry regarding ${lead.interest || 'VIP Membership'}.\n\nWhen would be a convenient time for you to drop by for a private club walkthrough and facility tour?`
    );

    return `
      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
        <!-- Prospect Info -->
        <td class="py-3 px-4">
          <div class="font-bold text-white text-xs">${lead.name}</div>
          <div class="text-[10px] text-zinc-500 font-mono mt-0.5">${lead.createdAt || 'Recently'}</div>
        </td>

        <!-- Contact Info -->
        <td class="py-3 px-4">
          <div class="text-xs text-zinc-200 font-mono flex items-center gap-2">
            <span>${lead.phone}</span>
            ${cleanPhone ? `
              <a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" title="Chat on WhatsApp" class="text-emerald-400 hover:text-emerald-300 text-sm">
                💬
              </a>
            ` : ''}
          </div>
          ${lead.email ? `<div class="text-[10px] text-zinc-400 truncate max-w-[150px]">${lead.email}</div>` : ''}
        </td>

        <!-- Target Plan / Interest -->
        <td class="py-3 px-4">
          <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold border border-white/10 bg-white/5 text-zinc-200">
            ${lead.interest || 'General Inquiry'}
          </span>
        </td>

        <!-- Acquisition Channel -->
        <td class="py-3 px-4 text-xs">
          <span class="text-[10px] text-zinc-400 font-mono">${lead.source || 'Website'}</span>
        </td>

        <!-- Pipeline Status (Inline Selector) -->
        <td class="py-3 px-4">
          <select onchange="window.changeLeadStatus('${lead.id}', this.value)" 
                  class="text-[11px] font-mono px-2 py-1 bg-black border ${statusBorder} cursor-pointer focus:outline-none">
            <option value="New" ${lead.status === 'New' ? 'selected' : ''}>● New</option>
            <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>💬 Contacted</option>
            <option value="Tour Scheduled" ${lead.status === 'Tour Scheduled' ? 'selected' : ''}>📅 Tour Scheduled</option>
            <option value="Trial Attended" ${lead.status === 'Trial Attended' ? 'selected' : ''}>🏋 Trial Attended</option>
            <option value="Converted" ${lead.status === 'Converted' ? 'selected' : ''}>★ Converted</option>
            <option value="Lost" ${lead.status === 'Lost' ? 'selected' : ''}>✕ Lost</option>
          </select>
        </td>

        <!-- Notes -->
        <td class="py-3 px-4 text-xs">
          <div class="text-zinc-300 text-[11px] max-w-[200px] truncate" title="${lead.notes || 'No notes recorded'}">
            ${lead.notes || '<span class="text-zinc-600 italic">No notes</span>'}
          </div>
          <button onclick="window.editLeadNotes('${lead.id}')" class="text-[10px] text-zinc-500 hover:text-zinc-300 underline font-mono mt-0.5">
            ✏ Edit note
          </button>
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="inline-flex items-center gap-1.5 justify-end">
            ${cleanPhone ? `
              <a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" 
                 class="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-[10px] font-mono uppercase transition-all"
                 title="Send WhatsApp Invitation">
                WhatsApp
              </a>
            ` : ''}

            ${lead.status !== 'Converted' ? `
              <button onclick="window.openConvertLeadModal('${lead.id}')" 
                      class="px-2.5 py-1 bg-[#ff0033] hover:bg-white hover:text-black text-white text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1"
                      title="Convert this prospect into a paying member">
                <span>⚡</span> Convert
              </button>
            ` : `
              <span class="px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                ACTIVE
              </span>
            `}

            <button onclick="window.deleteLeadItem('${lead.id}')" 
                    class="p-1 text-zinc-600 hover:text-red-400 transition-colors" 
                    title="Delete Lead">
              🗑
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Global action handlers for Leads
window.changeLeadStatus = function(leadId, newStatus) {
  window.fit24Store.updateLeadStatus(leadId, newStatus);
  renderLeadsTable();
};

window.editLeadNotes = function(leadId) {
  const leads = window.fit24Store.getLeads();
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  const currentNotes = lead.notes || "";
  const newNotes = prompt(`Update notes for ${lead.name}:`, currentNotes);
  if (newNotes !== null) {
    window.fit24Store.updateLeadStatus(leadId, lead.status, newNotes.trim());
    renderLeadsTable();
  }
};

window.deleteLeadItem = function(leadId) {
  const leads = window.fit24Store.getLeads();
  const lead = leads.find(l => l.id === leadId);
  const name = lead ? lead.name : "this prospect";

  if (confirm(`Are you sure you want to remove ${name} from the lead pipeline?`)) {
    window.fit24Store.deleteLead(leadId);
    renderLeadsTable();
  }
};

window.openConvertLeadModal = function(leadId) {
  const leads = window.fit24Store.getLeads();
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  convertingLeadId = leadId;

  // Open member registration modal and pre-fill details
  const modal = document.getElementById("add-member-modal");
  if (!modal) return;

  const nameInput = document.getElementById("new-member-name");
  const phoneInput = document.getElementById("new-member-phone");
  const emailInput = document.getElementById("new-member-email");
  const tierSelect = document.getElementById("new-member-tier");

  if (nameInput) nameInput.value = lead.name;
  if (phoneInput) phoneInput.value = lead.phone;
  if (emailInput) emailInput.value = lead.email || "";

  if (tierSelect && lead.interest) {
    const interestUpper = lead.interest.toUpperCase();
    if (interestUpper.includes("ELITE")) {
      tierSelect.value = "ELITE";
    } else if (interestUpper.includes("PRO")) {
      tierSelect.value = "PRO";
    } else if (interestUpper.includes("PRIME")) {
      tierSelect.value = "PRIME";
    }
  }

  modal.classList.remove("hidden");
};

// 4. Facility Passbook ("What all facilities used")
function initFacilityPassbook() {
  const deductBtn = document.getElementById("deduct-facility-btn");
  if (deductBtn) {
    deductBtn.addEventListener("click", () => {
      const memberId = document.getElementById("facility-member-select").value;
      const facilityType = document.getElementById("facility-type-select").value;
      const staffNotes = document.getElementById("facility-staff-notes").value;

      if (!memberId) {
        alert("Please select a member.");
        return;
      }

      const res = window.fit24Store.deductFacilityQuota(memberId, facilityType, staffNotes || "Front Desk");
      if (!res.success) {
        alert(`Failed: ${res.message}`);
        return;
      }

      alert(`✓ Quota Deducted: 1 ${facilityType} session used for ${res.member.name}. (${res.remaining})`);
      document.getElementById("facility-staff-notes").value = "";
      renderAllData();
    });
  }
}

function renderFacilityLogs() {
  const tbody = document.getElementById("facility-logs-tbody");
  if (!tbody) return;

  const logs = window.fit24Store.getStore().facilityLogs || [];
  tbody.innerHTML = logs.map(l => `
    <tr class="border-b border-white/5 hover:bg-white/[0.02]">
      <td class="py-3 px-4 text-xs font-mono font-bold text-red-400">${l.memberId}</td>
      <td class="py-3 px-4 text-xs font-bold text-white">${l.memberName}</td>
      <td class="py-3 px-4 text-xs font-semibold text-zinc-200">
        <span class="px-2 py-0.5 rounded text-[11px] ${l.facility.includes('Sauna') ? 'bg-orange-500/20 text-orange-400' : l.facility.includes('Ice') ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}">${l.facility}</span>
      </td>
      <td class="py-3 px-4 text-xs font-mono text-zinc-400">${l.time}</td>
      <td class="py-3 px-4 text-xs font-mono text-zinc-300">${l.remaining}</td>
      <td class="py-3 px-4 text-xs text-zinc-500">${l.staff}</td>
    </tr>
  `).join("") || `<tr><td colspan="6" class="text-center py-6 text-zinc-500 text-xs">No facility usages logged today.</td></tr>`;
}

// 5. Membership Pause / Freeze Engine
function initPauseEngine() {
  const applyPauseBtn = document.getElementById("apply-pause-btn");
  if (applyPauseBtn) {
    applyPauseBtn.addEventListener("click", () => {
      const memberId = document.getElementById("pause-member-select").value;
      const pauseDays = parseInt(document.getElementById("pause-days-input").value);
      const reason = document.getElementById("pause-reason-input").value;

      if (!memberId) {
        alert("Please select a member.");
        return;
      }

      const res = window.fit24Store.pauseMembership(memberId, pauseDays, reason);
      if (!res.success) {
        alert(`Pause Request Rejected: ${res.message}`);
        return;
      }

      alert(`✓ Membership Paused: ${res.member.name} paused for ${pauseDays} days. New membership expiry extended to ${res.newEndDate}.`);
      renderAllData();
    });
  }

  const resumeBtn = document.getElementById("resume-pause-btn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      const memberId = document.getElementById("pause-member-select").value;
      if (!memberId) {
        alert("Please select a member.");
        return;
      }
      const res = window.fit24Store.resumeMembership(memberId);
      if (!res.success) {
        alert(`Error: ${res.message}`);
        return;
      }
      alert(`✓ Membership Resumed: ${res.member.name} is now ACTIVE!`);
      renderAllData();
    });
  }
}

function renderPauseOverview() {
  const container = document.getElementById("active-pauses-list");
  if (!container) return;

  const members = window.fit24Store.getMembers();
  const pausedMembers = members.filter(m => m.isPaused);

  if (pausedMembers.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-xs text-zinc-500">No members currently on pause.</div>`;
    return;
  }

  container.innerHTML = pausedMembers.map(m => `
    <div class="p-4 rounded-xl bg-black/40 border border-amber-500/30 flex items-center justify-between">
      <div>
        <h5 class="text-xs font-bold text-white flex items-center gap-2">
          ${m.name} (${m.id})
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">PAUSED</span>
        </h5>
        <div class="text-[11px] text-zinc-400 mt-1">
          Paused on: ${m.currentPauseStart || 'Recent'} · Total Pause Used: ${m.pauseDaysUsed}/${m.totalPauseAllowed} days (Block ${m.pauseBlocksUsed}/2)
        </div>
        <div class="text-[11px] text-zinc-300 font-mono mt-0.5">
          Extended Expiry: <strong>${m.endDate}</strong>
        </div>
      </div>
      <div>
        <button onclick="resumeMemberQuick('${m.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white">
          Resume Now
        </button>
      </div>
    </div>
  `).join("");
}

window.resumeMemberQuick = function(id) {
  const res = window.fit24Store.resumeMembership(id);
  if (res.success) {
    alert(`✓ ${res.member.name} resumed successfully!`);
    renderAllData();
  }
};

// 6. Café POS & Credit Wallet
function initCafePOS() {
  const calcBtn = document.getElementById("cafe-charge-btn");
  const memberSelect = document.getElementById("cafe-member-select");
  const grossInput = document.getElementById("cafe-gross-bill");

  if (memberSelect) {
    memberSelect.addEventListener("change", updateCafePreview);
  }
  if (grossInput) {
    grossInput.addEventListener("input", updateCafePreview);
  }

  if (calcBtn) {
    calcBtn.addEventListener("click", () => {
      const memberId = memberSelect.value;
      const grossBill = parseFloat(grossInput.value);
      const payWallet = document.getElementById("cafe-pay-wallet-checkbox").checked;
      const notes = document.getElementById("cafe-order-notes").value;

      if (!memberId) {
        alert("Please select a member.");
        return;
      }
      if (isNaN(grossBill) || grossBill <= 0) {
        alert("Please enter a valid bill amount.");
        return;
      }

      const res = window.fit24Store.processCafeSale(memberId, grossBill, payWallet, notes);
      if (!res.success) {
        alert(`Payment Failed: ${res.message}`);
        return;
      }

      alert(`✓ Café Bill Processed! Net: ₹${res.logRecord.netPaid.toFixed(2)} (${res.logRecord.discountApplied}). Paid via ${res.logRecord.paidVia}. Remaining Wallet: ₹${res.member.cafeCredit.toFixed(2)}`);
      grossInput.value = "";
      document.getElementById("cafe-order-notes").value = "";
      renderAllData();
    });
  }
}

function updateCafePreview() {
  const memberId = document.getElementById("cafe-member-select").value;
  const gross = parseFloat(document.getElementById("cafe-gross-bill").value) || 0;
  const previewBox = document.getElementById("cafe-bill-preview");

  if (!memberId || !previewBox) return;

  const member = window.fit24Store.getMember(memberId);
  if (!member) return;

  const discountRate = member.cafeDiscount || 0;
  const discountAmt = (gross * discountRate) / 100;
  const net = gross - discountAmt;

  previewBox.innerHTML = `
    <div class="text-xs space-y-1 p-3 bg-white/5 rounded-xl border border-white/5">
      <div class="flex justify-between">
        <span class="text-zinc-400">Member Tier:</span>
        <strong class="${member.tier === 'ELITE' ? 'text-yellow-400' : member.tier === 'PRIME' ? 'text-orange-400' : 'text-zinc-300'}">${member.tier} (${discountRate}% Discount)</strong>
      </div>
      <div class="flex justify-between">
        <span class="text-zinc-400">Available Wallet Credit:</span>
        <strong class="text-amber-400 font-mono">₹${member.cafeCredit.toFixed(2)}</strong>
      </div>
      <div class="flex justify-between border-t border-white/5 pt-1">
        <span class="text-zinc-400">Gross Bill:</span>
        <span class="font-mono text-zinc-300">₹${gross.toFixed(2)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-zinc-400">Tier Discount:</span>
        <span class="font-mono text-emerald-400">-₹${discountAmt.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-1">
        <span>Net Total to Pay:</span>
        <span class="font-mono text-red-400">₹${net.toFixed(2)}</span>
      </div>
    </div>
  `;
}

function renderCafeLogs() {
  const tbody = document.getElementById("cafe-logs-tbody");
  if (!tbody) return;

  const logs = window.fit24Store.getStore().cafeLogs || [];
  tbody.innerHTML = logs.map(c => `
    <tr class="border-b border-white/5 hover:bg-white/[0.02]">
      <td class="py-3 px-4 text-xs font-mono font-bold text-red-400">${c.memberId}</td>
      <td class="py-3 px-4 text-xs font-bold text-white">${c.memberName}</td>
      <td class="py-3 px-4 text-xs text-zinc-300">${c.item}</td>
      <td class="py-3 px-4 text-xs font-mono text-zinc-400">₹${c.billGross}</td>
      <td class="py-3 px-4 text-xs font-mono text-emerald-400">${c.discountApplied}</td>
      <td class="py-3 px-4 text-xs font-mono font-bold text-white">₹${c.netPaid}</td>
      <td class="py-3 px-4 text-xs text-zinc-400">${c.paidVia}</td>
      <td class="py-3 px-4 text-xs font-mono text-zinc-500">${c.time}</td>
    </tr>
  `).join("") || `<tr><td colspan="8" class="text-center py-6 text-zinc-500 text-xs">No café transactions logged today.</td></tr>`;
}

// 7. Populate Dropdowns for Quick selection
function populateMemberSelectDropdowns() {
  const members = window.fit24Store.getMembers();
  const dropdownIds = ["facility-member-select", "pause-member-select", "cafe-member-select", "invoice-form-member"];

  dropdownIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const curVal = el.value;
    el.innerHTML = `<option value="">-- Choose Member --</option>` + members.map(m => `
      <option value="${m.id}" ${m.id === curVal ? 'selected' : ''}>
        ${m.name} (${m.id}) - ${m.tier}
      </option>
    `).join("");
  });
}

// 8. Member Pass Quick Viewer
window.viewMemberPass = function(id) {
  const member = window.fit24Store.getMember(id);
  if (!member) return;

  const modal = document.getElementById("admin-member-modal");
  const content = document.getElementById("admin-member-modal-content");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="bg-[#121217] border border-white/20 rounded-3xl p-6 text-white max-w-md w-full relative">
      <button onclick="document.getElementById('admin-member-modal').classList.add('hidden')" class="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
      
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-zinc-400">FIT24 KANHANGAD MEMBER DOSSIER</span>
          <h3 class="text-2xl font-bold font-display text-white">${member.name}</h3>
        </div>
        <span class="text-xs font-bold px-2.5 py-1 rounded-full ${member.tier === 'ELITE' ? 'bg-yellow-500/20 text-yellow-400' : member.tier === 'PRIME' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}">${member.tier}</span>
      </div>

      <div class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/5">
          <div><span class="text-zinc-500">Member ID:</span> <strong class="text-white font-mono">${member.id}</strong></div>
          <div><span class="text-zinc-500">Mobile:</span> <strong class="text-white font-mono">${member.phone}</strong></div>
          <div><span class="text-zinc-500">Start Date:</span> <span class="text-zinc-300 font-mono">${member.startDate}</span></div>
          <div><span class="text-zinc-500">Expiry Date:</span> <span class="text-zinc-300 font-mono">${member.endDate}</span></div>
          <div><span class="text-zinc-500">Status:</span> <strong class="${member.isPaused ? 'text-amber-400' : 'text-emerald-400'}">${member.status}</strong></div>
          <div><span class="text-zinc-500">Total Visits:</span> <strong class="text-white">${member.totalVisits || 0}</strong></div>
        </div>

        <div class="p-3 bg-white/5 rounded-xl border border-white/5">
          <h5 class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">QUOTAS & BENEFITS:</h5>
          <div class="grid grid-cols-2 gap-2">
            <div>🧖 Sauna Remaining: <strong class="text-orange-400">${member.saunaTotal - member.saunaUsed} / ${member.saunaTotal}</strong></div>
            <div>🧊 Ice Bath Remaining: <strong class="text-cyan-400">${member.iceBathTotal - member.iceBathUsed} / ${member.iceBathTotal}</strong></div>
            <div>🎟 Guest Passes: <strong class="text-emerald-400">${member.guestPassesTotal - member.guestPassesUsed} / ${member.guestPassesTotal}</strong></div>
            <div>☕ Café Wallet: <strong class="text-amber-400 font-mono">₹${member.cafeCredit.toFixed(2)}</strong></div>
            <div>⏸ Pause Days Used: <strong class="text-zinc-300">${member.pauseDaysUsed} / ${member.totalPauseAllowed}</strong></div>
            <div>⏸ Pause Blocks: <strong class="text-zinc-300">${member.pauseBlocksUsed} / 2</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
};

// 9. Data Backup / Reset
function initDataBackup() {
  const resetBtn = document.getElementById("reset-storage-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset database to initial FIT24 seed data? Any new records will be reset.")) {
        window.fit24Store.resetToDefaults();
        alert("Database reset to initial sample members!");
        renderAllData();
      }
    });
  }

  const exportBtn = document.getElementById("export-storage-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.fit24Store.getStore(), null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `FIT24_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }
}

// ==========================================
// 10. TRAINER PROFILE MANAGEMENT
// ==========================================
function initTrainerManagement() {
  const openBtn = document.getElementById("open-add-trainer-btn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      window.openAddTrainerModal();
    });
  }

  const searchInput = document.getElementById("trainer-search-input");
  const statusFilter = document.getElementById("trainer-status-filter");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderTrainersTable();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", () => {
      renderTrainersTable();
    });
  }

  const form = document.getElementById("trainer-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const idInput = document.getElementById("trainer-form-id");
      const name = document.getElementById("trainer-form-name").value.trim();
      const title = document.getElementById("trainer-form-title").value.trim();
      const badge = document.getElementById("trainer-form-badge").value.trim() || title.toUpperCase();
      const badgeColor = document.getElementById("trainer-form-badge-color").value;
      const isActive = document.getElementById("trainer-form-status").value === "true";
      const specialty = document.getElementById("trainer-form-specialty").value.trim();
      const photoUrl = document.getElementById("trainer-form-photo").value.trim();
      const bio = document.getElementById("trainer-form-bio").value.trim();

      const trainerData = {
        name,
        title,
        badge,
        badgeColor,
        isActive,
        specialty,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80",
        bio
      };

      if (idInput && idInput.value) {
        window.fit24Store.updateTrainer(idInput.value, trainerData);
        alert(`🥊 Coach profile updated: ${name}`);
      } else {
        window.fit24Store.addTrainer(trainerData);
        alert(`🥊 New coach added: ${name}`);
      }

      const modal = document.getElementById("trainer-modal");
      if (modal) modal.classList.add("hidden");
      renderTrainersTable();
      if (typeof renderDynamicTrainers === "function") {
        renderDynamicTrainers();
      }
    });
  }
}

function renderTrainersTable() {
  const tbody = document.getElementById("trainers-table-tbody");
  if (!tbody) return;

  const trainers = window.fit24Store.getTrainers() || [];
  const q = (document.getElementById("trainer-search-input")?.value || "").toLowerCase().trim();
  const filterStatus = document.getElementById("trainer-status-filter")?.value || "ALL";

  // KPIs
  const totalCount = trainers.length;
  const activeCount = trainers.filter(t => t.isActive).length;
  const specialtiesSet = new Set(trainers.map(t => t.specialty).filter(Boolean));

  const elTotal = document.getElementById("metric-total-trainers");
  const elActive = document.getElementById("metric-active-trainers");
  const elSpecialties = document.getElementById("metric-specialties-count");
  const elCount = document.getElementById("trainer-table-count");

  if (elTotal) elTotal.innerText = totalCount;
  if (elActive) elActive.innerText = activeCount;
  if (elSpecialties) elSpecialties.innerText = specialtiesSet.size;

  // Filter
  const filtered = trainers.filter(t => {
    const matchQuery = !q ||
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.specialty && t.specialty.toLowerCase().includes(q)) ||
      (t.bio && t.bio.toLowerCase().includes(q));

    const matchStatus = filterStatus === "ALL" ||
      (filterStatus === "ACTIVE" && t.isActive) ||
      (filterStatus === "INACTIVE" && !t.isActive);

    return matchQuery && matchStatus;
  });

  if (elCount) {
    elCount.innerText = `${filtered.length} of ${totalCount} coaches listed`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-10 text-zinc-500 text-xs font-mono">
          No coaches found matching criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    let badgeStyle = "bg-red-500/10 text-red-400 border-red-500/30";
    if (t.badgeColor === "pink") badgeStyle = "bg-pink-500/10 text-pink-400 border-pink-500/30";
    else if (t.badgeColor === "orange") badgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    else if (t.badgeColor === "cyan") badgeStyle = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

    const stats = window.fit24Store.getTrainerMonthlyStats(t.id);

    return `
      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
        <!-- Coach Profile -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${t.photoUrl || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=120&q=80'}"
                 alt="${t.name}"
                 class="w-10 h-10 object-cover border border-white/20 grayscale hover:grayscale-0 transition-all rounded-none">
            <div>
              <div class="font-bold text-white text-xs">${t.name}</div>
              <div class="text-[10px] text-zinc-400 font-mono">${t.title || 'Coach'}</div>
            </div>
          </div>
        </td>

        <!-- Title & Badge -->
        <td class="py-3 px-4">
          <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold border ${badgeStyle}">
            ${t.badge || t.title || 'COACH'}
          </span>
        </td>

        <!-- Specialty -->
        <td class="py-3 px-4">
          <div class="text-xs text-zinc-300 font-mono">${t.specialty}</div>
          ${t.classesTaught && t.classesTaught.length ? `<div class="text-[10px] text-zinc-500 font-mono mt-0.5">Classes: ${t.classesTaught.join(', ')}</div>` : ''}
        </td>

        <!-- Client Roster & Payout -->
        <td class="py-3 px-4 font-mono">
          <div class="text-xs text-white"><strong>${stats.clientsCount}</strong> Athletes Assigned</div>
          <div class="text-[10px] text-emerald-400 mt-0.5 font-bold">${stats.sessionsConducted} PT Done · Est. Payout: ₹${stats.estimatedEarnings.toLocaleString()}</div>
          <button onclick="window.viewTrainerClients('${t.id}')" class="mt-1 text-[10px] text-[#ff0033] hover:text-white underline font-bold uppercase block">
            View Roster (${stats.clientsCount}) →
          </button>
        </td>

        <!-- Status -->
        <td class="py-3 px-4">
          <button onclick="window.toggleTrainerStatus('${t.id}')"
                  class="px-2 py-1 text-[10px] uppercase font-mono font-bold border transition-colors ${t.isActive ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'border-zinc-700 bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}">
            ${t.isActive ? '● Active On Floor' : '○ Inactive'}
          </button>
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="inline-flex items-center gap-1.5 justify-end">
            <button onclick="window.openEditTrainerModal('${t.id}')"
                    class="px-2.5 py-1 text-[10px] uppercase font-bold bg-white/5 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all">
              ✏ Edit
            </button>
            <button onclick="window.deleteTrainerRecord('${t.id}')"
                    class="px-2 py-1 text-[10px] uppercase font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
              🗑
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.openAddTrainerModal = function() {
  const modal = document.getElementById("trainer-modal");
  const form = document.getElementById("trainer-form");
  const title = document.getElementById("trainer-modal-title");
  const idInput = document.getElementById("trainer-form-id");

  if (form) form.reset();
  if (idInput) idInput.value = "";
  if (title) title.innerText = "ADD COACH PROFILE";

  const statusSelect = document.getElementById("trainer-form-status");
  if (statusSelect) statusSelect.value = "true";

  if (modal) modal.classList.remove("hidden");
};

window.openEditTrainerModal = function(id) {
  const trainers = window.fit24Store.getTrainers() || [];
  const trainer = trainers.find(t => t.id === id);
  if (!trainer) return;

  const modal = document.getElementById("trainer-modal");
  const title = document.getElementById("trainer-modal-title");
  const idInput = document.getElementById("trainer-form-id");

  if (idInput) idInput.value = trainer.id;
  if (title) title.innerText = `EDIT COACH: ${trainer.name.toUpperCase()}`;

  const nameInput = document.getElementById("trainer-form-name");
  const titleInput = document.getElementById("trainer-form-title");
  const badgeInput = document.getElementById("trainer-form-badge");
  const badgeColorSelect = document.getElementById("trainer-form-badge-color");
  const statusSelect = document.getElementById("trainer-form-status");
  const specialtyInput = document.getElementById("trainer-form-specialty");
  const photoInput = document.getElementById("trainer-form-photo");
  const bioInput = document.getElementById("trainer-form-bio");

  if (nameInput) nameInput.value = trainer.name || "";
  if (titleInput) titleInput.value = trainer.title || "";
  if (badgeInput) badgeInput.value = trainer.badge || "";
  if (badgeColorSelect) badgeColorSelect.value = trainer.badgeColor || "red";
  if (statusSelect) statusSelect.value = trainer.isActive ? "true" : "false";
  if (specialtyInput) specialtyInput.value = trainer.specialty || "";
  if (photoInput) photoInput.value = trainer.photoUrl || "";
  if (bioInput) bioInput.value = trainer.bio || "";

  if (modal) modal.classList.remove("hidden");
};

window.toggleTrainerStatus = function(id) {
  const trainers = window.fit24Store.getTrainers() || [];
  const trainer = trainers.find(t => t.id === id);
  if (!trainer) return;

  const newStatus = !trainer.isActive;
  window.fit24Store.updateTrainer(id, { isActive: newStatus });
  renderTrainersTable();
  if (typeof renderDynamicTrainers === "function") {
    renderDynamicTrainers();
  }
};

window.deleteTrainerRecord = function(id) {
  const trainers = window.fit24Store.getTrainers() || [];
  const trainer = trainers.find(t => t.id === id);
  const name = trainer ? trainer.name : "coach";

  if (confirm(`Are you sure you want to delete coach "${name}" from the active roster?`)) {
    window.fit24Store.deleteTrainer(id);
    renderTrainersTable();
    if (typeof renderDynamicTrainers === "function") {
      renderDynamicTrainers();
    }
  }
};

// ==========================================
// 11. GROUP CLASS TIMETABLE MANAGEMENT
// ==========================================
function initClassTimetableManagement() {
  const openBtn = document.getElementById("open-add-class-btn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      window.openAddClassModal();
    });
  }

  const searchInput = document.getElementById("class-search-input");
  const dayFilter = document.getElementById("class-day-filter");
  const catFilter = document.getElementById("class-cat-filter");

  if (searchInput) searchInput.addEventListener("input", () => renderClassesTable());
  if (dayFilter) dayFilter.addEventListener("change", () => renderClassesTable());
  if (catFilter) catFilter.addEventListener("change", () => renderClassesTable());

  const form = document.getElementById("class-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const idInput = document.getElementById("class-form-id");
      const dayOfWeek = document.getElementById("class-form-day").value;
      const startTime = document.getElementById("class-form-time").value.trim();
      const className = document.getElementById("class-form-name").value.trim();
      const coachName = document.getElementById("class-form-coach").value.trim();
      const duration = document.getElementById("class-form-duration").value.trim() || "45 mins";
      const category = document.getElementById("class-form-category").value;
      const intensity = document.getElementById("class-form-intensity").value;
      const isLadiesOnly = document.getElementById("class-form-ladies").checked;

      const classData = {
        dayOfWeek,
        startTime,
        className,
        coachName,
        duration,
        category,
        intensity,
        isLadiesOnly
      };

      if (idInput && idInput.value) {
        window.fit24Store.updateClass(idInput.value, classData);
        alert(`📅 Group class updated: ${className} (${dayOfWeek} ${startTime})`);
      } else {
        window.fit24Store.addClass(classData);
        alert(`📅 Scheduled new group class: ${className} (${dayOfWeek} ${startTime})`);
      }

      const modal = document.getElementById("class-modal");
      if (modal) modal.classList.add("hidden");
      renderClassesTable();
      if (typeof renderDynamicClasses === "function") {
        renderDynamicClasses();
      }
    });
  }
}

function renderClassesTable() {
  const tbody = document.getElementById("classes-table-tbody");
  if (!tbody) return;

  const classes = window.fit24Store.getClasses() || [];
  const q = (document.getElementById("class-search-input")?.value || "").toLowerCase().trim();
  const filterDay = document.getElementById("class-day-filter")?.value || "ALL";
  const filterCat = document.getElementById("class-cat-filter")?.value || "ALL";

  // KPIs
  const totalCount = classes.length;
  const morningCount = classes.filter(c => {
    const time = (c.startTime || "").toUpperCase();
    return time.includes("AM") && !time.includes("11:") && !time.includes("12:");
  }).length;
  const eveningCount = classes.filter(c => {
    const time = (c.startTime || "").toUpperCase();
    return time.includes("PM") && !time.includes("12:") && !time.includes("01:") && !time.includes("02:");
  }).length;
  const ladiesCount = classes.filter(c => c.isLadiesOnly || c.category === "LADIES").length;

  const elTotal = document.getElementById("metric-total-classes");
  const elMorning = document.getElementById("metric-morning-classes");
  const elEvening = document.getElementById("metric-evening-classes");
  const elLadies = document.getElementById("metric-ladies-classes");
  const elCount = document.getElementById("class-table-count");

  if (elTotal) elTotal.innerText = totalCount;
  if (elMorning) elMorning.innerText = morningCount;
  if (elEvening) elEvening.innerText = eveningCount;
  if (elLadies) elLadies.innerText = ladiesCount;

  // Filter
  const filtered = classes.filter(c => {
    const matchQuery = !q ||
      (c.className && c.className.toLowerCase().includes(q)) ||
      (c.coachName && c.coachName.toLowerCase().includes(q)) ||
      (c.startTime && c.startTime.toLowerCase().includes(q));

    const matchDay = filterDay === "ALL" || c.dayOfWeek === filterDay;
    const matchCat = filterCat === "ALL" || c.category === filterCat || (filterCat === "LADIES" && c.isLadiesOnly);

    return matchQuery && matchDay && matchCat;
  });

  if (elCount) {
    elCount.innerText = `${filtered.length} of ${totalCount} sessions scheduled`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-10 text-zinc-500 text-xs font-mono">
          No scheduled classes found matching criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    let intensityStyle = "border-amber-500/30 text-amber-400 bg-amber-500/10";
    if (c.intensity === "Extreme") intensityStyle = "border-red-500/30 text-red-400 bg-red-500/10";
    else if (c.intensity === "Medium") intensityStyle = "border-cyan-500/30 text-cyan-400 bg-cyan-500/10";
    else if (c.intensity === "Low") intensityStyle = "border-emerald-500/30 text-emerald-400 bg-emerald-500/10";

    let catBadge = "bg-white/5 text-zinc-300 border-white/10";
    if (c.category === "BOXING") catBadge = "bg-red-500/10 text-red-400 border-red-500/30";
    else if (c.category === "STRENGTH") catBadge = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    else if (c.category === "HIIT") catBadge = "bg-orange-500/10 text-orange-400 border-orange-500/30";
    else if (c.category === "YOGA") catBadge = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    else if (c.category === "LADIES" || c.isLadiesOnly) catBadge = "bg-pink-500/10 text-pink-400 border-pink-500/30";

    return `
      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
        <!-- Day & Timing -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <span class="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-white/10 text-white font-mono">
              ${c.dayOfWeek}
            </span>
            <span class="text-xs text-white font-mono font-bold">${c.startTime}</span>
          </div>
          <div class="text-[10px] text-zinc-500 font-mono mt-0.5">${c.duration || '45 mins'}</div>
        </td>

        <!-- Session Name -->
        <td class="py-3 px-4">
          <div class="font-bold text-white text-xs">${c.className}</div>
        </td>

        <!-- Coach -->
        <td class="py-3 px-4">
          <div class="text-xs text-zinc-300 font-mono flex items-center gap-1.5">
            <span>👤</span>
            <span>${c.coachName}</span>
          </div>
        </td>

        <!-- Discipline Category -->
        <td class="py-3 px-4">
          <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold border ${catBadge}">
            ${c.category}
          </span>
        </td>

        <!-- Intensity -->
        <td class="py-3 px-4">
          <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold border ${intensityStyle}">
            ${c.intensity || 'High'}
          </span>
        </td>

        <!-- Ladies Access -->
        <td class="py-3 px-4">
          ${c.isLadiesOnly ? `
            <span class="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-pink-500/10 border border-pink-500/30 text-pink-400">
              🌸 Ladies-Only (11 AM - 3 PM)
            </span>
          ` : `
            <span class="text-[10px] text-zinc-500 font-mono">Open Roster</span>
          `}
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="inline-flex items-center gap-1.5 justify-end">
            <button onclick="window.openEditClassModal('${c.id}')"
                    class="px-2.5 py-1 text-[10px] uppercase font-bold bg-white/5 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all">
              ✏ Edit
            </button>
            <button onclick="window.deleteClassRecord('${c.id}')"
                    class="px-2 py-1 text-[10px] uppercase font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
              🗑
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.openAddClassModal = function() {
  const modal = document.getElementById("class-modal");
  const form = document.getElementById("class-form");
  const title = document.getElementById("class-modal-title");
  const idInput = document.getElementById("class-form-id");

  if (form) form.reset();
  if (idInput) idInput.value = "";
  if (title) title.innerText = "SCHEDULE GROUP CLASS";

  const durationInput = document.getElementById("class-form-duration");
  if (durationInput) durationInput.value = "45 mins";

  const intensitySelect = document.getElementById("class-form-intensity");
  if (intensitySelect) intensitySelect.value = "High";

  if (modal) modal.classList.remove("hidden");
};

window.openEditClassModal = function(id) {
  const classes = window.fit24Store.getClasses() || [];
  const c = classes.find(item => item.id === id);
  if (!c) return;

  const modal = document.getElementById("class-modal");
  const title = document.getElementById("class-modal-title");
  const idInput = document.getElementById("class-form-id");

  if (idInput) idInput.value = c.id;
  if (title) title.innerText = `EDIT CLASS: ${c.className.toUpperCase()}`;

  const daySelect = document.getElementById("class-form-day");
  const timeInput = document.getElementById("class-form-time");
  const nameInput = document.getElementById("class-form-name");
  const coachInput = document.getElementById("class-form-coach");
  const durationInput = document.getElementById("class-form-duration");
  const catSelect = document.getElementById("class-form-category");
  const intensitySelect = document.getElementById("class-form-intensity");
  const ladiesCheckbox = document.getElementById("class-form-ladies");

  if (daySelect) daySelect.value = c.dayOfWeek || "Mon";
  if (timeInput) timeInput.value = c.startTime || "";
  if (nameInput) nameInput.value = c.className || "";
  if (coachInput) coachInput.value = c.coachName || "";
  if (durationInput) durationInput.value = c.duration || "45 mins";
  if (catSelect) catSelect.value = c.category || "GENERAL";
  if (intensitySelect) intensitySelect.value = c.intensity || "High";
  if (ladiesCheckbox) ladiesCheckbox.checked = Boolean(c.isLadiesOnly);

  if (modal) modal.classList.remove("hidden");
};

window.deleteClassRecord = function(id) {
  const classes = window.fit24Store.getClasses() || [];
  const c = classes.find(item => item.id === id);
  const name = c ? c.className : "session";

  if (confirm(`Are you sure you want to remove "${name}" from the weekly timetable?`)) {
    window.fit24Store.deleteClass(id);
    renderClassesTable();
    if (typeof renderDynamicClasses === "function") {
      renderDynamicClasses();
    }
  }
};

// ==========================================
// 12. BLOG & FIELD JOURNAL MANAGEMENT
// ==========================================
function initBlogManagement() {
  const openBtn = document.getElementById("open-add-blog-btn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      window.openAddBlogModal();
    });
  }

  const searchInput = document.getElementById("blog-search-input");
  const catFilter = document.getElementById("blog-cat-filter");
  const statusFilter = document.getElementById("blog-status-filter");

  if (searchInput) searchInput.addEventListener("input", () => renderBlogTable());
  if (catFilter) catFilter.addEventListener("change", () => renderBlogTable());
  if (statusFilter) statusFilter.addEventListener("change", () => renderBlogTable());

  const form = document.getElementById("blog-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const idInput = document.getElementById("blog-form-id");
      const title = document.getElementById("blog-form-title").value.trim();
      const category = document.getElementById("blog-form-category").value;
      const readTime = document.getElementById("blog-form-readtime").value.trim() || "4 min read";
      const coverImage = document.getElementById("blog-form-cover").value.trim();
      const excerpt = document.getElementById("blog-form-excerpt").value.trim();
      const content = document.getElementById("blog-form-content").value.trim();
      const isPublished = document.getElementById("blog-form-published").checked;

      const postData = {
        title,
        category,
        readTime,
        coverImage: coverImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        excerpt,
        content,
        isPublished
      };

      if (idInput && idInput.value) {
        window.fit24Store.updateBlogPost(idInput.value, postData);
        alert(`📰 Field journal article updated: ${title}`);
      } else {
        window.fit24Store.addBlogPost(postData);
        alert(`📰 Published article to Field Journal: ${title}`);
      }

      const modal = document.getElementById("blog-post-modal");
      if (modal) modal.classList.add("hidden");
      renderBlogTable();
      if (typeof renderDynamicBlog === "function") {
        renderDynamicBlog();
      }
    });
  }
}

function renderBlogTable() {
  const tbody = document.getElementById("blog-table-tbody");
  if (!tbody) return;

  const blogPosts = window.fit24Store.getBlogPosts() || [];
  const q = (document.getElementById("blog-search-input")?.value || "").toLowerCase().trim();
  const filterCat = document.getElementById("blog-cat-filter")?.value || "ALL";
  const filterStatus = document.getElementById("blog-status-filter")?.value || "ALL";

  // KPIs
  const totalCount = blogPosts.length;
  const publishedCount = blogPosts.filter(b => b.isPublished).length;
  const draftsCount = totalCount - publishedCount;

  const elTotal = document.getElementById("metric-total-blogs");
  const elPublished = document.getElementById("metric-published-blogs");
  const elDrafts = document.getElementById("metric-drafts-blogs");
  const elCount = document.getElementById("blog-table-count");

  if (elTotal) elTotal.innerText = totalCount;
  if (elPublished) elPublished.innerText = publishedCount;
  if (elDrafts) elDrafts.innerText = draftsCount;

  // Filter
  const filtered = blogPosts.filter(b => {
    const matchQuery = !q ||
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
      (b.content && b.content.toLowerCase().includes(q));

    const matchCat = filterCat === "ALL" || b.category === filterCat;
    const matchStatus = filterStatus === "ALL" ||
      (filterStatus === "PUBLISHED" && b.isPublished) ||
      (filterStatus === "DRAFT" && !b.isPublished);

    return matchQuery && matchCat && matchStatus;
  });

  if (elCount) {
    elCount.innerText = `${filtered.length} of ${totalCount} articles listed`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-10 text-zinc-500 text-xs font-mono">
          No articles found matching criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(b => {
    return `
      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
        <!-- Cover & Title -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${b.coverImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=120&q=80'}"
                 alt="${b.title}"
                 class="w-12 h-8 object-cover border border-white/20">
            <div>
              <div class="font-bold text-white text-xs max-w-[240px] truncate" title="${b.title}">${b.title}</div>
              <div class="text-[10px] text-zinc-500 font-mono truncate max-w-[240px]">${b.slug || ''}</div>
            </div>
          </div>
        </td>

        <!-- Topic Category -->
        <td class="py-3 px-4">
          <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold border border-purple-500/30 bg-purple-500/10 text-purple-400">
            ${b.category}
          </span>
        </td>

        <!-- Read Time -->
        <td class="py-3 px-4">
          <span class="text-xs text-zinc-400 font-mono">${b.readTime || '3 min read'}</span>
        </td>

        <!-- Publication Status -->
        <td class="py-3 px-4">
          <button onclick="window.toggleBlogPublish('${b.id}')"
                  class="px-2 py-1 text-[10px] uppercase font-mono font-bold border transition-colors ${b.isPublished ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}">
            ${b.isPublished ? '● Published Live' : '○ Draft'}
          </button>
        </td>

        <!-- Date -->
        <td class="py-3 px-4">
          <span class="text-[10px] text-zinc-500 font-mono">${b.createdAt || 'Recent'}</span>
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="inline-flex items-center gap-1.5 justify-end">
            <button onclick="window.openEditBlogModal('${b.id}')"
                    class="px-2.5 py-1 text-[10px] uppercase font-bold bg-white/5 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all">
              ✏ Edit
            </button>
            <button onclick="window.deleteBlogRecord('${b.id}')"
                    class="px-2 py-1 text-[10px] uppercase font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
              🗑
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.openAddBlogModal = function() {
  const modal = document.getElementById("blog-post-modal");
  const form = document.getElementById("blog-form");
  const title = document.getElementById("blog-modal-title");
  const idInput = document.getElementById("blog-form-id");

  if (form) form.reset();
  if (idInput) idInput.value = "";
  if (title) title.innerText = "WRITE JOURNAL ARTICLE";

  const readTimeInput = document.getElementById("blog-form-readtime");
  if (readTimeInput) readTimeInput.value = "4 min read";

  const publishedCheckbox = document.getElementById("blog-form-published");
  if (publishedCheckbox) publishedCheckbox.checked = true;

  if (modal) modal.classList.remove("hidden");
};

window.openEditBlogModal = function(id) {
  const blogPosts = window.fit24Store.getBlogPosts() || [];
  const b = blogPosts.find(item => item.id === id);
  if (!b) return;

  const modal = document.getElementById("blog-post-modal");
  const title = document.getElementById("blog-modal-title");
  const idInput = document.getElementById("blog-form-id");

  if (idInput) idInput.value = b.id;
  if (title) title.innerText = `EDIT ARTICLE: ${b.title.toUpperCase()}`;

  const titleInput = document.getElementById("blog-form-title");
  const catSelect = document.getElementById("blog-form-category");
  const readTimeInput = document.getElementById("blog-form-readtime");
  const coverInput = document.getElementById("blog-form-cover");
  const excerptInput = document.getElementById("blog-form-excerpt");
  const contentInput = document.getElementById("blog-form-content");
  const publishedCheckbox = document.getElementById("blog-form-published");

  if (titleInput) titleInput.value = b.title || "";
  if (catSelect) catSelect.value = b.category || "Recovery Science";
  if (readTimeInput) readTimeInput.value = b.readTime || "4 min read";
  if (coverInput) coverInput.value = b.coverImage || "";
  if (excerptInput) excerptInput.value = b.excerpt || "";
  if (contentInput) contentInput.value = b.content || "";
  if (publishedCheckbox) publishedCheckbox.checked = Boolean(b.isPublished);

  if (modal) modal.classList.remove("hidden");
};

window.toggleBlogPublish = function(id) {
  const blogPosts = window.fit24Store.getBlogPosts() || [];
  const b = blogPosts.find(item => item.id === id);
  if (!b) return;

  const newStatus = !b.isPublished;
  window.fit24Store.updateBlogPost(id, { isPublished: newStatus });
  renderBlogTable();
  if (typeof renderDynamicBlog === "function") {
    renderDynamicBlog();
  }
};

window.deleteBlogRecord = function(id) {
  const blogPosts = window.fit24Store.getBlogPosts() || [];
  const b = blogPosts.find(item => item.id === id);
  const title = b ? b.title : "article";

  if (confirm(`Are you sure you want to delete article "${title}"?`)) {
    window.fit24Store.deleteBlogPost(id);
    renderBlogTable();
    if (typeof renderDynamicBlog === "function") {
      renderDynamicBlog();
    }
  }
};

// ==========================================
// 13. GST TAX INVOICES & BILLING ENGINE
// ==========================================
function initInvoicesModule() {
  const openBtn = document.getElementById("open-add-invoice-btn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      window.openAddInvoiceModal();
    });
  }

  const searchInput = document.getElementById("invoice-search-input");
  const payFilter = document.getElementById("invoice-payment-filter");
  const tierFilter = document.getElementById("invoice-tier-filter");

  if (searchInput) searchInput.addEventListener("input", () => renderInvoicesTable());
  if (payFilter) payFilter.addEventListener("change", () => renderInvoicesTable());
  if (tierFilter) tierFilter.addEventListener("change", () => renderInvoicesTable());

  // Form submit
  const form = document.getElementById("new-invoice-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const memberSelect = document.getElementById("invoice-form-member");
      const memberId = memberSelect ? memberSelect.value : "";
      const member = window.fit24Store.getMember(memberId);
      const tier = document.getElementById("invoice-form-tier").value;
      const durationMonths = parseInt(document.getElementById("invoice-form-duration").value, 10) || 12;
      const grossAmount = parseFloat(document.getElementById("invoice-form-amount").value) || 0;
      const paidVia = document.getElementById("invoice-form-method").value;
      const paymentRef = document.getElementById("invoice-form-ref").value.trim() || `REF-${Date.now()}`;

      const newInv = window.fit24Store.addInvoice({
        memberId: member ? member.id : memberId,
        memberName: member ? member.name : "Member",
        tier,
        durationMonths,
        grossAmount,
        paidVia,
        paymentRef,
        itemsDescription: `${tier} Membership Plan (${durationMonths} Months)`
      });

      alert(`🧾 GST Tax Invoice generated! Invoice #: ${newInv.id}`);
      document.getElementById("new-invoice-modal").classList.add("hidden");
      renderInvoicesTable();
      renderCashbookAndChurnRadar();

      // Automatically open printable thermal receipt
      window.openInvoiceReceipt(newInv.id);
    });
  }
}

function renderInvoicesTable() {
  const tbody = document.getElementById("invoices-table-tbody");
  if (!tbody) return;

  const invoices = window.fit24Store.getInvoices() || [];
  const q = (document.getElementById("invoice-search-input")?.value || "").toLowerCase().trim();
  const payFilter = document.getElementById("invoice-payment-filter")?.value || "ALL";
  const tierFilter = document.getElementById("invoice-tier-filter")?.value || "ALL";

  // KPIs
  const totalCount = invoices.length;
  let totalGross = 0;
  let totalTaxable = 0;
  let totalGST = 0;

  invoices.forEach(inv => {
    totalGross += parseFloat(inv.grossAmount) || 0;
    totalTaxable += parseFloat(inv.baseAmount) || 0;
    totalGST += (parseFloat(inv.cgst) || 0) + (parseFloat(inv.sgst) || 0);
  });

  const elTotal = document.getElementById("metric-total-invoiced");
  const elTaxable = document.getElementById("metric-taxable-invoiced");
  const elGST = document.getElementById("metric-gst-invoiced");
  const elCount = document.getElementById("metric-invoices-count");
  const elTableCount = document.getElementById("invoice-table-count");

  if (elTotal) elTotal.innerText = `₹${totalGross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  if (elTaxable) elTaxable.innerText = `₹${totalTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  if (elGST) elGST.innerText = `₹${totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  if (elCount) elCount.innerText = totalCount;

  // Filter
  const filtered = invoices.filter(inv => {
    const matchQuery = !q ||
      (inv.id && inv.id.toLowerCase().includes(q)) ||
      (inv.memberName && inv.memberName.toLowerCase().includes(q)) ||
      (inv.memberId && inv.memberId.toLowerCase().includes(q));

    const matchPay = payFilter === "ALL" || (inv.paidVia && inv.paidVia.toLowerCase().includes(payFilter.toLowerCase()));
    const matchTier = tierFilter === "ALL" || inv.tier === tierFilter;

    return matchQuery && matchPay && matchTier;
  });

  if (elTableCount) elTableCount.innerText = `${filtered.length} of ${totalCount} invoices`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-10 text-zinc-500 text-xs font-mono">
          No GST tax invoices found matching filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(inv => {
    return `
      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
        <!-- Invoice # & Date -->
        <td class="py-3 px-4">
          <div class="font-bold text-white text-xs">${inv.id}</div>
          <div class="text-[10px] text-zinc-500 font-mono">${inv.issuedDate}</div>
        </td>

        <!-- Member Info -->
        <td class="py-3 px-4">
          <div class="font-bold text-zinc-200 text-xs">${inv.memberName}</div>
          <div class="text-[10px] text-zinc-400 font-mono">${inv.memberId}</div>
        </td>

        <!-- Plan Description -->
        <td class="py-3 px-4">
          <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold border border-white/10 bg-white/5 text-zinc-300">
            ${inv.itemsDescription || inv.tier}
          </span>
        </td>

        <!-- Base Taxable -->
        <td class="py-3 px-4 text-xs font-mono text-zinc-300">
          ₹${parseFloat(inv.baseAmount).toFixed(2)}
        </td>

        <!-- Total GST (18%) -->
        <td class="py-3 px-4 text-xs font-mono text-cyan-400">
          ₹${((parseFloat(inv.cgst) || 0) + (parseFloat(inv.sgst) || 0)).toFixed(2)}
          <span class="text-[9px] text-zinc-500 block">CGST ₹${inv.cgst} + SGST ₹${inv.sgst}</span>
        </td>

        <!-- Gross Total -->
        <td class="py-3 px-4 font-mono font-bold text-emerald-400 text-xs">
          ₹${parseFloat(inv.grossAmount).toFixed(2)}
        </td>

        <!-- Paid Via -->
        <td class="py-3 px-4 text-xs font-mono">
          <span class="text-zinc-300">${inv.paidVia || 'Cash'}</span>
          <span class="text-[9px] text-zinc-500 block truncate max-w-[120px]">${inv.paymentRef || ''}</span>
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="inline-flex items-center gap-1.5 justify-end">
            <button onclick="window.openInvoiceReceipt('${inv.id}')"
                    class="px-2.5 py-1 text-[10px] uppercase font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all flex items-center gap-1">
              <span>🖨️</span> Slip
            </button>
            <button onclick="window.deleteInvoiceRecord('${inv.id}')"
                    class="px-2 py-1 text-[10px] uppercase font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
              🗑
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.openAddInvoiceModal = function(defaultMemberId = null) {
  const modal = document.getElementById("new-invoice-modal");
  const form = document.getElementById("new-invoice-form");
  if (form) form.reset();

  populateMemberSelectDropdowns();

  if (defaultMemberId) {
    const memberSelect = document.getElementById("invoice-form-member");
    if (memberSelect) memberSelect.value = defaultMemberId;
    const member = window.fit24Store.getMember(defaultMemberId);
    if (member) {
      const tierSelect = document.getElementById("invoice-form-tier");
      const durationSelect = document.getElementById("invoice-form-duration");
      const amountInput = document.getElementById("invoice-form-amount");

      if (tierSelect) tierSelect.value = member.tier;
      if (durationSelect) durationSelect.value = member.durationMonths || 12;
      if (amountInput) amountInput.value = member.amountPaid || 19999;
    }
  }

  if (modal) modal.classList.remove("hidden");
};

window.issueInvoiceForMember = function(memberId) {
  window.openAddInvoiceModal(memberId);
};

window.openInvoiceReceipt = function(invoiceId) {
  const invoices = window.fit24Store.getInvoices() || [];
  const inv = invoices.find(i => i.id === invoiceId);
  if (!inv) return;

  const modal = document.getElementById("invoice-receipt-modal");
  const container = document.getElementById("thermal-receipt-content");
  if (!modal || !container) return;

  container.innerHTML = `
    <div class="text-center pb-3 border-b border-dashed border-zinc-400">
      <div class="text-2xl font-black tracking-widest uppercase font-gymbox text-black">FIT24 CLUB</div>
      <div class="text-[11px] font-bold text-zinc-700">PREMIUM FITNESS & COMBAT CLUB</div>
      <div class="text-[10px] text-zinc-600 mt-0.5">TB Road, Hosdurg, Kanhangad, Kerala</div>
      <div class="text-[10px] text-zinc-600">GSTIN: 32AABCF1234K1ZV</div>
      <div class="text-[11px] font-bold mt-1 text-black">TAX INVOICE / CASH MEMO</div>
    </div>

    <div class="py-2.5 border-b border-dashed border-zinc-400 space-y-1 text-[11px]">
      <div class="flex justify-between">
        <span>Invoice No: <strong>${inv.id}</strong></span>
        <span>Date: <strong>${inv.issuedDate}</strong></span>
      </div>
      <div>Athlete: <strong>${inv.memberName.toUpperCase()}</strong> (${inv.memberId || 'GUEST'})</div>
      <div>Payment Mode: <strong>${inv.paidVia}</strong> (${inv.paymentRef || 'Verified'})</div>
    </div>

    <table class="w-full py-2 my-2 border-b border-dashed border-zinc-400 text-left text-[11px]">
      <thead>
        <tr class="font-bold border-b border-zinc-300">
          <th class="py-1">DESCRIPTION</th>
          <th class="py-1 text-center">QTY</th>
          <th class="py-1 text-right">AMT (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="py-1.5">${inv.itemsDescription || inv.tier + ' Plan'}</td>
          <td class="py-1.5 text-center">1</td>
          <td class="py-1.5 text-right font-bold">${parseFloat(inv.baseAmount).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="space-y-1 border-b border-dashed border-zinc-400 pb-2 text-[11px]">
      <div class="flex justify-between">
        <span>Taxable Base Value:</span>
        <span>₹${parseFloat(inv.baseAmount).toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-zinc-600">
        <span>CGST (9.0%):</span>
        <span>₹${parseFloat(inv.cgst).toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-zinc-600">
        <span>SGST (9.0%):</span>
        <span>₹${parseFloat(inv.sgst).toFixed(2)}</span>
      </div>
    </div>

    <div class="py-2.5 border-b-2 border-black flex justify-between items-center">
      <span class="text-sm font-bold">GRAND TOTAL:</span>
      <span class="text-xl font-bold font-gymbox">₹${parseFloat(inv.grossAmount).toFixed(2)}</span>
    </div>

    <div class="py-2 text-[10px] text-zinc-600 space-y-1 text-center pt-2">
      <div class="font-bold text-black uppercase">ANYTHING GOES. NO BORING WORKOUTS.</div>
      <div>WhatsApp Support: +91 62389 20442</div>
      <div>* Keep receipt for locker allocation & guest pass entry *</div>
    </div>
  `;

  modal.classList.remove("hidden");
};

window.printThermalReceipt = function() {
  window.print();
};

window.deleteInvoiceRecord = function(id) {
  if (confirm(`Are you sure you want to delete invoice record "${id}"?`)) {
    window.fit24Store.deleteInvoice(id);
    renderInvoicesTable();
    renderCashbookAndChurnRadar();
  }
};

// ==========================================
// 14. DAILY CASHBOOK & CHURN RADAR
// ==========================================
function renderCashbookAndChurnRadar() {
  // 1. Daily Cashbook
  const rev = window.fit24Store.getDailyRevenue();
  const elGross = document.getElementById("cashbook-today-gross");
  const elUpi = document.getElementById("cashbook-today-upi");
  const elCash = document.getElementById("cashbook-today-cash");
  const elCard = document.getElementById("cashbook-today-card");

  if (elGross) elGross.innerText = `₹${rev.gross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  if (elUpi) elUpi.innerText = `₹${rev.upi.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  if (elCash) elCash.innerText = `₹${rev.cash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  if (elCard) elCard.innerText = `₹${rev.card.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  // 2. Churn Radar (Expiring within 14 days)
  const expiringMembers = window.fit24Store.getExpiringMembers(14) || [];
  const elCount = document.getElementById("expiring-members-count");
  const tbody = document.getElementById("expiring-members-tbody");

  if (elCount) elCount.innerText = `${expiringMembers.length} athletes expiring soon`;
  if (!tbody) return;

  if (expiringMembers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-6 text-zinc-500 text-xs font-mono">
          No memberships expiring in the next 14 days. Retention is strong!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = expiringMembers.map(m => {
    const cleanPhone = (m.phone || "").replace(/[^0-9]/g, "");
    const renewText = encodeURIComponent(
      `Hi ${m.name}! Greetings from FIT24 Kanhangad.\n\nYour ${m.tier} Membership expires on ${m.endDate} (${m.daysRemaining} days remaining).\n\nRenew today at the front desk to lock in your existing rate and retain all accrued perks!`
    );

    let daysBadge = "text-amber-400";
    if (m.daysRemaining <= 3) daysBadge = "text-red-500 font-bold animate-pulse";

    return `
      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
        <td class="py-2.5 px-3">
          <div class="font-bold text-white text-xs">${m.name}</div>
          <div class="text-[10px] text-zinc-500 font-mono">${m.phone}</div>
        </td>
        <td class="py-2.5 px-3">
          <span class="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded ${m.tier === 'ELITE' ? 'bg-yellow-400/20 text-yellow-400' : m.tier === 'PRIME' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}">
            ${m.tier}
          </span>
        </td>
        <td class="py-2.5 px-3 text-xs text-zinc-300 font-mono">
          ${m.endDate}
        </td>
        <td class="py-2.5 px-3 text-xs font-mono ${daysBadge}">
          ⚠️ ${m.daysRemaining} Days
        </td>
        <td class="py-2.5 px-3 text-right">
          <a href="https://wa.me/${cleanPhone}?text=${renewText}" target="_blank"
             class="px-2.5 py-1 text-[10px] font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded inline-flex items-center gap-1 transition-all">
            <span>💬</span> Send Renewal Reminder
          </a>
        </td>
      </tr>
    `;
  }).join("");
}

// ==========================================
// 15. MEMBER 360° DOSSIER & BIOMETRICS
// ==========================================
window.openMemberDossier = function(id) {
  const member = window.fit24Store.getMember(id);
  if (!member) return;

  const modal = document.getElementById("member-dossier-modal");
  const content = document.getElementById("member-dossier-content");
  if (!modal || !content) return;

  const saunaRem = member.saunaTotal - member.saunaUsed;
  const iceBathRem = member.iceBathTotal - member.iceBathUsed;
  const ptTotal = member.ptSessionsTotal || 0;
  const ptUsed = member.ptSessionsUsed || 0;
  const ptRem = ptTotal - ptUsed;
  const hasTrainer = Boolean(member.assignedTrainerId && (ptTotal > 0));
  const biometrics = member.biometrics || [];
  const trainers = window.fit24Store.getTrainers() || [];
  const workoutPlan = member.workoutPlan;
  const compliance = window.fit24Store.calculateComplianceScore ? window.fit24Store.calculateComplianceScore(member.id) : { score: 85, level: 'HIGH COMPLIANCE', color: 'emerald' };
  const habits = member.dailyHabits || { stepsTarget: 10000, stepsDone: 7200, waterDone: 2.5, sleepHours: 7.5 };
  const circ = member.circumferences || { waistCm: 82, chestCm: 102, armsCm: 37, thighsCm: 58 };
  const checkIns = member.weeklyCheckIns || [];
  const parq = member.parq || {};
  const hasParqFlags = parq.heartCondition || parq.chestPainActivity || parq.dizziness || parq.boneJointProblem || parq.bloodPressureMeds;

  const compBadgeColor = compliance.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : compliance.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40';

  content.innerHTML = `
    <div class="space-y-6">
      <!-- Dossier Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
        <div>
          <span class="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">// ATHLETE 360° DOSSIER</span>
          <h3 class="text-3xl font-gymbox text-white">${member.name.toUpperCase()}</h3>
          <p class="text-xs text-zinc-400 font-mono mt-0.5">
            Member Code: <strong class="text-white">${member.id}</strong> · Joined: ${member.startDate} · Expiry: ${member.endDate}
          </p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <div class="px-2.5 py-1 rounded text-center ${compBadgeColor}">
            <span class="text-[9px] font-mono uppercase block">Compliance</span>
            <span class="text-base font-gymbox font-bold">${compliance.score}%</span>
          </div>
          <button onclick="window.viewMemberPARQ('${member.id}')" class="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold uppercase transition-all font-mono">
            📋 PAR-Q Form
          </button>
          <span class="px-3 py-1 font-gymbox text-lg rounded ${member.tier === 'ELITE' ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40' : member.tier === 'PRIME' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}">
            ${member.tier} TIER
          </span>
        </div>
      </div>

      <!-- 3-Column Dossier Breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Health & Safety -->
        <div class="bg-black border border-white/10 p-4 space-y-3 rounded-none">
          <div class="flex justify-between items-center">
            <h4 class="text-xs font-bold text-red-500 uppercase tracking-wider font-mono">HEALTH & MEDICAL</h4>
            <button onclick="window.promptEditMedical('${member.id}')" class="text-[10px] text-zinc-400 hover:text-white underline">Edit</button>
          </div>
          <div class="space-y-2 text-xs font-mono">
            <div class="p-2 bg-purple-500/10 border border-purple-500/30">
              <span class="text-purple-400 font-bold block text-[10px] mb-1">🏋️ Assigned Coach:</span>
              <select onchange="window.assignMemberCoach('${member.id}', this.value)" class="w-full bg-black border border-white/20 text-xs text-white p-1.5 focus:border-[#ff0033]">
                <option value="">-- No Coach Assigned --</option>
                ${trainers.map(t => `<option value="${t.id}" ${t.id === member.assignedTrainerId ? 'selected' : ''}>${t.name} (${t.title || t.badge})</option>`).join("")}
              </select>
            </div>
            <div class="p-2 ${hasParqFlags ? 'bg-red-500/15 border border-red-500/40 text-red-300' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'} flex justify-between items-center">
              <div>
                <span class="text-[9px] uppercase font-bold block text-zinc-400">PAR-Q Clinical Status:</span>
                <strong>${hasParqFlags ? '⚠️ Restricted / Review Needed' : '✓ Cleared for Training'}</strong>
              </div>
              <button onclick="window.viewMemberPARQ('${member.id}')" class="text-[10px] underline hover:text-white">View</button>
            </div>
            <div class="p-2 bg-red-500/10 border border-red-500/30">
              <span class="text-red-400 font-bold block text-[10px]">⚠️ Medical Alert:</span>
              <span class="text-zinc-200 text-xs">${member.medicalAlerts || 'None recorded'}</span>
            </div>
            <div class="p-2 bg-white/5 border border-white/10">
              <span class="text-zinc-400 block text-[10px]">Emergency Contact:</span>
              <strong class="text-white text-xs">${member.emergencyContact || 'Not recorded'}</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 flex justify-between">
              <span class="text-zinc-400 text-[10px]">Blood Group:</span>
              <strong class="text-white">${member.bloodGroup || 'O+'}</strong>
            </div>
          </div>
        </div>

        <!-- Quotas & Personal Training -->
        <div class="bg-black border border-white/10 p-4 space-y-3 rounded-none">
          <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">FACILITY & PT QUOTAS</h4>
          <div class="space-y-2 text-xs font-mono">
            <div class="p-2 bg-white/5 border border-white/10 flex justify-between">
              <span class="text-zinc-400">🧖 Sauna:</span>
              <strong class="text-orange-400">${saunaRem} / ${member.saunaTotal} Left</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 flex justify-between">
              <span class="text-zinc-400">🧊 Ice Bath:</span>
              <strong class="text-cyan-400">${iceBathRem} / ${member.iceBathTotal} Left</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <span class="text-zinc-400 block">🥊 Personal Training:</span>
                <strong class="text-red-400">${ptRem} / ${ptTotal} Sessions</strong>
                <span class="text-[9px] ${hasTrainer ? 'text-emerald-400' : 'text-amber-400'} block font-bold">${hasTrainer ? '● 1-on-1 PT Active' : '○ Self-Guided Floor Athlete'}</span>
              </div>
              <div class="flex items-center gap-1">
                ${ptRem > 0 ? `
                  <button onclick="window.deductMemberPT('${member.id}')" class="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase rounded">
                    -1 PT
                  </button>
                ` : ''}
                <button onclick="window.addMemberPTSessions('${member.id}', 6)" class="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] font-bold uppercase rounded" title="Add +6 PT Sessions">
                  +6 PT
                </button>
              </div>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 flex justify-between">
              <span class="text-zinc-400">☕ Café Wallet:</span>
              <strong class="text-amber-400">₹${member.cafeCredit.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <!-- Biometrics & Weigh-in History -->
        <div class="bg-black border border-white/10 p-4 space-y-3 rounded-none">
          <div class="flex justify-between items-center">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">BIOMETRICS LOG</h4>
            <button onclick="window.logMemberWeighIn('${member.id}')" class="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded">
              + Weigh-in
            </button>
          </div>

          <div class="space-y-2 max-h-48 overflow-y-auto font-mono text-xs" id="dossier-biometrics-list">
            ${biometrics.length === 0 ? `
              <div class="text-zinc-500 text-[11px] italic p-3 text-center">No weigh-ins logged yet. Click "+ Weigh-in" above!</div>
            ` : biometrics.map(b => `
              <div class="p-2 bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <div class="font-bold text-white text-xs">${b.date}</div>
                  <div class="text-[10px] text-zinc-400">${b.notes || 'Routine weigh-in'}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-emerald-400 font-gymbox text-base">${b.weight} kg</div>
                  ${b.bodyFat ? `<div class="text-[9px] text-zinc-500">${b.bodyFat}% Fat</div>` : ''}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Prescribed Workout Blueprint -->
      <div class="bg-black border border-white/10 p-4 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div>
            <span class="text-[10px] font-mono font-bold text-[#ff0033] uppercase tracking-widest">// COACH PRESCRIPTION BLUEPRINT</span>
            <h4 class="text-lg font-gymbox text-white uppercase">${workoutPlan ? workoutPlan.title : 'NO WORKOUT PLAN PRESCRIBED'}</h4>
            <div class="text-[10px] text-zinc-400">${workoutPlan ? workoutPlan.phase : 'Assign a split preset below'}</div>
          </div>
          <!-- Presets & Standard Templates -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-[9px] text-zinc-500 uppercase font-mono mr-0.5">Programs:</span>
            <button onclick="window.applyStandardProgram('${member.id}', 'ppl-6day')" class="px-2 py-1 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-[10px] font-bold uppercase border border-red-500/40" title="Push / Pull / Legs Hypertrophy">⚡ PPL (6-Day)</button>
            <button onclick="window.applyStandardProgram('${member.id}', 'upper-lower-4day')" class="px-2 py-1 bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white text-[10px] font-bold uppercase border border-cyan-500/40" title="Upper / Lower Powerbuilding">🏋️ Upper/Lower (4-Day)</button>
            <button onclick="window.applyStandardProgram('${member.id}', 'fullbody-3day')" class="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] font-bold uppercase border border-emerald-500/40" title="Full Body Strength">🧱 Full Body (3-Day)</button>
            <button onclick="window.applyStandardProgram('${member.id}', 'fat-shred-5day')" class="px-2 py-1 bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white text-[10px] font-bold uppercase border border-amber-500/40" title="Metabolic HIIT & Conditioning">🔥 Fat Shred (5-Day)</button>
            <button onclick="window.applyStandardProgram('${member.id}', 'ladies-sculpt-4day')" class="px-2 py-1 bg-pink-600/30 hover:bg-pink-600 text-pink-300 hover:text-white text-[10px] font-bold uppercase border border-pink-500/40" title="Ladies Sculpt & Tone">🌸 Ladies Sculpt (4-Day)</button>
          </div>
        </div>

        ${workoutPlan ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            ${(workoutPlan.split || []).map(s => `
              <div class="p-2 bg-white/5 border border-white/10 space-y-1">
                <div class="flex justify-between items-center">
                  <span class="text-[#ff0033] font-bold text-[10px]">${s.day}</span>
                  <strong class="text-white text-xs">${s.title}</strong>
                </div>
                <div class="text-zinc-300 text-[11px]">${s.exercises}</div>
                ${s.notes ? `<div class="text-[9px] text-amber-400 italic">Cue: ${s.notes}</div>` : ''}
              </div>
            `).join("")}
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
            <div class="p-2 bg-white/5 border border-white/10 text-center">
              <span class="text-[10px] text-zinc-500 block uppercase">Calories</span>
              <strong class="text-yellow-400 font-gymbox text-base">${member.dietTargets ? member.dietTargets.calories : (workoutPlan.dietTargets ? workoutPlan.dietTargets.calories : 2200)} kcal</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 text-center">
              <span class="text-[10px] text-zinc-500 block uppercase">Protein</span>
              <strong class="text-[#ff0033] font-gymbox text-base">${member.dietTargets ? member.dietTargets.proteinGrams : 140}g</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 text-center">
              <span class="text-[10px] text-zinc-500 block uppercase">Carbohydrates</span>
              <strong class="text-cyan-400 font-gymbox text-base">${member.dietTargets ? member.dietTargets.carbsGrams : 220}g</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 text-center">
              <span class="text-[10px] text-zinc-500 block uppercase">Healthy Fats</span>
              <strong class="text-amber-400 font-gymbox text-base">${member.dietTargets ? member.dietTargets.fatsGrams : 65}g</strong>
            </div>
          </div>
        ` : `
          <div class="text-zinc-500 text-xs italic py-2">Click one of the preset buttons above to assign a training split to this member.</div>
        `}
      </div>

      <!-- Habits & Circumference Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Daily Habits Card -->
        <div class="bg-black border border-white/10 p-4 space-y-2 font-mono text-xs">
          <div class="flex justify-between items-center border-b border-white/10 pb-2">
            <span class="text-[10px] text-[#ff0033] font-bold uppercase tracking-wider">// DAILY ACTION ADHERENCE</span>
            <span class="text-[10px] text-zinc-400">Live Today</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            <div class="p-2 bg-white/5 border border-white/10">
              <div class="text-[9px] text-yellow-400 font-bold">🔥 Calories Burnt:</div>
              <div class="text-sm font-bold text-yellow-300">${habits.caloriesBurntDone || 520} / ${habits.caloriesBurntTarget || 650} kcal</div>
            </div>
            <div class="p-2 bg-white/5 border border-white/10">
              <div class="text-[9px] text-zinc-400">👣 Steps:</div>
              <div class="text-sm font-bold text-white">${habits.stepsDone ? habits.stepsDone.toLocaleString() : '0'} / ${(habits.stepsTarget || 10000).toLocaleString()}</div>
            </div>
            <div class="p-2 bg-white/5 border border-white/10">
              <div class="text-[9px] text-zinc-400">💧 Hydration:</div>
              <div class="text-sm font-bold text-cyan-400">${habits.waterDone || 0} / 3.5 L</div>
            </div>
            <div class="p-2 bg-white/5 border border-white/10">
              <div class="text-[9px] text-zinc-400">😴 Sleep:</div>
              <div class="text-sm font-bold text-purple-400">${habits.sleepHours || 0} Hours</div>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 col-span-2">
              <div class="text-[9px] text-zinc-400">🥩 Protein Target:</div>
              <div class="text-sm font-bold ${habits.proteinDone ? 'text-emerald-400' : 'text-amber-400'}">${habits.proteinDone ? '✓ COMPLETED (160g)' : 'Pending'}</div>
            </div>
          </div>
        </div>

        <!-- Body Circumferences -->
        <div class="bg-black border border-white/10 p-4 space-y-2 font-mono text-xs">
          <div class="flex justify-between items-center border-b border-white/10 pb-2">
            <span class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">// BODY METRIC CIRCUMFERENCES</span>
            <button onclick="window.promptUpdateCircumferences('${member.id}')" class="text-[10px] text-zinc-400 hover:text-white underline">Edit</button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div class="p-2 bg-white/5 border border-white/10 text-center">
              <span class="text-[9px] text-zinc-500 uppercase block">Waist</span>
              <strong class="text-white text-sm font-gymbox">${circ.waistCm || '--'} cm</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 text-center">
              <span class="text-[9px] text-zinc-500 uppercase block">Chest</span>
              <strong class="text-white text-sm font-gymbox">${circ.chestCm || '--'} cm</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 text-center">
              <span class="text-[9px] text-zinc-500 uppercase block">Arms</span>
              <strong class="text-white text-sm font-gymbox">${circ.armsCm || '--'} cm</strong>
            </div>
            <div class="p-2 bg-white/5 border border-white/10 text-center">
              <span class="text-[9px] text-zinc-500 uppercase block">Thighs</span>
              <strong class="text-white text-sm font-gymbox">${circ.thighsCm || '--'} cm</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Coach Metabolic & Calorie Intake Monitor -->
      <div class="bg-black border border-white/10 p-4 space-y-3 font-mono">
        <div class="flex items-center justify-between border-b border-white/10 pb-2">
          <div>
            <span class="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">// METABOLIC INTAKE & ENERGY BALANCE MONITOR</span>
            <h4 class="text-base font-gymbox text-white uppercase">NUTRITION & EXPENDITURE AUDIT</h4>
          </div>
          <span class="text-xs text-zinc-400">Target: ${workoutPlan && workoutPlan.dietTargets ? workoutPlan.dietTargets.calories : 2400} kcal</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
          <div class="p-2.5 bg-white/5 border border-white/5">
            <span class="text-[9px] text-zinc-400 uppercase block">INTAKE TODAY</span>
            <strong class="text-yellow-400 font-gymbox text-lg">${(member.calorieIntakeHistory && member.calorieIntakeHistory.length > 0) ? member.calorieIntakeHistory[member.calorieIntakeHistory.length - 1].intakeKcal : 2350} kcal</strong>
          </div>
          <div class="p-2.5 bg-white/5 border border-white/5">
            <span class="text-[9px] text-zinc-400 uppercase block">BURNT TODAY</span>
            <strong class="text-[#ff0033] font-gymbox text-lg">${habits.caloriesBurntDone || 520} kcal</strong>
          </div>
          <div class="p-2.5 bg-white/5 border border-white/5">
            <span class="text-[9px] text-zinc-400 uppercase block">ENERGY BALANCE</span>
            <strong class="text-emerald-400 font-gymbox text-lg">-450 kcal Deficit</strong>
            <span class="text-[9px] text-emerald-400 block font-bold">✓ Lean Hypertrophy Track</span>
          </div>
        </div>

        <div class="p-3 bg-white/[0.02] border border-white/5 text-xs space-y-1.5">
          <span class="text-[10px] text-zinc-400 uppercase font-bold block">Logged Fuel Meals Today:</span>
          ${(member.todayMeals || [
            { time: "08:00 AM", name: "Oatmeal, Banana & Whey Isolate", kcal: 580, protein: 45 },
            { time: "01:30 PM", name: "Grilled Chicken, Brown Rice & Broccoli", kcal: 720, protein: 55 }
          ]).map(m => `
            <div class="flex justify-between items-center text-[11px] p-1.5 bg-black border border-white/5 rounded">
              <span class="text-zinc-300">${m.time} · ${m.name}</span>
              <span class="text-yellow-400 font-bold">${m.kcal} kcal (${m.protein}g P)</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Coach 7-Day Day-by-Day Workout Split Planner & Audit -->
      <div class="bg-black border border-white/10 p-4 space-y-3 font-mono">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2 gap-2">
          <div>
            <span class="text-[10px] text-[#ff0033] font-bold uppercase tracking-widest">// 7-DAY WORKOUT SPLIT PLANNER & LOG AUDIT</span>
            <h4 class="text-base font-gymbox text-white uppercase">ATHLETE TRAINING TIMELINE (MON–SUN)</h4>
          </div>
          <span class="text-xs text-zinc-400">Coach can prescribe upcoming & review completed</span>
        </div>

        <div class="space-y-2.5">
          ${(member.dayByDaySchedule || defaultDayByDaySchedule()).map(day => `
            <div class="p-3 bg-white/[0.02] border ${day.status === 'completed' ? 'border-emerald-500/30' : day.status === 'today' ? 'border-[#ff0033]/40 bg-red-950/10' : 'border-white/10'} rounded text-xs space-y-1.5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-1.5">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 ${day.status === 'completed' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : day.status === 'today' ? 'bg-red-600 text-white' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'} font-bold text-[10px] rounded">
                    ${day.dayKey} (${day.status.toUpperCase()})
                  </span>
                  <strong class="text-white text-sm font-gymbox">${day.title}</strong>
                </div>
                <div class="flex items-center gap-2">
                  ${day.status === 'completed' ? `
                    <span class="text-emerald-400 text-[10px] font-bold">✓ ${(day.totalVolumeKg || 14200).toLocaleString()} kg Volume Lifted</span>
                    <button onclick="window.promptWorkoutCoachFeedback('${member.id}', '${day.dayKey}')" class="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-[10px] rounded border border-white/10">
                      💬 Coach Note
                    </button>
                  ` : `
                    <span class="text-zinc-400 text-[10px]">${day.durationMins || 60} Mins</span>
                    <button onclick="window.openEditWorkoutModal('${member.id}', '${day.dayKey}')" class="px-2.5 py-0.5 bg-[#ff0033] hover:bg-red-600 text-white font-bold text-[10px] rounded">
                      ✏️ Edit Day's Split
                    </button>
                  `}
                </div>
              </div>

              <div class="text-[11px] text-zinc-300">
                <span class="text-[9px] uppercase text-zinc-500 font-bold block">Prescription:</span>
                ${Array.isArray(day.exercises) ? day.exercises.map(e => `${e.name} (${e.sets || '4x8'})`).join(' · ') : day.exercises}
              </div>

              ${day.coachCue ? `
                <div class="text-[10px] text-amber-400 italic">
                  💡 Cue: ${day.coachCue}
                </div>
              ` : ''}

              ${day.coachFeedback ? `
                <div class="p-2 bg-emerald-950/20 border border-emerald-500/30 rounded text-[10px] text-emerald-300">
                  <strong class="text-emerald-400 uppercase">Coach Feedback:</strong> "${day.coachFeedback}"
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sunday Check-In & Athlete Reviews -->
      <div class="bg-black border border-white/10 p-4 space-y-3 font-mono">
        <div class="flex items-center justify-between border-b border-white/10 pb-2">
          <div>
            <span class="text-[10px] text-[#ff0033] font-bold uppercase tracking-widest">// SUNDAY CHECK-INS & COACH REVIEWS</span>
            <h4 class="text-base font-gymbox text-white uppercase">WEEKLY ATHLETE REFLECTIONS (${checkIns.length})</h4>
          </div>
        </div>

        ${checkIns.length === 0 ? `
          <div class="text-zinc-500 text-xs italic py-3 text-center">No weekly check-ins submitted by this athlete yet. Athlete can submit Sunday check-ins in Athlete Portal.</div>
        ` : `
          <div class="space-y-3">
            ${checkIns.map((ci, idx) => `
              <div class="p-3 bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 bg-red-600/20 text-[#ff0033] font-bold text-[10px] border border-red-500/30">${ci.date}</span>
                    <span class="text-zinc-300 text-xs">⚡ Energy: <strong class="text-yellow-400">${ci.energy}/5</strong></span>
                    <span class="text-zinc-300 text-xs">🧠 Stress: <strong class="text-purple-400">${ci.stress}/5</strong></span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-zinc-400 text-[11px]">Adherence: <strong class="text-emerald-400 font-gymbox text-sm">${ci.adherencePercent}%</strong></span>
                    <button onclick="window.replySundayCheckIn('${member.id}', ${idx})" class="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase rounded">
                      💬 Reply to Athlete
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div class="p-2 bg-black border border-white/5">
                    <span class="text-[9px] uppercase text-zinc-500 font-bold block mb-0.5">🏆 Weekly Wins & Highlights:</span>
                    <p class="text-zinc-300 italic">"${ci.wins || 'Completed all scheduled training sessions.'}"</p>
                  </div>
                  <div class="p-2 bg-black border border-white/5">
                    <span class="text-[9px] uppercase text-zinc-500 font-bold block mb-0.5">❓ Questions / Obstacles for Coach:</span>
                    <p class="text-amber-300 italic">"${ci.questionsForTrainer || 'None this week.'}"</p>
                  </div>
                </div>

                ${ci.coachFeedback ? `
                  <div class="p-2.5 bg-red-500/10 border border-red-500/30 text-[11px] rounded">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-red-400 block mb-0.5">💬 COACH RESPONSE:</span>
                    <p class="text-white">${ci.coachFeedback}</p>
                  </div>
                ` : `
                  <div class="text-[10px] text-zinc-500 italic">Awaiting coach feedback. Click "Reply to Athlete" above to send instructions.</div>
                `}
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
};

window.promptEditMedical = function(memberId) {
  const member = window.fit24Store.getMember(memberId);
  if (!member) return;

  const alerts = prompt("Medical Alerts / Physical Limitations:", member.medicalAlerts || "None");
  if (alerts === null) return;
  const emergency = prompt("Emergency Contact (Name & Phone):", member.emergencyContact || "");
  if (emergency === null) return;
  const blood = prompt("Blood Group (e.g. O+, B+, A+):", member.bloodGroup || "O+");
  if (blood === null) return;

  window.fit24Store.updateMemberMedical(memberId, {
    medicalAlerts: alerts,
    emergencyContact: emergency,
    bloodGroup: blood
  });

  window.openMemberDossier(memberId);
};

window.logMemberWeighIn = function(memberId) {
  const weight = prompt("Enter athlete's weight in kg (e.g. 78.4):", "78.0");
  if (!weight) return;
  const bodyFat = prompt("Body Fat % (optional, e.g. 15.2):", "");
  const notes = prompt("Coach Notes / Workout PR (e.g. Squat PR 140kg):", "Monthly assessment");

  window.fit24Store.logBiometric(memberId, {
    weight: parseFloat(weight) || 0,
    bodyFat: bodyFat ? parseFloat(bodyFat) : null,
    notes: notes || "Weigh-in"
  });

  window.openMemberDossier(memberId);
};

window.deductMemberPT = function(memberId) {
  const res = window.fit24Store.deductPTSession(memberId);
  if (!res.success) {
    alert(res.message);
    return;
  }
  alert(`🥊 PT Session Deducted! ${res.remaining}`);
  window.openMemberDossier(memberId);
  renderAllData();
};

window.assignMemberCoach = function(memberId, trainerId) {
  window.fit24Store.assignTrainer(memberId, trainerId);
  window.openMemberDossier(memberId);
  renderAllData();
  renderTrainersTable();
};

window.applyWorkoutPreset = function(memberId, presetKey) {
  const presets = {
    STRENGTH: {
      title: "Hypertrophy & Biomechanics Split",
      phase: "Phase 2: Strength Block (Week 4 of 12)",
      dietTargets: { calories: 2400, proteinGrams: 160, waterLiters: 4.0 },
      split: [
        { day: "Day 1 (Mon)", title: "Heavy Push & Chest", exercises: "Incline DB Press 4x8, Barbell Bench 4x6, Dips 3x10, DB Lateral Raises 4x15", notes: "Focus on 2-sec eccentric pause on bench" },
        { day: "Day 2 (Wed)", title: "Back & Pull Engine", exercises: "Conventional Deadlifts 4x5, Lat Pulldowns 4x10, Facepulls 3x15, Heavy Bag 4 rounds", notes: "Wrap wrists and maintain neutral spine" },
        { day: "Day 3 (Fri)", title: "Lower Body Power", exercises: "Barbell Back Squats 4x8, Romanian Deadlifts 3x10, Standing Calves 4x15", notes: "Knees tracking toes, explosive ascent" },
        { day: "Day 4 (Sat)", title: "Olympic / Conditioning", exercises: "Power Cleans 5x3, Farmer's Carries 4x50m, Assault Bike intervals", notes: "Follow with 85°C dry sauna recovery" }
      ]
    },
    COMBAT: {
      title: "Fight Conditioning & Striking Endurance",
      phase: "Speed & Power Rounds",
      dietTargets: { calories: 2200, proteinGrams: 140, waterLiters: 4.0 },
      split: [
        { day: "Day 1 (Tue)", title: "Combat Footwork & Jab-Cross", exercises: "Footwork ladder drills 15m, 1-2 Combo on pads 5x3min, Jump rope 1000 skips", notes: "Keep chin tucked, recover hands to cheek" },
        { day: "Day 2 (Thu)", title: "Heavy Bag Power Rounds", exercises: "Hooks & uppercuts 6x3min, Med ball slams 4x15, Burpees 4x12", notes: "Explosive hip rotation on left hook" },
        { day: "Day 3 (Sat)", title: "Sparring & Strength", exercises: "Controlled ring sparring 4 rounds, Hex bar deadlift 4x6, Pullups 4x8", notes: "Mouthguard mandatory" }
      ]
    },
    LADIES: {
      title: "Ladies Functional Tone & HIIT Sculpt",
      phase: "Core & Metabolic Conditioning",
      dietTargets: { calories: 1750, proteinGrams: 110, waterLiters: 3.0 },
      split: [
        { day: "Day 1 (Mon)", title: "Kettlebell Flow & Glutes", exercises: "KB Swings 4x15, Goblet Squats 4x12, Glute Bridges 4x20", notes: "Hips back, snap glutes at lock" },
        { day: "Day 2 (Wed)", title: "Cardio Rave & Core", exercises: "Zumba interval rhythm, Battle ropes 4x30s, Plank holds 3x60s", notes: "Keep heart rate in zone 3-4" }
      ]
    },
    REHAB: {
      title: "Postural Alignment & Athletic Mobility",
      phase: "Spine & Core Stability (Week 2 of 8)",
      dietTargets: { calories: 1900, proteinGrams: 120, waterLiters: 3.5 },
      split: [
        { day: "Day 1 (Mon)", title: "Thoracic & Core Flow", exercises: "Cat-Cow 3x10, Bird-Dog 3x12, Deadbugs 3x15, Cable Woodchops 3x12", notes: "Activate deep transverse abdominis" },
        { day: "Day 2 (Wed)", title: "Glute & Hip Decompression", exercises: "Hip Thrusts 4x10, Bulgarian Split Squats 3x10, Banded Lateral Walks", notes: "Full hip extension at top" },
        { day: "Day 3 (Fri)", title: "Full Body Functional", exercises: "Kettlebell Deadlifts 4x10, Dumbbell Overhead Press 3x10, Row Machine 2000m", notes: "Finish with 4°C ice bath contrast therapy" }
      ]
    }
  };

  const chosen = presets[presetKey];
  if (!chosen) return;
  window.fit24Store.updateMemberWorkoutPlan(memberId, chosen);
  alert(`✅ Assigned "${chosen.title}" to athlete!`);
  window.openMemberDossier(memberId);
};

window.viewMemberPARQ = function(memberId) {
  const member = window.fit24Store.getMember(memberId);
  if (!member) return;
  const modal = document.getElementById("parq-modal");
  const content = document.getElementById("parq-modal-content");
  if (!modal || !content) return;

  const p = member.parq || {};
  const hasFlags = p.heartCondition || p.chestPainActivity || p.dizziness || p.boneJointProblem || p.bloodPressureMeds;

  content.innerHTML = `
    <div class="space-y-4 font-mono">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span class="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">// MEDICAL CLEARANCE & HEALTH INTAKE</span>
          <h3 class="text-2xl font-gymbox text-white uppercase">${member.name}</h3>
          <p class="text-xs text-zinc-400 font-mono">Member ID: <strong class="text-white">${member.id}</strong> · Signed: ${p.completedDate || 'On Registration'}</p>
        </div>
        <span class="px-2.5 py-1 text-xs font-mono font-bold uppercase ${hasFlags ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}">
          ${hasFlags ? '⚠️ RESTRICTED / CAUTION' : '✓ CLEARED FOR MAX INTENSITY'}
        </span>
      </div>

      <div class="p-3 bg-black/60 border border-white/10 text-xs space-y-2">
        <div class="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Physical Activity Readiness Questionnaire (PAR-Q)</div>
        
        <div class="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
          <span class="text-zinc-300">1. Has your doctor ever said that you have a heart condition?</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.heartCondition ? 'bg-red-500/30 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'}">${p.heartCondition ? 'YES' : 'NO'}</span>
        </div>

        <div class="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
          <span class="text-zinc-300">2. Do you feel pain in your chest when performing physical activity?</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.chestPainActivity ? 'bg-red-500/30 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'}">${p.chestPainActivity ? 'YES' : 'NO'}</span>
        </div>

        <div class="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
          <span class="text-zinc-300">3. Do you lose your balance because of dizziness or lose consciousness?</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.dizziness ? 'bg-red-500/30 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'}">${p.dizziness ? 'YES' : 'NO'}</span>
        </div>

        <div class="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
          <span class="text-zinc-300">4. Do you have a bone, joint, or spinal injury that could worsen with exercise?</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.boneJointProblem ? 'bg-red-500/30 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'}">${p.boneJointProblem ? 'YES' : 'NO'}</span>
        </div>

        <div class="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
          <span class="text-zinc-300">5. Are you currently prescribed medication for blood pressure or heart condition?</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.bloodPressureMeds ? 'bg-red-500/30 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'}">${p.bloodPressureMeds ? 'YES' : 'NO'}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 bg-black/60 border border-white/10">
          <div class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Primary Fitness Objective</div>
          <div class="text-white font-bold">${p.primaryGoal || 'General Fitness & Hypertrophy'}</div>
        </div>
        <div class="p-3 bg-black/60 border border-white/10">
          <div class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Dietary Restrictions & Allergies</div>
          <div class="text-yellow-400 font-bold">${p.dietaryRestrictions || 'None Reported'}</div>
        </div>
      </div>

      <div class="flex justify-between items-center pt-2">
        <button onclick="window.editMemberPARQ('${member.id}')" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase">
          ✏️ Edit Questionnaire
        </button>
        <button onclick="document.getElementById('parq-modal').classList.add('hidden')" class="px-4 py-1.5 bg-[#ff0033] hover:bg-red-700 text-white text-xs font-bold uppercase">
          Close Inspection
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
};

window.editMemberPARQ = function(memberId) {
  const member = window.fit24Store.getMember(memberId);
  if (!member) return;
  const p = member.parq || {};
  const goal = prompt("Enter Primary Fitness Goal:", p.primaryGoal || "Hypertrophy / Fat Loss");
  if (goal === null) return;
  const diet = prompt("Enter Dietary Restrictions / Allergies:", p.dietaryRestrictions || "None");
  if (diet === null) return;
  const injury = confirm("Does the athlete have an active joint, bone, or heart concern? (Click OK for Yes / Flagged, Cancel for No)");
  
  window.fit24Store.updatePARQ(memberId, {
    ...p,
    primaryGoal: goal,
    dietaryRestrictions: diet,
    boneJointProblem: injury,
    completedDate: new Date().toISOString().split("T")[0]
  });
  window.viewMemberPARQ(memberId);
  if (document.getElementById("member-dossier-modal") && !document.getElementById("member-dossier-modal").classList.contains("hidden")) {
    window.openMemberDossier(memberId);
  }
};

window.replySundayCheckIn = function(memberId, checkInIndex) {
  const member = window.fit24Store.getMember(memberId);
  if (!member) return;
  const ci = (member.weeklyCheckIns || [])[checkInIndex];
  const defaultMsg = ci && ci.coachFeedback ? ci.coachFeedback : "Great adherence! Let's maintain caloric targets and progress load on compound lifts.";
  const feedback = prompt("Enter Coach Feedback / Action Plan for Athlete:", defaultMsg);
  if (feedback === null) return;
  window.fit24Store.replyWeeklyCheckIn(memberId, checkInIndex, feedback);
  window.openMemberDossier(memberId);
};

window.promptUpdateCircumferences = function(memberId) {
  const member = window.fit24Store.getMember(memberId);
  if (!member) return;
  const c = member.circumferences || {};
  const waist = prompt("Waist circumference (cm):", c.waistCm || "82");
  if (waist === null) return;
  const chest = prompt("Chest circumference (cm):", c.chestCm || "102");
  if (chest === null) return;
  const arms = prompt("Arms circumference (cm):", c.armsCm || "37");
  if (arms === null) return;
  const thighs = prompt("Thighs circumference (cm):", c.thighsCm || "58");
  if (thighs === null) return;

  window.fit24Store.updateCircumferences(memberId, {
    waistCm: parseFloat(waist) || 0,
    chestCm: parseFloat(chest) || 0,
    armsCm: parseFloat(arms) || 0,
    thighsCm: parseFloat(thighs) || 0
  });
  window.openMemberDossier(memberId);
};

window.viewTrainerClients = function(trainerId) {
  const trainer = window.fit24Store.getTrainer(trainerId);
  if (!trainer) return;
  const clients = window.fit24Store.getTrainerClients(trainerId);
  const stats = window.fit24Store.getTrainerMonthlyStats(trainerId);
  const modal = document.getElementById("trainer-clients-modal");
  const content = document.getElementById("trainer-clients-content");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="space-y-5 font-mono">
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <div class="flex items-center gap-3">
          <img src="${trainer.photoUrl}" class="w-12 h-12 object-cover border border-[#ff0033]">
          <div>
            <span class="text-[10px] font-mono font-bold text-[#ff0033] uppercase">// COACH CLIENT ROSTER</span>
            <h3 class="text-2xl font-gymbox text-white uppercase">${trainer.name}</h3>
            <div class="text-xs text-zinc-400">${trainer.specialty} · Commission: ₹${trainer.perSessionRate || 500} / session</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs text-zinc-400 font-mono">Monthly Estimated Earnings</div>
          <div class="text-2xl font-gymbox text-emerald-400">₹${stats.estimatedEarnings.toLocaleString()}</div>
          <div class="text-[10px] text-zinc-500 font-mono">${stats.sessionsConducted} PT sessions conducted</div>
        </div>
      </div>

      <!-- Clients Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left font-mono text-xs">
          <thead>
            <tr class="border-b border-white/10 text-[10px] text-zinc-500 uppercase">
              <th class="py-2.5 px-3">Athlete</th>
              <th class="py-2.5 px-3">Tier</th>
              <th class="py-2.5 px-3">Compliance</th>
              <th class="py-2.5 px-3">PT Sessions Balance</th>
              <th class="py-2.5 px-3">Status</th>
              <th class="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${clients.length === 0 ? `
              <tr><td colspan="6" class="py-6 text-center text-zinc-500 italic">No athletes assigned to this coach yet.</td></tr>
            ` : clients.map(c => {
              const compliance = window.fit24Store.calculateComplianceScore ? window.fit24Store.calculateComplianceScore(c.id) : { score: 85, color: 'emerald' };
              const compColor = compliance.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : compliance.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30';
              return `
              <tr class="border-b border-white/5 hover:bg-white/[0.02]">
                <td class="py-2.5 px-3">
                  <strong class="text-white block">${c.name}</strong>
                  <span class="text-[10px] text-zinc-400">${c.id}</span>
                </td>
                <td class="py-2.5 px-3">
                  <span class="px-2 py-0.5 text-[10px] uppercase font-bold border ${c.tier === 'ELITE' ? 'border-yellow-400/40 text-yellow-400' : c.tier === 'PRIME' ? 'border-orange-400/40 text-orange-400' : 'border-white/20 text-white'}">${c.tier}</span>
                </td>
                <td class="py-2.5 px-3">
                  <span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded ${compColor}">${compliance.score}%</span>
                </td>
                <td class="py-2.5 px-3">
                  <strong class="text-[#ff0033]">${Math.max(0, (c.ptSessionsTotal || 0) - (c.ptSessionsUsed || 0))} / ${c.ptSessionsTotal || 0} Left</strong>
                  <span class="text-[10px] text-zinc-500 block">(${c.ptSessionsUsed || 0} used)</span>
                </td>
                <td class="py-2.5 px-3">
                  <span class="${c.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'} text-[10px] uppercase font-bold">● ${c.status}</span>
                </td>
                <td class="py-2.5 px-3 text-right space-x-1">
                  <button onclick="window.viewMemberPARQ('${c.id}')" class="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold uppercase rounded border border-white/10" title="View PAR-Q Health Intake">
                    PAR-Q
                  </button>
                  <button onclick="window.deductMemberPT('${c.id}'); window.viewTrainerClients('${trainer.id}')" class="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase rounded">
                    -1 PT
                  </button>
                  <button onclick="document.getElementById('trainer-clients-modal').classList.add('hidden'); window.openMemberDossier('${c.id}')" class="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold uppercase rounded">
                    Dossier
                  </button>
                </td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
};

// ==========================================
// 16. HARDWARE SCANNER & WEBRTC CAMERA INTEGRATION
// ==========================================
window.executeScanCheckIn = function(code) {
  if (!code) return;
  const cleanCode = code.trim();
  const res = window.fit24Store.checkInMember(cleanCode, "Barcode / QR Laser");

  if (!res.success) {
    if (window.fit24Scanner) window.fit24Scanner.playWarningBeep();
    alert(`⚠️ Cannot Check In: ${res.message}`);
  } else {
    if (window.fit24Scanner) window.fit24Scanner.playSuccessBeep();
    alert(`✓ CHECK-IN APPROVED: ${res.member.name} (${res.member.tier}) at ${res.record.time}`);
    renderAllData();
  }
};

window.openCameraScanner = function() {
  const modal = document.getElementById("camera-scanner-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  if (window.fit24Scanner) {
    window.fit24Scanner.startCamera("camera-scanner-video", (scannedValue) => {
      window.closeCameraScanner();
      window.executeScanCheckIn(scannedValue);
    });
  }
};

window.closeCameraScanner = function() {
  const modal = document.getElementById("camera-scanner-modal");
  if (modal) modal.classList.add("hidden");
  if (window.fit24Scanner) {
    window.fit24Scanner.stopCamera();
  }
};

// ==========================================
// 17. TRAINER DAY-BY-DAY WORKOUT SPLIT MANAGEMENT & COACH FEEDBACK
// ==========================================
window.promptWorkoutCoachFeedback = function(memberId, dayKey) {
  const member = window.fit24Store.getMember(memberId);
  if (!member) return;
  const schedule = member.dayByDaySchedule || defaultDayByDaySchedule();
  const dayObj = schedule.find(d => d.dayKey.toLowerCase() === dayKey.toLowerCase());
  const currentFeedback = dayObj ? (dayObj.coachFeedback || "") : "";

  const feedback = prompt(`Enter Coach Debrief / Drillmaster Note for ${member.name} (${dayKey}):`, currentFeedback);
  if (feedback !== null) {
    window.fit24Store.addTrainerWorkoutFeedback(memberId, dayKey, feedback.trim());
    window.openMemberDossier(memberId);
  }
};

window.openEditWorkoutModal = function(memberId, dayKey) {
  const member = window.fit24Store.getMember(memberId);
  if (!member) return;
  const schedule = member.dayByDaySchedule || defaultDayByDaySchedule();
  const dayObj = schedule.find(d => d.dayKey.toLowerCase() === dayKey.toLowerCase());
  if (!dayObj) return;

  const modal = document.getElementById("trainer-edit-workout-modal");
  const content = document.getElementById("trainer-edit-workout-content");
  if (!modal || !content) return;

  // Format exercise list for the textarea
  let exercisesFormatted = "";
  if (Array.isArray(dayObj.exercises)) {
    exercisesFormatted = dayObj.exercises.map(e => {
      const parts = [e.name, e.sets || '4x8', e.targetWeight || '—', e.tempo || '2-0-1-0', (e.restSeconds || 90) + 's'];
      return parts.join(' | ');
    }).join('\n');
  } else if (typeof dayObj.exercises === 'string') {
    exercisesFormatted = dayObj.exercises;
  }

  content.innerHTML = `
    <div class="border-b border-[#ff0033]/30 pb-3 mb-4">
      <div class="flex items-center justify-between">
        <span class="text-[10px] tracking-widest text-[#ff0033] uppercase font-bold">Trainer Split Builder</span>
        <span class="px-2 py-0.5 bg-red-600/20 text-[#ff0033] border border-red-500/30 text-[10px] font-bold rounded uppercase">${dayObj.dayName || dayObj.dayKey} (${dayObj.status.toUpperCase()})</span>
      </div>
      <h3 class="text-xl font-gymbox text-white tracking-wide uppercase mt-1">Prescribe Workout: ${member.name}</h3>
      <p class="text-zinc-400 text-xs mt-0.5">Customise day-by-day training mission, target volume, and drillmaster cues.</p>
    </div>

    <form id="trainer-split-edit-form" onsubmit="event.preventDefault(); window.saveTrainerDayWorkout('${member.id}', '${dayObj.dayKey}');" class="space-y-4">
      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">Mission / Workout Focus Title</label>
        <input type="text" id="edit-workout-title" required value="${(dayObj.title || '').replace(/"/g, '&quot;')}" placeholder="e.g. Lower Body Power & Squats" class="w-full bg-black/60 border border-white/20 focus:border-[#ff0033] px-3 py-2 text-white text-xs rounded outline-none" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">Target Duration (Mins)</label>
          <input type="number" id="edit-workout-duration" min="15" max="180" value="${dayObj.durationMins || 60}" class="w-full bg-black/60 border border-white/20 focus:border-[#ff0033] px-3 py-2 text-white text-xs rounded outline-none" />
        </div>
        <div>
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">Split Status</label>
          <select id="edit-workout-status" class="w-full bg-black/60 border border-white/20 focus:border-[#ff0033] px-3 py-2 text-white text-xs rounded outline-none">
            <option value="upcoming" ${dayObj.status === 'upcoming' ? 'selected' : ''}>Upcoming (Prescribed)</option>
            <option value="today" ${dayObj.status === 'today' ? 'selected' : ''}>Today's Active Mission</option>
            <option value="completed" ${dayObj.status === 'completed' ? 'selected' : ''}>Completed & Audited</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">Coach / Drillmaster Cue</label>
        <textarea id="edit-workout-cue" rows="2" placeholder="e.g. Focus on 2-sec eccentric pause on bench. Squeeze pecs at lockout." class="w-full bg-black/60 border border-white/20 focus:border-[#ff0033] px-3 py-2 text-white text-xs rounded outline-none">${(dayObj.coachCue || '').replace(/</g, '&lt;')}</textarea>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">Prescribed Exercises</label>
          <span class="text-[9px] text-zinc-500 font-mono">Format: Name | Sets | Target | Tempo | Rest</span>
        </div>
        <textarea id="edit-workout-exercises" rows="5" class="w-full bg-black/60 border border-white/20 focus:border-[#ff0033] px-3 py-2 text-white font-mono text-[11px] rounded outline-none leading-relaxed" placeholder="Barbell Back Squats | 4x8 | 105kg | 3-0-1-0 | 90s&#10;Romanian Deadlifts | 3x10 | 90kg | 3-1-1-0 | 90s">${exercisesFormatted.replace(/</g, '&lt;')}</textarea>
        <p class="text-[10px] text-zinc-500 mt-1">💡 Enter 1 exercise per line with pipe separator (|) for precise sets, weight, tempo, and rest intervals.</p>
      </div>

      <div class="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
        <button type="button" onclick="document.getElementById('trainer-edit-workout-modal').classList.add('hidden')" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase rounded">Cancel</button>
        <button type="submit" class="px-5 py-2 bg-[#ff0033] hover:bg-red-600 text-white text-xs font-gymbox tracking-wider uppercase rounded shadow-lg shadow-red-900/40">Save & Prescribe Split</button>
      </div>
    </form>
  `;

  modal.classList.remove("hidden");
};

window.saveTrainerDayWorkout = function(memberId, dayKey) {
  const title = (document.getElementById("edit-workout-title")?.value || "").trim();
  const durationMins = parseInt(document.getElementById("edit-workout-duration")?.value) || 60;
  const status = document.getElementById("edit-workout-status")?.value || "upcoming";
  const coachCue = (document.getElementById("edit-workout-cue")?.value || "").trim();
  const exercisesRaw = (document.getElementById("edit-workout-exercises")?.value || "").trim();

  if (!title) {
    alert("Please enter a workout title.");
    return;
  }

  // Parse lines into exercises array
  const exercises = exercisesRaw.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const parts = line.split('|').map(p => p.trim());
    return {
      name: parts[0] || "Exercise",
      sets: parts[1] || "4x8",
      targetWeight: parts[2] || "—",
      tempo: parts[3] || "2-0-1-0",
      restSeconds: parseInt(parts[4]) || 90,
      completed: status === 'completed'
    };
  });

  const updatedMember = window.fit24Store.updateDayWorkoutSplit(memberId, dayKey, {
    title,
    durationMins,
    status,
    coachCue,
    exercises: exercises.length > 0 ? exercises : [{ name: title, sets: "4x10", targetWeight: "—" }]
  });

  if (updatedMember) {
    document.getElementById("trainer-edit-workout-modal")?.classList.add("hidden");
    window.openMemberDossier(memberId);
    alert(`✓ Workout split for ${dayKey} successfully updated and pushed to athlete's daily timeline!`);
  } else {
    alert("Could not update workout split. Please check the member details.");
  }
};

window.addMemberPTSessions = function(memberId, count = 6) {
  if (!window.fit24Store || !window.fit24Store.addPTSessions) return;
  const res = window.fit24Store.addPTSessions(memberId, count);
  if (!res || !res.success) {
    alert(res?.message || "Failed to add PT sessions.");
    return;
  }
  alert(`🥊 Added +${count} PT Sessions! Total package: ${res.newTotal} sessions (${res.remaining} remaining).`);
  window.openMemberDossier(memberId);
  renderAllData();
};

window.applyStandardProgram = function(memberId, programId) {
  if (!window.fit24Store || !window.fit24Store.applyProgramTemplate) return;
  const member = window.fit24Store.applyProgramTemplate(memberId, programId);
  if (member) {
    alert(`📋 Routine Blueprint applied: "${member.workoutPlan?.title || programId}"`);
    window.openMemberDossier(memberId);
    renderAllData();
  }
};


