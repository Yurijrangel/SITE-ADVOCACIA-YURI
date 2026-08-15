import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const config = window.FIREBASE_CONFIG;
if (!config) {
  const error = document.getElementById('login-error');
  if (error) error.textContent = 'Configuração do Firebase não foi carregada.';
  throw new Error('FIREBASE_CONFIG não encontrado.');
}

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

const quill = new window.Quill('#article-content', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  }
});

function $(id) { return document.getElementById(id); }

const loginForm = $('login-form');
const logoutBtn = $('logout-btn');
const loginError = $('login-error');
const loginBox = $('login-box');
const adminPanel = $('admin-panel');
const publishedList = $('published-list');
const articleForm = $('article-form');

function showPanel() {
  loginBox.classList.add('hidden');
  adminPanel.classList.remove('hidden');
}
function showLogin() {
  loginBox.classList.remove('hidden');
  adminPanel.classList.add('hidden');
}

onAuthStateChanged(auth, user => {
  if (user) {
    showPanel();
    renderPublishedList();
  } else {
    showLogin();
  }
});

loginForm && loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('username').value.trim();
  const password = $('password').value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginError.textContent = '';
  } catch (err) {
    console.error(err);
    loginError.textContent = 'Email ou senha inválidos. Verifique sua conta no Firebase.';
  }
});

logoutBtn && logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

function estimateReadingMinutes(html) {
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

articleForm && articleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = $('article-title').value.trim();
  const category = $('article-category').value.trim();
  const summary = $('article-summary').value.trim();
  const content = quill.root.innerHTML;
  if (!title || !content || content === '<p><br></p>') return;

  try {
    const minutes = estimateReadingMinutes(content);
    await addDoc(collection(db, 'blogPosts'), {
      title,
      category,
      excerpt: summary,
      content,
      createdAt: serverTimestamp(),
      readingMinutes: minutes
    });
    articleForm.reset();
    quill.setContents([]);
    renderPublishedList();
  } catch (err) {
    console.error('Erro ao publicar:', err);
    alert('Erro ao publicar: ' + (err.message || err.code));
  }
});

async function renderPublishedList() {
  if (!publishedList) return;
  publishedList.innerHTML = '<li>Carregando...</li>';

  try {
    const snapshot = await getDocs(collection(db, 'blogPosts'));
    if (snapshot.empty) {
      publishedList.innerHTML = '<li>Nenhum artigo publicado ainda.</li>';
      return;
    }

    const posts = snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a, b) => {
        const timeA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });

    publishedList.innerHTML = posts.map(post => `
      <li>
        <div>
          <strong>${escapeHtml(post.title || '')}</strong>
          <span>${escapeHtml(post.category || '')}</span>
        </div>
        <div>
          <a href="post.html?id=${post.id}" target="_blank" class="btn">Abrir</a>
          <button type="button" data-id="${post.id}" class="delete-btn">Excluir</button>
        </div>
      </li>
    `).join('');

    publishedList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Excluir este artigo?')) return;
        try {
          await deleteDoc(doc(db, 'blogPosts', id));
          renderPublishedList();
        } catch (err) {
          console.error('Erro ao excluir:', err);
          alert('Erro ao excluir: ' + (err.message || err.code));
        }
      });
    });
  } catch (err) {
    console.error('Erro ao listar posts:', err);
    publishedList.innerHTML = '<li>Erro ao carregar artigos.</li>';
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>\"']/g, function (s) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
  });
}
