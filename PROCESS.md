## What I built

My interactive explainer is about content modelling: breaking content into
distinct structured fields before it goes anywhere near a page. Most web work
talks about code and visual design, rarely about this. The visitor extracts
fields — release date, genre, director, cast, poster, plot — from one movie's
raw text blob, and each extraction unlocks a filter or search feature across
the whole 12-movie catalog, not just the movie being edited.

## The moments that mattered

### 1st moment: Scoping the topic

1. **what happened**<br/>
My first idea explained content modelling in general: fields, taxonomy,
components, media, as a sort-into-buckets interaction across several content
types. A visitor with no CMS background wouldn't know what to do with that,
and several concepts risked reading as several unrelated ideas, not one.
2. **what I did instead of the obvious thing**<br/>
I narrowed to one content type any visitor recognises — a movie — and changed
the payoff from "tidy up one record" to "unlock capability across a whole
catalog." Extracting genre/cast/poster/plot from one movie's raw blob turns on
a filter or search feature across every movie in the listing.
3. **how you knew it was right**<br/>
I checked it against the brief again: it made the interaction concrete enough
to state as a test (the genre filter doesn't exist until taxonomy runs, and
returns correct results right after), and it collapsed a sprawling idea into
the single focused one the brief asks for.
4. **the citation**<br/>
[`69bd9fa ... 8e7e509`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/compare/69bd9fa...8e7e509)

### 2nd moment: one editable panel, not every card

1. **what happened**<br/>
My first version gave every grid card the same clickable-looking blob styling
as the worked example, assuming visual consistency was the goal. With 8-12
cards all reading as "click me," a visitor had no way to tell which one was
the actual exercise and which were just... other movies.
2. **what you did instead of the obvious thing**<br/>
I moved to one dedicated panel as the only clickable place, leaving every
other card's blob visible but inert. To keep the catalog-wide payoff visible
rather than asserted, those inert blobs update passively: the moment a step
completes in the panel, the matching phrase in every card's blob gets the same
highlight and flips to its structured form, in sync.
3. **how you knew it was right**<br/>
I checked this against the affordance problem (only one thing in the UI should
read as "do this") and against build cost: the highlight reuses the same data
and trigger already needed for the catalog filters, not a second mechanism.
4. **the citation**<br/>
[`6e10ed0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/commit/6e10ed0)

### 3rd moment: Dimming the panel instead of removing it entirely

1. **what happened**<br/>
While compacting the grid to cut scrolling, I planned to remove the panel
once all six steps were done, matching the tidied grid and clearing the
"leftover UI" feeling of nothing left to click.
2. **what you did instead of the obvious thing**<br/>
I paused and talked it through with the agent. The panel is the worked example
showing a raw blob and its structured-facts transformation side by side — the
reference every card's synced reveal echoes. Removing it would delete exactly
the comparison the exercise is built around, and contradict an earlier call to
leave the panel's own blob untouched after the grid's blobs disappeared. So I
dimmed and collapsed it instead: present, low visual weight, still comparable.
3. **how you knew it was right**<br/>
The point of this topic is showing how content modelling turns unstructured
content into the best possible view for visitors, and that needs a before/after
side by side. Losing the panel would remove the one place that comparison
exists.
4. **the citation**<br/>
[`08df7d0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/commit/08df7d0)
