import type { MovieRecord } from "../types/movie";

// The one movie the visitor actually works on: every phrase in its blob is
// clickable, and extracting a facet from it is what unlocks that facet's
// filter/search/render across the whole catalog below.
export const PANEL_MOVIE_ID = "alien";

// Every poster is the same person's original artwork, made for this project,
// so the credit line is identical on every record — that's accurate, not
// lazy. It's structured data only (data.poster.credit, shown in
// StructuredFacts), never woven into a blob: there's no plausible raw-import
// sentence that would say this, so it isn't something extraction could
// discover. `poster.url` is a relative path (no leading slash): this repo
// builds under a GitHub Pages base path, so render code must prefix it with
// `import.meta.env.BASE_URL` rather than treating it as root-absolute (see
// astro.config.ts). The image files themselves don't exist yet — they're
// hand-drawn separately and dropped into public/posters/.
const POSTER_CREDIT = "Original artwork created for this project";

// Plots are written as an ordered array of sentence fragments, not one
// string. `data.plot` is the fragments joined with a single space — one
// source, so there's nothing to let drift between the structured value and
// the wording the UI has to find inside the raw text. `anchors.plot` is the
// same array: each fragment is a real, exact substring of `blob`, but the
// blob scatters them apart from each other, interrupted by genre/cast/
// director/poster sentences, rather than keeping the plot as one contiguous
// run of text.

const spiderManPlotSentences = [
  "Four years after the world forgot he was ever Spider-Man, Peter Parker still patrols New York alone, watching old friends move on without him.",
  "When a threat too dangerous to see by conventional means starts picking off the city's heroes, Peter is forced to confront a change in himself that he can't fully control.",
  "Old allies resurface as he tries to hold his double life together without the support system he once had.",
  "Whether he can stop the threat may come down to accepting the very transformation he's been fighting.",
];
const spiderManPlot = spiderManPlotSentences.join(" ");

const odysseyPlotSentences = [
  "Twenty years after leaving for the Trojan War, Odysseus is still trying to find his way home to Ithaca, harried at every turn by vengeful gods and monstrous obstacles.",
  "Back home, his wife Penelope holds off a growing crowd of suitors while raising a son who barely remembers his father.",
  "Odysseus's cunning is tested against sirens, cyclopes, and the sea itself as much as his strength is.",
  "The journey becomes as much about who he's willing to become to get home as it is about the distance left to travel.",
];
const odysseyPlot = odysseyPlotSentences.join(" ");

const darkKnightPlotSentences = [
  "With Gotham's organized crime rattled by Batman's growing effectiveness, a chaotic new criminal calling himself the Joker emerges to plunge the city into anarchy.",
  "Bruce Wayne, District Attorney Harvey Dent, and Lieutenant Jim Gordon form an uneasy alliance to bring him down, but the Joker's goal isn't money or power — it's proving that anyone can be broken.",
  "As the body count rises and the city's faith in its protectors erodes, Batman is pushed toward choices that blur the line between the hero Gotham wants and the one it actually needs.",
];
const darkKnightPlot = darkKnightPlotSentences.join(" ");

const prestigePlotSentences = [
  "Two rival stage magicians in turn-of-the-century London, Robert Angier and Alfred Borden, push their obsessive competition further and further past the point of professional rivalry.",
  "After a trick goes fatally wrong, each man dedicates himself to outdoing the other at any cost, sabotaging shows and stealing secrets along the way.",
  "Their pursuit of the perfect illusion — a man vanishing and reappearing instantly — leads both toward sacrifices that have little to do with showmanship anymore.",
  "By the time the truth behind their tricks comes out, neither man is left with much of what he started with.",
];
const prestigePlot = prestigePlotSentences.join(" ");

