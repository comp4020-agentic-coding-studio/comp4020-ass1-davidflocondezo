## What I built
My interactive explainer is about the importance of content modelling: breaking 
content into distinct structures before it displays on a user experince.
Most common topics about website and digital development talk about coding, 
visual design and maybe discovery but rarely about content modelling. 
I tackle this topic by allowing users to extract fields: 
Release date, genre, director, cast, poster, plot, from one movie's
raw-text blob, and each extraction unlocks a filter or search feature across
the whole 12-movie listing. This shows the importance of having this structured 
content and how it affects how the user can interact with the experience.

## The moments that mattered

### Scoping the topic

1. **what happened**<br/>
My first idea explained content modelling in general as a sort-into-buckets 
interaction across content. A visitor with no content modelling 
background wouldn't know what to do with that and the multiple activities 
that it would create, risked reading as several unrelated ideas, not one.
2. **what I did instead**<br/>
I narrowed it to one content type any visitor recognises: a movie and changed
the payoff from "tidy up records" to "unlock capability across a listing." 
Extracting genre/cast/poster/plot from one movie's raw-blob turns on
a filter or search feature across every movie in the listing.
3. **how I knew it was right**<br/>
I checked it against the brief again: it made the interaction concrete enough
to state as a test (the genre filter doesn't exist until taxonomy runs, and
returns correct results right after), and it collapsed a sprawling idea into
the single focused one the brief asks for.
4. **citation**<br/>
[`69bd9fa...6e10ed0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/compare/69bd9fa...6e10ed0)

### One editable panel

1. **what happened**<br/>
My first version gave every movie listing the same clickable blob as the worked 
example. With 12 movies all essentially telling the visitor to "click me". 
It wasn't till I did my first interactive stepthrough that I found out 
that a visitor had no way to tell which was the actual exercise.
2. **what I did instead**<br/>
I left one dedicated panel as the only clickable place, leaving every
other listing's blob visible but inert. To keep the listing-wide payoff visible,
the blobs all still update. The moment a step completes in the panel, 
the matching data in every card's listing gets the same
highlight and flips to its structured form, in sync.
3. **how I knew it was right**<br/>
I checked this against the affordance problem (only one thing in the UI should
read as "do this") and against build cost: the highlight reuses the same data
and trigger already needed for the listing filters, not a second mechanism.
4. **citation**<br/>
[`6e10ed0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/commit/6e10ed0)

### Dimming the panel instead of removing it entirely

1. **what happened**<br/>
While compacting the listings to reduce scrolling, I planned to remove the dedicated blob panel
once all the steps were done, clearing the "leftover UI" feeling of nothing left to click.
2. **what I did instead**<br/>
I paused and talked it through with the agent. I realised that the panel is the worked example
showing a raw-blob and its structured-facts transformation side by side.
Removing it would delete exactly the comparison the entire exercise is built around, 
and would contradict the previous moment too. Instead I dimmed and changed the opacity 
when steps completed to keep the UI a bit clean.
3. **how I knew it was right**<br/>
The point of this topic is showing how content modelling turns unstructured
content into the best possible view for visitors, and that needs a before/after
side by side. Losing the panel would remove the one place that comparison exists.
4. **citation**<br/>
[`08df7d0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-davidflocondezo/commit/08df7d0)
