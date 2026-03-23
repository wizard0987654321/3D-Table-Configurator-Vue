# Frontend - Vue 3 + Vite

This is the frontend application for the Webframeworks Vue project, built with Vue 3 and Vite.

## 🚀 Getting Started

### 1. Prerequisites
* Install [Node.js](https://nodejs.org/)
* Install [Git](https://git-scm.com/)

### 2. Clone the Repository
1. Clone the project from GitLab:
   ```bash
   git clone https://git.thm.de/asmh41/webframeworks.git
   cd webframeworks/webframeworksvue
   ```
2. The `.env` file is already included in the backend for testing purposes — no need to create it manually.

### 3. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. The `.env` file is already included in the repository — it contains the necessary database configuration for local development.
4. Start the backend server: `npm start`

### 4. Frontend Setup
1. In a new terminal, navigate to the `frontend` folder: `cd ../frontend`
2. Install dependencies: `npm install`
3. Start the development server with hot-reload: `npm run dev`
4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Available Scripts

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

### Lint and Format Code

```sh
npm run lint
npm run format
```

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).
