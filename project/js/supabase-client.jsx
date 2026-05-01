// Lightweight Supabase REST wrapper.
// Reads SUPABASE_URL and SUPABASE_ANON_KEY from window globals set by the host.
// Every method returns null/false silently when those globals are absent so the
// app continues to work with demo data in local and E2E environments.
(function () {
  const SUPA_URL = window.SUPABASE_URL   || '';
  const SUPA_KEY = window.SUPABASE_ANON_KEY || '';

  // Supabase JS SDK stores the session under this localStorage key.
  function getStoredSession() {
    if (!SUPA_URL) return null;
    try {
      const proj = new URL(SUPA_URL).hostname.split('.')[0];
      const raw  = localStorage.getItem('sb-' + proj + '-auth-token');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  async function fetchUserProfile(userId, accessToken) {
    if (!SUPA_URL || !SUPA_KEY || !userId) return null;
    try {
      const res = await fetch(
        SUPA_URL + '/rest/v1/user_profiles?user_id=eq.' + encodeURIComponent(userId) + '&select=*&limit=1',
        {
          headers: {
            'apikey':        SUPA_KEY,
            'Authorization': 'Bearer ' + (accessToken || SUPA_KEY),
            'Accept':        'application/json',
          },
        }
      );
      if (!res.ok) return null;
      const rows = await res.json();
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    } catch { return null; }
  }

  // Map a user_profiles row + auth user object to the shape expected by all screens.
  function mapProfileToDemo(profile, user) {
    if (!profile) return null;
    const fullName  = profile.display_name
      || (user && user.user_metadata && user.user_metadata.full_name)
      || (user && user.email && user.email.split('@')[0])
      || 'User';
    const firstName = profile.first_name || fullName.split(' ')[0] || fullName;
    const avatar    = (firstName[0] || 'U').toUpperCase();
    return {
      firstName,
      name:      fullName,
      avatar,
      points:    profile.points          ?? 0,
      streak:    profile.streak          ?? 0,
      accuracy:  profile.accuracy        ?? 0,
      predicted: profile.predicted_score ?? 0,
      listening: profile.listening_score ?? 0,
      reading:   profile.reading_score   ?? 0,
      radar:     profile.radar           ?? [0, 0, 0, 0, 0],
      tier:      profile.tier            || 'green',
      completed: profile.completed       ?? 0,
    };
  }

  // Resolve current stored session → fetch profile → map to demo shape.
  // Returns null if not configured, no session, or any network error.
  async function loadSessionProfile() {
    const session = getStoredSession();
    if (!session) return null;
    const user    = session.user;
    const token   = session.access_token;
    if (!user) return null;
    const profile = await fetchUserProfile(user.id, token);
    return mapProfileToDemo(profile, user);
  }

  const LS_HISTORY_KEY = 'certpath_test_sessions';

  function getTestHistory() {
    try { return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || '[]'); } catch { return []; }
  }

  // session shape: { type, listening_raw, reading_raw, listening_scaled, reading_scaled, total_score }
  async function saveTestSession(session) {
    const record = {
      ...session,
      id: Date.now().toString(),
      completed_at: new Date().toISOString(),
    };

    // Always persist locally
    try {
      const history = getTestHistory();
      history.push(record);
      if (history.length > 20) history.splice(0, history.length - 20);
      localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history));
    } catch {}

    // Also write to Supabase when configured
    if (SUPA_URL && SUPA_KEY) {
      const stored = getStoredSession();
      if (stored?.user) {
        try {
          await fetch(SUPA_URL + '/rest/v1/user_test_sessions', {
            method: 'POST',
            headers: {
              'apikey':        SUPA_KEY,
              'Authorization': 'Bearer ' + (stored.access_token || SUPA_KEY),
              'Content-Type':  'application/json',
              'Prefer':        'return=minimal',
            },
            body: JSON.stringify({ user_id: stored.user.id, ...record }),
          });
        } catch {}
      }
    }

    return record;
  }

  async function fetchShopItems() {
    if (!SUPA_URL || !SUPA_KEY) return null;
    try {
      const res = await fetch(
        SUPA_URL + '/rest/v1/shop_items?select=*&order=cost.asc',
        {
          headers: {
            'apikey':        SUPA_KEY,
            'Authorization': 'Bearer ' + SUPA_KEY,
            'Accept':        'application/json',
          },
        }
      );
      if (!res.ok) return null;
      const rows = await res.json();
      if (!Array.isArray(rows) || rows.length === 0) return null;
      return rows.map(r => ({
        id:        r.id,
        icon:      r.icon      || '📦',
        name:      r.name      || '',
        desc:      r.desc      || r.description || '',
        cost:      r.cost      || 0,
        tag:       r.tag       || undefined,
        comingSoon: r.coming_soon || false,
      }));
    } catch { return null; }
  }

  window.supabaseClient = {
    getStoredSession, fetchUserProfile, mapProfileToDemo, loadSessionProfile,
    saveTestSession, getTestHistory, fetchShopItems,
  };
})();
