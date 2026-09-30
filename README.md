# Thistle Architecture

The website at [www.thistlearchitecture.co.uk](https://www.thistlearchitecture.co.uk).
Next.js 16 (App Router) and TypeScript, with TinaCMS for content, Stripe for
feasibility payments and Formspree for forms. Hosted on Vercel.

## Running it on your own machine

You need Node.js 20 or newer, and Git.

```bash
npm install
vercel env pull .env.local     # or copy the values from Vercel, Settings, Environment Variables
npm run dev                    # http://localhost:3000
```

`npm run dev` starts the site and the Tina editor together. The editor is at
[localhost:3000/admin](http://localhost:3000/admin).

Without `.env.local` the site still runs, but anything needing a key is off:
payments, the CMS editor, analytics.

## How a change reaches the live site

Every push to `main` builds and deploys automatically. There is no separate
release step. A build takes about two minutes.

```bash
git add -A
git commit -m "what changed and why"
git push
```

Two things worth knowing:

- **Vercel only builds commits whose author belongs to the Vercel team.** If a
  build never starts, that is almost always why. GitHub shows it as
  "Deployment was blocked".
- The production build also pushes `formspree.json` to Formspree, so form
  recipients and automatic replies are part of a normal deploy.

## Editing content, not code

Most words and images on the site live in `content/`, as JSON, and are edited in
the Tina editor at `/admin` on the live site. A save there commits to this repo
and triggers a deploy, the same as a push.

The rule the code follows: `content/*.json` is what the site shows, and the
matching file in `data/` is a fallback used only when a field is empty. If you
change wording in `data/`, the site probably will not change. Change it in
`content/`, or in the editor.

Deliberately **not** editable in the CMS, because an edit there could publish
something untrue:

- Prices. They live in `data/pricingData.ts` next to the code that charges the
  card, so the page and Stripe cannot disagree.
- Anything that selects a record rather than saying something: which case study
  a page features, which review appears where, and where a button goes.

## Tests

Run these when you touch the thing they cover. None of them need a browser
except where noted.

| Command | What it checks |
|---|---|
| `npm run pricing-check` | The fee engine still returns the agreed prices |
| `npm run test:notification` | The paid-feasibility email carries the right fields |
| `npm run test:sample-report` | Every example-feasibility link exists and is in the email |
| `npm run test:images` | Image handling from the CMS |
| `npm run test:disclaimer` | The disclaimer gate on both checkouts (needs the site running) |
| `npm run test:analytics` | The analytics events (needs the site running) |
| `npm run optimise-media` | Reports oversized images. Add `-- --write` to fix them |

A full production build without CMS credentials: `npm run build:local`.

## Where things are

```
src/app/            routes, and the API endpoints for checkout, leads and webhooks
views/              one file per page
sections/           the blocks pages are built from
components/         shared UI
content/            the CMS content, as JSON
data/               fallbacks, the pricing engine, and lists that are code by design
tina/               the CMS schema, which decides what is editable
docs/               decisions, client correspondence and working notes
scripts/            tests and maintenance tasks
```

## Notes

This repository is public. Anything committed here, including anything deleted
later, stays in the history. Client names, addresses and keys do not belong in
it.
