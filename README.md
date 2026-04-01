# Yuri Rangel Advocacia — Site Profissional

Site institucional moderno e responsivo para escritório de **advocacia criminal especializado**.

## Características

✅ **Design Profissional**
- Paleta de cores sofisticada (verde escuro #1F4D3A, dourado #C9A86A, branco #F5F5F5)
- Tipografia elegante (Merriweather serif + Poppins clean)
- Layout minimalista e responsivo

✅ **Seções Completas**
1. **Hero** — Chamada impactante com botões de ação
2. **Sobre** — Apresentação do escritório + diferenciais
3. **Áreas de Atuação** — 16 cards com especialidades
4. **Depoimentos** — Seção com avaliações de clientes
5. **Atendimento Urgente** — Seção de urgência destacada
6. **Diferenciais** — 4 pontos-chave de valor
7. **Rodapé** — Informações legais e rápidas

✅ **SEO e Rastreamento**
- Meta tags completas (description, keywords, Open Graph)
- Schema Markup LD-JSON (Organization, LegalService, BreadcrumbList)
- Google Analytics 4 (GA4) integrado — configure seu ID em `index.html`

✅ **Blog Jurídico**
- Página `blog.html` com artigos renderizados dinamicamente
- Artigos em `data/blog.json` — edite apenas o JSON para adicionar conteúdo
- Modal de leitura com artigo completo
- CTA para contato após cada artigo

✅ **Funcionalidades**
- Botão flutuante WhatsApp animado
- Links de WhatsApp integrados (wa.me API)
- Menu responsivo para mobile
- Scroll suave entre seções
- Animações ao scroll

## Como Executar Localmente

### Opção 1: Python (Recomendado)
```bash
cd SITE-ADVOCACIA-YURI
python -m http.server 8000
```

### Opção 2: Node.js
```bash
cd SITE-ADVOCACIA-YURI
npx serve -s . -l 8000
```

> **Abra no navegador:** http://localhost:8000

> ⚠️ O blog precisa de um servidor local (não abre via `file://`) por usar `fetch()`.

## Estrutura

```
SITE-ADVOCACIA-YURI/
├── index.html          (página principal)
├── blog.html           (blog jurídico)
├── css/
│   └── styles.css      (estilos completos)
├── js/
│   └── scripts.js      (interatividade + blog)
├── data/
│   ├── testimonials.json  (depoimentos em JSON)
│   └── blog.json          (artigos jurídicos)
├── docs/
│   ├── SEO.md          (guia de SEO)
│   ├── ANALYTICS.md    (setup Google Analytics)
│   └── BLOG.md         (como adicionar artigos)
├── assets/
│   ├── logo.png        (logo do escritório)
│   ├── fundo.png       (imagem de fundo hero)
│   └── yuri.jpeg       (foto do advogado)
├── README.md           (este arquivo)
└── .gitignore
```

## Configurações Essenciais

### 1. Google Analytics
Abra `index.html` e substitua `G-XXXXXXXXXX` pelo seu Measurement ID real:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SEU-ID-AQUI"></script>
```
📖 Veja o guia completo em [`docs/ANALYTICS.md`](docs/ANALYTICS.md)

### 2. URL do Site (Schema Markup)
Substitua `https://yurijrangel.github.io/SITE-ADVOCACIA-YURI/` pela URL real do site no bloco LD-JSON do `index.html`.

### 3. Adicionar Artigos ao Blog
Edite apenas o arquivo `data/blog.json`. Não é necessário tocar no HTML.
📖 Veja o guia completo em [`docs/BLOG.md`](docs/BLOG.md)

### 4. Cores (opcional)
Em `css/styles.css`, altere as variáveis CSS:
```css
:root {
  --primary:   #1F4D3A;   /* verde escuro */
  --secondary: #C9A86A;   /* dourado */
  --bg:        #F5F5F5;   /* fundo */
}
```

## Deploy Recomendado

### GitHub Pages (grátis)
```bash
git add .
git commit -m "Atualização do site"
git push origin main
```
Ative GitHub Pages nas configurações do repositório → Pages → Branch: main.

**URL gerada:** `https://yurijrangel.github.io/SITE-ADVOCACIA-YURI/`

### Alternativas
- **Netlify** — Arraste a pasta para https://app.netlify.com/drop
- **Vercel** — Importe o repositório em https://vercel.com

## Documentação

| Arquivo | Descrição |
|---------|-----------|
| [`docs/SEO.md`](docs/SEO.md) | Como otimizar para o Google (Schema Markup, meta tags) |
| [`docs/ANALYTICS.md`](docs/ANALYTICS.md) | Como configurar o Google Analytics 4 |
| [`docs/BLOG.md`](docs/BLOG.md) | Como adicionar e editar artigos no blog |

## Licença

© 2026 Yuri Rangel Advocacia. Todos os direitos reservados.

