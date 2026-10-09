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
        }
      }
    });
  });
}

// Master refresh
function renderAllData() {
  renderDashboardMetrics();
  renderAttendanceTable();
  renderMemberTable();
  renderLeadsTable();
  renderFacilityLogs();
  renderPauseOverview();
  renderCafeLogs();
  renderTrainersTable();
  renderClassesTable();
  renderBlogTable();
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
        <td class="py-3 px-4 text-xs text-right space-x-1">
          <button onclick="viewMemberPass('${m.id}')" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-white">Pass</button>
          <button onclick="openQuotaModal('${m.id}')" class="px-2 py-1 rounded bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-[11px]">Use Quota</button>
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
  const dropdownIds = ["facility-member-select", "pause-member-select", "cafe-member-select"];

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
        </td>

        <!-- Bio & Philosophy -->
        <td class="py-3 px-4">
          <div class="text-xs text-zinc-400 max-w-[260px] truncate" title="${t.bio || ''}">
            ${t.bio || '<span class="text-zinc-600 italic">No bio specified</span>'}
          </div>
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
