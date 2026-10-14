# SplitSense UI review and rowing feature roadmap

Updated October 13, 2026. This is a first implementation batch, not feature parity with RowIQ.

## UI references and original previews

[WHOOP's Home documentation](https://www.whoop.com/nl/en/thelocker/the-all-new-whoop-home-screen/) groups prominent training measures with daily context. [Strava's training log](https://support.strava.com/en-us/articles/15402077-training-log) emphasizes activity history and weekly patterns. [TrainingPeaks' mobile chart documentation](https://help.trainingpeaks.com/hc/en-us/articles/204071064-How-do-I-use-and-edit-charts-on-iOS-devices) connects calendar planning with dashboard analysis. These patterns informed three original SplitSense Home variants; branding, assets and code were not copied.

The variants were tried in the actual browser prototype at a 390 × 844 phone viewport. Each uses the same saved data and lower Home sections, with a different lead card. Scores are my subjective design assessment of these SplitSense previews, not competitor ratings or athlete usability-study results. Each criterion has equal weight, scored out of ten.

| SplitSense direction | Readability | Main action clarity | Rowing relevance | Visual hierarchy | Room to grow | Average |
|---|---:|---:|---:|---:|---:|---:|
| Performance | 9 | 9 | 9 | 9 | 8 | **8.8** |
| Planner | 8 | 8 | 9 | 8 | 9 | **8.4** |
| Activity | 9 | 9 | 7 | 8 | 7 | **8.0** |

**Selected default: Performance.** The dark hero gives the logging action and weekly distance a clear focus. Planner gives scheduled work priority; Activity makes the latest saved session prominent. Both remain available through the development-only Home UI Lab. A real athlete study may change this ranking.

All directions share a light canvas, navy text, teal controls, mint surfaces, lime highlights, a weekly strip, quick actions and five bottom tabs. Calendar, Library and Pace Lab are separate sections within Plan, keeping each task focused. Existing entrance and press animations respect reduced-motion preferences.

## Implemented in this batch

- Three selectable Home previews, with Performance as the default.
- Plan tab with a weekly training strip and date-sorted saved sessions.
- Five editable logging templates: continuous erg, 6 × 500 m, 2K benchmark, on-water technique and strength.
- Schedule templates locally; log a scheduled session with its template prefilled. A linked saved workout marks the plan logged.
- Interval results with individual distances, work times and recovery seconds; total distance/work time are calculated separately from recovery.
- Per-repetition split breakdown, fastest/slowest interval review and comparable continuous-session reviews.
- Pace Lab: constant-split finish time and Concept2-equivalent watts, using [Concept2's published formula](https://www.concept2.com/training/pace-calculator). This is calculated power from average pace, not measured average watts or on-water power.
- 500 m erg benchmark added alongside 2K, 5K and 6K. Interval sessions are excluded from continuous-distance records.
- Existing version-1 storage gains an empty plan list without losing workouts or profiles. Invalid plan or interval data is rejected.

## RowIQ reference and SplitSense status

RowIQ publishes PM5-connected training, workout summaries, configurable live data, force-curve analysis, progress metrics, team racing and coach tools. Source: [RowIQ product overview](https://rowiqapp.com/).

| RowIQ capability | SplitSense status | Next implementation |
|---|---|---|
| Training history and distance records | Working locally | Editing, export and cloud backup |
| Built-in and custom plans | Partial: templates and calendar | Custom workout builder and multi-week plans |
| Workout debrief | Partial: manual totals, intervals, comparisons | Richer charts with measured stroke data |
| Per-stroke split, rate, power and heart rate | Not connected | Real PM5/BLE integration and device testing |
| Force-curve target and analysis | Not connected | Capture curves, define targets and validate scoring |
| Weekly meters / community rankings | Local totals only | Opt-in accounts and validated leaderboard results |
| Team races and live coach board | Not implemented | Backend, membership and live transport |
| Coach roster and assignments | Not implemented | Athlete/coach roles and private team access |

RowIQ also describes personalised Smart Plans, recovery context, AI coaching, device integrations and lifting tools in its [Concept2 feature guide](https://www.rowiqapp.com/concept2).

| RowIQ capability | SplitSense status | Next implementation |
|---|---|---|
| History-aware AI coach | Planned | Secure server-side coaching with athlete consent |
| Personalised AI plans | Planned | Goals, availability, validated generation and plan editing |
| HRV / sleep / readiness | Not connected | Voluntary check-ins, then consent-based health integrations |
| Concept2 Logbook and Strava sync | Not connected | OAuth, tested uploads and duplicate prevention |
| PM5 workout programming | Not connected | Native monitor protocol and compatibility testing |
| Strength tracking | Basic session + notes | Exercise/set/rep/weight records |
| Spoken workout cues | Not implemented | Goal pacing and tested audio cues |
| Fitness / fatigue analytics | Not implemented | A documented load model with clear assumptions |

RowIQ's side-on video analysis is described as an early limited rollout in its [video announcement](https://rowiqapp.com/blog/reading-your-stroke-from-video). SplitSense has no video analysis yet; this needs a separate tested implementation.

## Verification and limits

TypeScript checks and ten domain tests pass. iOS, Android and web bundles export. Browser checks covered all three Home variants, plan date validation, plan persistence after reload, template-prefilled logging, missing interval result rejection, existing session review, pace calculation and five-tab navigation. The temporary plan created for verification was removed; the existing saved workout was preserved.

Physical-phone, actual PM5 and account integrations remain untested or unimplemented. Authentication is still a visual demo; data remains local. The UI Lab and DEV toolbar are omitted from production builds. Existing inherited dependency advisories remain documented in the README.

## Next delivery order

1. Workout editing/export, custom templates and richer interval charts.
2. Real accounts and private cloud backup.
3. PM5 and heart-rate connections, with physical-device verification.
4. AI coach and plan generation behind secure subscription entitlements.
5. Team assignments, live racing and opt-in community features.
