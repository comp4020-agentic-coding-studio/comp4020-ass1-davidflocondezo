## What I built
My interactive explainer is about the importance of content modelling: breaking 
content into distinct structured fields before it displays on a user experince.
Most common topics about website and digital development talks about coding, 
visual design and maybe discovery but rarely about content modelling. 
I tackle this topic by allowing users to extract fields: 
Release date, genre, director, cast, poster, plot, from one movie's
raw text blob, and each extraction unlocks a filter or search feature across
the whole 12-movie listing. This shows the importance of having this structured 
content and how it affects how the user can interact with the experience.

## The moments that mattered

### Scoping the topic

1. **what happened**<br/>
My first idea explained content modelling in general as a sort-into-buckets 
interaction across several content types. A visitor with no CMS background 
wouldn't know what to do with that,and several concepts risked reading as 
several unrelated ideas, not one.
2. **what I did instead of the obvious thing**<br/>
I narrowed to one content type any visitor recognises: a movie and changed
the payoff from "tidy up one record" to "unlock capability across a whole
catalog." Extracting genre/cast/poster/plot from one movie's raw blob turns on
a filter or search feature across every movie in the listing.
3. **how you knew it was right**<br/>
I checked it against the brief again: it made the interaction concrete enough
to state as a test (the genre filter doesn't exist until taxonomy runs, and
returns correct results right after), and it collapsed a sprawling idea into
the single focused one the brief asks for.
4. **citation**<br/>
[`69bd9fa...8e7e509`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/compare/69bd9fa...8e7e509)

### One editable panel

1. **what happened**<br/>
My first version gave every movie listing the same clickable blob as the worked 
example. With 12 movies all essentially telling the visitor to "click me,". 
It wasn't till i did my first stepthrough of the experience that I found out 
that a visitor had no way to tell which was the actual exercise.
2. **what you did instead of the obvious thing**<br/>
I moved to one dedicated panel as the only clickable place, leaving every
other card's blob visible but inert. To keep the listing-wide payoff visible,
the blobs all still update together: the moment a step
completes in the panel, the matching phrase in every card's blob gets the same
highlight and flips to its structured form, in sync.
3. **how you knew it was right**<br/>
I checked this against the affordance problem (only one thing in the UI should
read as "do this") and against build cost: the highlight reuses the same data
and trigger already needed for the listing filters, not a second mechanism.
4. **citation**<br/>
[`6e10ed0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/commit/6e10ed0)

### Dimming the panel instead of removing it entirely

1. **what happened**<br/>
While compacting the listings to reduce scrolling, I planned to remove the blob panel
once all steps were done, clearing the "leftover UI" feeling of nothing left to click.
2. **what you did instead of the obvious thing**<br/>
I paused and talked it through with the agent. I realised that the panel is the worked example
showing a raw blob and its structured-facts transformation side by side — the
reference every card's synced reveal echoes. Removing it would delete exactly
the comparison the exercise is built around, and contradict an earlier call to
leave the panel's own blob untouched after the grid's blobs disappeared. So I
dimmed and changed the opacity when completed instead.
3. **how you knew it was right**<br/>
The point of this topic is showing how content modelling turns unstructured
content into the best possible view for visitors, and that needs a before/after
side by side. Losing the panel would remove the one place that comparison exists.
4. **citation**<br/>
[`08df7d0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/commit/08df7d0)
