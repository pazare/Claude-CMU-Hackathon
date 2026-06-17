# Product strategy: from a wall photo to revenue

This is the plan for turning the prototype into a business. It is written for speed
to first revenue, for building only what earns, and for a product that one person can
ship. It is honest about what is defensible and what is not.

## The bet

A student photographs a crowded CMU poster wall. Claude vision splits the photo into
each separate flyer, reads each one into a structured listing, and the student swipes a
personalized board of the posters that matter to them. Nobody ships this. The market
scan confirmed it: products either read one flyer into one calendar event (a crowded,
commoditized niche, now free at the OS level through Apple Visual Intelligence) or run
manual, admin-entered campus feeds. None turn one photo of a whole wall into many
categorized listings plus a personal feed.

That whitespace is real, but it is not the moat. The bet is that the wall photo is the
cheapest way to build two assets nobody else has: a current, deduplicated record of what
is posted across CMU's specific boards, and the relationships with the people who want
student attention. Those assets are the business. The extraction is how we get them.

## What is defensible, and what is not

Be clear-eyed about the commodity line.

- **Not defensible:** reading text off a flyer. Apple Visual Intelligence and a dozen
  freemium apps already do single-flyer extraction. A work-study student with a phone
  can reproduce a basic digitization. Selling extraction is selling labor.
- **Defensible:** state across time and relationships. A dated, deduplicated record of
  every flyer on a board, what changed week to week, and which listings are current is
  software, not OCR. The demand side that pays to reach matched students (labs, the
  career center, local businesses) is a network, not a feature. Both compound. Neither
  can be photographed by a clone.

So the product to sell is not "we digitize your board." It is "we keep a live, sourced
record of what is posted, and we put the right flyer in front of the right student."

## Who pays, and who pays first

Students do not pay. The scan confirmed the graveyard: Yik Yak (about $400M peak, shut
down), Fizz (about $41.5M raised, no real revenue), Geneva ($0, absorbed and killed).
About a quarter of any campus user base graduates every year, and students are ad-averse.
Do not try to charge them. Ever.

The payers, in order of how fast they sign:

1. **A research lab recruiting paid study subjects.** A principal investigator has a real
   study-recruitment budget line and can sign a small invoice without procurement. This
   is the sharpest first customer: a named person, an existing budget, a problem this
   week (filling a study).
2. **A department or student org running an event series.** Already spends staff time and
   printing on attendance. Buys placement plus a sheet of competing events.
3. **Local businesses near campus** (Craig Street, Forbes Avenue). Pay for a promoted
   poster with a promo code so the redemption is measurable.
4. **The university itself** (student affairs, facilities). Highest ceiling, slowest path:
   procurement, vendor onboarding, and a privacy review take quarters. Defer this.

The first dollar comes from a named, funded buyer, not a role. "An operations office"
is not a customer; a specific PI who needs twenty subjects by Friday is.

## The lead motion: a funded buyer in weeks

Run five discovery conversations with one goal: get one person to say "that comes from my
budget, here is how I pay you." Start with research labs that recruit paid subjects
(Dietrich psychology, the HCII, the CBDR pool) because the budget line and the signer both
already exist.

Sell them a weekly service:

- Digitize the boards in their building and hand them a clean sheet of every current
  posting, every row one click from a thumbnail of the original flyer, with low-confidence
  rows flagged for their sign-off. This makes their own staff the fast approver of record
  and keeps liability on their signature, not ours.
- Place their flyer in front of matched students in the feed, and report who kept it.

Price it against their existing recruitment or events budget: a first run at $150 to remove
the yes-or-no friction, then $300 per building per month for weekly service. Bill it as a
services invoice or a p-card charge, not a subscription, so there is no payments system to
build and no procurement to clear.

If no named, funded buyer surfaces in five conversations, the services wedge is dead and
the fallback is the same demand-side payer reached directly: a single recruitment slot sold
to one lab. The market scan already validated that this is where the money is (Handshake is
free for students; employers pay, about $190M revenue, $3.5B valuation).

## The profit model and sequencing

| Phase | Weeks | What ships | First revenue |
| --- | --- | --- | --- |
| 0 | 1 | Self-auditing export (sheet with per-row thumbnail, confidence flag, parsed date). Run a free sample on one building, hand it over unsolicited as proof. | none yet |
| 1 | 2 to 4 | Convert the proof into a paid weekly service for one funded buyer. $150 first run, then $300 per building per month. Each run seeds the public feed for free. | services dollars |
| 2 | 4 to 10 | Turn the seeded feed on for students (QR stickers next to the same boards). Sell a $150 sponsored recruitment slot to a lab. | demand-side placement |
| 3 | 8 to 16 | Add local-merchant promoted posters with promo-code attribution. Fold the proof-of-posting report in as the retention artifact. | merchant ad base |

