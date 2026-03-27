function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function renderSkills(container, skills) {
  container.innerHTML = '';

  if (!skills || !skills.length) return;

  skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill';
    tag.textContent = skill;
    container.appendChild(tag);
  });
}

function populatePostMeta(post) {
  if (!post) return;

  const dateEl = document.getElementById('post-1-date');
  const titleEl = document.getElementById('post-1-title');
  const descriptionEl = document.getElementById('post-1-description');
  const tagsEl = document.getElementById('post-1-tags');

  if (dateEl && post.date) {
    dateEl.textContent = formatDate(post.date);
    dateEl.classList.remove('hidden');
  }

  if (titleEl && post.title) {
    titleEl.textContent = post.title;
  }

  if (descriptionEl && post.description) {
    descriptionEl.textContent = post.description;
  }

  if (tagsEl) {
    renderSkills(tagsEl, post.skills || []);
  }
}

async function loadTimelineData() {
  try {
    const response = await fetch('timeline-data.json');
    if (!response.ok) {
      throw new Error('Failed to load timeline data');
    }

    const data = await response.json();
    const post1 = data.find(item => item.id === 'post-1');
    populatePostMeta(post1);
  } catch (error) {
    console.error('Error loading timeline data:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTimelineData();
});
