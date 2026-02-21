import express from 'express';
import supabaseAdmin from '../lib/supabaseAdmin.js';

const router = express.Router();

// GET savings
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  const { data, error } = await supabaseAdmin
    .from('savings')
    .select('*')
    .eq('user_id', user_id)
    .order('date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST savings (Insert)
router.post('/', async (req, res) => {
  const { user_id, source, amount, date } = req.body;

  if (!user_id || !source || !amount || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { error } = await supabaseAdmin
    .from('savings')
    .insert([{ user_id, source, amount, date }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ success: true });
});

// DELETE savings
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('savings')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

export default router;
