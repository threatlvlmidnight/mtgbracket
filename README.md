# MTG Draft Round Robin

A lightweight five-player Magic: The Gathering draft tracker. The public page shows the schedule and live standings. Only the Site owner, signed in with the configured ChatGPT account, can select match winners.

## Schedule

| Round | Match 1 | Match 2 | Bye |
| --- | --- | --- | --- |
| 1 | Micah vs. Sam | Alyssa vs. Tom | Ben |
| 2 | Ben vs. Micah | Sam vs. Tom | Alyssa |
| 3 | Ben vs. Alyssa | Micah vs. Tom | Sam |
| 4 | Ben vs. Tom | Alyssa vs. Sam | Micah |
| 5 | Ben vs. Sam | Micah vs. Alyssa | Tom |

Round one is seeded with Micah and Tom as winners. Round five completes all ten unique pairings. Standings count match wins and losses; byes are excluded.

## Run and deploy

The app is a dependency-free Cloudflare Worker for ChatGPT Sites. Source is in `worker/index.js`. The Site provisions an R2 bucket through `.openai/hosting.json` and stores the results in one JSON object. Configure `OWNER_EMAIL` as a secret in Sites; write access checks the authenticated email on every request.

```sh
bash scripts/build.sh
node scripts/validate-artifact.mjs
```

The static schedule and standings are available to anyone with the public URL. The owner signs in through ChatGPT to edit results. Future tournament formats can use separate schedule definitions and result stores.
