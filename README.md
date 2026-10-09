# FIT24 — Premium Fitness Club Platform & Admin ERP

> **Location**: TB Road, Hosdurg, Kanhangad, Kasaragod, Kerala  
> **Aesthetic Tone**: Gymbox London Electric Red (`#ff0033`) & Matte Black (`#050505`)  
> **Contact**: WhatsApp: [+91 62389 20442](https://wa.me/916238920442) | Instagram: [@fit24premium](https://instagram.com/fit24premium)

---

## ⚡ Project Overview

**FIT24** is an enterprise-grade fitness club web ecosystem designed to replace expensive subscription software (CultOS, GymMaster, Mindbody) with a dedicated in-house web platform and cloud-connected ERP.

Built with **Gymbox London** energy, bold condensed typography (`font-gymbox`), high-voltage neon accents, and connected to **Supabase Cloud Database** with real-time updates and offline-first storage.

---

## 🌟 Key Features

### 1. High-Voltage Public Website (`index.html`)
- **Hero & Grand Opening Countdown**: Live countdown to Sunday, 18 October 2026.
- **8 Discipline Zones Horizontal Showcase**:
  - Regulation Boxing Ring, Heavy Iron Biomechanics, Finnish Sauna, Sub-Zero Ice Bath, Yoga & Mobility, Snooker Lounge, Fit Café, and Ladies-Only Functional Zone.
  - Hover zoom reveal effects and seamless scroll exploration.
- **Interactive Athletic Calculators**:
  - **Dynamic Membership Tier Pricing**: 1, 3, 6, 12, and 24-month duration selector with per-month breakdowns and pause allowances for Pro, Prime, and Elite tiers.
  - **1RM Strength Calculator**: Epley & Brzycki formula 1-Rep Max calculations with working percentage targets (50%–95%).
  - **TDEE & Calorie Deficit Calculator**: Mifflin-St Jeor metabolic formula with activity multipliers and goal-specific macronutrient targets.
- **Trainer Profile Showcase**: Active roster of master drillmasters, credentials, specialty tags, and direct WhatsApp 1-on-1 PT consultation links.
- **Group Class Weekly Timetable**: Day-by-day scheduler with category filters and dedicated **🌸 Ladies-Only Access (11:00 AM – 03:00 PM)**.
- **FIT24 Field Journal (Blog)**: Recovery science guides, Fit Café nutrition breakdowns, and an on-page modal article reader.
- **Digital Pass Instant Lookup**: Instant card lookup for members to verify active quota balances on the fly.

### 2. Comprehensive Admin ERP (`admin.html`)
- **Live Floor Occupancy & KPI Dashboard**: Real-time attendance counts and floor capacity tracking.
- **Express Attendance Terminal**: Rapid search-by-phone/name and simulated QR scanner check-in with pause and expiry enforcement.
- **Member CRM Directory**: Full client management across Pro, Prime, and Elite tiers with dossiers and expiry tracking.
- **Lead Pipeline Management**: Prospect tracking across pipeline stages (`New`, `Contacted`, `Tour Scheduled`, `Trial Attended`, `Converted`, `Lost`) with one-click conversion to active membership and pre-filled WhatsApp walkthrough invites.
- **Trainer Profile Management**: Add, edit, toggle active status, and manage coach badges and credentials.
- **Group Class Timetable Scheduler**: Weekly session management, intensity levels, assigned drillmasters, and ladies-only hour controls.
- **Blog & Field Journal Desk**: Draft, edit, publish live, and preview athletic intelligence articles.
- **Facility Quota Passbook**: Deduct Sauna sessions, Sub-Zero Cold Plunge, and Guest Passes with real-time audit logs.
- **Membership Pause Engine**: Brochure-compliant pause controls (min 7 days, max 2 split blocks) that automatically freeze membership countdowns and extend expiry dates.
- **Fit Café POS**: Member billing with automated tier discounts (10% Prime, 15% Elite) and wallet credit deductions.
- **Cloud & Offline Sync**: Full two-way sync with Supabase REST API & Realtime channels, plus local storage fallback.

### 3. Mobile Member Digital Pass (`member.html`)
- Smartphone-optimized digital card with live QR code, remaining sauna/ice bath counts, remaining café credits, and direct WhatsApp actions.

---

## 🚀 Live Cloud Integration (Supabase)

This project connects to Supabase with the following schema:
- `members`: Membership CRM records, tiers, wallet balances, quotas.
- `attendances`: Daily check-in timestamps.
- `facility_logs`: Sauna, Ice Bath, and Guest Pass quota deductions.
- `cafe_logs`: Fit Café POS orders and wallet deductions.
- `leads`: Lead acquisition pipeline and prospect inquiries.
- `trainers`: Coach directory, specialties, photos, and floor status.
- `classes`: Weekly timetable, day, time, coach, category, intensity.
- `blog_posts`: Field journal articles, categories, and published state.

SQL schema definition is included in [`supabase_schema.sql`](./supabase_schema.sql).

---

## 🛠️ Deploying to GitHub & GitHub Pages

### 1. Initialize Local Git Repository
```bash
git init
git add .
git commit -m "feat: initial release of FIT24 website and admin ERP"
```

### 2. Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `fit24` or `fit24-club`).
3. Keep it **Public** (required for free GitHub Pages).
4. Do **not** check "Initialize with README" (since one already exists).
5. Click **Create repository**.

### 3. Push Local Code to GitHub
Replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub repository details:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### 4. Enable GitHub Pages (Instant Free Hosting)
1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Branch**, select `main` branch and `/ (root)` folder.
3. Click **Save**.
4. Within 1–2 minutes, your website will be live at:
   `https://YOUR_USERNAME.github.io/REPO_NAME/`

---

## 📂 File Structure

```
fit24/
├── index.html            # Gymbox-style Public Website, Calculators & Sections
├── admin.html            # All-in-One Admin ERP, CRM, Timetable, Leads, Quota Passbook
├── member.html           # Mobile Digital Pass & Quota Card for Members
├── supabase_schema.sql   # Complete Supabase PostgreSQL Schema & Seed Data
├── README.md             # Project documentation and deployment guide
├── .gitignore            # Git ignore file for clean repo
├── css/
│   └── style.css         # Gymbox London dark theme, neon glows, typography
└── js/
    ├── data.js           # Offline-first store, brochure matrix, business logic
    ├── supabase.js       # Supabase Cloud Client with CRUD & Realtime sync
    ├── app.js            # Frontend calculators, sliders, timetable & blog reader
    └── admin.js          # Admin ERP desks, attendance, pause engine, timetable, CRM
```
