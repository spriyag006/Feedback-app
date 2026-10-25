const form = document.getElementById('feedback-form');
const statusEl = document.getElementById('status');
const listEl = document.getElementById('list');
const totalEl = document.getElementById('total');
const averageEl = document.getElementById('average');

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function renderList(items) {
  listEl.innerHTML = '';
  if (items.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No feedback yet. Be the first!';
    listEl.appendChild(p);
    return;
  }

  items.forEach((f) => {
    const item = document.createElement('div');
    item.className = 'item';

    const head = document.createElement('div');
    head.className = 'item-head';

    const name = document.createElement('strong');
    name.textContent = f.name;       // textContent prevents XSS

    const rating = document.createElement('span');
    rating.className = 'stars';
    rating.textContent = stars(f.rating);

    head.append(name, rating);

    const msg = document.createElement('p');
    msg.textContent = f.message;

    const date = document.createElement('small');
    date.textContent = new Date(f.created_at.replace(' ', 'T') + 'Z').toLocaleString();

    item.append(head, msg, date);
    listEl.appendChild(item);
  });
}

async function loadAll() {
  try {
    const [feedback, stats] = await Promise.all([
      fetch('/api/feedback').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
    ]);
    renderList(feedback);
    totalEl.textContent = stats.total;
    averageEl.textContent = stats.average;
  } catch (err) {
    statusEl.textContent = 'Could not load feedback.';
    statusEl.className = 'error';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  statusEl.textContent = '';
  statusEl.className = '';

  const payload = {
    name: document.getElementById('name').value,
    rating: document.getElementById('rating').value,
    message: document.getElementById('message').value,
  };

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Something went wrong.');

    form.reset();
    statusEl.textContent = 'Thanks for your feedback!';
    statusEl.className = 'ok';
    loadAll();
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.className = 'error';
  } finally {
    button.disabled = false;
  }
});

loadAll();
