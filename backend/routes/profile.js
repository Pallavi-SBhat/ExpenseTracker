import express from 'express';
import supabaseAdmin from '../lib/supabaseAdmin.js';

const router = express.Router();

// GET profile
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('id', user_id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// UPDATE profile
router.post('/update', async (req, res) => {
  const { user_id, full_name, monthly_income, savings_goal, currency } = req.body;

  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      full_name,
      monthly_income: monthly_income || 0,
      savings_goal: savings_goal || 0,
      currency,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

export default router;
