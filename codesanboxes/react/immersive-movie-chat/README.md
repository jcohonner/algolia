# Immersive Movie Chat

Application React (Next.js) mobile-first pour recommander des films via un agent Algolia Agent Studio compatible Vercel AI SDK 5.

## Prerequis

- Node.js 20+

## Lancer

```bash
npm install
npm run dev
```

Puis ouvre `http://localhost:3000`.

## Architecture

- `app/page.tsx`: UI immersive (2/3 carrousel, 1/3 chat)
- `useChat` + `DefaultChatTransport`: integration directe avec l'agent distant
- Chat ephemere: seul l'echange courant est affiche
