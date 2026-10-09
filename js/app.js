// FIT24 - Gymbox-Themed Public Website Application Logic & 3 Calculators

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  renderFacilities();
  initHorizontalPinScroll();
  renderDynamicTrainers();
  initPricingCalculator();
  initCalculatorTabs();
  initMembershipSavingsCalculator();
  initMacroCalculator();
  initRecoveryProtocolCalculator();
  initClassSchedule();
  renderDynamicBlog();
  initMemberPassModal();
  initLeadModal();
});

// 1. Grand Opening Countdown (18 Oct 2026)
function initCountdown() {
  const targetDate = new Date("2026-10-18T06:00:00+05:30").getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const banner = document.getElementById("countdown-container");
    if (diff <= 0) {
      if (banner) banner.innerHTML = `<span class="text-gym-red font-gymbox text-2xl tracking-wider">🔥 FIT24 IS OFFICIALLY UNLEASHED IN KANHANGAD! VISIT US TODAY! 🔥</span>`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById("cd-days");
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-minutes");
    const sEl = document.getElementById("cd-seconds");

    if (dEl) dEl.innerText = String(days).padStart(2, "0");
    if (hEl) hEl.innerText = String(hours).padStart(2, "0");
    if (mEl) mEl.innerText = String(minutes).padStart(2, "0");
    if (sEl) sEl.innerText = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// 2. Render Facilities with Images, Zoom on Hover, and Reveal Subtext
function renderFacilities() {
  const track = document.getElementById("disciplines-track");
  if (!track) return;

  track.innerHTML = FIT24_DATA.facilities.map((f) => `
    <div class="discipline-card group w-[310px] sm:w-[380px] md:w-[420px] h-[480px] sm:h-[530px] flex-shrink-0 relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 cursor-pointer select-none">
      <!-- Full-bleed background image with smooth zoom on hover -->
      <img src="${f.image}" alt="${f.name}" class="card-bg-img absolute inset-0 w-full h-full object-cover z-0" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'">

      <!-- Multi-stop Dark Athletic Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35 z-10 pointer-events-none group-hover:via-black/85 transition-all duration-500"></div>

      <!-- Top Red Highlight Line on Hover -->
      <div class="absolute top-0 inset-x-0 h-1 bg-[#ff0033] opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>

      <!-- Top Row Info -->
      <div class="relative z-20 flex items-center justify-between">
        <span class="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase bg-[#ff0033] text-white">
          ${f.category}
        </span>
        <span class="text-4xl sm:text-5xl font-gymbox text-white/30 group-hover:text-[#ff0033] transition-colors">
          ${f.num}
        </span>
      </div>

      <!-- Bottom Content: Always shows Title + Tagline; Hover reveals Description & Inclusions -->
      <div class="relative z-20 mt-auto">
        <h3 class="text-3xl sm:text-4xl font-gymbox text-white mb-2 tracking-wide group-hover:text-[#ff0033] transition-colors">
          ${f.name}
        </h3>

        <!-- Initial Teaser Subtext (Always present) -->
        <p class="text-zinc-200 text-xs sm:text-sm font-mono border-l-2 border-[#ff0033] pl-2 font-bold leading-snug mb-1">
          ${f.tagline}
        </p>

        <!-- Hover Prompt -->
        <div class="text-[10px] font-mono text-[#ff0033] uppercase font-bold tracking-widest pt-1 flex items-center gap-1 group-hover:hidden transition-all">
          <span>▶ HOVER TO EXPAND SPECS</span>
        </div>

        <!-- Hidden Subtext: Slides & Reveals on Hover -->
        <div class="card-reveal-content">
          <p class="text-zinc-300 text-xs font-mono leading-relaxed mb-4 pt-3 border-t border-white/15">
            ${f.desc}
          </p>

          <div class="flex flex-wrap gap-1 mb-3">
            ${f.tags.map(t => `<span class="text-[10px] px-2 py-0.5 bg-black/80 border border-white/20 text-white font-mono uppercase font-bold">${t}</span>`).join('')}
          </div>

          <div class="text-[10px] font-mono font-bold text-[#ff0033] uppercase pt-2 border-t border-white/10 flex items-center justify-between">
            <span>INCLUDED IN:</span>
            <span class="text-white">${f.includedIn.join(" · ")}</span>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// 2.1 Horizontal Scroll Pin: Down-scroll drives cards left-to-right, then down to rest
function initHorizontalPinScroll() {
  const section = document.getElementById("disciplines");
  const track = document.getElementById("disciplines-track");
  const counter = document.getElementById("disciplines-counter");
  const progressBar = document.getElementById("disciplines-progress-bar");
  const prevBtn = document.getElementById("disciplines-prev-btn");
  const nextBtn = document.getElementById("disciplines-next-btn");

  if (!section || !track) return;

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalScroll = section.offsetHeight - windowH;

    if (totalScroll <= 0) return;

    // How far user has scrolled vertically into the pinned section
    const currentScroll = -rect.top;
    let progress = currentScroll / totalScroll;
    progress = Math.max(0, Math.min(1, progress));

    // Calculate maximum horizontal travel needed for track
    const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth + 80);
    const translateX = progress * maxTranslate;

    track.style.transform = `translateX(-${translateX}px)`;

    if (progressBar) {
      progressBar.style.width = `${Math.round(progress * 100)}%`;
    }

    if (counter) {
      const activeIdx = Math.min(8, Math.max(1, Math.round(progress * 7) + 1));
      counter.innerText = `0${activeIdx} / 08`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  // Next / Prev step buttons for user convenience
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const totalScroll = section.offsetHeight - window.innerHeight;
      const step = totalScroll / 7;
      const targetScroll = window.scrollY + step;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const totalScroll = section.offsetHeight - window.innerHeight;
      const step = totalScroll / 7;
      const targetScroll = window.scrollY - step;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    });
  }
}

// 3. Dynamic Gymbox Pricing Matrix
let currentSelectedDuration = 12;

function initPricingCalculator() {
  const durationButtons = document.querySelectorAll(".duration-btn");
  durationButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      durationButtons.forEach(b => {
        b.classList.remove("gym-tab-active", "bg-[#ff0033]", "text-white");
        b.classList.add("bg-white/5", "text-zinc-400");
      });
      btn.classList.add("gym-tab-active", "bg-[#ff0033]", "text-white");
      btn.classList.remove("bg-white/5", "text-zinc-400");

      currentSelectedDuration = parseInt(btn.dataset.months);
      updatePricingCards();
    });
  });

  updatePricingCards();
}

function updatePricingCards() {
  const tiers = FIT24_DATA.pricingMatrix.tiers;
  const container = document.getElementById("pricing-cards-container");
  if (!container) return;

  const durationInfo = FIT24_DATA.pricingMatrix.durations.find(d => d.months === currentSelectedDuration) || { pauseLabel: "None" };

  const pauseBanner = document.getElementById("pause-badge-text");
  if (pauseBanner) {
    pauseBanner.innerHTML = currentSelectedDuration === 1 
      ? `<span class="text-zinc-400 font-mono">1 Month Commitment: <strong class="text-zinc-200">No pause days</strong> included.</span>`
      : `<span class="text-[#ff0033] font-mono font-bold tracking-wide uppercase">✓ INCLUDES <strong>${durationInfo.pauseLabel}</strong> (Min 7 days per block, split into 2 blocks max)</span>`;
  }

  container.innerHTML = tiers.map(tier => {
    const pricing = tier.pricing[currentSelectedDuration];
    const isPrime = tier.id === "prime";
    const isElite = tier.id === "elite";

    let borderClass = "border-2 border-white/15 hover:border-[#ff0033]";
    let badgeBg = "bg-white/10 text-white";
    let ctaClass = "bg-[#ff0033] hover:bg-white hover:text-black text-white";
    let glowClass = "";

    if (isPrime) {
      borderClass = "border-2 border-[#ff0033] glow-gymbox-red";
      badgeBg = "bg-[#ff0033] text-white";
      ctaClass = "bg-[#ff0033] hover:bg-white hover:text-black text-white font-black";
      glowClass = "relative";
    } else if (isElite) {
      borderClass = "border-2 border-yellow-400 hover:border-yellow-300";
      badgeBg = "bg-yellow-400 text-black";
      ctaClass = "bg-yellow-400 hover:bg-white hover:text-black text-black font-black";
      glowClass = "relative";
    }

    const whatsappMessage = encodeURIComponent(
      `Hi FIT24 Kanhangad! I'm ready to join the ${tier.name} tier for ${currentSelectedDuration} Months (₹${pricing.price.toLocaleString('en-IN')}). Let's get me onboarded!`
    );

    return `
      <div class="bg-[#0e0e12] ${borderClass} p-8 flex flex-col justify-between transition-all duration-300 ${glowClass}">
        ${isPrime ? `<div class="absolute -top-3.5 right-6 bg-[#ff0033] text-black px-3 py-0.5 text-[10px] font-black uppercase tracking-widest font-mono">LOUDEST CLUB CHOICE</div>` : ''}
        ${isElite ? `<div class="absolute -top-3.5 right-6 bg-yellow-400 text-black px-3 py-0.5 text-[10px] font-black uppercase tracking-widest font-mono">ALL-INCLUSIVE VIP</div>` : ''}

        <div>
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-[11px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase ${badgeBg}">
              ${tier.badge}
            </span>
            <span class="text-xs font-mono font-bold text-zinc-400">
              ${pricing.pauseDays > 0 ? `${pricing.pauseDays}d Pause` : 'No Pause'}
            </span>
          </div>

          <h3 class="text-5xl font-gymbox text-white mb-2 tracking-wide">
            ${tier.name}
          </h3>
          <p class="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-6">${tier.subtitle}</p>

          <!-- Price Display -->
          <div class="p-6 bg-black border border-white/10 mb-8">
            <div class="flex items-baseline gap-1">
              <span class="text-xl text-zinc-400 font-bold">₹</span>
              <span class="text-5xl sm:text-6xl font-gymbox text-white tracking-tight">
                ${pricing.price.toLocaleString('en-IN')}
              </span>
              <span class="text-xs text-zinc-400 font-mono ml-2">/ ${currentSelectedDuration} MO</span>
            </div>
            <div class="mt-3 flex items-center justify-between text-xs text-zinc-400 border-t border-white/10 pt-3 font-mono">
              <span>Approx. per month:</span>
              <span class="font-bold text-[#ff0033]">≈ ₹${pricing.perMonth.toLocaleString('en-IN')}/mo</span>
            </div>
          </div>

          <!-- Feature Inclusions -->
          <div class="space-y-3 mb-8">
            <div class="text-[11px] font-mono font-bold uppercase tracking-widest text-[#ff0033] mb-3">TIER PRIVILEGES:</div>
            ${tier.features.map(f => `
              <div class="flex items-start gap-3 text-xs text-zinc-300 font-medium">
                <span class="text-[#ff0033] font-bold text-sm">▶</span>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="space-y-3 pt-6 border-t border-white/10">
          <a href="https://wa.me/916238920442?text=${whatsappMessage}" target="_blank"
             class="w-full py-4 text-center font-gymbox text-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${ctaClass}">
            LOCK IN ${tier.name}
          </a>
          <button onclick="openLeadModal('${tier.name}', ${currentSelectedDuration}, ${pricing.price})"
                  class="w-full py-2.5 border border-white/20 hover:border-[#ff0033] text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all">
            Book Guest Pass / VIP Tour
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// =========================================================================
// 4. THE 3 CALCULATORS SYSTEM
// =========================================================================

function initCalculatorTabs() {
  const tabs = document.querySelectorAll(".calc-tab-btn");
  const panels = document.querySelectorAll(".calc-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.calc;
      tabs.forEach(t => {
        t.classList.remove("gym-tab-active", "bg-[#ff0033]", "text-white");
        t.classList.add("bg-white/5", "text-zinc-400");
      });
      tab.classList.add("gym-tab-active", "bg-[#ff0033]", "text-white");
      tab.classList.remove("bg-white/5", "text-zinc-400");

      panels.forEach(p => p.classList.add("hidden"));
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.remove("hidden");
    });
  });
}

// -------------------------------------------------------------
// CALCULATOR 1: Membership Value & Savings Calculator
// -------------------------------------------------------------
function initMembershipSavingsCalculator() {
  const tierSelect = document.getElementById("calc1-tier");
  const durationSelect = document.getElementById("calc1-duration");

  function calculateSavings() {
    if (!tierSelect || !durationSelect) return;
    const tierName = tierSelect.value;
    const durationMonths = parseInt(durationSelect.value);

    const tier = FIT24_DATA.pricingMatrix.tiers.find(t => t.name === tierName) || FIT24_DATA.pricingMatrix.tiers[0];
    const planInfo = tier.pricing[durationMonths];

    // Price if renewed monthly
    const monthlyRate1 = tier.pricing[1].price;
    const totalIfMonthly = monthlyRate1 * durationMonths;
    const actualPlanPrice = planInfo.price;
    const cashSavings = totalIfMonthly - actualPlanPrice;
    const dailyCost = Math.round(actualPlanPrice / (durationMonths * 30));

    // Valuation of free perks bundled in the tier:
    // Sauna: ₹600/session, Ice Bath: ₹600/session, Guest Pass: ₹500/pass, Cafe Credit: exact face value
    const saunaVal = tier.saunaQuota * 600;
    const iceVal = tier.iceBathQuota * 600;
    const guestVal = tier.guestPasses * 500;
    const cafeVal = tier.cafeCredit;
    const totalPerksVal = saunaVal + iceVal + guestVal + cafeVal;
    const netEffectiveGymAccess = Math.max(0, actualPlanPrice - totalPerksVal);

    // Update UI elements
    const elDaily = document.getElementById("calc1-out-daily");
    const elSavings = document.getElementById("calc1-out-savings");
    const elPerksVal = document.getElementById("calc1-out-perks");
    const elEffective = document.getElementById("calc1-out-effective");
    const elBreakdown = document.getElementById("calc1-out-breakdown");

    if (elDaily) elDaily.innerText = `₹${dailyCost}/day`;
    if (elSavings) elSavings.innerText = `Save ₹${cashSavings.toLocaleString('en-IN')}`;
    if (elPerksVal) elPerksVal.innerText = `₹${totalPerksVal.toLocaleString('en-IN')}`;
    if (elEffective) elEffective.innerText = `₹${netEffectiveGymAccess.toLocaleString('en-IN')}`;

    if (elBreakdown) {
      elBreakdown.innerHTML = `
        <div class="space-y-1 text-xs font-mono text-zinc-300">
          <div class="flex justify-between"><span>Plan Upfront Price:</span> <strong class="text-white">₹${actualPlanPrice.toLocaleString('en-IN')}</strong></div>
          <div class="flex justify-between"><span>Monthly Equivalent:</span> <strong class="text-[#ff0033]">≈ ₹${planInfo.perMonth.toLocaleString('en-IN')}/mo</strong></div>
          <div class="flex justify-between border-t border-white/10 pt-1 text-zinc-400">
            <span>Free Bundled Perks Value:</span>
            <span class="text-emerald-400 font-bold">+ ₹${totalPerksVal.toLocaleString('en-IN')} included free</span>
          </div>
          <div class="text-[11px] text-zinc-500 pl-2">
            • Sauna (${tier.saunaQuota} sessions): ₹${saunaVal} &bull; Ice Bath (${tier.iceBathQuota} plunges): ₹${iceVal}<br>
            • Café Credit: ₹${cafeVal} &bull; Guest Passes (${tier.guestPasses}): ₹${guestVal}
          </div>
        </div>
      `;
    }
  }

  if (tierSelect && durationSelect) {
    tierSelect.addEventListener("change", calculateSavings);
    durationSelect.addEventListener("change", calculateSavings);
    calculateSavings();
  }
}

// -------------------------------------------------------------
// CALCULATOR 2: Calorie & Macro Target Calculator + Café Recommender
// -------------------------------------------------------------
function initMacroCalculator() {
  const btn = document.getElementById("calc2-submit-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const gender = document.getElementById("calc2-gender").value;
    const age = parseInt(document.getElementById("calc2-age").value) || 25;
    const weight = parseFloat(document.getElementById("calc2-weight").value) || 75;
    const height = parseFloat(document.getElementById("calc2-height").value) || 175;
    const activity = parseFloat(document.getElementById("calc2-activity").value) || 1.55;
    const goal = document.getElementById("calc2-goal").value;

    // Mifflin-St Jeor Equation for BMR
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = (gender === "male") ? bmr + 5 : bmr - 161;

    // TDEE
    const tdee = Math.round(bmr * activity);

    // Adjust calories based on goal
    let targetCalories = tdee;
    let proteinPerKg = 2.0;

    if (goal === "shred") {
      targetCalories = tdee - 500;
      proteinPerKg = 2.4; // higher protein for muscle retention in deficit
    } else if (goal === "bulk") {
      targetCalories = tdee + 350;
      proteinPerKg = 2.0;
    } else if (goal === "combat") {
      targetCalories = tdee + 150;
      proteinPerKg = 2.2;
    }

    const proteinGrams = Math.round(weight * proteinPerKg);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);
    const carbGrams = Math.max(50, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));

    // Update Output UI
    const elCals = document.getElementById("calc2-out-calories");
    const elProtein = document.getElementById("calc2-out-protein");
    const elCarbs = document.getElementById("calc2-out-carbs");
    const elFats = document.getElementById("calc2-out-fats");
    const elCafe = document.getElementById("calc2-out-cafe-recommendation");

    if (elCals) elCals.innerText = `${targetCalories} kcal`;
    if (elProtein) elProtein.innerText = `${proteinGrams}g`;
    if (elCarbs) elCarbs.innerText = `${carbGrams}g`;
    if (elFats) elFats.innerText = `${fatGrams}g`;

    // Recommend from FIT24 Café menu based on goal
    let recommendedItem = FIT24_DATA.cafeMenu[0];
    if (goal === "shred") {
      recommendedItem = FIT24_DATA.cafeMenu[2]; // Smoked chicken breast macro bowl (48g protein)
    } else if (goal === "combat") {
      recommendedItem = FIT24_DATA.cafeMenu[0]; // Double Hydro-Whey Beast Shake
    }

    if (elCafe) {
      elCafe.innerHTML = `
        <div class="p-4 bg-black border border-[#ff0033]/40 rounded-xl">
          <div class="text-[10px] font-mono uppercase tracking-widest text-[#ff0033] font-bold mb-1">FIT24 CAFÉ FUEL MATCH</div>
          <h5 class="text-sm font-bold text-white">${recommendedItem.name}</h5>
          <div class="text-xs text-zinc-300 font-mono mt-1">
            ${recommendedItem.protein}g Protein &bull; ${recommendedItem.carbs}g Carbs &bull; ${recommendedItem.calories} kcal
          </div>
          <div class="text-[11px] text-zinc-400 mt-2">
            Order at reception desk: ₹${recommendedItem.price} (Auto 10%-15% discount for Prime & Elite + deduct from your complimentary credit!)
          </div>
        </div>
      `;
    }
  });
}

// -------------------------------------------------------------
// CALCULATOR 3: Contrast Therapy Recovery Protocol Calculator
// -------------------------------------------------------------
function initRecoveryProtocolCalculator() {
  const btn = document.getElementById("calc3-submit-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const workoutType = document.getElementById("calc3-workout").value;
    const experience = document.getElementById("calc3-experience").value;

    let saunaMins = 15;
    let saunaTemp = "80°C - 85°C";
    let iceMins = 3;
    let iceTemp = "6°C - 8°C";
    let rounds = 2;
    let tip = "Hydrate with 500ml electrolyte water before entering heat.";

    if (workoutType === "heavy") {
      saunaMins = 18;
      iceMins = 4;
      rounds = 2;
      tip = "End on the ice plunge to seal blood vessels and flush localized inflammation from heavy squatting.";
    } else if (workoutType === "combat") {
      saunaMins = 15;
      iceMins = 3;
      rounds = 3;
      tip = "High metabolic sparring: Contrast rounds trigger neurovascular pumps to flush upper body soreness.";
    } else if (workoutType === "rest") {
      saunaMins = 20;
      iceMins = 2;
      rounds = 1;
      tip = "Focus on parasympathetic nervous system reboot. End warm and relax in the Snooker lounge.";
    }

    if (experience === "rookie") {
      iceMins = Math.min(2, iceMins);
      rounds = 1;
      iceTemp = "8°C - 10°C";
    } else if (experience === "pro") {
      iceMins = 5;
      iceTemp = "4°C (Sub-Zero)";
      rounds = 3;
    }

    const outSauna = document.getElementById("calc3-out-sauna");
    const outIce = document.getElementById("calc3-out-ice");
    const outRounds = document.getElementById("calc3-out-rounds");
    const outTip = document.getElementById("calc3-out-tip");

    if (outSauna) outSauna.innerText = `${saunaMins} Mins @ ${saunaTemp}`;
    if (outIce) outIce.innerText = `${iceMins} Mins @ ${iceTemp}`;
    if (outRounds) outRounds.innerText = `${rounds} Contrast Cycles`;
    if (outTip) outTip.innerText = tip;
  });
}

// 4.1 Master Trainers & Coaches Dynamic Roster
function renderDynamicTrainers() {
  const container = document.getElementById("trainers-container");
  if (!container || !window.fit24Store) return;

  const trainers = (window.fit24Store.getTrainers() || []).filter(t => t.isActive !== false);
  if (trainers.length === 0) {
    container.innerHTML = `<div class="col-span-full py-8 text-center text-zinc-500 font-mono text-xs">No trainer profiles available.</div>`;
    return;
  }

  container.innerHTML = trainers.map(t => {
    let badgeBg = "bg-[#ff0033] text-white";
    if (t.badgeColor === "pink" || t.badgeColor === "purple") badgeBg = "bg-pink-600 text-white";
    else if (t.badgeColor === "cyan" || t.badgeColor === "blue") badgeBg = "bg-cyan-600 text-white";
    else if (t.badgeColor === "orange" || t.badgeColor === "yellow") badgeBg = "bg-amber-600 text-white";

    const firstName = t.name.split(' ')[0];
    const waMsg = encodeURIComponent(`Hi ${t.name}! I would like to book a 1-on-1 consultation and walkthrough with you at FIT24 Kanhangad regarding ${t.specialty}.`);

    return `
      <div class="bg-[#0e0e12] border-2 border-white/10 hover:border-[#ff0033] p-5 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden">
        <div class="relative h-64 mb-4 overflow-hidden border border-white/10 bg-black">
          <img src="${t.photoUrl}" alt="${t.name}" class="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          <span class="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${badgeBg}">
            ${t.badge || t.title}
          </span>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-2xl font-gymbox text-white tracking-wide uppercase group-hover:text-[#ff0033] transition-colors">${t.name}</h3>
            <div class="text-[11px] font-mono font-bold text-zinc-300 uppercase mt-0.5">${t.title}</div>
            <div class="inline-block mt-2 px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-mono text-[#ff0033] font-bold">
              ${t.specialty}
            </div>
            <p class="text-xs text-zinc-400 font-mono mt-3 line-clamp-3 leading-relaxed">
              ${t.bio}
            </p>
          </div>

          <div class="pt-4 mt-4 border-t border-white/10">
            <a href="https://wa.me/916238920442?text=${waMsg}" target="_blank"
               class="w-full py-2.5 bg-white/5 hover:bg-[#ff0033] border border-white/15 hover:border-[#ff0033] text-white text-xs font-mono font-bold uppercase text-center block transition-all">
              Book With ${firstName} →
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// 5. Dynamic Class Timetable with Day & Category Filters
let currentScheduleDay = "ALL";
let currentScheduleCategory = "ALL";

function initClassSchedule() {
  const dayBtns = document.querySelectorAll(".schedule-day-btn");
  const catBtns = document.querySelectorAll(".schedule-cat-btn");

  dayBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      dayBtns.forEach(b => {
        b.classList.remove("bg-[#ff0033]", "text-white");
        b.classList.add("bg-white/5", "text-zinc-300");
      });
      btn.classList.add("bg-[#ff0033]", "text-white");
      btn.classList.remove("bg-white/5", "text-zinc-300");
      currentScheduleDay = btn.dataset.day || "ALL";
      renderDynamicClasses();
    });
  });

  catBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      catBtns.forEach(b => {
        b.classList.remove("bg-white", "text-black");
        if (!b.classList.contains("border-pink-500/30")) {
          b.classList.add("bg-white/5", "text-zinc-300");
        }
      });
      btn.classList.add("bg-white", "text-black");
      btn.classList.remove("bg-white/5", "text-zinc-300");
      currentScheduleCategory = btn.dataset.category || "ALL";
      renderDynamicClasses();
    });
  });

  renderDynamicClasses();
}

