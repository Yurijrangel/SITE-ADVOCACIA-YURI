import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, query, where } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

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

const SHARE_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.6L6.1 22H3l8.1-9.3L2.9 2h6.5l4.5 6L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35M12.05 2C6.56 2 2.11 6.42 2.11 11.86c0 2 .53 3.87 1.47 5.48L2 22l4.86-1.57a9.98 9.98 0 0 0 5.2 1.44h.01c5.48 0 9.93-4.42 9.93-9.87 0-2.64-1.04-5.11-2.92-6.98A9.9 9.9 0 0 0 12.05 2Z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'
};

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

function buildShareBar(shareUrl, shareTitle) {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  return `
    <div class="share-bar">
      <span class="share-label">Compartilhar:</span>
      <a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook">${SHARE_ICONS.facebook}</a>
      <a class="share-btn" href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no X">${SHARE_ICONS.twitter}</a>
      <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn">${SHARE_ICONS.linkedin}</a>
      <a class="share-btn" href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">${SHARE_ICONS.whatsapp}</a>
      <button type="button" class="share-btn" id="copy-link-btn" aria-label="Copiar link">${SHARE_ICONS.link}</button>
      <button type="button" class="share-btn" id="print-btn" aria-label="Imprimir artigo">${SHARE_ICONS.print}</button>
    </div>
  `;
}

async function loadComments(postId) {
  const listEl = document.getElementById('comments-list');
  if (!listEl) return;
  listEl.innerHTML = '<p class="empty-state">Carregando comentários...</p>';

  try {
    const q = query(collection(db, 'blogPosts', postId, 'comments'), where('approved', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      listEl.innerHTML = '<p class="empty-state">Seja o primeiro a comentar.</p>';
      return;
    }

    const comments = snapshot.docs
      .map(docSnap => docSnap.data())
      .sort((a, b) => {
        const timeA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeA - timeB;
      });

    listEl.innerHTML = comments.map(comment => `
      <div class="comment-item">
        <strong>${escapeHtml(comment.name || 'Anônimo')}</strong>
        <span class="comment-date">${formatDateValue(comment.createdAt)}</span>
        <p>${escapeHtml(comment.message || '')}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar comentários:', err);
    listEl.innerHTML = '<p class="empty-state">Erro ao carregar comentários.</p>';
  }
}

function wireCommentForm(postId) {
  const form = document.getElementById('comment-form');
  const feedback = document.getElementById('comment-feedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('comment-name').value.trim();
    const message = document.getElementById('comment-message').value.trim();
    if (!name || !message) return;

    try {
      await addDoc(collection(db, 'blogPosts', postId, 'comments'), {
        name,
        message,
        approved: false,
        createdAt: serverTimestamp()
      });
      form.reset();
      if (feedback) feedback.textContent = 'Comentário enviado! Ele será exibido após aprovação.';
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      if (feedback) feedback.textContent = 'Erro ao enviar comentário. Tente novamente.';
    }
  });
}

function wireShareBar(shareUrl) {
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copyBtn.classList.add('is-copied');
        setTimeout(() => copyBtn.classList.remove('is-copied'), 2000);
      } catch (err) {
        console.error('Erro ao copiar link:', err);
      }
    });
  }

  const printBtn = document.getElementById('print-btn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
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
    const shareUrl = window.location.href;
    const tags = Array.isArray(post.tags) ? post.tags : [];

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
        ${tags.length ? `<div class="article-tags">${tags.map(tag => `<span class="article-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
        ${buildShareBar(shareUrl, post.title || '')}
        ${post.authorBio ? `
          <div class="author-bio-card">
            <div class="author-bio-name">${escapeHtml(post.author || 'Yuri Rangel')}</div>
            <p>${escapeHtml(post.authorBio)}</p>
            ${post.authorSocial && /^https?:\/\//i.test(post.authorSocial) ? `<a class="author-bio-social" href="${escapeHtml(post.authorSocial)}" target="_blank" rel="noopener noreferrer">Ver perfil ${SHARE_ICONS.link}</a>` : ''}
          </div>
        ` : ''}
        <a href="blog.html" class="btn btn-dark btn-outline-dark">Voltar para o blog</a>

        <div class="comments-section">
          <h3>Comentários</h3>
          <div id="comments-list" class="comments-list"></div>
          <form id="comment-form" class="comment-form">
            <h4>Deixe seu comentário</h4>
            <label>Nome
              <input type="text" id="comment-name" maxlength="80" required />
            </label>
            <label>Comentário
              <textarea id="comment-message" rows="4" maxlength="600" required></textarea>
            </label>
            <button type="submit" class="btn btn-dark">Enviar comentário</button>
            <p id="comment-feedback" class="comment-feedback" aria-live="polite"></p>
          </form>
        </div>
      </div>
    `;

    wireShareBar(shareUrl);
    wireCommentForm(id);
    loadComments(id);
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
