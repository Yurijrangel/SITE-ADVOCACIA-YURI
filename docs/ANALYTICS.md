# Google Analytics 4 (GA4) — Guia de Configuração

Este guia explica como configurar o Google Analytics 4 no site de Yuri Rangel Advocacia.

---

## O que é o Google Analytics?

O Google Analytics é uma ferramenta gratuita do Google que mostra informações sobre os visitantes do seu site:
- Quantas pessoas visitaram o site
- De onde vieram (Google, WhatsApp, redes sociais)
- Quais páginas mais acessaram
- Quanto tempo ficaram no site
- Em qual cidade estão

---

## Passo a Passo para Configurar

### Passo 1 — Criar conta no Google Analytics

1. Acesse: https://analytics.google.com
2. Clique em **"Começar a usar"**
3. Faça login com sua conta Google
4. Clique em **"Criar conta"**

### Passo 2 — Configurar a propriedade

1. **Nome da conta:** `Yuri Rangel Advocacia`
2. Clique em **Próxima**
3. **Nome da propriedade:** `Site Advocacia Yuri`
4. **Fuso horário:** `Brasil — Horário de Brasília`
5. **Moeda:** `Real Brasileiro (BRL)`
6. Clique em **Próxima**
7. Preencha as informações do negócio e clique em **Criar**

### Passo 3 — Obter o Measurement ID

1. No painel do GA4, vá em **Administrador** (ícone de engrenagem)
2. Em **Propriedade**, clique em **Fluxos de dados**
3. Clique em **Adicionar fluxo → Web**
4. Digite a URL do site e um nome
5. Copie o **Measurement ID** — parece com `G-XXXXXXXXXX`

### Passo 4 — Inserir o ID no site

Abra o arquivo `index.html` e localize estas duas linhas (há duas ocorrências):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```
e
```javascript
gtag('config', 'G-XXXXXXXXXX');
```

Substitua **G-XXXXXXXXXX** pelo seu Measurement ID real. Exemplo:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123DEF4');
</script>
```

> **Importante:** Substitua em ambos os lugares — na URL do script e no `gtag('config', ...)`.

### Passo 5 — Verificar se está funcionando

1. Faça deploy do site (publicar)
2. Acesse o site pelo seu celular ou computador
3. No painel do GA4, clique em **Relatórios → Tempo real**
4. Você deve ver "1 usuário ativo agora"

---

## O que acompanhar no Analytics

### Relatórios mais úteis para um escritório de advocacia

| Relatório | Onde encontrar | O que mostra |
|-----------|----------------|--------------|
| Visão geral | Relatórios → Visão geral | Total de visitas, usuários novos |
| Páginas mais vistas | Relatórios → Engajamento → Páginas | Quais páginas são mais acessadas |
| Origem do tráfego | Relatórios → Aquisição | De onde vêm os visitantes |
| Localização | Relatórios → Dados demográficos | Cidades dos visitantes |
| Tempo real | Relatórios → Tempo real | Visitantes agora |

### Métricas importantes

- **Usuários:** Quantidade de pessoas únicas que visitaram
- **Sessões:** Número de visitas (uma pessoa pode ter várias sessões)
- **Taxa de rejeição:** % de pessoas que saem sem interagir (quanto menor, melhor)
- **Duração média:** Tempo médio que as pessoas ficam no site

---

## Privacidade e LGPD

No Brasil, a LGPD (Lei Geral de Proteção de Dados) exige que os usuários sejam informados sobre coleta de dados. Recomenda-se adicionar um aviso de cookies ao site. Uma solução simples gratuita é o **Cookieyes** (https://www.cookieyes.com).

---

## Dúvidas

Para suporte, acesse a Central de Ajuda do Google Analytics:
https://support.google.com/analytics
