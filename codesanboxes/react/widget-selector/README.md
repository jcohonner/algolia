# Widget selector

This demo aims to customize Dynamic Widgets widget to add the possibility to select which widget to apply on the different facets using a condition less rule.

## condition less rule

first you need to define a condition less rule in your configuration with the informations you need to select the widget you want to apply on the facet.

```js
{
  "consequence": {
    "userData": {
      "facetMapping": {
        "price": {widget: "slider"},
        "featured": {widget: "toggle"},
        "actors": {widget: "refinement", props: {"searchable": true}}
      }
    }
  },
  "enabled": true,
  "objectID": "qr-widget-selector"
}
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
