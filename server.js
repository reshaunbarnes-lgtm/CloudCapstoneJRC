const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/visits', async (req, res) => {
  const { data, error } = await supabase
    .from('visitor_counts')
    .select('count')
    .eq('id', 'global')
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ count: data?.count ?? 0 });
});

app.post('/api/visit', async (req, res) => {
  const { data, error } = await supabase
    .from('visitor_counts')
    .select('count')
    .eq('id', 'global')
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const nextCount = Number(data?.count ?? 0) + 1;
  const { error: upsertError } = await supabase
    .from('visitor_counts')
    .upsert({ id: 'global', count: nextCount }, { returning: 'representation' });

  if (upsertError) {
    return res.status(500).json({ error: upsertError.message });
  }

  return res.json({ count: nextCount });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
