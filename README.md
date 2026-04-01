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
3. **Áreas de Atuação** — 8 cards com especialidades
4. **Atendimento Urgente** — Seção de urgência destacada
5. **Diferenciais** — 4 pontos-chave de valor
6. **Contato** — Formulário + botão WhatsApp
7. **Rodapé** — Informações legais e rápidas

✅ **Funcionalidades**
- Botão flutuante WhatsApp animado
- Links de WhatsApp integrados (wa.me API)
- Menu responsivo para mobile
- Scroll suave entre seções
- Animações ao scroll
- Formulário com integração WhatsApp

## Como Executar Localmente

### Opção 1: Python (Recomendado)
```powershell
cd "c:\Users\yuri.rangel.UNIANDRADE\Documents\site yuri"
python -m http.server 8000
```

### Opção 2: Node.js
```powershell
cd "c:\Users\yuri.rangel.UNIANDRADE\Documents\site yuri"
npx serve -s . -l 8000
```

**Abra no navegador:** http://localhost:8000

## Estrutura

```
site yuri/
├── index.html          (página principal)
├── css/
│   └── styles.css      (estilos profissionais)
├── js/
│   └── scripts.js      (interatividade + WhatsApp)
├── assets/
│   ├── logo.svg        (logo do escritório)
│   └── favicon.svg     (favicon)
├── README.md           (este arquivo)
└── .gitignore
```

## Personalização

### 1. Número de WhatsApp
No arquivo `index.html`, substitua `5541999999999` pelo número real:
```html
https://wa.me/5541999999999?text=...
```

### 2. OAB e Informações Legais
Edite no `index.html` (seção footer):
```html
<p><strong>OAB/PR:</strong> [Inserir número OAB]</p>
```

### 3. Cores (opcional)
Em `css/styles.css`, altere as variáveis CSS:
```css
:root{
  --primary:#1F4D3A;      /* verde escuro */
  --secondary:#C9A86A;    /* dourado */
  --bg:#F5F5F5;           /* fundo */
}
```

## Próximas Etapas

- [ ] Integrar CMS (headless) ou backend
- [ ] Adicionar formulário backend real
- [ ] SEO + Schema Markup (LD-JSON)
- [ ] Analytics (Google Analytics)
- [ ] Depoimentos de clientes (seção adicional)
- [ ] Blog/Artigos jurídicos
- [ ] Deploy (GitHub Pages, Netlify, Vercel)

## Deploy Recomendado

**GitHub Pages** (grátis, sem backend):
```powershell
git init
git add .
git commit -m "Site Yuri Rangel Advocacia"
git branch -M main
git remote add origin https://github.com/seu-usuario/yuri-rangel-advocacia.git
git push -u origin main
```

Depois ativar GitHub Pages nas configurações do repositório.

**Alternativas:** Netlify, Vercel (arrastar e soltar)

## Licença

© 2026 Yuri Rangel Advocacia. Todos os direitos reservados.

