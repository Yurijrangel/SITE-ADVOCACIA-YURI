import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, serverTimestamp, getDocs, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

const config = window.FIREBASE_CONFIG;
if (!config) {
  const error = document.getElementById('login-error');
  if (error) error.textContent = 'Configuração do Firebase não foi carregada.';
  throw new Error('FIREBASE_CONFIG não encontrado.');
}

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Permite gravar largura/estilo customizado nas imagens do artigo (Quill não faz isso por padrão).
const BaseImageFormat = window.Quill.import('formats/image');
const IMAGE_FORMAT_ATTRIBUTES = ['alt', 'width', 'style'];
class ImageFormat extends BaseImageFormat {
  static formats(domNode) {
    return IMAGE_FORMAT_ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) formats[attribute] = domNode.getAttribute(attribute);
      return formats;
    }, {});
  }
  format(name, value) {
    if (IMAGE_FORMAT_ATTRIBUTES.indexOf(name) > -1) {
      if (value) this.domNode.setAttribute(name, value);
      else this.domNode.removeAttribute(name);
    } else {
      super.format(name, value);
    }
  }
}
window.Quill.register(ImageFormat, true);

// Garante que o alinhamento seja gravado como estilo inline (funciona fora do editor, sem CSS extra).
const AlignStyle = window.Quill.import('attributors/style/align');
window.Quill.register(AlignStyle, true);

// Idem para tamanho de fonte.
const SizeStyle = window.Quill.import('attributors/style/size');
window.Quill.register(SizeStyle, true);

// Idem para cor do texto (sem whitelist: aceita qualquer cor, vinda do seletor de cor nativo).
const ColorStyle = window.Quill.import('attributors/style/color');
window.Quill.register(ColorStyle, true);

// Controle de espaçamento entre parágrafos (não existe por padrão no Quill).
const Parchment = window.Quill.import('parchment');

// Fonte: o "font" padrão do Quill só aceita serif/monospace via classe CSS do editor.
// Registramos como estilo inline com as duas fontes da marca, para funcionar no artigo publicado.
const FontFamilyStyle = new Parchment.Attributor.Style('font', 'font-family', {
  scope: Parchment.Scope.INLINE,
  whitelist: [
    "'Cormorant Garamond', Georgia, serif",
    "'Outfit', system-ui, -apple-system, sans-serif"
  ]
});
window.Quill.register(FontFamilyStyle, true);
const LineHeightStyle = new Parchment.Attributor.Style('lineheight', 'line-height', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['1.3', '1.8', '2.2']
});
window.Quill.register(LineHeightStyle, true);

// Controle de recuo do parágrafo (sobrescreve o indent padrão do Quill, que depende de classes CSS
// só presentes no editor e não seriam aplicadas no artigo publicado).
const IndentStyle = new Parchment.Attributor.Style('indent', 'margin-left', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['0em', '2em', '4em']
});
window.Quill.register(IndentStyle, true);

// Recuo da primeira linha do parágrafo (text-indent), padrão da formatação de texto jurídico/ABNT.
const FirstLineIndentStyle = new Parchment.Attributor.Style('firstline', 'text-indent', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['0cm', '1.25cm', '2.5cm']
});
window.Quill.register(FirstLineIndentStyle, true);

let selectedImageIndex = null;

async function imageHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      alert('Imagem muito grande. Envie um arquivo de até 5 MB.');
      return;
    }

    const range = quill.getSelection(true) || { index: quill.getLength() };
    quill.insertText(range.index, 'Enviando imagem...', { italic: true });

    try {
      const path = `blog-images/${Date.now()}-${file.name}`;
      const imageRef = ref(storage, path);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      quill.deleteText(range.index, 'Enviando imagem...'.length);
      quill.insertEmbed(range.index, 'image', url);
      selectedImageIndex = range.index;
      imageSizeToolbar && imageSizeToolbar.classList.add('is-active');

      let cursor = range.index + 1;
      const caption = window.prompt('Legenda da imagem (opcional, deixe em branco para pular):', '');
      if (caption && caption.trim()) {
        quill.insertText(cursor, '\n', 'user');
        cursor += 1;
        const text = caption.trim();
        quill.insertText(cursor, text, { italic: true, color: '#9A9A9A', size: '13px' }, 'user');
        quill.formatLine(cursor, text.length, 'align', 'center', 'user');
        cursor += text.length;
        quill.insertText(cursor, '\n', { italic: false, color: false, size: false }, 'user');
        cursor += 1;
      }
      quill.setSelection(cursor);
    } catch (err) {
      quill.deleteText(range.index, 'Enviando imagem...'.length);
      console.error('Erro ao enviar imagem:', err);
      alert('Erro ao enviar imagem: ' + (err.message || err.code));
    }
  };
}