University B2B contracts stay deferred. They need quarters of procurement and contradict
the weeks-not-quarters mandate.

## The product: the Living Mural

One tactile surface, three states, no tab bar. Everything is a flyer on a board: on the
wall, in your hand, or pinned to your board.

- **The wow moment is the peel.** Hold the camera to a wall. The photo freezes, then each
  real flyer lifts off it one by one, casts a shadow, rotates upright, and flies into a
  stack in your hand while the spot it left dims. Eleven paper flyers become eleven cards
  you can hold. The animation runs on the per-flyer bounding boxes Claude already returns,
  so it is animation work over data the engine already produces, and it covers the vision
  latency so the wait feels like the magic, not a spinner.
- **Swipe to pin.** Flick a card right to pin it to your board, left to toss. The board is
  one continuous, hand-tilted, pinned corkboard you tend over a semester.
- **Tap to flip.** Tap a pinned poster and it flips like paper to show the structured
  details and one action wired to its category (add to calendar, apply, email, directions).

First-run flow, target under fifteen seconds, zero setup: open straight onto an empty
board, tap "point at a wall," and either shoot a real wall or tap "use the demo wall" so
the peel still happens with no key. No account, no interest quiz, no key wall on the first
open. Interests are learned from what you pin.

**Monetization lives inside the metaphor.** A sponsored listing is a "Pinned by ..." poster:
same paper, same pin, same flip, marked only by a thin colored thread and a caption
("Pinned by the HCII," "Pinned by La Prima"). It is what a real corkboard already does, so
it never reads as an ad banner. A sponsored pin persists onto the board only if the student
actually pins it, and a kept pin carries a claim or apply action, so what the lab or
merchant buys is an intent signal, not an impression. That is honest at low volume and far
more sellable.

## The one change that makes it compound

Today the app is a static export with localStorage only. A sweep lands in the operator's
browser and never reaches a second student. The seeding premise fails by construction
unless we fix it.

The fix needs no backend. The same one-button export that produces the buyer's sheet also
writes a single static JSON of that building's current postings (with the crops) into the
site build, and the app loads that file as the default deck when localStorage is empty,
instead of the obviously-fake sample. One JSON file, shipped by the GitHub Pages export
that already runs, refreshed by each weekly run we are already paid to do. This is the piece
that turns paid services into a seeded consumer feed. Build it before any polish.

## Lean build plan

Build now (the money-making core):

1. A self-auditing export: one button that dumps the current postings to a sheet, each row
   carrying a thumbnail of its source crop, a confidence or needs-review flag, and a parsed
   date so staleness is computable. This is the deliverable and the QA layer in one.
2. The static-JSON seed path above, so a run feeds the public feed.
3. The Living Mural peel and pin, reusing the corkboard and bounding boxes already built.
4. The "Pinned by ..." sponsored tile as one more poster on the board.

Cut for now (deliberately):

- Accounts, andrew.cmu.edu sign-in, board governance and admins.
- A real backend, database, or sync. Static export and localStorage stay.
- Stripe or subscription billing. Invoice and p-card only.
- Any student-facing charge or ad network.
- Detection and deskew polish beyond what works. Re-shoot a bad board.
- The OpenAI recreate path on the critical money path.

## What could kill this, and the fix

The plan was stress-tested adversarially. Four risks came back serious, all survivable with
the fixes already folded in above.

- **No named budget holder.** "An operations office" is a role, not a checkbook. Fix: sell a
  specific funded buyer (a PI recruiting subjects) before writing export code. Get one person
  to name the budget.
- **Cold start.** localStorage-only means a run cannot reach another student. Fix: the static
  JSON seed, so the first keyless student swipes real current flyers, not stale demos.
- **Commoditization.** Selling digitization is selling labor Apple can undercut. Fix: sell the
  dated, deduplicated, sourced record and the placement network, not the OCR. The moat is state
  over time and relationships.
- **Liability and quality.** A wrong room number or a transcribed scam in a sheet the buyer
  signs is their liability. Fix: ship confidence flags, a thumbnail link back to every source
  flyer, and a parsed date, so the buyer's own staff is the approver and the human-review step
  becomes the visible value instead of hidden free labor.

## The next 30 days

1. Week 1: build the self-auditing export and the static JSON seed. Run a free sample on one
   building. Hand it to one named PI or org lead, unsolicited, as proof. Do not name a price yet.
2. Week 2: run five discovery conversations. Goal: one person who names the budget the money
   comes from. Convert the proof into a $150 first run.
3. Weeks 3 to 4: deliver the first paid weekly runs at $300 per building per month, and let each
   run seed the feed. Put QR stickers next to the boards. Sell the first $150 recruitment slot.
