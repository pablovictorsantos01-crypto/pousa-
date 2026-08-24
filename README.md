# Pousa — site de hospedagens estilo Airbnb

Site estático de hospedagens (HTML, CSS e JS puro, sem framework, sem backend
e sem banco de dados). As hospedagens são uma lista fixa dentro de `js/main.js`,
e os favoritos ficam salvos no navegador de cada visitante (`localStorage`) —
não exige login nem conta.

## Como rodar localmente

Não precisa de instalação nem build — é só abrir `index.html` no navegador,
ou servir a pasta com qualquer servidor estático, por exemplo:

```bash
npx serve .
```

## Estrutura

- `index.html` — página principal com busca, filtros e grade de hospedagens
- `css/style.css` — identidade visual (paleta, tipografia, animações)
- `js/main.js` — dados das hospedagens, filtros e favoritos (via `localStorage`)

## Deploy

Site 100% estático — funciona em qualquer hospedagem estática (Vercel, Netlify,
GitHub Pages, etc.), sem nenhuma configuração de servidor ou banco de dados.