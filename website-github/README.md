# gojoego.co

Personal website built with React + Vite, deployed on Netlify.

## Stack

- **Frontend:** React 18, Vite
- **Functions:** Netlify serverless functions (`netlify/functions/`)
- **Hosting:** Netlify

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Netlify handles this automatically on push.

## Project structure

```
├── src/
│   ├── app.jsx       # Main app component
│   ├── main.jsx      # React entry point
│   ├── data.js       # Site data
│   └── styles.js     # Styles
├── netlify/
│   └── functions/    # Serverless functions
├── img/              # Static images
├── index.html        # HTML entry point
├── netlify.toml      # Netlify config
└── vite.config.js    # Vite config
```
