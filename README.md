# Personal Web Starter

Boilerplate minimalista para comenzar tu pagina personal con **Astro + React + Tailwind CSS**, listo para deploy inmediato en **Vercel** y con tooling de **pnpm**, **ESLint** y **Prettier** configurados desde el dia uno.

## Stack

- Astro 5 con integracion de React (`@astrojs/react`)
- Tailwind CSS 4 mediante `@tailwindcss/vite`
- Adapter oficial `@astrojs/vercel` listo para `pnpm build`
- ESLint + Prettier (incluyendo `prettier-plugin-tailwindcss`) para un estilo consistente

La pagina inicial unicamente imprime un simple **Hola mundo** para que arranques tu propio diseno sin ruido.

## Estructura

```
src/
├── components/Hero.tsx    # Ejemplo en React
├── layouts/Layout.astro   # Layout base con estilos globales
├── pages/index.astro      # Pagina inicial con el Hero
└── styles/global.css      # Importa Tailwind
```

## Comandos

| Comando        | Accion                                             |
| -------------- | -------------------------------------------------- |
| `pnpm install` | Instala las dependencias                           |
| `pnpm dev`     | Server de desarrollo en `http://localhost:4321`    |
| `pnpm build`   | Compila el sitio listo para produccion (`/dist`)   |
| `pnpm preview` | Sirve el build de forma local                      |
| `pnpm lint`    | Ejecuta ESLint sobre archivos `.astro` y `.tsx`    |
| `pnpm format`  | Aplica Prettier usando la configuracion del repo   |

## Deploy en Vercel

1. Haz login en Vercel y crea un nuevo proyecto apuntando a este repositorio.
2. Vercel detectara automaticamente el framework gracias a `vercel.json`.
3. El comando de build es `pnpm build` y la carpeta de salida es `dist/`.

Listo! Ya tienes la base para tu sitio personal lista para el primer commit.
