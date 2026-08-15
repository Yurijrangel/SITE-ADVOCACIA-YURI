(function () {
  'use strict';

  const STORAGE_KEY = 'siteBlogArticles';
  const AUTH_KEY = 'siteBlogAuth';
  const DEFAULT_ARTICLES = [
    {
      id: 'audiencia-de-custodia',
      title: 'Como agir na primeira audiência de custódia?',
      category: 'Audiência de Custódia',
      summary: 'Entenda o que acontece nessa etapa, quais direitos podem ser exercidos e quando a presença de um advogado faz diferença concreta no resultado.',
      content: '<p>Na primeira audiência de custódia, o foco é verificar se a prisão foi legal, se há necessidade de manutenção da prisão e se existem condições de liberdade provisória ou medidas menos gravosas.</p><p>O momento exige atenção especial. Não basta apenas responder às perguntas do juiz. O advogado precisa analisar a legalidade da prisão, a prova de materialidade, a existência de risco e as condições de cada caso.</p><h3>O que deve ser observado</h3><p>É importante confirmar se houve respeito ao direito de comunicação, se a prisão foi fundamentada e se o acusado foi informado de forma adequada sobre seus direitos. Também é essencial verificar se não há possibilidade de concessão de medidas cautelares alternativas.</p><blockquote>A primeira audiência de custódia não é apenas uma formalidade: ela pode ser o momento decisivo para a liberdade do cliente.</blockquote><h3>Quando a presença de um advogado é essencial?</h3><p>Quando há risco de prisão preventiva, questionamento sobre legalidade da prisão, ou quando existem dúvidas sobre a prova e a necessidade de cautelares. Nesses cenários, a presença de um defensor técnico pode diferenciar uma situação de liberdade de uma situação de prisão mantida sem respaldo adequado.</p>',
      date: '2026-08-14',
      readTime: '4 min de leitura'
    },
    {
      id: 'sinais-de-advogado-agora',
      title: '5 sinais de que você precisa de um advogado criminal agora',
      category: 'Defesa Criminal',
      summary: 'Nem toda dúvida pede medida judicial, mas certas situações exigem atenção imediata para evitar prejuízos irreversíveis na sua defesa.',
      content: '<p>Em muitos casos, a pessoa demora a agir porque acredita que a situação ainda não é grave o bastante para exigir assistência jurídica. Porém, em processos criminais, a demora pode gerar decisões muito mais difíceis de reverter depois.</p><p>Alguns sinais são claros: intimações, buscas e apreensões, ameaças de prisão, conversas com autoridades, recebimento de notificações e qualquer prova que sugira investigações.</p><h3>O que você não deve ignorar</h3><ul><li>Recebimento de documentos oficiais ou intimações.</li><li>Solicitação para comparecer a delegacias ou audiências.</li><li>Presença em inquéritos ou investigações relacionadas ao seu nome.</li><li>Qualquer indício de risco de prisão cautelar.</li><li>Necessidade de responder a questionamentos sobre fatos que envolvam sua responsabilidade.</li></ul><p>Esses elementos não significam necessariamente condenação, mas indicam que a defesa precisa começar imediatamente. O ideal é agir antes que a situação se agrave.</p>',
      date: '2026-08-09',
      readTime: '5 min de leitura'
    },
    {
      id: 'quando-habeas-corpus',
      title: 'Quando o habeas corpus é a melhor saída para a liberdade?',
      category: 'Habeas Corpus',
      summary: 'Em alguns casos, a prisão é ilegal ou desproporcional. Saber reconhecer esse cenário pode ser decisivo para a proteção da liberdade.',
      content: '<p>O habeas corpus é um remédio constitucional voltado à proteção da liberdade de locomoção, especialmente quando há constrangimento ilegal ou abuso de poder no curso do processo.</p><p>Ele pode ser usado quando a prisão é ilegal, quando a custódia se tornou arbitrária, ou quando há excesso de prazo, ausência de fundamentação ou desrespeito a garantias constitucionais.</p><h3>Quando ele é indicado</h3><p>Se a pessoa está presa sem base legal adequada, se a decisão de prisão foi tomada sem observância dos requisitos legais ou se houve abuso na aplicação de medidas cautelares. Em alguns casos, o habeas corpus é a forma mais rápida de garantir a liberdade enquanto a questão principal do processo é analisada.</p><p>O importante é entender que não é qualquer pedido que será acolhido. A análise exige argumentos jurídicos sólidos e conhecimento técnico sobre a situação concreta. Por isso, a orientação de um advogado criminal é essencial.</p>',
      date: '2026-08-03',
      readTime: '6 min de leitura'
    }
  ];

  const FALLBACK_CREDENTIALS = {
    username: 'yuri',
    password: 'advocacia2026'
  };

  const firebaseConfig = window.FIREBASE_CONFIG || {};
  const isFirebaseConfigured = !!(
    window.firebase &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'SEU_PROJETO'
  );

  let auth = null;
  let db = null;

  if (isFirebaseConfigured) {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
  }

  function getLocalArticles() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
      return DEFAULT_ARTICLES;
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_ARTICLES;
    } catch (error) {
      return DEFAULT_ARTICLES;
    }
  }

  function setLocalArticles(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }

  function getArticles() {
    if (db) {
      return getLocalArticles();
    }
    return getLocalArticles();
  }

  function setArticles(articles) {
    if (db) {
      return;
    }
    setLocalArticles(articles);
  }

  function showPanel() {
    const loginBox = document.getElementById('login-box');
    const adminPanel = document.getElementById('admin-panel');
    if (loginBox) loginBox.classList.add('hidden');
    if (adminPanel) adminPanel.classList.remove('hidden');
  }

  function showLogin() {
    const loginBox = document.getElementById('login-box');
    const adminPanel = document.getElementById('admin-panel');
    if (loginBox) loginBox.classList.remove('hidden');
    if (adminPanel) adminPanel.classList.add('hidden');
  }

  function isLogged() {
    const session = sessionStorage.getItem(AUTH_KEY);
    return session === 'true';
  }

  function showMessage(message, isError) {
    const errorNode = document.getElementById('login-error');
    if (!errorNode) return;
    errorNode.textContent = message;
    errorNode.style.color = isError ? '#b33939' : '#1f4d3a';
  }

  function buildArticlePayload(title, category, summary, content) {
    const id = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80) || 'artigo-novo';

    return {
      id,
      title,
      category,
      summary,
      content: content
        .split('\n\n')
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join(''),
      date: new Date().toISOString().slice(0, 10),
      readTime: '4 min de leitura',
      createdAt: firebase.firestore.FieldValue ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
    };
  }

  async function renderPublishedList() {
    const publishedList = document.getElementById('published-list');
    if (!publishedList) return;

    if (db) {
      try {
        const snapshot = await db.collection('blogPosts').orderBy('createdAt', 'desc').get();
        const articles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (!articles.length) {
          publishedList.innerHTML = '<li>Nenhum artigo publicado ainda.</li>';
          return;
        }

        publishedList.innerHTML = articles.map((article) => `
          <li>
            <div>
              <strong>${article.title}</strong>
              <span>${article.category}</span>
            </div>
            <button type="button" data-delete-id="${article.id}" class="delete-btn">Excluir</button>
          </li>
        `).join('');

        publishedList.querySelectorAll('[data-delete-id]').forEach((button) => {
          button.addEventListener('click', async function () {
            const id = this.getAttribute('data-delete-id');
            await db.collection('blogPosts').doc(id).delete();
            renderPublishedList();
          });
        });
        return;
      } catch (error) {
        console.error('Erro ao carregar posts do Firebase:', error);
      }
    }

    const articles = getLocalArticles();
    if (!articles.length) {
      publishedList.innerHTML = '<li>Nenhum artigo publicado ainda.</li>';
      return;
    }

    publishedList.innerHTML = articles.map((article) => `
      <li>
        <div>
          <strong>${article.title}</strong>
          <span>${article.category}</span>
        </div>
        <button type="button" data-delete-id="${article.id}" class="delete-btn">Excluir</button>
      </li>
    `).join('');

    publishedList.querySelectorAll('[data-delete-id]').forEach((button) => {
      button.addEventListener('click', function () {
        const id = this.getAttribute('data-delete-id');
        const filtered = getLocalArticles().filter((article) => article.id !== id);
        setLocalArticles(filtered);
        renderPublishedList();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const yearNode = document.getElementById('year');
    if (yearNode) yearNode.textContent = new Date().getFullYear();

    if (isLogged()) {
      showPanel();
    } else if (auth) {
      showLogin();
    } else {
      showLogin();
    }

    if (auth) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          showPanel();
          renderPublishedList();
        } else {
          showLogin();
        }
      });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (auth) {
          try {
            await auth.signInWithEmailAndPassword(email, password);
            sessionStorage.setItem(AUTH_KEY, 'true');
            showMessage('', false);
            showPanel();
            renderPublishedList();
          } catch (error) {
            console.error('Login Firebase falhou:', error);
            showMessage('Email ou senha inválidos. Verifique sua conta no Firebase.', true);
          }
          return;
        }

        const fallbackEmail = FALLBACK_CREDENTIALS.username;
        const fallbackPassword = FALLBACK_CREDENTIALS.password;
        if (email === fallbackEmail && password === fallbackPassword) {
          sessionStorage.setItem(AUTH_KEY, 'true');
          showMessage('', false);
          showPanel();
          renderPublishedList();
          return;
        }

        showMessage('Usuário ou senha inválidos.', true);
      });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function () {
        if (auth) {
          await auth.signOut();
        }
        sessionStorage.removeItem(AUTH_KEY);
        showLogin();
      });
    }

    const articleForm = document.getElementById('article-form');
    if (articleForm) {
      articleForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const title = document.getElementById('article-title').value.trim();
        const category = document.getElementById('article-category').value.trim();
        const summary = document.getElementById('article-summary').value.trim();
        const content = document.getElementById('article-content').value.trim();

        if (!title || !category || !summary || !content) {
          return;
        }

        if (db) {
          const payload = buildArticlePayload(title, category, summary, content);
          await db.collection('blogPosts').add({
            ...payload,
            createdAt: new Date()
          });
          articleForm.reset();
          renderPublishedList();
          return;
        }

        const existing = getLocalArticles();
        const id = title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .slice(0, 80) || 'artigo-novo';

        const article = {
          id,
          title,
          category,
          summary,
          content: content
            .split('\n\n')
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join(''),
          date: new Date().toISOString().slice(0, 10),
          readTime: '4 min de leitura'
        };

        const updated = [article, ...existing].slice(0, 20);
        setLocalArticles(updated);
        articleForm.reset();
        renderPublishedList();
      });
    }

    renderPublishedList();
  });
}());
