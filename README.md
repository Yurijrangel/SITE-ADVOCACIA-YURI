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

## Firebase (para login e publicação de artigos)

O blog foi preparado para funcionar com Firebase Auth + Firestore.

### 1. Criar o projeto no Firebase
- Acesse https://console.firebase.google.com/
- Crie um projeto novo
- Ative `Authentication`
- Em `Sign-in method`, habilite `Email/Password`
- Crie pelo menos um usuário administrador
- Ative `Firestore Database`
- Crie uma base no modo teste ou produção

### 2. Configurar o arquivo de conexão
Abra `firebase-config.js` e substitua os valores fictícios pelos dados do seu projeto Firebase:

```js
window.FIREBASE_CONFIG = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_PROJETO.firebaseapp.com',
  projectId: 'SEU_PROJETO',
  storageBucket: 'SEU_PROJETO.appspot.com',
  messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
  appId: 'SEU_APP_ID'
};
```

Esses valores podem ser pegos em:
- Firebase Console → Configuração do projeto → Seus apps → Configuração do web app

### 3. Usar o painel admin
Após configurar o Firebase, abra:

```text
http://localhost:8000/admin.html
```

Faça login com o e-mail e senha criados no Firebase e publique os artigos.

### 4. Como os artigos são armazenados
Os artigos são salvos na coleção `blogPosts` do Firestore.

### 5. Imagens nos artigos
O botão de imagem do editor faz upload do arquivo para o **Firebase Storage** (pasta `blog-images/`) e insere no artigo apenas o link da imagem — assim o texto não fica gigante e não estoura o limite de 1 MB por documento do Firestore.

Para funcionar, ative o Storage no projeto:

- Firebase Console → `Build` → `Storage` → `Get started` (cria o bucket padrão)
- Em `Rules`, use algo como:

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blog-images/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

Limite atual no admin: imagens de até 5 MB.

### 6. Segurança
Para produção, o ideal é configurar regras do Firestore para permitir escrita só para usuários autenticados.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Licença

© 2026 Yuri Rangel Advocacia. Todos os direitos reservados.

