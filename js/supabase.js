// FIT24 - Supabase Integration Client & Realtime Bridge
// Connected to Live PostgreSQL Database: https://ytubbcxsmqypngmkejji.supabase.co

const FIT24_SUPABASE_CONFIG = {
  url: "https://ytubbcxsmqypngmkejji.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dWJiY3hzbXF5cG5nbWtlamppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NDQyNTIsImV4cCI6MjEwNjAyMDI1Mn0.QIAPJQMveqkgxzq2abDJWu7DpwfPbdxpU5a1I870RZw",
  
  isConfigured: function() {
    return Boolean(this.url && this.anonKey && this.anonKey.startsWith("ey"));
  }
};

class Fit24SupabaseClient {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.init();
  }

  init() {
    if (FIT24_SUPABASE_CONFIG.isConfigured() && window.supabase) {
      try {
        this.client = window.supabase.createClient(FIT24_SUPABASE_CONFIG.url, FIT24_SUPABASE_CONFIG.anonKey);
        this.isReady = true;
        console.log("⚡ FIT24 Live: Connected to Supabase Cloud Database!");
        this.subscribeRealtime();
      } catch (err) {
        console.warn("Supabase init error, running offline fallback:", err);
      }
    }
  }

  // Realtime live sync across devices (iPad, front desk, manager phone)
  subscribeRealtime() {
    if (!this.client) return;

    this.client
      .channel('fit24-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendances' }, (payload) => {
        console.log('Realtime check-in detected:', payload);
        if (window.fit24Store) window.fit24Store.syncFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, (payload) => {
        console.log('Realtime member change detected:', payload);
        if (window.fit24Store) window.fit24Store.syncFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'facility_logs' }, (payload) => {
        if (window.fit24Store) window.fit24Store.syncFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cafe_logs' }, (payload) => {
        if (window.fit24Store) window.fit24Store.syncFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        console.log('Realtime lead event:', payload);
        if (window.fit24Store) window.fit24Store.syncFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trainers' }, (payload) => {
        console.log('Realtime trainer event:', payload);
        if (window.fit24Store) window.fit24Store.syncFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, (payload) => {
        console.log('Realtime class schedule event:', payload);
        if (window.fit24Store) window.fit24Store.syncFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, (payload) => {
        console.log('Realtime blog post event:', payload);
        if (window.fit24Store) window.fit24Store.syncFromSupabase();
      })
      .subscribe();
  }

  // --- CONVERTERS ---
  toFrontendMember(row) {
    if (!row) return null;
    return {
      id: row.member_code,
      dbId: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || "",
      gender: row.gender || "Other",
      tier: row.tier,
      durationMonths: parseInt(row.duration_months),
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      amountPaid: parseFloat(row.amount_paid) || 0,
      saunaTotal: parseInt(row.sauna_total) || 0,
      saunaUsed: parseInt(row.sauna_used) || 0,
      iceBathTotal: parseInt(row.ice_bath_total) || 0,
      iceBathUsed: parseInt(row.ice_bath_used) || 0,
      guestPassesTotal: parseInt(row.guest_passes_total) || 0,
      guestPassesUsed: parseInt(row.guest_passes_used) || 0,
      cafeCredit: parseFloat(row.cafe_credit) || 0,
      cafeDiscount: parseInt(row.cafe_discount) || 0,
      snookerDiscount: parseInt(row.snooker_discount) || 0,
      totalPauseAllowed: parseInt(row.total_pause_allowed) || 0,
      pauseDaysUsed: parseInt(row.pause_days_used) || 0,
      pauseBlocksUsed: parseInt(row.pause_blocks_used) || 0,
      isPaused: Boolean(row.is_paused),
      currentPauseStart: row.current_pause_start,
      totalVisits: parseInt(row.total_visits) || 0,
      lastCheckIn: row.last_checkin,
      pauseHistory: []
    };
  }

  toSupabaseMember(m) {
    return {
      member_code: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email || null,
      gender: m.gender || 'Other',
      tier: m.tier,
      duration_months: m.durationMonths,
      start_date: m.startDate,
      end_date: m.endDate,
      status: m.status || 'ACTIVE',
      amount_paid: m.amountPaid,
      sauna_total: m.saunaTotal,
      sauna_used: m.saunaUsed || 0,
      ice_bath_total: m.iceBathTotal,
      ice_bath_used: m.iceBathUsed || 0,
      guest_passes_total: m.guestPassesTotal,
      guest_passes_used: m.guestPassesUsed || 0,
      cafe_credit: m.cafeCredit,
      cafe_discount: m.cafeDiscount || 0,
      snooker_discount: m.snookerDiscount || 0,
      total_pause_allowed: m.totalPauseAllowed || 0,
      pause_days_used: m.pauseDaysUsed || 0,
      pause_blocks_used: m.pauseBlocksUsed || 0,
      is_paused: Boolean(m.isPaused),
      current_pause_start: m.currentPauseStart || null,
      total_visits: m.totalVisits || 0,
      last_checkin: m.lastCheckIn || null
    };
  }

  // --- ASYNC CLOUD METHODS ---
  async fetchAll() {
    if (!this.client) return null;
    try {
      const [membersRes, attRes, facRes, cafeRes, leadsRes, trainersRes, classesRes, blogsRes] = await Promise.all([
        this.client.from('members').select('*').order('created_at', { ascending: false }),
        this.client.from('attendances').select('*').order('checkin_time', { ascending: false }).limit(50),
        this.client.from('facility_logs').select('*').order('recorded_at', { ascending: false }).limit(50),
        this.client.from('cafe_logs').select('*').order('recorded_at', { ascending: false }).limit(50),
        this.client.from('leads').select('*').order('created_at', { ascending: false }),
        this.client.from('trainers').select('*').order('display_order', { ascending: true }),
        this.client.from('classes').select('*').order('display_order', { ascending: true }),
        this.client.from('blog_posts').select('*').order('created_at', { ascending: false })
      ]);

      if (membersRes.error) throw membersRes.error;

      return {
        members: (membersRes.data || []).map(r => this.toFrontendMember(r)),
        attendances: (attRes.data || []).map(r => ({
          id: r.id,
          memberId: r.member_code,
          name: r.name,
          tier: r.tier,
          time: new Date(r.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(r.checkin_time).toLocaleDateString(),
          method: r.method
        })),
        facilityLogs: (facRes.data || []).map(r => ({
          id: r.id,
          memberId: r.member_code,
          memberName: r.member_name,
          facility: r.facility_type,
          time: new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          staff: r.staff_name || 'Reception Desk',
          remaining: r.remaining_text || ''
        })),
        cafeLogs: (cafeRes.data || []).map(r => ({
          id: r.id,
          memberId: r.member_code,
          memberName: r.member_name,
          tier: r.tier,
          item: r.items,
          billGross: parseFloat(r.bill_gross),
          discountApplied: r.discount_applied || '0%',
          netPaid: parseFloat(r.net_paid),
          paidVia: r.paid_via,
          time: new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })),
        leads: (leadsRes.data || []).map(r => ({
          id: r.id,
          name: r.full_name || 'Guest Prospect',
          phone: r.phone || '',
          email: r.email || '',
          interest: r.interest || 'General Inquiry',
          source: r.source || 'Website',
          status: r.status || 'New',
          notes: r.notes || '',
          createdAt: r.created_at ? new Date(r.created_at).toLocaleString() : 'Recently'
        })),
        trainers: (trainersRes.data || []).map(r => ({
          id: r.id,
          name: r.name,
          title: r.title,
          specialty: r.specialty,
          bio: r.bio,
          photoUrl: r.photo_url,
          badge: r.badge,
          badgeColor: r.badge_color || 'red',
          isActive: r.is_active !== false,
          displayOrder: r.display_order || 0
        })),
        classes: (classesRes.data || []).map(r => ({
          id: r.id,
          dayOfWeek: r.day_of_week,
          startTime: r.start_time,
          className: r.class_name,
          coachName: r.coach_name,
          duration: r.duration || '45 mins',
          intensity: r.intensity || 'Medium',
          category: r.category || 'GENERAL',
          isLadiesOnly: Boolean(r.is_ladies_only),
          displayOrder: r.display_order || 0
        })),
        blogPosts: (blogsRes.data || []).map(r => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          category: r.category,
          excerpt: r.excerpt,
          content: r.content,
          coverImage: r.cover_image,
          readTime: r.read_time || '4 min read',
          isPublished: r.is_published !== false,
          createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently'
        }))
      };
    } catch (err) {
      console.error("Supabase fetchAll error:", err);
      return null;
    }
  }

  // --- LEADS MANAGEMENT API ---
  async createLead(lead) {
    if (!this.client) return null;
    try {
      const payload = {
        full_name: lead.name,
        phone: lead.phone,
        email: lead.email || null,
        interest: lead.interest || 'General Inquiry',
        source: lead.source || 'Website VIP Tour',
        status: lead.status || 'New',
        notes: lead.notes || ''
      };
      const { data, error } = await this.client.from('leads').insert([payload]).select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn("Cloud create lead failed:", e);
      return null;
    }
  }

  async updateLeadStatus(id, newStatus, notes) {
    if (!this.client) return;
    try {
      const updates = { status: newStatus };
      if (notes !== undefined) updates.notes = notes;
      await this.client.from('leads').update(updates).eq('id', id);
    } catch (e) {
      console.warn("Cloud update lead status failed:", e);
    }
  }

  async deleteLead(id) {
    if (!this.client) return;
    try {
      await this.client.from('leads').delete().eq('id', id);
    } catch (e) {
      console.warn("Cloud delete lead failed:", e);
    }
  }

  // --- TRAINERS MANAGEMENT API ---
  async createTrainer(trainer) {
    if (!this.client) return null;
    try {
      const payload = {
        name: trainer.name,
        title: trainer.title || 'Coach',
        specialty: trainer.specialty || '',
        bio: trainer.bio || '',
        photo_url: trainer.photoUrl || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',
        badge: trainer.badge || 'Coach',
        badge_color: trainer.badgeColor || 'red',
        is_active: trainer.isActive !== false,
        display_order: trainer.displayOrder || 0
      };
      const { data, error } = await this.client.from('trainers').insert([payload]).select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn("Cloud create trainer failed:", e);
      return null;
    }
  }

  async updateTrainer(id, updates) {
    if (!this.client) return;
    try {
      const payload = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.specialty !== undefined) payload.specialty = updates.specialty;
      if (updates.bio !== undefined) payload.bio = updates.bio;
      if (updates.photoUrl !== undefined) payload.photo_url = updates.photoUrl;
      if (updates.badge !== undefined) payload.badge = updates.badge;
      if (updates.badgeColor !== undefined) payload.badge_color = updates.badgeColor;
      if (updates.isActive !== undefined) payload.is_active = updates.isActive;
      if (updates.displayOrder !== undefined) payload.display_order = updates.displayOrder;

      await this.client.from('trainers').update(payload).eq('id', id);
    } catch (e) {
      console.warn("Cloud update trainer failed:", e);
    }
  }

  async deleteTrainer(id) {
    if (!this.client) return;
    try {
      await this.client.from('trainers').delete().eq('id', id);
    } catch (e) {
      console.warn("Cloud delete trainer failed:", e);
    }
  }

  // --- GROUP CLASSES MANAGEMENT API ---
  async createClass(c) {
    if (!this.client) return null;
    try {
      const payload = {
        day_of_week: c.dayOfWeek || 'Mon',
        start_time: c.startTime || '07:00 AM',
        class_name: c.className,
        coach_name: c.coachName || 'FIT24 Coach',
        duration: c.duration || '45 mins',
        intensity: c.intensity || 'High',
        category: c.category || 'GENERAL',
        is_ladies_only: Boolean(c.isLadiesOnly),
        display_order: c.displayOrder || 0
      };
      const { data, error } = await this.client.from('classes').insert([payload]).select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn("Cloud create class failed:", e);
      return null;
    }
  }

  async updateClass(id, updates) {
    if (!this.client) return;
    try {
      const payload = {};
      if (updates.dayOfWeek !== undefined) payload.day_of_week = updates.dayOfWeek;
      if (updates.startTime !== undefined) payload.start_time = updates.startTime;
      if (updates.className !== undefined) payload.class_name = updates.className;
      if (updates.coachName !== undefined) payload.coach_name = updates.coachName;
      if (updates.duration !== undefined) payload.duration = updates.duration;
      if (updates.intensity !== undefined) payload.intensity = updates.intensity;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.isLadiesOnly !== undefined) payload.is_ladies_only = updates.isLadiesOnly;
      if (updates.displayOrder !== undefined) payload.display_order = updates.displayOrder;

      await this.client.from('classes').update(payload).eq('id', id);
    } catch (e) {
      console.warn("Cloud update class failed:", e);
    }
  }

  async deleteClass(id) {
    if (!this.client) return;
    try {
      await this.client.from('classes').delete().eq('id', id);
    } catch (e) {
      console.warn("Cloud delete class failed:", e);
    }
  }

  // --- BLOG POSTS MANAGEMENT API ---
  async createBlogPost(b) {
    if (!this.client) return null;
    try {
      const payload = {
        title: b.title,
        slug: b.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: b.category || 'Club Intel',
        excerpt: b.excerpt || '',
        content: b.content || '',
        cover_image: b.coverImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        read_time: b.readTime || '4 min read',
        is_published: b.isPublished !== false
      };
      const { data, error } = await this.client.from('blog_posts').insert([payload]).select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn("Cloud create blog post failed:", e);
      return null;
    }
  }

  async updateBlogPost(id, updates) {
    if (!this.client) return;
    try {
      const payload = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.excerpt !== undefined) payload.excerpt = updates.excerpt;
      if (updates.content !== undefined) payload.content = updates.content;
      if (updates.coverImage !== undefined) payload.cover_image = updates.coverImage;
      if (updates.readTime !== undefined) payload.read_time = updates.readTime;
      if (updates.isPublished !== undefined) payload.is_published = updates.isPublished;

      await this.client.from('blog_posts').update(payload).eq('id', id);
    } catch (e) {
      console.warn("Cloud update blog post failed:", e);
    }
  }

  async deleteBlogPost(id) {
    if (!this.client) return;
    try {
      await this.client.from('blog_posts').delete().eq('id', id);
    } catch (e) {
      console.warn("Cloud delete blog post failed:", e);
    }
  }

  async saveNewMember(member) {
    if (!this.client) return;
    try {
      const payload = this.toSupabaseMember(member);
      const { data, error } = await this.client.from('members').insert([payload]).select();
      if (error) console.error("Supabase saveNewMember error:", error);
      return data;
    } catch (e) {
      console.warn("Cloud save member failed:", e);
    }
  }

  async updateMember(member) {
    if (!this.client) return;
    try {
      const payload = this.toSupabaseMember(member);
      const { data, error } = await this.client
        .from('members')
        .update(payload)
        .eq('member_code', member.id);
      if (error) console.error("Supabase updateMember error:", error);
      return data;
    } catch (e) {
      console.warn("Cloud update member failed:", e);
    }
  }

  async logAttendance(att, member) {
    if (!this.client) return;
    try {
      // 1. Insert attendance record
      await this.client.from('attendances').insert([{
        member_id: member.dbId || 'abd14817-6136-4ddf-9629-9c5549902d96', // will link via member_code
        member_code: member.id,
        name: member.name,
        tier: member.tier,
        method: att.method || 'Fast Search'
      }]);

      // 2. Update member total visits
      await this.client.from('members').update({
        total_visits: member.totalVisits,
        last_checkin: new Date().toISOString()
      }).eq('member_code', member.id);
    } catch (e) {
      console.warn("Cloud log attendance failed:", e);
    }
  }

  async logFacilityQuota(facLog, member) {
    if (!this.client) return;
    try {
      await this.client.from('facility_logs').insert([{
        member_id: member.dbId || 'abd14817-6136-4ddf-9629-9c5549902d96',
        member_code: member.id,
        member_name: member.name,
        facility_type: facLog.facility,
        remaining_text: facLog.remaining,
        staff_notes: facLog.staff || 'Front Desk'
      }]);

      await this.client.from('members').update({
        sauna_used: member.saunaUsed,
        ice_bath_used: member.iceBathUsed,
        guest_passes_used: member.guestPassesUsed
      }).eq('member_code', member.id);
    } catch (e) {
      console.warn("Cloud log facility quota failed:", e);
    }
  }

  async logPause(member, pauseDays, reason) {
    if (!this.client) return;
    try {
      await this.client.from('pause_logs').insert([{
        member_id: member.dbId || 'abd14817-6136-4ddf-9629-9c5549902d96',
        member_code: member.id,
        pause_start_date: member.currentPauseStart || new Date().toISOString().split('T')[0],
        pause_days: pauseDays,
        reason: reason || 'Member Request',
        status: 'ACTIVE_PAUSE'
      }]);

      await this.client.from('members').update({
        is_paused: member.isPaused,
        status: member.status,
        pause_days_used: member.pauseDaysUsed,
        pause_blocks_used: member.pauseBlocksUsed,
        end_date: member.endDate,
        current_pause_start: member.currentPauseStart
      }).eq('member_code', member.id);
    } catch (e) {
      console.warn("Cloud log pause failed:", e);
    }
  }

  async logResume(member) {
    if (!this.client) return;
    try {
      await this.client.from('members').update({
        is_paused: false,
        status: 'ACTIVE'
      }).eq('member_code', member.id);
    } catch (e) {
      console.warn("Cloud log resume failed:", e);
    }
  }

  async logCafeSale(cafeLog, member) {
    if (!this.client) return;
    try {
      await this.client.from('cafe_logs').insert([{
        member_id: member.dbId || 'abd14817-6136-4ddf-9629-9c5549902d96',
        member_code: member.id,
        member_name: member.name,
        tier: member.tier,
        items: cafeLog.item,
        bill_gross: cafeLog.billGross,
        discount_applied: cafeLog.discountApplied,
        net_paid: cafeLog.netPaid,
        paid_via: cafeLog.paidVia
      }]);

      await this.client.from('members').update({
        cafe_credit: member.cafeCredit
      }).eq('member_code', member.id);
    } catch (e) {
      console.warn("Cloud log cafe sale failed:", e);
    }
  }
}

window.fit24Supabase = new Fit24SupabaseClient();
