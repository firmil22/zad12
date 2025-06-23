import {format} from 'date-fns';

function formatDate(dateString) {
    const date = new Date(dateString);
    return format(date, 'dd-MM-yyyy');
}

let sort = document.getElementById('sort-selector')
sort.addEventListener('change', async (event) => {
    const sortOption = event.target.value;
    await loadArticles(sortOption);
});

const fetchArticles = async (sortBy) => {
    try {
        let url = 'https://luhgtujmxnmpkqgbhqdt.supabase.co/rest/v1/article?select=*';

        if (sortBy === 'date_asc') {
            url = 'https://luhgtujmxnmpkqgbhqdt.supabase.co/rest/v1/article?select=*&order=created_at.asc';
        } else if (sortBy === 'date_desc') {
            url = 'https://luhgtujmxnmpkqgbhqdt.supabase.co/rest/v1/article?select=*&order=created_at.desc';
        } else if (sortBy === 'title_asc') {
            url = 'https://luhgtujmxnmpkqgbhqdt.supabase.co/rest/v1/article?select=*&order=title.asc';
        }

        const response = await fetch(url, {
            headers: {
                apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aGd0dWpteG5tcGtxZ2JocWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTMwMzcsImV4cCI6MjA2NDUyOTAzN30.Z6hwAV47a0Lm0i8GVMs868SJ3o0wTUYGkHiIkc2PiD0',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};

fetchArticles();

function generateTable(articles) {
    const container = document.getElementById('table-container');

    container.innerHTML = '';

    const table = document.createElement('table');
    table.innerHTML = `
    <table class="table-auto">
    </table>
    `;

    const thead = document.createElement('thead');
    thead.innerHTML = `
    <tr>
      <th class="p-2 border-2 border-gray-400">Tytuł</th>
      <th class="p-2 border-2 border-gray-400">Podtytuł</th>
      <th class="p-2 border-2 border-gray-400">Autor</th>
      <th class="p-2 border-2 border-gray-400">Data</th>
      <th class="p-2 border-2 border-gray-400">Zawartość</th>
    </tr>
  `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const row = document.createElement('tr');

        row.innerHTML = `
      <td class="p-2 border-2 border-gray-400">${article.title}</td>
      <td class="p-2 border-2 border-gray-400">${article.subtitle}</td>
      <td class="p-2 border-2 border-gray-400">${article.author}</td>
      <td class="p-2 border-2 border-gray-400">${formatDate(article.created_at)}</td>
      <td class="p-2 border-2 border-gray-400">${article.content}</td>
    `;

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    container.appendChild(table);
};

const loadArticles = async (sortOption = 'date_asc') => {
    const articles = await fetchArticles(sortOption);
    generateTable(articles);
};

loadArticles();
const createNewArticle = async ({ title, subtitle, author, content, created_at }) => {
    try {
        const response = await fetch('https://luhgtujmxnmpkqgbhqdt.supabase.co/rest/v1/article?select=*', {
            method: 'POST',
            headers: {
                apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aGd0dWpteG5tcGtxZ2JocWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTMwMzcsImV4cCI6MjA2NDUyOTAzN30.Z6hwAV47a0Lm0i8GVMs868SJ3o0wTUYGkHiIkc2PiD0',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, subtitle, author, content, created_at }),
        });

        if (response.status !== 201) {
            throw new Error(`Status: ${response.status}`);
        }
        alert('Artykuł został dodany!');
        loadArticles();
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Wystąpił błąd podczas dodawania artykułu.');
    }
};

const form = document.getElementById('article-form')
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const title = formData.get('title');
    const subtitle = formData.get('subtitle');
    const author = formData.get('author');
    const created_at = formData.get('created_at');
    const content = formData.get('content');

    await createNewArticle({ title, subtitle, author, content, created_at });

    event.target.reset();
});

loadArticles();