const obsessionPlotSentences = [
  "After breaking a mysterious carved willow charm while trying to win over his crush Nikki, music-store employee Bear gets exactly what he wished for: she falls for him almost overnight.",
  "It isn't long before Bear realizes the charm's gift comes with a price he never agreed to, as people around the new couple start meeting sinister ends.",
  "Bear tries to undo what he's done before it costs him everything, but the willow's wish, once granted, doesn't let go easily.",
  "What began as a hopeless-romantic's shortcut curdles into a fight to survive his own desire.",
];
const obsessionPlot = obsessionPlotSentences.join(" ");

const shangChiPlotSentences = [
  "Shaun, a San Francisco valet who has spent years quietly avoiding his past, is pulled back into it when his father's organization, the Ten Rings, comes looking for him and his sister.",
  "Alongside his friend Katy, he travels to confront the father he fled and the legacy of power he was trained since childhood to inherit.",
  "What he finds waiting in his father's hidden village of Ta Lo is older and stranger than the criminal empire he grew up fearing.",
  "Shaun has to decide how much of his father's strength he's willing to carry forward, and how much he has to leave behind.",
];
const shangChiPlot = shangChiPlotSentences.join(" ");

const creedPlotSentences = [
  "Adonis Johnson, the son of the late boxing champion Apollo Creed, has never met his father and has spent his life trying to prove he can be more than the name he never got to use growing up.",
  "He tracks down Apollo's old rival and friend Rocky Balboa in Philadelphia and asks him to be his trainer, despite Rocky having left boxing behind long ago.",
  "As Adonis fights his way up under a false name to avoid living in his father's shadow, Rocky faces a fight of his own outside the ring.",
  "Their partnership becomes less about making a champion and more about two men helping each other reckon with who they are.",
];
const creedPlot = creedPlotSentences.join(" ");

const devilWearsPradaPlotSentences = [
  "Andy Sachs, an aspiring journalist with little interest in fashion, takes a job as junior assistant to Miranda Priestly, the notoriously demanding editor-in-chief of Runway magazine.",
  "What starts as a stopgap job becomes an education in an industry Andy once dismissed, as she's pushed to anticipate Miranda's every impossible demand.",
  "The better Andy gets at the job, the more it starts to cost her outside of it, from her relationships to her sense of who she wants to become.",
  "By the time she's finally good at surviving Miranda's world, she has to decide whether she still wants to live in it.",
];
const devilWearsPradaPlot = devilWearsPradaPlotSentences.join(" ");

const homeAlonePlotSentences = [
  "Eight-year-old Kevin McCallister is accidentally left behind when his large family rushes off on a Christmas vacation to Paris without him.",
  "At first thrilled to have the house to himself, Kevin quickly has to grow up when two bumbling burglars, Harry and Marv, target his home believing it's empty.",
  "Using a string of household booby traps, Kevin turns the house into a gauntlet the two thieves aren't prepared for.",
  "Meanwhile, his mother races against time and holiday travel chaos to get back to him before the burglars succeed.",
];
const homeAlonePlot = homeAlonePlotSentences.join(" ");

const sinnersPlotSentences = [
  "In 1932 Mississippi, twin brothers Smoke and Stack return to their hometown after years away and pour everything they have into opening a juke joint for the local Black community.",
  "Their opening night celebration draws a crowd looking for one good night before the hardships of the Jim Crow South resume come morning.",
  "But something far older and hungrier than the law has taken an interest in the gathering, and by midnight the party has to become a fight to survive until dawn.",
  "What starts as a homecoming turns into a siege none of them saw coming.",
];
const sinnersPlot = sinnersPlotSentences.join(" ");

const alienPlotSentences = [
  "The crew of the commercial towing vessel Nostromo is woken early from hyper-sleep to investigate a distress signal from a nearby moon, against warrant officer Ripley's objections.",
  "What they bring back aboard is not a survivor but something else entirely, and it doesn't stay contained for long.",
  "As the creature picks the crew off one by one through the ship's cramped corridors, Ripley has to figure out how to survive both it and the company that sent them there.",
  "By the end, staying alive means trusting no one's motives but her own.",
];
const alienPlot = alienPlotSentences.join(" ");

