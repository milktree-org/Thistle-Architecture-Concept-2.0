# Thistle handover plan, 21 September 2026

Ed asked on 18 September for ownership, not access, of five things. This is the
order to do them in so the live sites never stop building, what each needs, and
what to watch for. Everything here is account work in dashboards; none of it is
code. Levi or whoever owns each Milktree account has to run it.

## What moves

| Thing | Where it is now | Where it goes |
|---|---|---|
| GitHub: Thistle site | milktree-org/Thistle-Architecture-Concept-2.0 (public) | A Thistle GitHub organisation Ed owns, Milktree as collaborators |
| GitHub: HMO Designers | milktree-org/hmo-designers (private) | Same organisation |
| Vercel: Thistle site | milktree-agencys-projects / thistle-architecture-concept-2-0 | Ed's team, thistle-architecture |
| Vercel: HMO Designers | milktree-agencys-projects / hmo-designers | Ed's team, thistle-architecture |
| Tina Cloud (both sites) | Under Levi's account, Ed a collaborator | Ed as owner |
| Google Analytics | Three properties inside Milktree's Analytics account | An Analytics account Thistle owns (see note) |
| GoHighLevel | Thistle sub-account under Milktree's agency | Ed as owner, Jodi's access unchanged |

HMO Checker is WordPress, not in GitHub or Vercel. Ed already has admin on it.

## Order, and why

1. **GitHub first.** Ed creates a GitHub organisation (free). The Milktree org
   owner transfers both repos into it (repo Settings, Danger Zone, Transfer).
   GitHub redirects the old URLs, but Vercel and Tina both need to be pointed
   at the new location, which is why they come after.
   - Straight after: in Vercel, install the Vercel GitHub app on Ed's new
     organisation and reconnect each project's Git repository. Push a test
     commit and confirm a production build runs.
2. **Vercel second.** Whoever runs it must be an Owner of the Milktree team and
   a member of Ed's thistle-architecture team, so Ed invites them first. Ed's
   team needs a payment method (Pro). Project Settings, General, Transfer.
   Vercel states zero downtime. Moves with it: deployments, environment
   variables, domains, the Git link. Does not move: integrations and logs.
   - Check after: both domains resolve, the env vars are present (Stripe keys,
     STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_GA_MEASUREMENT_ID, TINA_TOKEN,
     NEXT_PUBLIC_TINA_CLIENT_ID, FORMSPREE_DEPLOY_KEY, FORMSPREE_PROJECT_ID),
     a test build passes, the Stripe webhook still reaches
     /api/checkout/webhook (the URL is the domain, so it does not change).
   - **Watch:** from then on Vercel only builds commits whose author is a
     member of Ed's team. That is the same block Ed hit on 9 September, the
     other way round. Anyone at Milktree who keeps working on the sites needs
     a seat on his team, or their pushes will not deploy.
3. **Tina Cloud third.** Tina does not publish a transfer procedure. Ask Tina
   support to move both projects to Ed's account. If they cannot, Ed creates
   his own Tina projects against the new repos, and the two values in Vercel
   (NEXT_PUBLIC_TINA_CLIENT_ID, TINA_TOKEN) are swapped for his. The build
   fails without them, so change both in the same sitting and redeploy.
4. **Google Analytics.** Recommendation: move the three properties into an
   Analytics account that thistleanalytics@gmail.com creates, rather than
   making that address an administrator on Milktree's account. An account
   administrator sees every property in the account, so if Milktree's account
   holds any other client, Ed's address would see theirs. Moving a property
   keeps its history and Measurement ID. It needs someone with Editor rights
   on both accounts, so add a Milktree user to Ed's new account for the move.
5. **GoHighLevel.** Levi's call, tied to the CRM transfer he is arranging. The
   website does not post to GoHighLevel today, so this move cannot break it.
   Item 34 (leads into Jodi's pipeline) is built after it, with the Thistle
   sub-account's API key.

## Also worth closing in the same sitting

- **Search Console.** Ed's plan was properties under the Thistle account with
  Milktree as users. Scarlett has also lost access to her URL-prefix property
  since launch; putting her verification file in /public restores hers.
- **Formspree.** The project and its deploy key are Milktree's. The key sits in
  Vercel, so it moves with the project, but the Formspree account does not.
  Decide whether Formspree moves to Thistle too.
- **Stripe.** Already Thistle's account; nothing moves.

## Done means

Ed confirms he can see each thing in his own account, a commit by him builds
and goes live, and Milktree's access is at collaborator level. Levi then
invoices the £900 balance.
