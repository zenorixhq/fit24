// FIT24 - Core Data Store & Business Logic
// Gymbox Theme & Accurate to the FIT24 Brochure (Kanhangad Grand Opening: 18 Oct 2026)

const FIT24_DATA = {
  clubInfo: {
    name: "FIT24",
    tagline: "PREMIUM FITNESS CLUB",
    slogan: "TRAIN. RECOVER. UNWIND.",
    gymboxPunchline: "THE ANTIDOTE TO BORING GYMS. ANYTHING GOES.",
    location: "TB Road, Hosdurg, Kanhangad, Kasaragod",
    grandOpening: "2026-10-18T06:00:00+05:30",
    phone: "+91 62389 20442",
    instagram: "@fit24premium",
    whatsappLink: "https://wa.me/916238920442"
  },

  // 8 Facilities from Brochure with Curated Dark Aesthetic Images
  facilities: [
    {
      id: "gym-floor",
      num: "01",
      name: "GYM FLOOR",
      tagline: "Strength and cardio zones, with lockers and changing rooms.",
      desc: "Industrial-grade biomechanic machines, calibrated competition plates, Olympic lifting platforms, functional astro-turf, and private locker suites.",
      category: "STRENGTH & CARDIO",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
      tags: ["Heavy Iron", "Olympic Platforms", "Lockers & Showers", "Cardio Suite"],
      includedIn: ["PRO", "PRIME", "ELITE"]
    },
    {
      id: "boxing",
      num: "02",
      name: "BOXING RING",
      tagline: "A full boxing ring and boxing training.",
      desc: "Regulation competition boxing ring, combat teardrop bags, speed balls, and coached sparring sessions to build devastating fight conditioning.",
      category: "COMBAT & FIGHT",
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80",
      tags: ["Full Boxing Ring", "Sparring", "Heavy Bags", "Fight Conditioning"],
      includedIn: ["PRO", "PRIME", "ELITE"]
    },
    {
      id: "yoga-zumba",
      num: "03",
      name: "YOGA AND ZUMBA",
      tagline: "Group classes to move, stretch and sweat.",
      desc: "High-energy club sound studio featuring daily certified instructors for Power Vinyasa Yoga, mobility flows, and high-octane Zumba dance cardio.",
      category: "SWEAT & HOLISTIC",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
      tags: ["Group Rave", "Power Yoga", "Zumba Dance", "Mobility"],
      includedIn: ["PRO", "PRIME", "ELITE"]
    },
    {
      id: "sauna",
      num: "04",
      name: "DRY SAUNA",
      tagline: "Heat to loosen up after a hard session.",
      desc: "Finnish dry heat chamber (80°C - 90°C) to flush lactic acid, relax tight fascial tissue, increase blood flow, and accelerate muscular recovery.",
      category: "THERMAL RECOVERY",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
      tags: ["85°C Finnish Heat", "Toxin Flush", "Fascia Release"],
      includedIn: ["PRIME (6 Sessions)", "ELITE (12 Sessions)"]
    },
    {
      id: "ice-bath",
      num: "05",
      name: "ICE BATH PLUNGE",
      tagline: "Cold immersion to speed up recovery.",
      desc: "Dedicated sub-zero athletic cold immersion plunge regulated at 4°C - 8°C for contrast therapy, blunting inflammation and building mental grit.",
      category: "THERMAL RECOVERY",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
      tags: ["4°C Cold Plunge", "Contrast Therapy", "Anti-Inflammation"],
      includedIn: ["PRIME (6 Sessions)", "ELITE (12 Sessions)"]
    },
    {
      id: "physiotherapy",
      num: "06",
      name: "PHYSIOTHERAPY",
      tagline: "Recovery and rehab support.",
      desc: "In-house clinical sports physiotherapist for gait analysis, postural correction, dry needling, cupping, and targeted athletic injury rehabilitation.",
      category: "CLINICAL REHAB",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      tags: ["Sports Rehab", "Postural Assessment", "Corrective Physio"],
      includedIn: ["PRO", "PRIME", "ELITE (Priority Booking)"]
    },
    {
      id: "snooker",
      num: "07",
      name: "SNOOKER LOUNGE",
      tagline: "Tables for the after-session game.",
      desc: "Full tournament-size regulation snooker tables in a moody executive lounge to decompress, socialize, and compete with members after workouts.",
      category: "CLUB SOCIAL",
      image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80",
      tags: ["Tournament Tables", "Social Lounge", "After-Session Game"],
      includedIn: ["10% OFF Prime", "15% OFF Elite"]
    },
    {
      id: "cafe",
      num: "08",
      name: "FIT24 CAFÉ & FUEL BAR",
      tagline: "Fuel before and fuel after.",
      desc: "Clean nutrition kitchen serving artisanal pre-workout espresso, cold-pressed recovery elixirs, isolate protein shakes, and macro-counted clean meals.",
      category: "NUTRITION & FUEL",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      tags: ["Whey Shakes", "Clean Meals", "Artisanal Espresso"],
      includedIn: ["₹500 Credit Pro", "₹1,000 Credit Prime", "₹2,000 Credit Elite"]
    }
  ],

  // Pricing Matrix from Brochure Page 3 & 4
  pricingMatrix: {
    tiers: [
      {
        id: "pro",
        name: "PRO",
        badge: "ESSENTIAL ACCESS",
        subtitle: "Everything you need to train.",
        color: "red",
        saunaQuota: 0,
        iceBathQuota: 0,
        guestPasses: 1,
        cafeCredit: 500,
        cafeDiscount: 0,
        snookerDiscount: 0,
        features: [
          "Full gym access & free-weights floor",
          "Lockers and private changing suites",
          "Comprehensive fitness guidance",
          "1 complimentary guest pass",
          "₹500 FIT24 Café credit"
        ],
        pricing: {
          1: { price: 2399, perMonth: 2399, pauseDays: 0 },
          3: { price: 6499, perMonth: 2166, pauseDays: 15 },
          6: { price: 11499, perMonth: 1917, pauseDays: 30 },
          12: { price: 19999, perMonth: 1667, pauseDays: 45 },
          24: { price: 35999, perMonth: 1500, pauseDays: 60 }
        }
      },
      {
        id: "prime",
        name: "PRIME",
        badge: "MOST POPULAR",
        subtitle: "Train, then recover.",
        color: "red-hot",
        saunaQuota: 6,
        iceBathQuota: 6,
        guestPasses: 2,
        cafeCredit: 1000,
        cafeDiscount: 10,
        snookerDiscount: 10,
        features: [
          "Everything in Pro tier",
          "6 sauna recovery sessions",
          "6 ice bath plunge sessions",
          "10% café food & drink discount",
          "10% snooker lounge discount",
          "2 complimentary guest passes",
          "₹1,000 FIT24 Reward Credit"
        ],
        pricing: {
          1: { price: 3599, perMonth: 3599, pauseDays: 0 },
          3: { price: 9699, perMonth: 3233, pauseDays: 15 },
          6: { price: 17299, perMonth: 2883, pauseDays: 30 },
          12: { price: 29999, perMonth: 2500, pauseDays: 45 },
          24: { price: 53999, perMonth: 2250, pauseDays: 60 }
        }
      },
      {
        id: "elite",
        name: "ELITE",
        badge: "ALL-INCLUSIVE VIP",
        subtitle: "Everything, first.",
        color: "black-gold",
        saunaQuota: 12,
        iceBathQuota: 12,
        guestPasses: 3,
        cafeCredit: 2000,
        cafeDiscount: 15,
        snookerDiscount: 15,
        features: [
          "Everything in Prime tier",
          "12 sauna recovery sessions",
          "12 ice bath plunge sessions",
          "15% café food & drink discount",
          "15% snooker lounge discount",
          "3 complimentary guest passes",
          "₹2,000 FIT24 Reward Credit",
          "Priority booking on classes & physio",
          "Exclusive FIT24 Black Member Gift"
        ],
        pricing: {
          1: { price: 5199, perMonth: 5199, pauseDays: 0 },
          3: { price: 13999, perMonth: 4666, pauseDays: 15 },
          6: { price: 24999, perMonth: 4167, pauseDays: 30 },
          12: { price: 42999, perMonth: 3583, pauseDays: 45 },
          24: { price: 77999, perMonth: 3250, pauseDays: 60 }
        }
      }
    ],

    durations: [
      { months: 1, label: "1 Month", pauseLabel: "None", note: "Standard" },
      { months: 3, label: "3 Months", pauseLabel: "15 days pause", note: "15d Pause" },
      { months: 6, label: "6 Months", pauseLabel: "30 days pause", note: "30d Pause" },
      { months: 12, label: "12 Months", pauseLabel: "45 days pause", note: "Best Seller" },
      { months: 24, label: "24 Months", pauseLabel: "60 days pause", note: "Lowest / Mo" }
    ],

    pauseRules: [
      "Pause allowed on any plan of 3 months or more.",
      "Minimum 7 days per pause.",
      "Request it 3 days ahead on WhatsApp or at the front desk.",
      "Take it once, or split it into two blocks.",
      "Pause before your plan ends. Unused pause days are not refunded.",
      "Sauna and ice bath sessions pause with your membership."
    ],

    goodToKnow: [
      "Plans can be transferred to a family member. A transfer fee applies.",
      "No cash refunds after the first 7 days.",
      "Per-month figures are approximate, for comparison."
    ]
  },

  // Sample Café Menu for Macro Matcher
  cafeMenu: [
    { name: "Double Hydro-Whey Beast Shake", protein: 44, carbs: 12, fats: 4, calories: 260, price: 220, type: "POST_WORKOUT" },
    { name: "Creatine Nitro Pre-Shot + Double Espresso", protein: 5, carbs: 8, fats: 0, calories: 52, price: 140, type: "PRE_WORKOUT" },
    { name: "Smoked Chicken Breast Macro Bowl", protein: 48, carbs: 45, fats: 10, calories: 462, price: 320, type: "CLEAN_MEAL" },
    { name: "Paneer Power Bowl & Quinoa", protein: 32, carbs: 50, fats: 14, calories: 454, price: 280, type: "CLEAN_MEAL" },
    { name: "Cold-Pressed Recovery Green Detox Juice", protein: 3, carbs: 18, fats: 0, calories: 84, price: 160, type: "RECOVERY" }
  ],

  // Sample seed members for the Client Management App ERP
  initialMembers: [
    {
      id: "F24-1001",
      name: "Rahul Nambiar",
      phone: "+91 98471 23456",
      email: "rahul.nambiar@gmail.com",
      gender: "Male",
      tier: "ELITE",
      durationMonths: 12,
      startDate: "2026-10-18",
      endDate: "2027-10-18",
      status: "ACTIVE",
      amountPaid: 42999,
      saunaTotal: 12,
      saunaUsed: 3,
      iceBathTotal: 12,
      iceBathUsed: 4,
      guestPassesTotal: 3,
      guestPassesUsed: 1,
      cafeCredit: 1650,
      cafeDiscount: 15,
      snookerDiscount: 15,
      totalPauseAllowed: 45,
      pauseDaysUsed: 0,
      pauseBlocksUsed: 0,
      isPaused: false,
      pauseHistory: [],
      lastCheckIn: "2026-10-24T08:15:00",
      totalVisits: 14
    },
    {
      id: "F24-1002",
      name: "Dr. Anjali Menon",
      phone: "+91 94472 88990",
      email: "anjali.menon@hospital.org",
      gender: "Female",
      tier: "PRIME",
      durationMonths: 6,
      startDate: "2026-10-18",
      endDate: "2027-04-18",
      status: "ACTIVE",
      amountPaid: 17299,
      saunaTotal: 6,
      saunaUsed: 2,
      iceBathTotal: 6,
      iceBathUsed: 2,
      guestPassesTotal: 2,
      guestPassesUsed: 0,
      cafeCredit: 750,
      cafeDiscount: 10,
      snookerDiscount: 10,
      totalPauseAllowed: 30,
      pauseDaysUsed: 0,
      pauseBlocksUsed: 0,
      isPaused: false,
      pauseHistory: [],
      lastCheckIn: "2026-10-24T07:45:00",
      totalVisits: 8
    },
    {
      id: "F24-1003",
      name: "Mohammed Shafi",
      phone: "+91 97455 33221",
      email: "shafi.k@enterprise.com",
      gender: "Male",
      tier: "PRO",
      durationMonths: 12,
      startDate: "2026-10-18",
      endDate: "2027-10-18",
      status: "ACTIVE",
      amountPaid: 19999,
      saunaTotal: 0,
      saunaUsed: 0,
      iceBathTotal: 0,
      iceBathUsed: 0,
      guestPassesTotal: 1,
      guestPassesUsed: 1,
      cafeCredit: 120,
      cafeDiscount: 0,
      snookerDiscount: 0,
      totalPauseAllowed: 45,
      pauseDaysUsed: 0,
      pauseBlocksUsed: 0,
      isPaused: false,
      pauseHistory: [],
      lastCheckIn: "2026-10-23T18:30:00",
      totalVisits: 19
    },
    {
      id: "F24-1004",
      name: "Sneha Rao",
      phone: "+91 96330 11223",
      email: "sneha.rao@design.in",
      gender: "Female",
      tier: "PRIME",
      durationMonths: 3,
      startDate: "2026-10-18",
      endDate: "2027-01-25",
      status: "PAUSED",
      amountPaid: 9699,
      saunaTotal: 6,
      saunaUsed: 1,
      iceBathTotal: 6,
      iceBathUsed: 1,
      guestPassesTotal: 2,
      guestPassesUsed: 0,
      cafeCredit: 900,
      cafeDiscount: 10,
      snookerDiscount: 10,
      totalPauseAllowed: 15,
      pauseDaysUsed: 7,
      pauseBlocksUsed: 1,
      isPaused: true,
      currentPauseStart: "2026-10-22",
      pauseHistory: [
        { startDate: "2026-10-22", days: 7, reason: "Family trip", status: "ONGOING" }
      ],
      lastCheckIn: "2026-10-21T19:00:00",
      totalVisits: 4
    },
    {
      id: "F24-1005",
      name: "Arjun Balakrishnan",
      phone: "+91 94001 77665",
      email: "arjun.b@techkasaragod.com",
      gender: "Male",
      tier: "ELITE",
      durationMonths: 24,
      startDate: "2026-10-18",
      endDate: "2028-10-18",
      status: "ACTIVE",
      amountPaid: 77999,
      saunaTotal: 12,
      saunaUsed: 1,
      iceBathTotal: 12,
      iceBathUsed: 2,
      guestPassesTotal: 3,
      guestPassesUsed: 0,
      cafeCredit: 2000,
      cafeDiscount: 15,
      snookerDiscount: 15,
      totalPauseAllowed: 60,
      pauseDaysUsed: 0,
      pauseBlocksUsed: 0,
      isPaused: false,
      pauseHistory: [],
      lastCheckIn: "2026-10-24T06:30:00",
      totalVisits: 22
    }
  ],

  initialAttendances: [
    { id: "att-1", memberId: "F24-1005", name: "Arjun Balakrishnan", tier: "ELITE", time: "06:30 AM", date: "Today", method: "QR Code" },
    { id: "att-2", memberId: "F24-1002", name: "Dr. Anjali Menon", tier: "PRIME", time: "07:45 AM", date: "Today", method: "Fast Search" },
    { id: "att-3", memberId: "F24-1001", name: "Rahul Nambiar", tier: "ELITE", time: "08:15 AM", date: "Today", method: "QR Code" }
  ],

  initialFacilityLogs: [
    { id: "log-1", memberId: "F24-1001", memberName: "Rahul Nambiar", facility: "Ice Bath", time: "Today 09:00 AM", staff: "Reception Desk", remaining: "8 remaining" },
    { id: "log-2", memberId: "F24-1002", memberName: "Dr. Anjali Menon", facility: "Sauna", time: "Today 08:30 AM", staff: "Front Desk", remaining: "4 remaining" },
    { id: "log-3", memberId: "F24-1005", memberName: "Arjun Balakrishnan", facility: "Ice Bath", time: "Today 07:15 AM", staff: "Reception Desk", remaining: "10 remaining" }
  ],

  initialCafeLogs: [
    { id: "cafe-1", memberId: "F24-1001", memberName: "Rahul Nambiar", tier: "ELITE", item: "Double Hydro-Whey Beast Shake + Espresso", billGross: 360, discountApplied: "15% (-₹54)", netPaid: 306, paidVia: "FIT24 Wallet Credit", time: "Today 09:15 AM" }
  ],

  initialLeads: [
    { id: "lead-1", name: "Kavya Suresh", phone: "+91 98475 44332", email: "kavya@gmail.com", interest: "PRIME (Gym & Sauna)", source: "Website VIP Tour", status: "New", notes: "Prefers morning tour at 8:00 AM", createdAt: "Today" },
    { id: "lead-2", name: "Fahad Rahman", phone: "+91 97460 11998", email: "fahad.r@gmail.com", interest: "Boxing Ring & Combat", source: "Walk-In Front Desk", status: "Contacted", notes: "Interested in technical sparring coach", createdAt: "Yesterday" },
    { id: "lead-3", name: "Vishnu Prasad", phone: "+91 94462 77881", email: "", interest: "ELITE (12 Months)", source: "WhatsApp Club Desk", status: "Tour Scheduled", notes: "Visiting Saturday 6 PM with friend", createdAt: "2 days ago" }
  ],

  initialTrainers: [
    {
      id: "ba89f66e-c912-4e11-a7bb-a7b6e5731384",
      name: "Rahul Menon",
      title: "Head Coach",
      specialty: "Strength & Olympic Biomechanics",
      bio: "CSCS certified with 8+ years coaching competitive athletes and total body recomposition. Specialist in heavy compound lifts and hypertrophy.",
      photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80",
      badge: "HEAD COACH",
      badgeColor: "red",
      isActive: true,
      displayOrder: 0
    },
    {
      id: "2c7c5cb9-4a9f-4318-bd88-66a98da80219",
      name: "Anjali Nair",
      title: "Ladies Lead Coach",
      specialty: "Women's Functional & HIIT",
      bio: "ACE certified trainer leading dedicated ladies-only training hours (11 AM - 3 PM) with kettlebell, sculpt, and high-cadence cardio drills.",
      photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      badge: "LADIES LEAD",
      badgeColor: "pink",
      isActive: true,
      displayOrder: 1
    },
    {
      id: "8f56efb9-fbe9-4556-91e8-78c66a4bc4d9",
      name: "Vikram Das",
      title: "Combat Lead",
      specialty: "Boxing & Heavy Bag Conditioning",
      bio: "Former State Boxing Medallist with 10+ years in technical punch mechanics, head movement, counter drills, and nightclub combat fitness.",
      photoUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
      badge: "COMBAT LEAD",
      badgeColor: "orange",
      isActive: true,
      displayOrder: 2
    },
    {
      id: "fa32efc1-7f91-455b-b998-38b46e499c82",
      name: "Dr. Sneha K. (MPT)",
      title: "Sports Physio Lead",
      specialty: "Sports Injury & Mobility",
      bio: "Master of Physiotherapy specializing in fascial release, spine decompression, sauna heat shock protocols, and sub-zero contrast plunge recovery.",
      photoUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80",
      badge: "SPORTS PHYSIO",
      badgeColor: "cyan",
      isActive: true,
      displayOrder: 3
    }
  ],

  initialClasses: [
    { id: "cls-1", dayOfWeek: "Mon", startTime: "06:30 AM", className: "Vinyasa Flow Yoga", coachName: "Mathew Singer", duration: "45 mins", intensity: "Medium", category: "YOGA", isLadiesOnly: false, displayOrder: 0 },
    { id: "cls-2", dayOfWeek: "Mon", startTime: "07:30 AM", className: "Boxing Ring Conditioning", coachName: "Vikram Das", duration: "60 mins", intensity: "High", category: "BOXING", isLadiesOnly: false, displayOrder: 1 },
    { id: "cls-3", dayOfWeek: "Mon", startTime: "11:30 AM", className: "Ladies-Only Core & Sculpt 🌸", coachName: "Anjali Nair", duration: "45 mins", intensity: "Medium", category: "LADIES", isLadiesOnly: true, displayOrder: 2 },
    { id: "cls-4", dayOfWeek: "Mon", startTime: "01:30 PM", className: "Ladies-Only Zumba Cardio 🌸", coachName: "Anjali Nair", duration: "45 mins", intensity: "High", category: "LADIES", isLadiesOnly: true, displayOrder: 3 },
    { id: "cls-5", dayOfWeek: "Mon", startTime: "05:30 PM", className: "Strength & Biomechanics", coachName: "Rahul Menon", duration: "60 mins", intensity: "Extreme", category: "STRENGTH", isLadiesOnly: false, displayOrder: 4 },
    { id: "cls-6", dayOfWeek: "Mon", startTime: "07:00 PM", className: "HYROX Functional Engine", coachName: "Scott Vetter", duration: "50 mins", intensity: "High", category: "HIIT", isLadiesOnly: false, displayOrder: 5 },
    { id: "cls-7", dayOfWeek: "Tue", startTime: "06:30 AM", className: "Olympic Weightlifting Intro", coachName: "Rahul Menon", duration: "60 mins", intensity: "High", category: "STRENGTH", isLadiesOnly: false, displayOrder: 6 },
    { id: "cls-8", dayOfWeek: "Tue", startTime: "11:30 AM", className: "Ladies-Only Pilates Mat 🌸", coachName: "Anjali Nair", duration: "45 mins", intensity: "Medium", category: "LADIES", isLadiesOnly: true, displayOrder: 7 },
    { id: "cls-9", dayOfWeek: "Wed", startTime: "07:30 AM", className: "Heavy Bag Power Drills", coachName: "Vikram Das", duration: "60 mins", intensity: "High", category: "BOXING", isLadiesOnly: false, displayOrder: 8 },
    { id: "cls-10", dayOfWeek: "Wed", startTime: "11:30 AM", className: "Ladies-Only HIIT Circuit 🌸", coachName: "Anjali Nair", duration: "45 mins", intensity: "High", category: "LADIES", isLadiesOnly: true, displayOrder: 9 },
    { id: "cls-11", dayOfWeek: "Fri", startTime: "06:30 AM", className: "Mobility & Spine Rehab", coachName: "Dr. Sneha", duration: "45 mins", intensity: "Medium", category: "YOGA", isLadiesOnly: false, displayOrder: 10 },
    { id: "cls-12", dayOfWeek: "Sat", startTime: "05:00 PM", className: "Community Sparring & Cold Plunge", coachName: "Vikram Das", duration: "75 mins", intensity: "Extreme", category: "BOXING", isLadiesOnly: false, displayOrder: 11 }
  ],

  initialBlogPosts: [
    {
      id: "91a4b4d7-db4c-426e-ba38-4de12df3ace3",
      title: "The Science of Sub-Zero Contrast Therapy: Why 3°C Ice Baths Accelerate Hypertrophy",
      slug: "science-of-sub-zero-contrast-therapy",
      category: "Recovery Science",
      excerpt: "Explore the physiological vasoconstriction and dopamine elevation mechanisms behind cold plunge therapy and Finnish cedar sauna cycles.",
      content: "Sub-zero contrast therapy represents the gold standard in athletic recovery. By immersing the body in 3°C to 5°C cold plunge water immediately following intense strength training or boxing rounds, peripheral vasoconstriction forces pooled lactic acid into central circulation. When paired with 85°C dry sauna heat shock protein activation, muscle soreness decreases by up to 60% while accelerating central nervous system recovery.\n\nAt FIT24 Hosdurg, athletes follow a structured 3:1 protocol: 15 minutes of dry Finnish sauna followed by 3 minutes in our custom chiller plunge.",
      coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      readTime: "4 min read",
      isPublished: true,
      createdAt: "Today"
    },
    {
      id: "88a1b4d7-db4c-426e-ba38-4de12df3ace4",
      title: "Why Dedicated Ladies-Only Hours (11 AM – 3 PM) Transform Consistency in North Kerala",
      slug: "ladies-only-hours-consistency",
      category: "Community & Wellness",
      excerpt: "Privacy, expert female coaches, and high-energy sisterhood create a zero-judgment environment for women to conquer free weights.",
      content: "Consistency in fitness breaks down when athletes feel intimidated or restricted. FIT24's brochure policy reserves 11:00 AM to 03:00 PM exclusively for female athletes, with female trainers, zero male floor access, and customized functional training routines.\n\nWhether mastering the barbell squat, kettlebell swings, or rhythm cardio, ladies-only hours eliminate friction and build sustainable fitness habits.",
      coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      readTime: "3 min read",
      isPublished: true,
      createdAt: "Yesterday"
    },
    {
      id: "77a1b4d7-db4c-426e-ba38-4de12df3ace5",
      title: "Fueling The Machine: How To Match Your Daily Macros With The FIT24 Fit Café Menu",
      slug: "fueling-the-machine-macros-fit24-cafe",
      category: "Nutrition & Fuel",
      excerpt: "A tactical guide to post-workout protein shakes, cold-pressed hydration, and using your member wallet credits at the nutrition bar.",
      content: "You cannot out-train poor nutrition. The FIT24 Fuel Bar was built inside the club so you never have to skip the critical 45-minute post-workout nutrient window.\n\nFrom double-scoop whey isolate shakes with peanut butter to electrolyte cold-pressed hydration, our baristas craft clean, macro-matched fuel for prime recovery. Members in Prime and Elite tiers enjoy automatic discounts (10% and 15%) billed straight from their signup reward wallet.",
      coverImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      readTime: "5 min read",
      isPublished: true,
      createdAt: "3 days ago"
    }
  ]
};