const martianPlotSentences = [
  "During a dust-storm evacuation of a manned Mars mission, astronaut Mark Watney is struck by debris and presumed dead, so his crew leaves the planet without him.",
  "Watney survives, alone on Mars with limited supplies and no way to tell Earth he's alive, and has to use his training as a botanist and engineer to keep himself fed and sheltered until help can come.",
  "Back on Earth, NASA and his crew, led by Commander Melissa Lewis, race to work out whether a rescue is even possible.",
  "Getting him home becomes a problem of logistics, improvisation, and how much risk everyone is willing to take for one person.",
];
const martianPlot = martianPlotSentences.join(" ");

export const movies: MovieRecord[] = [
  {
    id: "spider-man-brand-new-day",
    blob: `Spider-Man: Brand New Day hit theaters July 31, 2026. ${spiderManPlotSentences[0]} It's an Action/Adventure/Fantasy blockbuster directed by Destin Daniel Cretton. ${spiderManPlotSentences[1]} Tom Holland carries the whole film as Peter Parker. ${spiderManPlotSentences[2]} Zendaya returns as MJ, sharper and more guarded than before. ${spiderManPlotSentences[3]} The poster shows a lone red-and-blue silhouette dwarfed by a city that no longer recognizes him.`,
    data: {
      title: "Spider-Man: Brand New Day",
      releaseDate: "2026-07-31",
      plot: spiderManPlot,
      genres: ["Action", "Adventure", "Fantasy"],
      director: ["Destin Daniel Cretton"],
      cast: [
        { actor: "Tom Holland", character: "Peter Parker" },
        { actor: "Zendaya", character: "MJ" },
      ],
      poster: {
        url: "posters/spider-man-brand-new-day.jpeg",
        alt: "a lone red-and-blue silhouette dwarfed by a city that no longer recognizes him",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "July 31, 2026",
      plot: spiderManPlotSentences,
      genres: ["Action", "Adventure", "Fantasy"],
      director: ["Destin Daniel Cretton"],
      cast: [
        { actor: "Tom Holland", character: "Peter Parker", anchor: "Tom Holland carries the whole film as Peter Parker" },
        { actor: "Zendaya", character: "MJ", anchor: "Zendaya returns as MJ, sharper and more guarded than before" },
      ],
      poster: {
        anchor: "a lone red-and-blue silhouette dwarfed by a city that no longer recognizes him",
      },
    },
  },
  {
    id: "the-odyssey",
    blob: `Matt Damon anchors the whole voyage as Odysseus in The Odyssey, which premiered July 17, 2026. ${odysseyPlotSentences[0]} Anne Hathaway gives Penelope a quiet, unshakeable resolve. ${odysseyPlotSentences[1]} It's an Adventure/Fantasy/Action epic. ${odysseyPlotSentences[2]} Christopher Nolan directed the film. ${odysseyPlotSentences[3]} The poster shows a wooden ship cresting a black wave under a sky full of watching gods.`,
    data: {
      title: "The Odyssey",
      releaseDate: "2026-07-17",
      plot: odysseyPlot,
      genres: ["Adventure", "Fantasy", "Action"],
      director: ["Christopher Nolan"],
      cast: [
        { actor: "Matt Damon", character: "Odysseus" },
        { actor: "Anne Hathaway", character: "Penelope" },
      ],
      poster: {
        url: "posters/the-odyssey.jpeg",
        alt: "a wooden ship cresting a black wave under a sky full of watching gods",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "July 17, 2026",
      plot: odysseyPlotSentences,
      genres: ["Adventure", "Fantasy", "Action"],
      director: ["Christopher Nolan"],
      cast: [
        { actor: "Matt Damon", character: "Odysseus", anchor: "Matt Damon anchors the whole voyage as Odysseus" },
        { actor: "Anne Hathaway", character: "Penelope", anchor: "Anne Hathaway gives Penelope a quiet, unshakeable resolve" },
      ],
      poster: {
        anchor: "a wooden ship cresting a black wave under a sky full of watching gods",
      },
    },
  },
  {
    id: "the-dark-knight",
    blob: `The Dark Knight opened July 18, 2008. ${darkKnightPlotSentences[0]} It's an Action/Crime/Drama landmark. ${darkKnightPlotSentences[1]} Christian Bale returns as Bruce Wayne, more worn down than before. Heath Ledger's Joker steals every scene he's in. ${darkKnightPlotSentences[2]} Christopher Nolan directed the film. The poster shows a cracked bat-symbol reflected in broken glass, lit by a single sickly green glow.`,
    data: {
      title: "The Dark Knight",
      releaseDate: "2008-07-18",
      plot: darkKnightPlot,
      genres: ["Action", "Crime", "Drama"],
      director: ["Christopher Nolan"],
      cast: [
        { actor: "Christian Bale", character: "Bruce Wayne" },
        { actor: "Heath Ledger", character: "The Joker" },
      ],
      poster: {
        url: "posters/the-dark-knight.jpeg",
        alt: "a cracked bat-symbol reflected in broken glass, lit by a single sickly green glow",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "July 18, 2008",
      plot: darkKnightPlotSentences,
      genres: ["Action", "Crime", "Drama"],
      director: ["Christopher Nolan"],
      cast: [
        { actor: "Christian Bale", character: "Bruce Wayne", anchor: "Christian Bale returns as Bruce Wayne, more worn down than before" },
        { actor: "Heath Ledger", character: "The Joker", anchor: "Heath Ledger's Joker steals every scene he's in" },
      ],
      poster: {
        anchor: "a cracked bat-symbol reflected in broken glass, lit by a single sickly green glow",
      },
    },
  },
  {
    id: "the-prestige",
    blob: `Christian Bale plays the obsessive illusionist Alfred Borden in The Prestige, a Drama/Mystery/Sci-Fi puzzle box that arrived October 20, 2006. ${prestigePlotSentences[0]} Hugh Jackman is just as consumed as Robert Angier. ${prestigePlotSentences[1]} Christopher Nolan directed the film. ${prestigePlotSentences[2]} The poster shows two identical top hats facing each other across an empty stage. ${prestigePlotSentences[3]}`,
    data: {
      title: "The Prestige",
      releaseDate: "2006-10-20",
      plot: prestigePlot,
      genres: ["Drama", "Mystery", "Sci-Fi"],
      director: ["Christopher Nolan"],
      cast: [
        { actor: "Christian Bale", character: "Alfred Borden" },
        { actor: "Hugh Jackman", character: "Robert Angier" },
      ],
      poster: {
        url: "posters/the-prestige.jpeg",
        alt: "two identical top hats facing each other across an empty stage",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "October 20, 2006",
      plot: prestigePlotSentences,
      genres: ["Drama", "Mystery", "Sci-Fi"],
      director: ["Christopher Nolan"],
      cast: [
        { actor: "Christian Bale", character: "Alfred Borden", anchor: "Christian Bale plays the obsessive illusionist Alfred Borden" },
        { actor: "Hugh Jackman", character: "Robert Angier", anchor: "Hugh Jackman is just as consumed as Robert Angier" },
      ],
      poster: {
        anchor: "two identical top hats facing each other across an empty stage",
      },
    },
  },
  {
    id: "obsession",
    blob: `Obsession reached US theaters May 15, 2026. ${obsessionPlotSentences[0]} Michael Johnston plays the hapless Bear. ${obsessionPlotSentences[1]} It's a Horror debut written and directed by Curry Barker. ${obsessionPlotSentences[2]} Inde Navarrette plays Nikki, the object of his wish. ${obsessionPlotSentences[3]} The poster shows a gnarled willow branch wrapped tight around a small carved charm.`,
    data: {
      title: "Obsession",
      releaseDate: "2026-05-15",
      plot: obsessionPlot,
      genres: ["Horror"],
      director: ["Curry Barker"],
      cast: [
        { actor: "Michael Johnston", character: "Bear" },
        { actor: "Inde Navarrette", character: "Nikki" },
      ],
      poster: {
        url: "posters/obsession.jpeg",
        alt: "a gnarled willow branch wrapped tight around a small carved charm",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "May 15, 2026",
      plot: obsessionPlotSentences,
      genres: ["Horror"],
      director: ["Curry Barker"],
      cast: [
        { actor: "Michael Johnston", character: "Bear", anchor: "Michael Johnston plays the hapless Bear" },
        { actor: "Inde Navarrette", character: "Nikki", anchor: "Inde Navarrette plays Nikki, the object of his wish" },
      ],
      poster: {
        anchor: "a gnarled willow branch wrapped tight around a small carved charm",
      },
    },
  },
  {
    id: "shang-chi",
    blob: `Shang-Chi and the Legend of the Ten Rings opened September 3, 2021. ${shangChiPlotSentences[0]} Simu Liu leads as Shang-Chi, trying to outrun his own name. ${shangChiPlotSentences[1]} It's an Action/Adventure/Fantasy origin story directed by Destin Daniel Cretton. ${shangChiPlotSentences[2]} Awkwafina brings dry humor as his friend Katy. ${shangChiPlotSentences[3]} The poster shows ten glowing rings suspended mid-air around a lone silhouette in a fighting stance.`,
    data: {
      title: "Shang-Chi and the Legend of the Ten Rings",
      releaseDate: "2021-09-03",
      plot: shangChiPlot,
      genres: ["Action", "Adventure", "Fantasy"],
      director: ["Destin Daniel Cretton"],
      cast: [
        { actor: "Simu Liu", character: "Shang-Chi" },
        { actor: "Awkwafina", character: "Katy" },
      ],
      poster: {
        url: "posters/shang-chi.jpeg",
        alt: "ten glowing rings suspended mid-air around a lone silhouette in a fighting stance",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "September 3, 2021",
      plot: shangChiPlotSentences,
      genres: ["Action", "Adventure", "Fantasy"],
      director: ["Destin Daniel Cretton"],
      cast: [
        { actor: "Simu Liu", character: "Shang-Chi", anchor: "Simu Liu leads as Shang-Chi, trying to outrun his own name" },
        { actor: "Awkwafina", character: "Katy", anchor: "Awkwafina brings dry humor as his friend Katy" },
      ],
      poster: {
        anchor: "ten glowing rings suspended mid-air around a lone silhouette in a fighting stance",
      },
    },
  },
  {
    id: "creed",
    blob: `Creed hit theaters November 25, 2015, directed by Ryan Coogler. ${creedPlotSentences[0]} Michael B. Jordan carries the film as Adonis Creed. ${creedPlotSentences[1]} It's a Drama/Sport spin-off. ${creedPlotSentences[2]} Sylvester Stallone steps back into Rocky Balboa one more time. ${creedPlotSentences[3]} The poster shows two boxers' shadows overlapping into a single fighter under gym lights.`,
    data: {
      title: "Creed",
      releaseDate: "2015-11-25",
      plot: creedPlot,
      genres: ["Drama", "Sport"],
      director: ["Ryan Coogler"],
      cast: [
        { actor: "Michael B. Jordan", character: "Adonis Creed" },
        { actor: "Sylvester Stallone", character: "Rocky Balboa" },
      ],
      poster: {
        url: "posters/creed.jpeg",
        alt: "two boxers' shadows overlapping into a single fighter under gym lights",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "November 25, 2015",
      plot: creedPlotSentences,
      genres: ["Drama", "Sport"],
      director: ["Ryan Coogler"],
      cast: [
        { actor: "Michael B. Jordan", character: "Adonis Creed", anchor: "Michael B. Jordan carries the film as Adonis Creed" },
        { actor: "Sylvester Stallone", character: "Rocky Balboa", anchor: "Sylvester Stallone steps back into Rocky Balboa one more time" },
      ],
      poster: {
        anchor: "two boxers' shadows overlapping into a single fighter under gym lights",
      },
    },
  },
  {
    id: "the-devil-wears-prada",
    blob: `Meryl Streep is icily commanding as Miranda Priestly in The Devil Wears Prada, which opened June 30, 2006. ${devilWearsPradaPlotSentences[0]} It's a Comedy/Drama directed by David Frankel. ${devilWearsPradaPlotSentences[1]} Anne Hathaway plays in-over-her-head assistant Andy Sachs. ${devilWearsPradaPlotSentences[2]} The poster shows a single stiletto heel poised over a stack of glossy magazine covers. ${devilWearsPradaPlotSentences[3]}`,
    data: {
      title: "The Devil Wears Prada",
      releaseDate: "2006-06-30",
      plot: devilWearsPradaPlot,
      genres: ["Comedy", "Drama"],
      director: ["David Frankel"],
      cast: [
        { actor: "Meryl Streep", character: "Miranda Priestly" },
        { actor: "Anne Hathaway", character: "Andy Sachs" },
      ],
      poster: {
        url: "posters/the-devil-wears-prada.jpeg",
        alt: "a single stiletto heel poised over a stack of glossy magazine covers",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "June 30, 2006",
      plot: devilWearsPradaPlotSentences,
      genres: ["Comedy", "Drama"],
      director: ["David Frankel"],
      cast: [
        { actor: "Meryl Streep", character: "Miranda Priestly", anchor: "Meryl Streep is icily commanding as Miranda Priestly" },
        { actor: "Anne Hathaway", character: "Andy Sachs", anchor: "Anne Hathaway plays in-over-her-head assistant Andy Sachs" },
      ],
      poster: {
        anchor: "a single stiletto heel poised over a stack of glossy magazine covers",
      },
    },
  },
  {
    id: "home-alone",
    blob: `Home Alone opened November 16, 1990, a Comedy/Family holiday staple. ${homeAlonePlotSentences[0]} Chris Columbus directed it. ${homeAlonePlotSentences[1]} Macaulay Culkin is unforgettable as Kevin McCallister. ${homeAlonePlotSentences[2]} Joe Pesci plays the luckless burglar Harry. ${homeAlonePlotSentences[3]} The poster shows a small boy's face frozen mid-scream behind a frosted windowpane.`,
    data: {
      title: "Home Alone",
      releaseDate: "1990-11-16",
      plot: homeAlonePlot,
      genres: ["Comedy", "Family"],
      director: ["Chris Columbus"],
      cast: [
        { actor: "Macaulay Culkin", character: "Kevin McCallister" },
        { actor: "Joe Pesci", character: "Harry" },
      ],
      poster: {
        url: "posters/home-alone.jpeg",
        alt: "a small boy's face frozen mid-scream behind a frosted windowpane",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "November 16, 1990",
      plot: homeAlonePlotSentences,
      genres: ["Comedy", "Family"],
      director: ["Chris Columbus"],
      cast: [
        { actor: "Macaulay Culkin", character: "Kevin McCallister", anchor: "Macaulay Culkin is unforgettable as Kevin McCallister" },
        { actor: "Joe Pesci", character: "Harry", anchor: "Joe Pesci plays the luckless burglar Harry" },
      ],
      poster: {
        anchor: "a small boy's face frozen mid-scream behind a frosted windowpane",
      },
    },
  },
  {
    id: "sinners",
    blob: `Sinners opened April 18, 2025, directed by Ryan Coogler. ${sinnersPlotSentences[0]} It's a Horror/Thriller/Drama. ${sinnersPlotSentences[1]} Michael B. Jordan plays both twins, starting with Smoke. ${sinnersPlotSentences[2]} Hailee Steinfeld plays Mary, caught up in their opening night. ${sinnersPlotSentences[3]} The poster shows two identical silhouettes playing the same guitar under a blood-red sky.`,
    data: {
      title: "Sinners",
      releaseDate: "2025-04-18",
      plot: sinnersPlot,
      genres: ["Horror", "Thriller", "Drama"],
      director: ["Ryan Coogler"],
      cast: [
        { actor: "Michael B. Jordan", character: "Smoke" },
        { actor: "Hailee Steinfeld", character: "Mary" },
      ],
      poster: {
        url: "posters/sinners.jpeg",
        alt: "two identical silhouettes playing the same guitar under a blood-red sky",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "April 18, 2025",
      plot: sinnersPlotSentences,
      genres: ["Horror", "Thriller", "Drama"],
      director: ["Ryan Coogler"],
      cast: [
        { actor: "Michael B. Jordan", character: "Smoke", anchor: "Michael B. Jordan plays both twins, starting with Smoke" },
        { actor: "Hailee Steinfeld", character: "Mary", anchor: "Hailee Steinfeld plays Mary, caught up in their opening night" },
      ],
      poster: {
        anchor: "two identical silhouettes playing the same guitar under a blood-red sky",
      },
    },
  },
  {
    id: "alien",
    blob: `Alien opened May 25, 1979. ${alienPlotSentences[0]} It's a Sci-Fi/Horror classic. ${alienPlotSentences[1]} Ridley Scott directed it. ${alienPlotSentences[2]} Sigourney Weaver holds the screen as warrant officer Ellen Ripley. ${alienPlotSentences[3]} Tom Skerritt plays ship captain Dallas. The poster shows a cracked egg-shaped pod glowing faintly inside a dark cargo hold.`,
    data: {
      title: "Alien",
      releaseDate: "1979-05-25",
      plot: alienPlot,
      genres: ["Sci-Fi", "Horror"],
      director: ["Ridley Scott"],
      cast: [
        { actor: "Sigourney Weaver", character: "Ellen Ripley" },
        { actor: "Tom Skerritt", character: "Dallas" },
      ],
      poster: {
        url: "posters/alien.jpeg",
        alt: "a cracked egg-shaped pod glowing faintly inside a dark cargo hold",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "May 25, 1979",
      plot: alienPlotSentences,
      genres: ["Sci-Fi", "Horror"],
      director: ["Ridley Scott"],
      cast: [
        { actor: "Sigourney Weaver", character: "Ellen Ripley", anchor: "Sigourney Weaver holds the screen as warrant officer Ellen Ripley" },
        { actor: "Tom Skerritt", character: "Dallas", anchor: "Tom Skerritt plays ship captain Dallas" },
      ],
      poster: {
        anchor: "a cracked egg-shaped pod glowing faintly inside a dark cargo hold",
      },
    },
  },
  {
    id: "the-martian",
    blob: `The Martian opened October 2, 2015. ${martianPlotSentences[0]} It's an Adventure/Drama/Sci-Fi survival story. ${martianPlotSentences[1]} Ridley Scott directed it. ${martianPlotSentences[2]} Matt Damon is stranded and resourceful as Mark Watney. ${martianPlotSentences[3]} Jessica Chastain plays mission commander Melissa Lewis. The poster shows a lone figure standing in a red dust storm beneath a distant, indifferent sun.`,
    data: {
      title: "The Martian",
      releaseDate: "2015-10-02",
      plot: martianPlot,
      genres: ["Adventure", "Drama", "Sci-Fi"],
      director: ["Ridley Scott"],
      cast: [
        { actor: "Matt Damon", character: "Mark Watney" },
        { actor: "Jessica Chastain", character: "Melissa Lewis" },
      ],
      poster: {
        url: "posters/the-martian.jpeg",
        alt: "a lone figure standing in a red dust storm beneath a distant, indifferent sun",
        credit: POSTER_CREDIT,
      },
    },
    anchors: {
      releaseDate: "October 2, 2015",
      plot: martianPlotSentences,
      genres: ["Adventure", "Drama", "Sci-Fi"],
      director: ["Ridley Scott"],
      cast: [
        { actor: "Matt Damon", character: "Mark Watney", anchor: "Matt Damon is stranded and resourceful as Mark Watney" },
        { actor: "Jessica Chastain", character: "Melissa Lewis", anchor: "Jessica Chastain plays mission commander Melissa Lewis" },
      ],
      poster: {
        anchor: "a lone figure standing in a red dust storm beneath a distant, indifferent sun",
      },
    },
  },
];