const quill = new window.Quill('#article-content', {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
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
const submitBtn = $('article-submit-btn');
const cancelEditBtn = $('cancel-edit-btn');
const commentsPanel = $('comments-panel');
const adminCommentsList = $('admin-comments-list');
const imageSizeToolbar = $('image-size-toolbar');
const spacingToolbar = $('spacing-toolbar');
const indentToolbar = $('indent-toolbar');
const firstLineToolbar = $('firstline-toolbar');
const headingToolbar = $('heading-toolbar');
const fontsizeToolbar = $('fontsize-toolbar');
const fontToolbar = $('font-toolbar');
const colorToolbar = $('color-toolbar');
const colorPicker = $('color-picker');

let editingId = null;

quill.root.addEventListener('click', (e) => {
  if (e.target && e.target.tagName === 'IMG') {
    const blot = window.Quill.find(e.target);
    if (blot) {
      selectedImageIndex = quill.getIndex(blot);
      imageSizeToolbar && imageSizeToolbar.classList.add('is-active');
      return;
    }
  }
  selectedImageIndex = null;
  imageSizeToolbar && imageSizeToolbar.classList.remove('is-active');
});

imageSizeToolbar && imageSizeToolbar.querySelectorAll('button[data-size]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (selectedImageIndex === null) {
      alert('Clique em uma imagem do artigo antes de escolher o tamanho.');
      return;
    }
    const size = btn.getAttribute('data-size');
    const style = size ? `width:${size};height:auto;display:block;margin:20px auto;border-radius:12px;` : '';
    quill.formatText(selectedImageIndex, 1, 'style', style, 'user');
  });
});

spacingToolbar && spacingToolbar.querySelectorAll('button[data-spacing]').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = quill.getSelection(true);
    if (!range) {
      alert('Clique dentro de um parágrafo do artigo antes de escolher o espaçamento.');
      return;
    }
    quill.format('lineheight', btn.getAttribute('data-spacing'), 'user');
  });
});

indentToolbar && indentToolbar.querySelectorAll('button[data-indent]').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = quill.getSelection(true);
    if (!range) {
      alert('Clique dentro de um parágrafo do artigo antes de escolher o recuo.');
      return;
    }
    quill.format('indent', btn.getAttribute('data-indent'), 'user');
  });
});

firstLineToolbar && firstLineToolbar.querySelectorAll('button[data-firstline]').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = quill.getSelection(true);
    if (!range) {
      alert('Clique dentro de um parágrafo do artigo antes de escolher o recuo da primeira linha.');
      return;
    }
    quill.format('firstline', btn.getAttribute('data-firstline'), 'user');
  });
});

headingToolbar && headingToolbar.querySelectorAll('button[data-heading]').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = quill.getSelection(true);
    if (!range) {
      alert('Clique dentro de um parágrafo do artigo antes de escolher o título.');
      return;
    }
    const value = btn.getAttribute('data-heading');
    quill.format('header', value ? Number(value) : false, 'user');
  });
});

fontsizeToolbar && fontsizeToolbar.querySelectorAll('button[data-fontsize]').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = quill.getSelection(true);
    if (!range || range.length === 0) {
      alert('Selecione (arraste o mouse sobre) o texto antes de escolher o tamanho da letra.');
      return;
    }
    quill.formatText(range.index, range.length, 'size', btn.getAttribute('data-fontsize'), 'user');
  });
});

fontToolbar && fontToolbar.querySelectorAll('button[data-font]').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = quill.getSelection(true);
    if (!range || range.length === 0) {
      alert('Selecione (arraste o mouse sobre) o texto antes de escolher a fonte.');
      return;
    }
    quill.formatText(range.index, range.length, 'font', btn.getAttribute('data-font') || false, 'user');
  });
});

colorToolbar && colorToolbar.querySelectorAll('button[data-color]').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = quill.getSelection(true);
    if (!range || range.length === 0) {
      alert('Selecione (arraste o mouse sobre) o texto antes de escolher a cor.');
      return;
    }
    quill.formatText(range.index, range.length, 'color', btn.getAttribute('data-color') || false, 'user');
  });
});

colorPicker && colorPicker.addEventListener('change', () => {
  const range = quill.getSelection(true);
  if (!range || range.length === 0) {
    alert('Selecione (arraste o mouse sobre) o texto antes de escolher a cor.');
    return;
  }
  quill.formatText(range.index, range.length, 'color', colorPicker.value, 'user');
});

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

