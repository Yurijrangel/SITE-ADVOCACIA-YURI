import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const config = window.FIREBASE_CONFIG;
if (!config) {
  const root = document.getElementById('blog-grid');
  if (root) root.innerHTML = '<p class="empty-state">Configuração do Firebase não foi carregada.</p>';
  throw new Error('FIREBASE_CONFIG não encontrado.');
}

const app = initializeApp(config);
const db = getFirestore(app);

const container = document.getElementById('blog-grid');
const detail = document.getElementById('article-detail');

function formatDateValue(ts) {
  if (!ts) return '';
  try {
    if (ts.toDate) return ts.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return '';
  }
}

async function loadList() {
  if (!container) return;
  container.innerHTML = '<p class="empty-state">Carregando artigos...</p>';

  try {
    const snapshot = await getDocs(collection(db, 'blogPosts'));
    if (snapshot.empty) {
      container.innerHTML = '<p class="empty-state">Ainda não há artigos publicados.</p>';
      return;
    }

    const posts = snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a, b) => {
        const timeA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });

    container.innerHTML = posts.map(post => {
      const date = formatDateValue(post.createdAt);
      const excerpt = post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 180) + '...' : '');

      return `
        <article class="blog-card reveal-up is-visible">
          <span class="card-tag">${escapeHtml(post.category || 'Artigo')}</span>
          <h2>${escapeHtml(post.title || '')}</h2>
          <p>${escapeHtml(excerpt)}</p>
          <div class="article-meta">
            <span>${escapeHtml(post.author || 'Yuri Rangel')}</span>
            <span>${post.readingMinutes || '4 min de leitura'}</span>
            <span>${date}</span>
          </div>
          <a href="post.html?id=${post.id}" class="article-link">Leia o artigo</a>
        </article>
      `;
    }).join('');
  } catch (err) {
    console.error('Erro ao carregar posts:', err);
    container.innerHTML = '<p class="empty-state">Erro ao carregar artigos. Verifique o console.</p>';
  }
}

async function loadDetail() {
  if (!detail) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('post') || params.get('id');
  if (!id) return;

  detail.innerHTML = '<div class="container article-shell"><p>Carregando...</p></div>';

  try {
    const snapshot = await getDocs(collection(db, 'blogPosts'));
    const docSnap = snapshot.docs.find(item => item.id === id);
    if (!docSnap) {
      detail.innerHTML = '<div class="container article-shell"><p>Artigo não encontrado.</p></div>';
      return;
    }

    const post = docSnap.data();
    const date = formatDateValue(post.createdAt);

    detail.innerHTML = `
      <div class="container article-shell">
        <p class="article-kicker">${escapeHtml(post.category || '')}</p>
        <h2>${escapeHtml(post.title || '')}</h2>
        <div class="article-meta article-meta-large">
          <span>Por ${escapeHtml(post.author || 'Yuri Rangel')}</span>
          <span>${post.readingMinutes || '4 min de leitura'}</span>
          <span>${date}</span>
        </div>
        ${post.content}
        <a href="blog.html" class="btn btn-dark btn-outline-dark">Voltar para o blog</a>
      </div>
    `;
  } catch (err) {
    console.error(err);
    detail.innerHTML = '<div class="container article-shell"><p>Erro ao carregar o artigo.</p></div>';
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function (s) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadList();
  await loadDetail();
});
