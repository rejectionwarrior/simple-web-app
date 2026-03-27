function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function formatDate(d) {
  // Simple YYYY-MM -> Month YYYY if present
  if (!d) return '';
  const parts = d.split('-');
  if (parts.length >= 2) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[parseInt(parts[1],10)-1] + ' ' + parts[0];
  }
  return d;
}

function renderTimeline(entries) {
  const container = document.getElementById('timeline');
  container.innerHTML = '';
  entries.forEach((item, idx) => {
    const side = (idx % 2 === 0) ? 'entry-left' : 'entry-right';
    const entry = el('article', `entry ${side}`);
    const card = el('div', 'card');
    const date = el('div', 'date', formatDate(item.date));
    const title = el('div', 'title', item.title);
    const desc = el('div', 'desc', item.description);
    card.appendChild(date);
    card.appendChild(title);
    card.appendChild(desc);

    if (item.skills && item.skills.length) {
      const skills = el('div','skill-list');
      item.skills.forEach(s => skills.appendChild(el('span','skill', s)));
      card.appendChild(skills);
    }

    entry.appendChild(card);
    container.appendChild(entry);
  });
}

async function loadTimeline() {
  try {
    const resp = await fetch('timeline-data.json');
    if (!resp.ok) throw new Error('No data');
    const data = await resp.json();
    renderTimeline(data);
  } catch (err) {
    // Fallback — render a small static example
    renderTimeline([{
      date:'2020-01', title:'Example', description:'Add your timeline-data.json to populate real entries.', skills:['Example']
    }]);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const timelineContainer = document.getElementById('timeline');
  if (timelineContainer) {
    await loadTimeline();
  }
});