// Storage Management Helper for LocalStorage
class Fit24Store {
  constructor() {
    this.STORAGE_KEY = "FIT24_APP_STORAGE_v2";
    this._memoryStore = null;
    this.init();
  }

  init() {
    try {
      const existing = localStorage.getItem(this.STORAGE_KEY);
      if (!existing) {
        this.resetToDefaults();
      }
    } catch (e) {
      console.warn("LocalStorage access restricted; falling back to in-memory store:", e);
      this.resetToDefaults();
    }
    // Asynchronously sync from Supabase cloud database
    setTimeout(() => {
      this.syncFromSupabase();
    }, 150);
  }

  async syncFromSupabase() {
    if (window.fit24Supabase && window.fit24Supabase.isReady) {
      const cloudData = await window.fit24Supabase.fetchAll();
      if (cloudData && cloudData.members && cloudData.members.length > 0) {
        const store = this.getStore();
        store.members = cloudData.members;
        if (cloudData.attendances && cloudData.attendances.length > 0) store.attendances = cloudData.attendances;
        if (cloudData.facilityLogs && cloudData.facilityLogs.length > 0) store.facilityLogs = cloudData.facilityLogs;
        if (cloudData.cafeLogs && cloudData.cafeLogs.length > 0) store.cafeLogs = cloudData.cafeLogs;
        if (cloudData.leads && cloudData.leads.length > 0) store.leads = cloudData.leads;
        if (cloudData.trainers && cloudData.trainers.length > 0) store.trainers = cloudData.trainers;
        if (cloudData.classes && cloudData.classes.length > 0) store.classes = cloudData.classes;
        if (cloudData.blogPosts && cloudData.blogPosts.length > 0) store.blogPosts = cloudData.blogPosts;
        this.saveStore(store);
        console.log("☁ FIT24 Local state synchronized with Supabase cloud database!");
        if (typeof renderAllData === 'function') {
          renderAllData();
        }
        if (typeof renderDynamicTrainers === 'function') {
          renderDynamicTrainers();
        }
        if (typeof renderDynamicClasses === 'function') {
          renderDynamicClasses();
        }
        if (typeof renderDynamicBlog === 'function') {
          renderDynamicBlog();
        }
      }
    }
  }

