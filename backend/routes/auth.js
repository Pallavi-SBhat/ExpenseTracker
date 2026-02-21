import express from 'express';
import { supabase } from '../supabaseClient.js';
import supabaseAdmin from '../lib/supabaseAdmin.js';

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // Create user in Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) return res.status(400).json({ error: error.message });

    // Insert user profile (admin client bypasses RLS)
    if (data.user) {
      const { error: profileError } = await supabaseAdmin.from('user_profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        monthly_income: 0,
        savings_goal: 0,
        currency: 'USD',
      });

      if (profileError) {
        console.error(profileError);
        return res.status(500).json({ error: profileError.message });
      }
    }

    res.json({ user: data.user });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ user: data.user });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGOUT
router.post('/logout', async (_req, res) => {
  res.json({ success: true });
});

export default router;
