# 🐧⚡ BUG PINGUIM

Site onde a pessoa entra, aperta **BUGAR!**, informa o modelo do celular e a
rede (nome do Wi-Fi ou 4G/5G) e, em seguida, um **terminal de diagnóstico**
analisa o dispositivo em tempo real com dados reais. No final, um botão leva
para o site.

Feito com **React + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + Motion**.

## Rodando

```bash
npm install      # primeira vez
npm run dev      # servidor de desenvolvimento → http://localhost:5173
```

Build de produção:

```bash
npm run build    # gera a pasta dist/
npm run preview  # serve o build localmente
```

## Estrutura

```
src/
├── App.tsx              # máquina de estados: landing → form → hacking → sucesso
├── components/
│   ├── Landing.tsx      # tela inicial (hero, ticker, features, CTA)
│   ├── DataForm.tsx     # formulário: modelo do celular + rede (Wi-Fi ou 4G/5G)
│   ├── Success.tsx      # confirmação + botão "IR PARA O SITE"
│   ├── GlitchOverlay.tsx# tela de "hackeamento" com o terminal de diagnóstico
│   ├── Terminal.tsx     # terminal que digita os dados REAIS do dispositivo em tempo real
│   ├── Penguin.tsx      # pinguim mascote (SVG) com camadas de glitch RGB
│   └── ui/              # componentes shadcn (button, card, input, checkbox...)
└── index.css            # tema escuro neon + animações (glitch, scanlines, noise)
```

## ⚠️ Link do site final

O botão **"IR PARA O SITE"** aponta para um placeholder. Troque os links
`create` e `existing` na constante `DESTINATIONS` em `src/destinations.ts` pelos links reais
(o jogo / o site do trabalho):

```ts
export const DESTINATIONS: Record<AccountPath, string> = {
  create: 'https://exemplo.com.br/cadastro',
  existing: 'https://exemplo.com.br/login',
}
```

## Ajustes rápidos

- **Cores** (azul glacial + ciano): variáveis `--primary`, `--accent` etc. em `src/index.css`.
- **Fontes** (Consolas + Space Grotesk): configuradas em `index.css`.
- **Autenticação**: O acesso base é validado localmente na função `acceptsLogin` em `src/destinations.ts`.

## Observação

Os dados preenchidos ficam apenas no `localStorage` do navegador — nada é
enviado para nenhum servidor.
