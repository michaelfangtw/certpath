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

  window.supabaseClient = { getStoredSession, fetchUserProfile, mapProfileToDemo, loadSessionProfile };
})();