function startEdit(id, post) {
  editingId = id;
  $('article-title').value = post.title || '';
  $('article-category').value = post.category || '';
  $('article-author').value = post.author || '';
  $('article-author-bio').value = post.authorBio || '';
  $('article-author-social').value = post.authorSocial || '';
  $('article-tags').value = (post.tags || []).join(', ');
  $('article-summary').value = post.excerpt || '';
  quill.setContents([]);
  quill.clipboard.dangerouslyPasteHTML(post.content || '');
  submitBtn.textContent = 'Salvar alterações';
  cancelEditBtn.hidden = false;
  commentsPanel.hidden = false;
  loadCommentsForModeration(id);
  articleForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function stopEdit() {
  editingId = null;
  articleForm.reset();
  quill.setContents([]);
  submitBtn.textContent = 'Publicar artigo';
  cancelEditBtn.hidden = true;
  commentsPanel.hidden = true;
  adminCommentsList.innerHTML = '';
}

cancelEditBtn && cancelEditBtn.addEventListener('click', stopEdit);

articleForm && articleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = $('article-title').value.trim();
  const category = $('article-category').value.trim();
  const author = $('article-author').value.trim() || 'Yuri Rangel';
  const authorBio = $('article-author-bio').value.trim();
  const authorSocial = $('article-author-social').value.trim();
  const tags = $('article-tags').value.split(',').map(t => t.trim()).filter(Boolean);
  const summary = $('article-summary').value.trim();
  const content = quill.root.innerHTML;
  if (!title || !content || content === '<p><br></p>') return;

  const payload = {
    title,
    category,
    author,
    authorBio,
    authorSocial,
    tags,
    excerpt: summary,
    content,
    readingMinutes: estimateReadingMinutes(content)
  };

  try {
    if (editingId) {
      await updateDoc(doc(db, 'blogPosts', editingId), { ...payload, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, 'blogPosts'), { ...payload, createdAt: serverTimestamp() });
    }
    stopEdit();
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
          <button type="button" data-id="${post.id}" class="edit-btn">Editar</button>
          <button type="button" data-id="${post.id}" class="delete-btn">Excluir</button>
        </div>
      </li>
    `).join('');

    publishedList.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const post = posts.find(p => p.id === id);
        if (post) startEdit(id, post);
      });
    });

    publishedList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Excluir este artigo?')) return;
        try {
          await deleteDoc(doc(db, 'blogPosts', id));
          if (editingId === id) stopEdit();
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

async function loadCommentsForModeration(postId) {
  if (!adminCommentsList) return;
  adminCommentsList.innerHTML = '<li>Carregando...</li>';

  try {
    const snapshot = await getDocs(collection(db, 'blogPosts', postId, 'comments'));
    if (snapshot.empty) {
      adminCommentsList.innerHTML = '<li>Nenhum comentário ainda.</li>';
      return;
    }

    const comments = snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a, b) => {
        const timeA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });

    adminCommentsList.innerHTML = comments.map(comment => `
      <li>
        <div>
          <strong>${escapeHtml(comment.name || 'Anônimo')}</strong>
          <span>${escapeHtml(comment.message || '')}</span>
          <span>${comment.approved ? 'Aprovado' : 'Pendente de aprovação'}</span>
        </div>
        <div>
          ${comment.approved ? '' : `<button type="button" class="approve-btn" data-id="${comment.id}">Aprovar</button>`}
          <button type="button" class="delete-comment-btn" data-id="${comment.id}">Excluir</button>
        </div>
      </li>
    `).join('');

    adminCommentsList.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await updateDoc(doc(db, 'blogPosts', postId, 'comments', btn.getAttribute('data-id')), { approved: true });
          loadCommentsForModeration(postId);
        } catch (err) {
          console.error('Erro ao aprovar comentário:', err);
          alert('Erro ao aprovar comentário: ' + (err.message || err.code));
        }
      });
    });

    adminCommentsList.querySelectorAll('.delete-comment-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Excluir este comentário?')) return;
        try {
          await deleteDoc(doc(db, 'blogPosts', postId, 'comments', btn.getAttribute('data-id')));
          loadCommentsForModeration(postId);
        } catch (err) {
          console.error('Erro ao excluir comentário:', err);
          alert('Erro ao excluir comentário: ' + (err.message || err.code));
        }
      });
    });
  } catch (err) {
    console.error('Erro ao listar comentários:', err);
    adminCommentsList.innerHTML = '<li>Erro ao carregar comentários.</li>';
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>\"']/g, function (s) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
  });
}
