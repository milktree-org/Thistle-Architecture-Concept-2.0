# Handover runbook, Thistle

Written 30 September 2026, to be worked through in order. Ed owns the accounts
at the end of it; Milktree stays on as a collaborator for as long as it is
working on the site.

Nothing here changes the website. It moves who owns it.

## Before you start, you need

- The name of Ed's GitHub organisation, and Akash added to it with rights to
  create repositories.
- Akash invited to Ed's Vercel team (`thistle-architecture`), and a payment
  method on that team.
- Ed's Tina Cloud account email.

## 1. GitHub

Transfer both repositories into Ed's organisation:

- `milktree-org/Thistle-Architecture-Concept-2.0` (public)
- `milktree-org/hmo-designers` (private)

Settings, General, Danger Zone, Transfer ownership. GitHub keeps the issues and
history and redirects the old address, but nothing that authenticates against
the old path keeps working, which is why Vercel and Tina come next.

Then add Milktree back: Settings, Collaborators and teams.

## 2. Vercel

Both projects: `thistle-architecture-concept-2-0` and `hmo-designers`.

Project Settings, General, Transfer Project, into `thistle-architecture`.
Vercel moves deployments, environment variables, domains and the Git link with
no downtime. It does not move integrations or logs.

Then, on each project:

1. Settings, Git: install the Vercel GitHub app on Ed's organisation and
   reconnect the repository at its new address.
2. Settings, Environment Variables: check they all arrived. The site will not
   build or take payment without `TINA_TOKEN`, `NEXT_PUBLIC_TINA_CLIENT_ID`,
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FORMSPREE_DEPLOY_KEY`,
   `FORMSPREE_PROJECT_ID` and `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
3. Push a trivial commit and watch it deploy.
4. Check the domain still resolves and the Stripe webhook still reaches
   `/api/checkout/webhook`. The URL is the domain, so it does not change.

**The one that bites.** From this point Vercel only builds commits whose author
is on Ed's team. Anyone at Milktree still working on the site needs a seat, or
their pushes will look like they did nothing.

## 3. Tina Cloud

Tina publishes no transfer procedure, so ask their support to move both projects
to Ed's account.

If they cannot, Ed creates his own Tina projects against the repositories at
their new address, and the two values in Vercel,
`NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`, are replaced with his. Change
both together and redeploy: the build fails with one old and one new.

## 4. Google Analytics

Move the three properties into an Analytics account Thistle owns, rather than
making Ed an administrator on Milktree's account, which would show him every
other client in it. A property move keeps its history and Measurement ID, and
needs Editor rights on both accounts.

## 5. GoHighLevel

Levi's, with the CRM transfer. The website posts nothing to GoHighLevel today,
so this cannot break the site. The location ID is already recorded.

## 6. Setting Ed up to make changes

On Ed's machine:

```bash
# Node 20+, Git, and the GitHub CLI
git clone https://github.com/<thistle-org>/Thistle-Architecture-Concept-2.0.git
cd Thistle-Architecture-Concept-2.0
npm install
npx vercel link            # choose the thistle-architecture team and the project
npx vercel env pull .env.local
npm run dev                # http://localhost:3000, editor at /admin
```

Then set his Git identity, so his commits build:

```bash
git config user.name "Edward Kercher"
git config user.email "edward@thistlearchitecture.co.uk"
```

`CLAUDE.md` in the repository root tells any Claude session the rules of the
site: never invent a figure, never identify a client's property, UK English, and
what to run before pushing. `README.md` covers the layout, the tests and how a
change reaches the live site.

**Which tool for which job.** Wording and images: the Tina editor at
/admin on the live site, which commits and deploys on save. Anything structural,
a new page or a new field: a Claude session in the repository, then push.

## Done means

Ed can see each account in his own name, a commit by him reaches the live site,
and Milktree's access is collaborator level. Levi then invoices the balance.
