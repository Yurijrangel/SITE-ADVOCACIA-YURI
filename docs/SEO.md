# SEO — Guia de Otimização para Mecanismos de Busca

Este guia explica como o SEO do site de Yuri Rangel Advocacia foi implementado e como mantê-lo.

---

## O que é SEO?

SEO (Search Engine Optimization) é o conjunto de técnicas que melhoram a visibilidade do seu site no Google e outros buscadores. Um bom SEO significa aparecer nas primeiras posições quando alguém pesquisa "advogado criminal Curitiba", por exemplo.

---

## O que foi implementado

### 1. Meta Tags (no `<head>` do HTML)

```html
<meta name="description" content="Descrição do site..." />
<meta name="keywords" content="palavras-chave, separadas, por vírgula" />
<meta property="og:title" content="Título para redes sociais" />
<meta property="og:description" content="Descrição para redes sociais" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://seu-site.com" />
```

**O que cada uma faz:**
- `description` → Aparece como subtítulo nos resultados do Google
- `keywords` → Palavras-chave (menos importante hoje, mas boa prática)
- `og:*` → Controla como o link aparece ao ser compartilhado no WhatsApp, Facebook, etc.

### 2. Schema Markup (LD-JSON)

O Schema Markup é um código especial que conta ao Google informações estruturadas sobre o seu negócio. Está implementado como um bloco `<script type="application/ld+json">` no `index.html`.

Foram implementados três tipos:

#### Organization (Organização)
Informa ao Google que o site pertence a uma organização chamada "Yuri Rangel Advocacia".

#### LegalService (Serviço Jurídico)
Informa que é um escritório de advocacia, com telefone, área de atuação, e serviços oferecidos. Isso pode aparecer como um "card de negócio" nos resultados do Google.

#### BreadcrumbList (Navegação em Migalhas)
Mostra ao Google a estrutura de navegação do site:
```
Início > Áreas de Atuação > Blog Jurídico
```

---

## Como atualizar o Schema Markup

Abra o `index.html` e localize o bloco:
```html
<script type="application/ld+json">
```

### Atualizar o telefone
Substitua `+55-41-98439-7354` pelo número atualizado no formato internacional.

### Atualizar a URL do site
Se mudar o domínio, substitua `https://yurijrangel.github.io/SITE-ADVOCACIA-YURI/` pela nova URL em todos os campos `"url"` e `"item"`.

### Adicionar mais serviços
No objeto `"hasOfferCatalog"`, adicione itens no array `"itemListElement"`:
```json
{"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Nome do Serviço"}}
```

---

## Como verificar se o SEO está funcionando

### Ferramenta de Teste de Rich Results (Google)
1. Acesse: https://search.google.com/test/rich-results
2. Cole a URL do site
3. Verifique se o Schema Markup foi reconhecido sem erros

### Google Search Console
1. Acesse: https://search.google.com/search-console
2. Adicione seu site
3. Acompanhe cliques, impressões e posições no Google

---

## Boas práticas de SEO para advogados

- **Títulos claros**: Inclua cidade e especialidade (ex: "Advogado Criminal Curitiba")
- **Blog ativo**: Publicar artigos jurídicos regularmente melhora o ranqueamento
- **Velocidade**: O Google favorece sites rápidos — evite imagens muito pesadas
- **Mobile**: Certifique-se que o site funciona bem no celular
- **Links externos**: Tenha o escritório listado no Google Meu Negócio e OAB online

---

## Palavras-chave sugeridas para o Sul do Brasil

- advogado criminal Curitiba
- defesa criminal Paraná
- habeas corpus PR SC RS
- advogado penal Sul do Brasil
- advocacia criminal urgente
