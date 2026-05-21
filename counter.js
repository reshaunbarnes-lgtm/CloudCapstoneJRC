document.addEventListener('DOMContentLoaded', async () => {
  const counterEl = document.getElementById('visitor-counter');
  if (!counterEl) return;

  try {
    const response = await fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    counterEl.textContent = `Visitors: ${Number(data.count).toLocaleString()}`;
  } catch (error) {
    counterEl.textContent = 'Visitors: unable to load';
    console.error('Visitor counter error:', error);
  }
});
