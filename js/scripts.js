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
      const isOpen = mainNav.style.display === 'flex';
      mainNav.style.display = isOpen ? 'none' : 'flex';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '100%';
      mainNav.style.left = '0';
      mainNav.style.right = '0';
      mainNav.style.background = 'white';
      mainNav.style.flexDirection = 'column';
      mainNav.style.gap = '0';
      mainNav.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      mainNav.style.borderTop = '1px solid #eee';
      document.querySelectorAll('.main-nav a').forEach(link => {
        link.style.padding = '12px 24px';
        link.style.borderBottom = '1px solid #f0f0f0';
      });
    });

    // Fechar menu ao clicar em link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.style.display = 'none';
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
          // Fechar menu mobile se aberto
          const mainNav = document.getElementById('main-nav');
          if(mainNav) mainNav.style.display = 'none';
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
      window.open(`https://wa.me/5541999999999?text=${encodedMsg}`, '_blank');
      
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
});