function renderDynamicClasses() {
  const container = document.getElementById("schedule-container");
  if (!container || !window.fit24Store) return;

  let classes = window.fit24Store.getClasses() || [];

  if (currentScheduleDay !== "ALL") {
    classes = classes.filter(c => c.dayOfWeek === currentScheduleDay);
  }
  if (currentScheduleCategory !== "ALL") {
    if (currentScheduleCategory === "LADIES") {
      classes = classes.filter(c => c.isLadiesOnly || c.category === "LADIES");
    } else {
      classes = classes.filter(c => (c.category || '').toUpperCase().includes(currentScheduleCategory));
    }
  }

  if (classes.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-[#0e0e12] border-2 border-white/10 text-zinc-500 font-mono text-xs">
        No scheduled sessions found for ${currentScheduleDay} (${currentScheduleCategory}). Check with reception for private cage or mat training slots.
      </div>
    `;
    return;
  }

  container.innerHTML = classes.map(item => {
    let catBadgeClass = "bg-[#ff0033]/20 text-[#ff0033] border-[#ff0033]/30";
    if (item.category === "LADIES" || item.isLadiesOnly) {
      catBadgeClass = "bg-pink-500/20 text-pink-300 border-pink-500/30";
    } else if (item.category === "YOGA") {
      catBadgeClass = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    } else if (item.category === "STRENGTH") {
      catBadgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/30";
    }

    const waText = encodeURIComponent(`Hi FIT24! I would like to reserve my spot for ${item.className} on ${item.dayOfWeek} at ${item.startTime} with Coach ${item.coachName}.`);

    return `
      <div class="bg-[#0e0e12] border-2 border-white/10 hover:border-[#ff0033] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all group">
        <div class="flex items-start md:items-center gap-4">
          <div class="w-14 h-14 bg-black border border-white/15 flex flex-col items-center justify-center font-gymbox text-white group-hover:border-[#ff0033] transition-colors">
            <span class="text-xs text-[#ff0033] font-mono font-bold leading-none">${item.dayOfWeek}</span>
            <span class="text-lg leading-none mt-1 font-gymbox">${item.startTime.split(' ')[0]}</span>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 border uppercase ${catBadgeClass}">
                ${item.category}
              </span>
              ${item.isLadiesOnly ? `<span class="text-[10px] font-mono font-bold px-2 py-0.5 bg-pink-500/20 text-pink-300 border border-pink-500/30">🌸 LADIES-ONLY</span>` : ''}
              <span class="text-xs text-zinc-400 font-mono">${item.startTime} · ${item.duration} · Intensity: ${item.intensity}</span>
            </div>
            <h4 class="text-lg font-bold text-white font-gymbox tracking-wide uppercase">${item.className}</h4>
            <p class="text-xs text-zinc-400 font-mono">Coach: <strong class="text-zinc-200">${item.coachName}</strong></p>
          </div>
        </div>
        <div>
          <a href="https://wa.me/916238920442?text=${waText}" target="_blank"
             class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff0033] hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase transition-all shadow-md">
            Reserve Spot →
          </a>
        </div>
      </div>
    `;
  }).join("");
}

// 5.1 Dynamic Blog & Field Journal
function renderDynamicBlog() {
  const container = document.getElementById("blog-posts-container");
  if (!container || !window.fit24Store) return;

  const posts = (window.fit24Store.getBlogPosts() || []).filter(p => p.isPublished !== false);
  if (posts.length === 0) {
    container.innerHTML = `<div class="col-span-full py-8 text-center text-zinc-500 font-mono text-xs">No journal articles published yet.</div>`;
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="bg-[#0e0e12] border-2 border-white/10 hover:border-[#ff0033] flex flex-col justify-between group transition-all duration-300 overflow-hidden">
      <div class="relative h-48 overflow-hidden bg-black border-b border-white/10">
        <img src="${post.coverImage}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0">
        <span class="absolute top-3 left-3 px-2 py-0.5 bg-black/90 border border-white/20 text-white text-[10px] font-mono font-bold uppercase">
          ${post.category}
        </span>
      </div>

      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
            <span>${post.createdAt || 'Latest'}</span>
            <span class="text-[#ff0033] font-bold">${post.readTime}</span>
          </div>
          <h3 class="text-xl font-gymbox text-white tracking-wide uppercase leading-snug group-hover:text-[#ff0033] transition-colors mb-3">
            ${post.title}
          </h3>
          <p class="text-xs text-zinc-400 font-mono line-clamp-3 leading-relaxed mb-4">
            ${post.excerpt}
          </p>
        </div>

        <div class="pt-4 border-t border-white/10">
          <button onclick="window.openBlogReader('${post.id}')" 
                  class="text-xs font-mono font-bold text-[#ff0033] hover:text-white flex items-center gap-1.5 transition-colors">
            Read Full Intel <span>→</span>
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

window.openBlogReader = function(postId) {
  const posts = window.fit24Store.getBlogPosts() || [];
  const post = posts.find(p => p.id === postId);
  const modal = document.getElementById("blog-reader-modal");
  const content = document.getElementById("blog-reader-content");
  if (!modal || !content || !post) return;

  content.innerHTML = `
    <div>
      <span class="text-xs font-mono font-bold text-[#ff0033] uppercase tracking-widest">// ${post.category} · ${post.readTime}</span>
      <h2 class="text-3xl sm:text-4xl font-gymbox text-white uppercase tracking-tight mt-2 mb-4 leading-tight">${post.title}</h2>
      <div class="relative h-64 sm:h-80 w-full mb-6 border border-white/15 overflow-hidden">
        <img src="${post.coverImage}" alt="${post.title}" class="w-full h-full object-cover">
      </div>
      <p class="text-sm font-mono text-zinc-300 leading-relaxed font-bold mb-4 border-l-2 border-[#ff0033] pl-3 italic">
        ${post.excerpt}
      </p>
      <div class="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line">
        ${post.content}
      </div>
      <div class="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
        <span class="text-xs font-mono text-zinc-500">FIT24 Athletic Intel · TB Road, Hosdurg, Kanhangad</span>
        <button onclick="document.getElementById('blog-reader-modal').classList.add('hidden')" class="px-4 py-2 bg-[#ff0033] text-white font-mono text-xs uppercase font-bold hover:bg-white hover:text-black transition-all">
          Close Intel
        </button>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
};

// 6. Member Pass Lookup Modal
function initMemberPassModal() {
  const lookupBtn = document.getElementById("lookup-pass-btn");
  const input = document.getElementById("pass-search-input");
  const resultCard = document.getElementById("pass-result-card");

  if (!lookupBtn) return;

  lookupBtn.addEventListener("click", () => {
    const query = input.value.trim();
    if (!query) {
      alert("Enter your registered phone number or Member ID (e.g. F24-1001)");
      return;
    }

    const member = window.fit24Store.getMember(query);
    if (!member) {
      alert("No active member found with this ID or phone number. Check at reception.");
      return;
    }

    renderMemberCard(member, resultCard);
  });
}

function renderMemberCard(member, container) {
  let tierBadge = member.tier === "ELITE" 
    ? "bg-yellow-400 text-black border-yellow-400" 
    : member.tier === "PRIME" 
    ? "bg-[#ff0033] text-white border-[#ff0033]" 
    : "bg-white text-black border-white";

  container.classList.remove("hidden");
  container.innerHTML = `
    <div class="bg-black border-2 border-[#ff0033] p-6 text-white shadow-2xl relative overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="text-[10px] uppercase font-mono tracking-widest text-[#ff0033] font-bold">MEMBER DIGITAL PASS</span>
          <h4 class="text-2xl font-gymbox tracking-wider text-white">${member.name}</h4>
        </div>
        <span class="px-3 py-1 text-xs font-gymbox uppercase border ${tierBadge}">
          ${member.tier} VIP
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs mb-4 p-3 bg-white/5 border border-white/10 font-mono">
        <div><span class="text-zinc-500 block text-[10px]">ID:</span> <strong class="text-white">${member.id}</strong></div>
        <div><span class="text-zinc-500 block text-[10px]">STATUS:</span> <strong class="${member.isPaused ? 'text-amber-400' : 'text-emerald-400'}">${member.isPaused ? '⏸ PAUSED' : '● ACTIVE'}</strong></div>
        <div><span class="text-zinc-500 block text-[10px]">EXPIRY:</span> <strong class="text-zinc-300">${member.endDate}</strong></div>
        <div><span class="text-zinc-500 block text-[10px]">CAFÉ WALLET:</span> <strong class="text-[#ff0033]">₹${member.cafeCredit.toFixed(2)}</strong></div>
      </div>

      <div class="space-y-2 mb-4 font-mono text-xs">
        <div class="flex justify-between">
          <span class="text-zinc-400">🧖 Sauna Sessions:</span>
          <strong class="text-white">${member.saunaTotal - member.saunaUsed} / ${member.saunaTotal} left</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-400">🧊 Ice Bath Plunges:</span>
          <strong class="text-white">${member.iceBathTotal - member.iceBathUsed} / ${member.iceBathTotal} left</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-400">🎟 Guest Passes:</span>
          <strong class="text-white">${member.guestPassesTotal - member.guestPassesUsed} / ${member.guestPassesTotal} left</strong>
        </div>
      </div>

      <div class="pt-3 border-t border-white/10 flex items-center justify-between">
        <div class="text-[10px] font-mono text-zinc-400">
          Present at Front Desk<br><span class="text-[#ff0033]">TB Road, Hosdurg, Kanhangad</span>
        </div>
        <div class="w-14 h-14 bg-white p-1.5 flex flex-col justify-between items-center shadow-lg">
          <div class="w-full flex justify-between"><div class="w-2.5 h-2.5 bg-black"></div><div class="w-2.5 h-2.5 bg-black"></div></div>
          <span class="text-[7px] font-mono text-black font-black uppercase">${member.id}</span>
          <div class="w-full flex justify-between"><div class="w-2.5 h-2.5 bg-black"></div><div class="w-2.5 h-2.5 bg-black"></div></div>
        </div>
      </div>
    </div>
  `;
}

// 7. Lead Tour Modal
function initLeadModal() {
  let selectedPlanTitle = "VIP Tour & Club Pass";

  window.openLeadModal = function(tierName, months, price) {
    const modal = document.getElementById("lead-modal");
    if (!modal) return;
    selectedPlanTitle = tierName ? `${tierName} Plan (${months} Months - ₹${price ? price.toLocaleString('en-IN') : ''})` : "VIP Tour & Club Pass";
    const infoEl = document.getElementById("lead-plan-info");
    if (infoEl) infoEl.innerText = selectedPlanTitle;
    modal.classList.remove("hidden");
  };

  window.closeLeadModal = function() {
    const modal = document.getElementById("lead-modal");
    if (modal) modal.classList.add("hidden");
  };

  const form = document.getElementById("lead-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("lead-name").value.trim();
      const phone = document.getElementById("lead-phone").value.trim();
      const email = document.getElementById("lead-email") ? document.getElementById("lead-email").value.trim() : "";
      const timePref = document.getElementById("lead-time") ? document.getElementById("lead-time").value : "";

      if (window.fit24Store) {
        window.fit24Store.addLead({
          name,
          phone,
          email,
          interest: selectedPlanTitle,
          source: "Website VIP Tour",
          status: "New",
          notes: `Time preference: ${timePref}`
        });
      }

      alert(`🔥 HELL YEAH, ${name.toUpperCase()}!\n\nYour VIP Pass inquiry for ${selectedPlanTitle} has been received.\n\nOur front desk team at TB Road, Hosdurg, Kanhangad will connect with you via WhatsApp (${phone}) shortly to confirm your walkthrough time!`);
      form.reset();
      closeLeadModal();
    });
  }
}
