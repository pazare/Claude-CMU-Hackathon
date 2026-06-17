# Making scattered campus opportunities reachable

These notes describe the problem the project addresses and how it is approached, from the
computer vision that reads a poster wall to the design choices that pool postings across
buildings. They are honest about what is technically hard and what is not.

## The problem

On a campus, opportunities are posted where they happen. A paid research study goes on the
psychology building's wall. A part-time job goes on the one board outside the hiring
department. A club fair flyer goes up in a single hallway. A student in another building
never walks past most of them, so matches they are eligible for and would want never reach
them. The barrier is not eligibility or interest; it is that the information is physical,
local, and easy to miss. Much of what a campus offers is therefore systematically out of
reach: the match exists, but the student and the flyer never meet. Pooling postings across
buildings, so a flyer in one hall can reach the right student in another, is the point.

## The approach

A student photographs a crowded CMU poster wall. Claude vision splits the photo into each
separate flyer, reads each one into a structured listing, and the student swipes a
personalized board of the postings that matter to them. A market scan found nobody ships
this: existing products either read one flyer into one calendar event (a crowded niche, now
free at the OS level through Apple Visual Intelligence) or run manual, admin-entered campus
feeds. None turn one photo of a whole wall into many categorized listings and a personal
feed.

The wall photo matters because it is the cheapest way to build what the problem needs: a
current, deduplicated record of what is posted across many buildings, in one place a student
can search. The extraction is how that record gets built.

## What is hard, and what is not

Be clear about the commodity line, because it marks where the real work is.

- **Not hard:** reading text off a single flyer. Apple Visual Intelligence and many freemium
  apps already do it. This part is solved.
- **Hard, and where the value is:** turning a photo of a whole wall into separate, correct
  listings; keeping a dated record of what changed week to week; deduplicating the same flyer
  seen on two walls; and matching each posting to the students it actually fits. State across
  time and good matching are software problems, not OCR.

So the interesting artifact is not a flyer turned into text. It is a live, sourced record of
what is posted across campus, with every posting linked back to the photo it came from.

## The product: the Living Mural

One tactile surface, three states, no tab bar. Everything is a flyer on a board: on the
wall, in your hand, or pinned to your board.

- **The peel.** Hold the camera to a wall. The photo freezes, then each real flyer lifts off
  it one by one, casts a shadow, rotates upright, and flies into a stack in your hand while
  the spot it left dims. Eleven paper flyers become eleven cards you can hold. The animation
  runs on the per-flyer bounding boxes Claude already returns, so it is animation over data
  the engine already produces, and it covers the vision latency so the wait reads as the work,
  not a spinner.
- **Swipe to pin.** Flick a card right to pin it to your board, left to toss. The board is one
  continuous, hand-tilted, pinned corkboard you tend over a semester.
- **Tap to flip.** Tap a pinned poster and it flips like paper to show the structured details
  and one action wired to its category (add to calendar, apply, email, directions).

First-run flow, target under fifteen seconds, zero setup: open straight onto an empty board,
tap "point at a wall," and either shoot a real wall or tap "use the demo wall" so the peel
still happens with no key. No account, no interest quiz, no key wall on the first open.
Interests are learned from what you pin.

## Reaching other students without a backend

Today the prototype keeps everything in the browser's localStorage, so a wall one student
photographs never reaches anyone else. That breaks the whole point, which is pooling postings
across buildings.

The fix needs no server. The same step that reads a wall also writes a single static JSON of
that wall's current postings, with the crops, into the site build, and the app loads it as
the default board when local storage is empty. One file, shipped by the static export that
already runs, refreshed whenever a wall is rescanned. A flyer photographed in one building
then shows up for a student who never goes there. It is the smallest change that makes the
postings actually reachable.

## Build plan

Build first:

1. A self-auditing export: each posting carries a thumbnail of its source crop, a confidence
   or needs-review flag, and a parsed date, so a wrong read is visible and staleness is
   computable.
2. The shared static JSON above, so one student's scan reaches others.
3. The Living Mural peel and pin, reusing the corkboard and bounding boxes already built.

Out of scope for now:

- Accounts, andrew.cmu.edu sign-in, board governance and admins.
- A real backend, database, or sync. The static export and localStorage stay.
- Detection and deskew polish beyond what works. Re-shoot a bad board.

## Open risks

The approach was stress-tested adversarially. The technical risks that matter:

- **Reaching a second student.** localStorage-only means a scan stays on one device. Fix: the
  shared static JSON, so the first student who opens the site swipes real current flyers, not
  a stale demo.
- **Extraction quality and trust.** A wrong room number or a misread contact is worse than no
  listing. Fix: per-posting confidence flags and a thumbnail link back to the source flyer, so
  a person can check any row against the original in one click, and a parsed date so stale
  postings drop out.
- **Commodity pressure.** Single-flyer reading is free and getting freer. Fix: the value is not
  the read; it is the cross-building, deduplicated, matched record over time, which a one-shot
  OCR tool does not build.
