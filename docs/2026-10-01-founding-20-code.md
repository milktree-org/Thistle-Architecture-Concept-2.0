# Founding 20 code (F20)

1 October 2026.

## What Ed asked for

- 29 September: "To claim a place they sign up on the site, pay the deposit and add a promo code. Aksh can set the code up and we give it out in the emails. It covers both the £49.99 report and the full feasibility."
- 30 September: the code is F20. Email 6 opens it at the end of November. Ed can't make site changes himself yet, so we set it up.
- Levi, 30 September: it is not money off. It only marks the person as one of the Founding 20.

## What was built

- A "Have a promo code?" link on both checkouts: the £49.99 form on /feasibility-package and the pay screen of the calculator on /pricing. It opens a code box.
- F20 is the only code accepted. Case and spaces do not matter.
- A wrong code stops payment and shows a message. The server checks it too.
- The code does not change the price. It is saved on the Stripe payment.
- The paid email to the team starts with `[F20]` and has a "Promo code" row. To count places, search the inbox for `[F20]`.
- On the £49.99 form, the code also goes on the lead sent before payment.

## What it does not do

- It does not stop at 20. Nothing stores who has used the code, so count the places by hand from the paid emails.
- It works from today. Email 6 is the only place the code is given out, so nobody should have it before then.

## Where it lives

- `lib/promoCode.ts`: the list of codes. To add one or remove F20, change it here.
- `components/checkout/PromoCodeField.tsx`: the box.
- `src/app/api/checkout/route.ts`: the server check, and the Stripe metadata.
- `lib/checkoutNotification.ts`: the email subject tag and row. Tested by `npm run test:notification`.

## Still open

- Ed to set the closing date once email 6 has a send date.
