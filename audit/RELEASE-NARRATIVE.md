# State of AI: seven-part narrative build

Evidence cut: October 16, 2026. The design and existing feature set start from GitHub main at `3742daa`; verified evidence corrections from the preceding preview at `9109da2` are integrated rather than discarded.

## Preservation

- The previous GitHub site is available through “Previous version” in the rebuilt site.
- Its 107 retained backup files were compared byte-for-byte with the preserved baseline. None was changed.
- Both the previous GitHub source and the preceding preview source are preserved as separate archives in the Project, together with a Git bundle.
- Local backup refs: `backup/pre-narrative-github-20261016` and `backup/pre-narrative-preview-20261016`.

## Editorial structure

The report and deck follow the same order:

- AI stack, bottom-up and horizontal within each layer.
- Agentic revolution and agentic stack.
- Business Models.
- Services.
- Healthcare.
- Robotics and Physical AI, including industrial AI.
- Investing and valuations.

The default reading path is approximately 3,000 words. Twenty-one native expandable rabbit holes preserve evidence, source methods, the agent stack, services map, healthcare money river and patient loop, robotics and industrial money rivers, and the existing DVC portfolio explorer. The deck contains 17 slides and retains the cinematic opener.

Only the latest editorial update notes are shown. Historical observation dates are retained when they define a metric or explanatory model.

## Numerical consistency

Fifty-five shared editorial evidence records feed report values, slide figures, evidence panels, mouseovers and the latest-edition page. Recurring explorer headline figures are synchronized with those records. Unit tests compare generated renderings with their records; browser tests compare rendered values again after initialization.

The infrastructure midpoint and bounds reconcile to the selected issuer guidance. All three money-river datasets were checked for finite, nonnegative flows and balanced buyer/destination totals. They remain historical explanatory models, not mechanically inflated 2026 market totals.

No universal gross-margin or EBITDA bands, synthetic revenue-market totals, mismatched ARR multiples or unsupported current private marks were inserted. Dated public financing announcements are not described as live prices. Rhoda's [company announcement](https://www.rhoda.ai/news/press-release) does not state a valuation; no unsupported valuation is asserted. Higgsfield's [public round](https://techcrunch.com/2026/08/17/higgsfield-raises-400m-series-b-quadrupling-its-valuation-in-8-months-to-5-4b/) is explicitly dated rather than described as the latest possible private transaction.

## Validation

- Seven report chapters and 17 slide routes checked.
- All 398 healthcare microcopy regression assertions passed.
- All active JavaScript files passed syntax checks.
- No duplicate HTML IDs or missing local script, stylesheet or image references found in the three current entry pages.
- Reading path / explore-all round trip, direct links into closed rabbit holes and mobile chapter selection checked.
- Agent-stack expansion, services-map details, portfolio filters, healthcare view/filter controls, patient states and all three money-river detail interactions checked.
- Evidence source popup, full selectable URL fallback, evidence close/Escape, slide navigation, hash refresh and presentation-focus mode checked.
- Desktop and phone screenshots reviewed, with additional short-window and reduced-motion checks.
- No captured JavaScript runtime exceptions in the final local pass.
- At 1440 × 1000, the 17 slides fit without horizontal or vertical slide overflow. Phones and short desktop windows intentionally allow vertical slide scrolling while retaining fixed navigation.
- No horizontal page overflow found at 375px. Wide money-flow diagrams use intentional internal horizontal scrolling.

QA found and corrected inherited tooltip dependencies, a zero-height mobile deck container, small map labels, clipped phone controls, a mobile cover overflow, a cover button behind navigation and an overlapping opener caption. Initial test failures and their resolved retests are preserved in the browser QA log.

## Hosted preview verification

The updated preview retains artifact ID `6f1dadc7-09ca-45dd-ac5b-c7bf11de4ee2`. A fresh browser context confirmed seven report chapters, 17 deck slides, loaded local brand fonts, synchronized figures, rendered robotics and industrial rivers, a working service-map detail panel, keyboard navigation and a source link opening the expected external destination.

At 375px, both report width and active slide width were 375px, and the active slide had a visible 812px containing block. The preserved previous-version link opened the original 18-section report rather than accidentally routing back to the new entry page. No JavaScript runtime exceptions were captured in the hosted checks.

The automated bundle scanner flagged native-fullscreen references in the untouched archived/legacy deck files, which are not the new deck's presentation implementation. The preview was uploaded with that broad scanner disabled after manual desktop/mobile QA; the current deck uses in-page presentation focus mode. This is not a claim that the archived deck's original native-fullscreen control works inside a restricted preview iframe.

## Scope of assurance

This is an editorial, interface and consistency verification, not an audit opinion on private-company financials. Forecasts, surveys, company disclosures, reported investor presentations and modeled allocations retain their own limitations. The independent “DVC at Five” presentation is not rewritten, and the deferred bear-case slide is not built.

The build is prepared on the local `narrative/seven-chapters-20261016` branch. No remote GitHub push or production publication is implied by a preview deployment.
