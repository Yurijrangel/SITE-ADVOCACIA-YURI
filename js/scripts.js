// SCRIPTS — Advocacia Criminal Site
document.addEventListener('DOMContentLoaded', function(){
  // 1. Inserir ano no footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Toggle menu mobile
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      mainNav.classList.toggle('open');
    });

    // Fechar menu ao clicar em link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // 3. Scroll suave para links de âncora
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          const headerHeight = document.querySelector('.site-header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          if(mainNav) mainNav.classList.remove('open');
        }
      }
    });
  });

  // 4. Lidar com envio do formulário (simulado)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const message = document.getElementById('message').value;
      
      // Enviar via WhatsApp (alternativa)
      const whatsappMsg = `Olá, meu nome é ${name}. Telefone: ${phone}. Mensagem: ${message}`;
      const encodedMsg = encodeURIComponent(whatsappMsg);
      window.open(`https://wa.me/5541984397354?text=${encodedMsg}`, '_blank');
      
      // Limpar formulário
      contactForm.reset();
      alert('Mensagem enviada via WhatsApp!');
    });
  }

  // 5. Animação ao scroll
  const observer = new IntersectionObserver(function(entries){
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  });
  
  document.querySelectorAll('.area-card, .differential-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // 6. Carregar e renderizar artigos do blog
  const blogGrid = document.getElementById('blog-grid');
  if(blogGrid){
    carregarBlog();
  }
});

// ============================================================
//  BLOG — Carregar artigos do JSON e renderizar na página
// ============================================================

/**
 * Carrega os artigos de data/blog.json e os exibe na página.
 * Para adicionar novos artigos, edite apenas o arquivo data/blog.json.
 */
function carregarBlog(){
  const blogGrid = document.getElementById('blog-grid');

  fetch('data/blog.json')
    .then(function(response){
      if(!response.ok) throw new Error('Não foi possível carregar os artigos.');
      return response.json();
    })
    .then(function(artigos){
      blogGrid.innerHTML = '';

      if(!artigos || artigos.length === 0){
        blogGrid.innerHTML = '<p class="blog-loading">Nenhum artigo encontrado.</p>';
        return;
      }

      artigos.forEach(function(artigo){
        const card = criarCardArtigo(artigo);
        blogGrid.appendChild(card);
      });

      // Configurar modal após criar os cards
      configurarModal(artigos);
    })
    .catch(function(err){
      blogGrid.innerHTML = '<p class="blog-loading">Erro ao carregar artigos. Tente novamente.</p>';
      console.error('Blog:', err);
    });
}

/**
 * Cria um card HTML para um artigo do blog.
 * @param {Object} artigo - Objeto com dados do artigo (id, titulo, resumo, categoria, data, autor)
 * @returns {HTMLElement} Elemento DOM do card
 */
function criarCardArtigo(artigo){
  const card = document.createElement('article');
  card.className = 'blog-card';
  card.setAttribute('data-id', artigo.id);
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', 'Ler artigo: ' + artigo.titulo);

  const dataFormatada = formatarData(artigo.data);

  card.innerHTML = `
    <div class="blog-card-body">
      <span class="blog-card-categoria">${artigo.categoria}</span>
      <h3>${artigo.titulo}</h3>
      <p>${artigo.resumo}</p>
    </div>
    <div class="blog-card-footer">
      <span><strong>${artigo.autor}</strong> · ${dataFormatada}</span>
      <span class="blog-card-link">Ler mais →</span>
    </div>
  `;

  return card;
}

/**
 * Configura o modal para exibir o conteúdo completo de um artigo.
 * @param {Array} artigos - Lista de artigos carregados do JSON
 */
function configurarModal(artigos){
  const modal = document.getElementById('blog-modal');
  if(!modal) return;

  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCategoria = document.getElementById('modal-categoria');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalBody = document.getElementById('modal-body');

  // Abrir modal ao clicar em um card
  document.querySelectorAll('.blog-card').forEach(function(card){
    card.addEventListener('click', function(){
      const id = parseInt(card.getAttribute('data-id'));
      const artigo = artigos.find(a => a.id === id);
      if(artigo) abrirModal(artigo);
    });

    // Acessibilidade: abrir modal com Enter/Space
    card.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        const id = parseInt(card.getAttribute('data-id'));
        const artigo = artigos.find(a => a.id === id);
        if(artigo) abrirModal(artigo);
      }
    });
  });

  function abrirModal(artigo){
    modalCategoria.textContent = artigo.categoria;
    modalTitle.textContent = artigo.titulo;
    modalMeta.textContent = artigo.autor + ' · ' + formatarData(artigo.data);
    modalBody.textContent = artigo.conteudo;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function fecharModal(){
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', fecharModal);

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !modal.hidden) fecharModal();
  });
}

/**
 * Formata uma data no formato YYYY-MM-DD para o padrão brasileiro DD/MM/YYYY.
 * @param {string} dataStr - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada em pt-BR
 */
function formatarData(dataStr){
  try {
    const partes = dataStr.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  } catch(e) {
    return dataStr;
  }
}

