(function () {
  'use strict';

  const STORAGE_KEY = 'siteBlogArticles';
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

  const firebaseConfig = window.FIREBASE_CONFIG || {};
  const isFirebaseConfigured = !!(
    window.firebase &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'SEU_PROJETO'
  );

  let db = null;

  if (isFirebaseConfigured) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  }

  function getLocalArticles() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
      return DEFAULT_ARTICLES;
    }

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_ARTICLES;
    } catch (error) {
      return DEFAULT_ARTICLES;
    }
  }

  function formatDate(value) {
    if (!value) return 'Hoje';
    const date = new Date(value + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  async function getArticles() {
    if (db) {
      try {
        const snapshot = await db.collection('blogPosts').orderBy('createdAt', 'desc').get();
        const articles = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        if (!articles.length) {
          return getLocalArticles();
        }

        return articles;
      } catch (error) {
        console.error('Erro ao carregar posts do Firebase:', error);
      }
    }

    return getLocalArticles();
  }

  async function renderList() {
    const container = document.getElementById('blog-grid');
    if (!container) return;

    const articles = await getArticles();

    if (!articles.length) {
      container.innerHTML = '<p class="empty-state">Ainda não há artigos publicados.</p>';
      return;
    }

    container.innerHTML = articles.map((article) => `
      <article class="blog-card reveal-up">
        <span class="card-tag">${article.category || 'Artigo'}</span>
        <h2>${article.title}</h2>
        <p>${article.summary || ''}</p>
        <div class="article-meta">
          <span>${article.readTime || '4 min de leitura'}</span>
          <span>${formatDate(article.date)}</span>
        </div>
        <a href="blog.html?post=${encodeURIComponent(article.id)}" class="article-link">Leia o artigo</a>
      </article>
    `).join('');
  }

  async function renderDetail() {
    const articleDetail = document.getElementById('article-detail');
    if (!articleDetail) return;

    const query = new URLSearchParams(window.location.search);
    const articleId = query.get('post');
    const articles = await getArticles();
    const article = articles.find((item) => item.id === articleId) || articles[0];

    if (!article) {
      articleDetail.innerHTML = '<div class="container article-shell"><p>Artigo não encontrado.</p><a href="blog.html" class="btn btn-dark btn-outline-dark">Voltar para o blog</a></div>';
      return;
    }

    articleDetail.innerHTML = `
      <div class="container article-shell">
        <p class="article-kicker">${article.category || 'Artigo'}</p>
        <h2>${article.title}</h2>
        <div class="article-meta article-meta-large">
          <span>${article.readTime || '4 min de leitura'}</span>
          <span>${formatDate(article.date)}</span>
        </div>
        ${article.content}
        <a href="blog.html" class="btn btn-dark btn-outline-dark">Voltar para o blog</a>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderList();
    renderDetail();
  });
}());
