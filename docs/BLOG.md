# Blog Jurídico — Como Adicionar Artigos

Este guia explica como adicionar, editar e remover artigos do blog jurídico do site.

---

## Como funciona o blog

O blog funciona de forma simples:
1. Os artigos ficam no arquivo `data/blog.json`
2. O JavaScript lê esse arquivo automaticamente
3. Os artigos são exibidos como cards na página `blog.html`
4. Ao clicar em um card, o artigo completo abre em um modal

**Você não precisa editar HTML para adicionar artigos!** Só edite o arquivo JSON.

---

## Estrutura de um artigo

Cada artigo no `data/blog.json` tem este formato:

```json
{
  "id": 5,
  "titulo": "Título do Artigo Jurídico",
  "resumo": "Breve resumo que aparece no card — máximo 2 frases.",
  "conteudo": "Conteúdo completo do artigo.\n\nPode ter múltiplos parágrafos.\nUse \\n para quebras de linha.",
  "categoria": "Direito Penal",
  "data": "2026-04-01",
  "autor": "Yuri Rangel",
  "imagem": null
}
```

### Campos explicados

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `id` | ✅ Sim | Número único. Sempre incremente (+1 do último) |
| `titulo` | ✅ Sim | Título do artigo (aparece no card e no modal) |
| `resumo` | ✅ Sim | Resumo curto exibido no card |
| `conteudo` | ✅ Sim | Texto completo (use `\n` para nova linha) |
| `categoria` | ✅ Sim | Ex: "Direito Penal", "Habeas Corpus", "LGPD" |
| `data` | ✅ Sim | Formato: `AAAA-MM-DD` (ex: `2026-04-01`) |
| `autor` | ✅ Sim | Nome do autor |
| `imagem` | ❌ Opcional | Caminho da imagem ou `null` se não tiver |

---

## Como adicionar um novo artigo

### Passo 1 — Abrir o arquivo

Abra o arquivo `data/blog.json` em qualquer editor de texto.

### Passo 2 — Adicionar o artigo

Adicione um novo objeto no **início** da lista (para aparecer primeiro no blog):

```json
[
  {
    "id": 5,
    "titulo": "Meu Novo Artigo",
    "resumo": "Resumo do artigo para aparecer no card.",
    "conteudo": "Conteúdo completo do artigo aqui.\n\nSegundo parágrafo.\n\n**Título em negrito:**\n\n- Item 1\n- Item 2",
    "categoria": "Direito Penal",
    "data": "2026-04-01",
    "autor": "Yuri Rangel",
    "imagem": null
  },
  {
    "id": 1,
    "titulo": "Artigo Anterior...",
    ...
  }
]
```

### Passo 3 — Verificar a formatação

O JSON precisa estar correto. Use o validador online: https://jsonlint.com

Cole o conteúdo do arquivo e clique em **Validate JSON**. Se aparecer "Valid JSON", está correto.

### Passo 4 — Salvar e publicar

Salve o arquivo e faça o deploy (publicação) do site normalmente.

---

## Como editar um artigo existente

1. Abra `data/blog.json`
2. Encontre o artigo pelo `"titulo"` ou `"id"`
3. Edite os campos desejados
4. Salve e publique

---

## Como remover um artigo

1. Abra `data/blog.json`
2. Delete o bloco inteiro do artigo (do `{` ao `}` correspondente)
3. Cuide para manter as vírgulas corretas entre os artigos restantes
4. Salve e publique

---

## Categorias sugeridas

Use categorias consistentes para facilitar a organização:

- `Direito Penal`
- `Processo Penal`
- `Direito Constitucional`
- `Lei de Drogas`
- `Execução Penal`
- `Violência Doméstica`
- `Crimes Econômicos`
- `Habeas Corpus`
- `Dicas Jurídicas`

---

## Exemplo de artigo completo

```json
{
  "id": 5,
  "titulo": "Presunção de Inocência: entenda seu direito",
  "resumo": "A presunção de inocência é um princípio constitucional fundamental. Saiba como ele te protege no processo penal.",
  "conteudo": "A presunção de inocência está prevista no artigo 5º, inciso LVII, da Constituição Federal:\n\n'Ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.'\n\n**O que isso significa na prática?**\n\n- Você não precisa provar sua inocência — é o Estado que deve provar sua culpa\n- A prisão antes do julgamento é a exceção, não a regra\n- Toda dúvida deve ser interpretada em seu favor (in dubio pro reo)\n\n**Como a defesa usa esse princípio?**\n\nUm advogado criminal experiente utiliza a presunção de inocência como fundamento em recursos, habeas corpus e alegações finais, contestando provas frágeis e garantindo julgamento justo.\n\nTem dúvidas sobre seu caso? Entre em contato agora.",
  "categoria": "Direito Constitucional",
  "data": "2026-04-15",
  "autor": "Yuri Rangel",
  "imagem": null
}
```

---

## Dicas para escrever bons artigos jurídicos

1. **Título claro**: Use linguagem que o cliente entende, não só jargão jurídico
2. **Resumo direto**: Explique em 1-2 frases o que o artigo responde
3. **Linguagem acessível**: Explique termos técnicos quando usá-los
4. **Chamada para ação**: Termine com convite para contato
5. **Regularidade**: Publique ao menos 1-2 artigos por mês para melhorar o SEO
