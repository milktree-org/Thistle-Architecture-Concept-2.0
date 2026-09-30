# Working on the Thistle Architecture site

This is the live website of an architecture practice, at
www.thistlearchitecture.co.uk. Every push to `main` deploys to it within a
couple of minutes. There is no staging site. Treat each change as something the
public will read.

Read `README.md` for how the project is laid out and how to run it.

## The rules that matter most

**Never invent a fact.** No prices, room counts, floor areas, dates,
percentages, planning references or client names that you cannot point to in
this repository or that the person asking has just given you. If a figure is
needed and missing, say so and leave a gap. A made-up number on a page that
quotes fees and planning outcomes is worse than an empty one.

**Do not identify a client's property.** Case studies name a street only where
that has been agreed. House numbers, postcodes, client names and live planning
application references stay off the site. If a change would add one, stop and
ask.

**Words:** UK English, plain and short, at about a Grade 7 reading level. No em
dashes anywhere.

**Content before code.** If the change is wording or an image, edit the JSON in
`content/`, not the fallback in `data/`. The site reads `content/` first, so a
change in `data/` alone will usually do nothing.

**Prices are code on purpose.** `data/pricingData.ts` feeds both the page and
the Stripe charge. If a fee changes, change it there and run
`npm run pricing-check`.

## Before you finish

1. Run the tests that cover what you touched. `README.md` lists them.
2. `npx tsc --noEmit -p .` if you changed TypeScript.
3. Commit and push. Do not wait to be asked.
4. Check the live URL after the deploy, not localhost. If it needs a CMS change
   to show up, clear `.next/cache` before rebuilding locally.

## Things that have caught people out

- **A build that never starts.** Vercel only builds commits whose author is a
  member of the Vercel team that owns the project. Check the commit author
  email before assuming the code is at fault.
- **Images.** Run `npm run optimise-media` whenever you add or replace one.
  Nothing over 500KB should reach the repository.
- **Tina fields render as null locally.** That is a cached query, not a bug.
  Delete `.next/cache` and build again.
- **A grep proving nothing.** Check what a page actually renders, not that a
  string exists in a file.

## History

`docs/` holds the decisions behind the site, including the running list of
client feedback and what was done about each item. If you are about to change
something that looks odd, the reason is often written down there first.
