const supabaseUrl = 'https://luhgtujmxnmpkqgbhqdt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aGd0dWpteG5tcGtxZ2JocWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTMwMzcsImV4cCI6MjA2NDUyOTAzN30.Z6hwAV47a0Lm0i8GVMs868SJ3o0wTUYGkHiIkc2PiD0';
const apiUrl = `${supabaseUrl}/rest/v1/article`;

async function fetchArticles() {
  const res = await fetch(`${apiUrl}?select=*`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });
  const articles = await res.json();

  const sortOption = document.getElementById('sort').value;
  let sortedArticles = [...articles];

  if (sortOption === 'created_at.desc') {
    sortedArticles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption === 'created_at.asc') {
    sortedArticles.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortOption === 'title.asc') {
    sortedArticles.sort((a, b) => a.title.localeCompare(b.title));
  }

  document.getElementById('articles').innerHTML = sortedArticles.map(a => {
    const formattedDate = new Date(a.created_at).toLocaleDateString('pl-PL');
    return `
      <div>
        <h3>${a.title}</h3>
        <h4>${a.subtitle}</h4>
        <p><b>${a.author}</b>, ${formattedDate}</p>
        <p>${a.content}</p>
      </div>
    `;
  }).join('');
}

document.getElementById('articleForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    title: form.title.value,
    subtitle: form.subtitle.value,
    author: form.author.value,
    content: form.content.value,
    created_at: form.created_at.value || new Date().toISOString()
  };

  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  form.reset();
  fetchArticles();
});

document.getElementById('sort').addEventListener('change', () => {
  fetchArticles();
});

fetchArticles();
