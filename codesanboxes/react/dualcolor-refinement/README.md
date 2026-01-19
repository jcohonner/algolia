# Dual Color Refinement

The gaol of this refinement widget is to be able to refine by color with a concept of primary and secondary colors fro a single product.

Exemple :
Shoes that are Red and Blue can be refined by Red (primary color) or Blue (secondary color).

Refinement behavior:

- If the user refines by a color, it shows products that have this color as primary first then products that have this color as secondary.

This behavior relies on Algolia filter scoring.

Open in Code Sandbox:

https://codesandbox.io/p/devbox/github/jcohonner/algolia/tree/main/codesanboxes/react/dualcolor-refinement

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
