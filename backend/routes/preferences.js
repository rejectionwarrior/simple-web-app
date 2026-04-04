const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper — pulls the user out of the Authorization header
async function getUser(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }

  return data.user;
}

// GET /preferences
router.get('/', async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return;

  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return res.status(400).json({ error: error.message });
  }

  // If no preferences exist yet, return defaults
  if (!data) {
    return res.json({ theme: 'light' });
  }

  res.json(data);
});

// POST /preferences
router.post('/', async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return;

  const { theme } = req.body;

  const { data, error } = await supabase
    .from('preferences')
    .upsert({
      user_id: user.id,
      theme: theme || 'light',
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Preferences saved', preferences: data });
});

module.exports = router;