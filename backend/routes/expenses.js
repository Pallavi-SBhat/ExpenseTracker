import express from 'express';
import supabaseAdmin from '../lib/supabaseAdmin.js';

const router = express.Router();

// GET /api/expenses?user_id=...
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  const { data, error } = await supabaseAdmin
    .from('expenses')
    .select('*')
    .eq('user_id', user_id)
    .order('date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST /api/expenses
router.post('/', async (req, res) => {
  const { user_id, category, amount, description, date } = req.body;

  if (!user_id || !category || !amount || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { error } = await supabaseAdmin
    .from('expenses')
    .insert([{ user_id, category, amount, description, date }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ success: true });
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

export default router;