  resetToDefaults() {
    const data = {
      members: FIT24_DATA.initialMembers,
      attendances: FIT24_DATA.initialAttendances,
      facilityLogs: FIT24_DATA.initialFacilityLogs,
      cafeLogs: FIT24_DATA.initialCafeLogs,
      leads: FIT24_DATA.initialLeads,
      trainers: FIT24_DATA.initialTrainers,
      classes: FIT24_DATA.initialClasses,
      blogPosts: FIT24_DATA.initialBlogPosts
    };
    this._memoryStore = JSON.parse(JSON.stringify(data));
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Memory store is active
    }
  }

  getStore() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      // fallback
    }
    if (!this._memoryStore) {
      this.resetToDefaults();
    }
    return this._memoryStore;
  }

  saveStore(store) {
    this._memoryStore = store;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      // fallback
    }
  }

  getMembers() {
    return this.getStore().members;
  }

  getMember(id) {
    return this.getMembers().find(m => m.id.toLowerCase() === id.toLowerCase() || m.phone.replace(/\s+/g, '').includes(id.replace(/\s+/g, '')));
  }

  addMember(memberData) {
    const store = this.getStore();
    const newId = `F24-${1000 + store.members.length + 1}`;
    
    const tierConfig = FIT24_DATA.pricingMatrix.tiers.find(t => t.name === memberData.tier) || FIT24_DATA.pricingMatrix.tiers[0];
    const durationPricing = tierConfig.pricing[memberData.durationMonths] || { price: 2399, pauseDays: 0 };

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(memberData.durationMonths));

    const newMember = {
      id: newId,
      name: memberData.name,
      phone: memberData.phone,
      email: memberData.email || "",
      gender: memberData.gender || "Other",
      tier: memberData.tier,
      durationMonths: parseInt(memberData.durationMonths),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: "ACTIVE",
      amountPaid: durationPricing.price,
      saunaTotal: tierConfig.saunaQuota,
      saunaUsed: 0,
      iceBathTotal: tierConfig.iceBathQuota,
      iceBathUsed: 0,
      guestPassesTotal: tierConfig.guestPasses,
      guestPassesUsed: 0,
      cafeCredit: tierConfig.cafeCredit,
      cafeDiscount: tierConfig.cafeDiscount,
      snookerDiscount: tierConfig.snookerDiscount,
      totalPauseAllowed: durationPricing.pauseDays,
      pauseDaysUsed: 0,
      pauseBlocksUsed: 0,
      isPaused: false,
      pauseHistory: [],
      lastCheckIn: null,
      totalVisits: 0
    };

    store.members.unshift(newMember);
    this.saveStore(store);

    // Sync to Supabase Cloud
    if (window.fit24Supabase) {
      window.fit24Supabase.saveNewMember(newMember);
    }
    return newMember;
  }

  checkInMember(memberId, method = "Fast Search") {
    const store = this.getStore();
    const member = store.members.find(m => m.id === memberId);
    if (!member) return { success: false, message: "Member not found" };

    if (member.isPaused) {
      return { success: false, message: `Membership is PAUSED until resume request is approved.` };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const attendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: member.id,
      name: member.name,
      tier: member.tier,
      time: timeStr,
      date: "Today",
      method: method
    };

    member.lastCheckIn = now.toISOString();
    member.totalVisits = (member.totalVisits || 0) + 1;

    store.attendances.unshift(attendanceRecord);
    this.saveStore(store);

    // Sync to Supabase Cloud
    if (window.fit24Supabase) {
      window.fit24Supabase.logAttendance(attendanceRecord, member);
    }
    return { success: true, member, record: attendanceRecord };
  }

  deductFacilityQuota(memberId, facilityType, staff = "Front Desk") {
    const store = this.getStore();
    const member = store.members.find(m => m.id === memberId);
    if (!member) return { success: false, message: "Member not found" };

    let remainingMsg = "";
    if (facilityType === "Sauna") {
      if (member.saunaUsed >= member.saunaTotal) {
        return { success: false, message: `No Sauna sessions remaining for ${member.name} (${member.tier}).` };
      }
      member.saunaUsed++;
      remainingMsg = `${member.saunaTotal - member.saunaUsed} remaining`;
    } else if (facilityType === "Ice Bath") {
      if (member.iceBathUsed >= member.iceBathTotal) {
        return { success: false, message: `No Ice Bath sessions remaining for ${member.name} (${member.tier}).` };
      }
      member.iceBathUsed++;
      remainingMsg = `${member.iceBathTotal - member.iceBathUsed} remaining`;
    } else if (facilityType === "Guest Pass") {
      if (member.guestPassesUsed >= member.guestPassesTotal) {
        return { success: false, message: `No complimentary Guest Passes remaining for ${member.name}.` };
      }
      member.guestPassesUsed++;
      remainingMsg = `${member.guestPassesTotal - member.guestPassesUsed} remaining`;
    }

    const logRecord = {
      id: `log-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      facility: facilityType,
      time: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      staff: staff,
      remaining: remainingMsg
    };

    store.facilityLogs.unshift(logRecord);
    this.saveStore(store);

    // Sync to Supabase Cloud
    if (window.fit24Supabase) {
      window.fit24Supabase.logFacilityQuota(logRecord, member);
    }
    return { success: true, member, remaining: remainingMsg };
  }

  pauseMembership(memberId, pauseDays, reason) {
    const store = this.getStore();
    const member = store.members.find(m => m.id === memberId);
    if (!member) return { success: false, message: "Member not found" };

    if (member.durationMonths < 3) {
      return { success: false, message: "Pause is only allowed on plans of 3 months or more (Brochure policy)." };
    }
    if (pauseDays < 7) {
      return { success: false, message: "Minimum 7 days required per pause block." };
    }
    if (member.pauseBlocksUsed >= 2) {
      return { success: false, message: "Maximum 2 pause blocks already reached for this plan." };
    }

    const availablePause = member.totalPauseAllowed - member.pauseDaysUsed;
    if (pauseDays > availablePause) {
      return { success: false, message: `Exceeds available pause limit. Only ${availablePause} days remaining.` };
    }

    member.isPaused = true;
    member.status = "PAUSED";
    member.pauseDaysUsed += parseInt(pauseDays);
    member.pauseBlocksUsed += 1;

    const curEnd = new Date(member.endDate);
    curEnd.setDate(curEnd.getDate() + parseInt(pauseDays));
    member.endDate = curEnd.toISOString().split('T')[0];

    const todayStr = new Date().toISOString().split('T')[0];
    member.currentPauseStart = todayStr;
    member.pauseHistory.unshift({
      startDate: todayStr,
      days: parseInt(pauseDays),
      reason: reason || "Member request",
      status: "ACTIVE_PAUSE"
    });

    this.saveStore(store);

    // Sync to Supabase Cloud
    if (window.fit24Supabase) {
      window.fit24Supabase.logPause(member, pauseDays, reason);
    }
    return { success: true, member, newEndDate: member.endDate };
  }

  resumeMembership(memberId) {
    const store = this.getStore();
    const member = store.members.find(m => m.id === memberId);
    if (!member) return { success: false, message: "Member not found" };

    member.isPaused = false;
    member.status = "ACTIVE";
    if (member.pauseHistory.length > 0 && member.pauseHistory[0].status === "ACTIVE_PAUSE") {
      member.pauseHistory[0].status = "RESUMED";
    }

    this.saveStore(store);

    // Sync to Supabase Cloud
    if (window.fit24Supabase) {
      window.fit24Supabase.logResume(member);
    }
    return { success: true, member };
  }

  processCafeSale(memberId, grossBill, payViaWallet = true, notes = "") {
    const store = this.getStore();
    const member = store.members.find(m => m.id === memberId);
    if (!member) return { success: false, message: "Member not found" };

    const discountPercent = member.cafeDiscount || 0;
    const discountAmount = (grossBill * discountPercent) / 100;
    const netAmount = grossBill - discountAmount;

    if (payViaWallet) {
      if (member.cafeCredit < netAmount) {
        return { success: false, message: `Insufficient wallet balance (₹${member.cafeCredit.toFixed(2)} available vs ₹${netAmount.toFixed(2)} required).` };
      }
      member.cafeCredit -= netAmount;
    }

    const logRecord = {
      id: `cafe-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      tier: member.tier,
      item: notes || "Café Protein & Refreshment order",
      billGross: grossBill,
      discountApplied: `${discountPercent}% (-₹${discountAmount.toFixed(2)})`,
      netPaid: netAmount,
      paidVia: payViaWallet ? "FIT24 Wallet Credit" : "Direct Cash / UPI",
      time: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    store.cafeLogs.unshift(logRecord);
    this.saveStore(store);

    // Sync to Supabase Cloud
    if (window.fit24Supabase) {
      window.fit24Supabase.logCafeSale(logRecord, member);
    }
    return { success: true, member, logRecord };
  }

  // --- LEADS MANAGEMENT ---
  getLeads() {
    const store = this.getStore();
    if (!store.leads || store.leads.length === 0) {
      store.leads = (FIT24_DATA.initialLeads || []).slice();
      this.saveStore(store);
    }
    return store.leads;
  }

  addLead(leadData) {
    const store = this.getStore();
    const newLead = {
      id: `lead-${Date.now()}`,
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email || "",
      interest: leadData.interest || "General Inquiry",
      source: leadData.source || "Website VIP Tour",
      status: leadData.status || "New",
      notes: leadData.notes || "",
      createdAt: "Just now"
    };

    if (!store.leads) store.leads = [];
    store.leads.unshift(newLead);
    this.saveStore(store);

    // Sync to Supabase Cloud
    if (window.fit24Supabase) {
      window.fit24Supabase.createLead(newLead);
    }
    return newLead;
  }

  updateLeadStatus(leadId, newStatus, notes) {
    const store = this.getStore();
    if (!store.leads) return;
    const lead = store.leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      if (notes !== undefined) lead.notes = notes;
      this.saveStore(store);

      // Sync to Supabase Cloud
      if (window.fit24Supabase) {
        window.fit24Supabase.updateLeadStatus(leadId, newStatus, notes);
      }
    }
  }

  deleteLead(leadId) {
    const store = this.getStore();
    if (!store.leads) return;
    store.leads = store.leads.filter(l => l.id !== leadId);
    this.saveStore(store);

    // Sync to Supabase Cloud
    if (window.fit24Supabase) {
      window.fit24Supabase.deleteLead(leadId);
    }
  }

  // --- TRAINERS MANAGEMENT ---
  getTrainers() {
    const store = this.getStore();
    if (!store.trainers || store.trainers.length === 0) {
      store.trainers = (FIT24_DATA.initialTrainers || []).slice();
      this.saveStore(store);
    }
    return store.trainers;
  }

  addTrainer(data) {
    const store = this.getStore();
    const newTrainer = {
      id: `trainer-${Date.now()}`,
      name: data.name,
      title: data.title || "Coach",
      specialty: data.specialty || "Strength & Functional",
      bio: data.bio || "",
      photoUrl: data.photoUrl || "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80",
      badge: data.badge || "COACH",
      badgeColor: data.badgeColor || "red",
      isActive: data.isActive !== false,
      displayOrder: store.trainers ? store.trainers.length : 0
    };

    if (!store.trainers) store.trainers = [];
    store.trainers.push(newTrainer);
    this.saveStore(store);

    if (window.fit24Supabase) {
      window.fit24Supabase.createTrainer(newTrainer);
    }
    return newTrainer;
  }

  updateTrainer(id, updates) {
    const store = this.getStore();
    if (!store.trainers) return null;
    const t = store.trainers.find(item => item.id === id);
    if (t) {
      Object.assign(t, updates);
      this.saveStore(store);
      if (window.fit24Supabase) {
        window.fit24Supabase.updateTrainer(id, updates);
      }
      return t;
    }
    return null;
  }

  deleteTrainer(id) {
    const store = this.getStore();
    if (!store.trainers) return;
    store.trainers = store.trainers.filter(item => item.id !== id);
    this.saveStore(store);
    if (window.fit24Supabase) {
      window.fit24Supabase.deleteTrainer(id);
    }
  }

  // --- GROUP CLASSES MANAGEMENT ---
  getClasses() {
    const store = this.getStore();
    if (!store.classes || store.classes.length === 0) {
      store.classes = (FIT24_DATA.initialClasses || []).slice();
      this.saveStore(store);
    }
    return store.classes;
  }

  addClass(data) {
    const store = this.getStore();
    const newClass = {
      id: `class-${Date.now()}`,
      dayOfWeek: data.dayOfWeek || "Mon",
      startTime: data.startTime || "07:00 AM",
      className: data.className,
      coachName: data.coachName || "FIT24 Coach",
      duration: data.duration || "45 mins",
      intensity: data.intensity || "High",
      category: data.category || "GENERAL",
      isLadiesOnly: Boolean(data.isLadiesOnly),
      displayOrder: store.classes ? store.classes.length : 0
    };

    if (!store.classes) store.classes = [];
    store.classes.push(newClass);
    this.saveStore(store);

    if (window.fit24Supabase) {
      window.fit24Supabase.createClass(newClass);
    }
    return newClass;
  }

  updateClass(id, updates) {
    const store = this.getStore();
    if (!store.classes) return null;
    const c = store.classes.find(item => item.id === id);
    if (c) {
      Object.assign(c, updates);
      this.saveStore(store);
      if (window.fit24Supabase) {
        window.fit24Supabase.updateClass(id, updates);
      }
      return c;
    }
    return null;
  }

  deleteClass(id) {
    const store = this.getStore();
    if (!store.classes) return;
    store.classes = store.classes.filter(item => item.id !== id);
    this.saveStore(store);
    if (window.fit24Supabase) {
      window.fit24Supabase.deleteClass(id);
    }
  }

  // --- BLOG POSTS MANAGEMENT ---
  getBlogPosts() {
    const store = this.getStore();
    if (!store.blogPosts || store.blogPosts.length === 0) {
      store.blogPosts = (FIT24_DATA.initialBlogPosts || []).slice();
      this.saveStore(store);
    }
    return store.blogPosts;
  }

  addBlogPost(data) {
    const store = this.getStore();
    const newPost = {
      id: `blog-${Date.now()}`,
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: data.category || "Club Intel",
      excerpt: data.excerpt || "",
      content: data.content || "",
      coverImage: data.coverImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      readTime: data.readTime || "4 min read",
      isPublished: data.isPublished !== false,
      createdAt: "Today"
    };

    if (!store.blogPosts) store.blogPosts = [];
    store.blogPosts.unshift(newPost);
    this.saveStore(store);

    if (window.fit24Supabase) {
      window.fit24Supabase.createBlogPost(newPost);
    }
    return newPost;
  }

  updateBlogPost(id, updates) {
    const store = this.getStore();
    if (!store.blogPosts) return null;
    const b = store.blogPosts.find(item => item.id === id);
    if (b) {
      Object.assign(b, updates);
      this.saveStore(store);
      if (window.fit24Supabase) {
        window.fit24Supabase.updateBlogPost(id, updates);
      }
      return b;
    }
    return null;
  }

  deleteBlogPost(id) {
    const store = this.getStore();
    if (!store.blogPosts) return;
    store.blogPosts = store.blogPosts.filter(item => item.id !== id);
    this.saveStore(store);
    if (window.fit24Supabase) {
      window.fit24Supabase.deleteBlogPost(id);
    }
  }
}

window.fit24Store = new Fit24Store();
