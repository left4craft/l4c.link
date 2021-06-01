# l4c.link

[![Netlify Status](https://api.netlify.com/api/v1/badges/473f64be-abbe-4c0d-a7f3-895885ada035/deploy-status)](https://app.netlify.com/sites/l4c/deploys)

A very simple serverless URL shortener built with Supabase and Netlify, so simple that it doesn't have a UI at all.

## Development

Install netlify-cli:

```bash
npm i netlify-cli -g
```

Create `.env`:

```env
SUPABASE_URL=
SUPABASE_KEY=
KEY=
```

`SUPABASE_KEY` should be the **service** key.
`KEY` is the api key for creating new short URLs.

Run:

```bash
npm run dev
```

## Deploying

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/left4craft/l4c.link)
