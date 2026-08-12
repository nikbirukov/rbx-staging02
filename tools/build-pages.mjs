/**
 * RegBox v2 — interior page generator.
 *
 * Static HTML/CSS/vanilla JS, no build step. This script exists only so the
 * shared manifest bar, header and footer live in ONE place instead of eight
 * copies that drift apart. Edit the shell or a page's content below, run
 * `node tools/build-pages.mjs`, and the interior pages are rewritten.
 *
 * index.html is deliberately NOT generated: it carries the unique hero and
 * is maintained by hand.
 *
 * Same content as v4's generator — real product descriptions, real
 * Exhibitor Marketing pricing, real portfolio list, drawn from a live read
 * of regbox.co.uk (fetched 2026-08-06) — restyled here in v2's own ticket/
 * manifest system (ink ground, phosphor-green signal, Big Shoulders) rather
 * than v4's Swiss/orange system. Nothing here is invented.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ORGANISER_PAGES = [
  ['/event-registration/', 'Event Registration'],
  ['/event-deck/', 'Event Deck'],
  ['/marketing-automation/', 'Marketing Automation'],
  ['/digital-solutions/', 'Digital Solutions'],
];

const EXHIBITOR_PAGES = [
  ['/online-exhibitor-manual/', 'Online Exhibitor Manual'],
  ['/exhibitor-marketing/', 'Exhibitor Marketing'],
];

// Interior pages all live one directory below the root (/event-deck/index.html,
// not /event-deck.html), so every link between them — and every asset link —
// needs a '../' prefix rather than a leading '/'. Root-relative paths break
// the moment the site is served from a subpath (e.g. a GitHub Pages project
// site) rather than a domain root.
const rel = (absolutePath) => `..${absolutePath}`;

const subList = (pages, current) =>
  pages
    .map(([href, label]) =>
      `            <li><a href="${rel(href)}"${href === current ? ' aria-current="page"' : ''}>${label}</a></li>`
    )
    .join('\n');

const footList = (pages) =>
  pages.map(([href, label]) => `        <li><a href="${rel(href)}">${label}</a></li>`).join('\n');

const SITE = 'https://www.regbox.co.uk';
// Bump on every edit to style.css / site.js — the browser has no other
// reason to fetch either past its first visit.
const ASSET_VERSION = 7;

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RegBox',
  alternateName: 'RegBox™',
  url: `${SITE}/`,
  description: 'Event registration systems, onsite badging, exhibitor manuals and event data solutions for UK exhibitions, shows and conferences.',
  telephone: '+44-845-612-3640',
  email: 'info@regbox.co.uk',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '59 Pound Street',
    addressLocality: 'Carshalton',
    addressRegion: 'Surrey',
    postalCode: 'SM5 3PG',
    addressCountry: 'GB',
  },
  parentOrganization: { '@type': 'Organization', name: 'IG Events' },
  memberOf: { '@type': 'Organization', name: 'ESSA — Event Supplier and Services Association' },
};

// Matches the visual .crumbs breadcrumb in phead() exactly, so the
// structured data never claims a path the page itself doesn't show.
const breadcrumbSchema = (section, label, url) => {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }];
  if (section) items.push({ '@type': 'ListItem', position: 2, name: section });
  items.push({ '@type': 'ListItem', position: items.length + 1, name: label, item: `${SITE}${url}` });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
};

const shell = ({ url, section, title, description, body }) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — RegBox</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE}${url}">
<meta name="robots" content="index, follow">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230C0F0D'/%3E%3Crect x='9' y='9' width='14' height='14' fill='%2334F08A'/%3E%3C/svg%3E">
<meta name="theme-color" content="#0C0F0D">

<meta property="og:type" content="website">
<meta property="og:site_name" content="RegBox">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${title} — RegBox">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE}${url}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title} — RegBox">
<meta name="twitter:description" content="${description}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders:wght@500;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/style.css?v=${ASSET_VERSION}">

<script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbSchema(section, title, url))}</script>
</head>
<body>

<a class="skip" href="#main">Skip to content</a>

<div class="manibar">
  <div class="wrap manibar__in">
    <p class="manibar__status"><span class="dot" aria-hidden="true"></span> SYSTEM STATUS: OPERATIONAL</p>
    <p class="manibar__mid">
      <span>REGISTRATION DIVISION OF IG EVENTS</span>
      <span>ESSA MEMBER</span>
      <span id="clock" class="mono" aria-label="Current time"></span>
    </p>
    <p class="manibar__links">
      <a href="tel:+448456123640">0845 612 3640</a>
      <a href="mailto:info@regbox.co.uk">info@regbox.co.uk</a>
    </p>
  </div>
</div>

<header class="site-head">
  <div class="wrap site-head__in">
    <a class="brand" href="../">
      <span class="brand__word">REGBOX<span class="bar" aria-hidden="true"><i></i><i></i><i></i><i></i></span></span>
      <span class="brand__tag">Event data solutions</span>
    </a>
    <input type="checkbox" id="navtoggle" class="navtoggle" hidden>
    <label for="navtoggle" class="burger" aria-label="Open menu"><span></span><span></span><span></span></label>
    <nav class="nav" aria-label="Primary">
      <div class="nav__head">
        <span class="brand__word">REGBOX<span class="bar" aria-hidden="true"><i></i><i></i><i></i><i></i></span></span>
        <label for="navtoggle" class="nav__close" aria-label="Close menu"><span></span><span></span></label>
      </div>
      <ul>
        <li><a href="../"><span class="no">00</span> Home</a></li>
        <li class="has-sub">
          <button type="button" class="nav__parent" aria-expanded="false">Organisers</button>
          <ul class="sub">
${subList(ORGANISER_PAGES, url)}
          </ul>
        </li>
        <li class="has-sub">
          <button type="button" class="nav__parent" aria-expanded="false">Exhibitors</button>
          <ul class="sub">
${subList(EXHIBITOR_PAGES, url)}
          </ul>
        </li>
        <li><a href="${rel('/contact-us/')}"${url === '/contact-us/' ? ' aria-current="page"' : ''}>Contact us</a></li>
      </ul>
      <a class="btn btn--primary nav__cta" href="${rel('/contact-us/')}">Request a quote</a>
    </nav>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="foot">
  <div class="wrap foot__in">
    <div class="foot__brand">
      <a class="brand" href="../"><span class="brand__word">REGBOX<span class="bar" aria-hidden="true"><i></i><i></i><i></i><i></i></span></span></a>
      <p>Event registration systems and software for exhibitions, shows and
         conferences. The registration division of IG&nbsp;Events.</p>
    </div>
    <nav class="foot__nav" aria-label="Organisers">
      <h2>Organisers</h2>
      <ul>
${footList(ORGANISER_PAGES)}
      </ul>
    </nav>
    <nav class="foot__nav" aria-label="Exhibitors">
      <h2>Exhibitors</h2>
      <ul>
${footList(EXHIBITOR_PAGES)}
        <li><a href="${rel('/contact-us/')}">Contact us</a></li>
      </ul>
    </nav>
    <div class="foot__contact">
      <h2>Get in touch</h2>
      <ul>
        <li><a href="tel:+448456123640">0845 612 3640</a></li>
        <li><a href="tel:+448456123650">0845 612 3650</a></li>
        <li><a href="mailto:info@regbox.co.uk">info@regbox.co.uk</a></li>
        <li class="mono">59 Pound Street, Carshalton,<br>Surrey, SM5 3PG</li>
        <li class="mono">Mon–Fri, 9:00am–5:30pm</li>
      </ul>
    </div>
  </div>
  <div class="wrap foot__legal">
    <p>&copy; <span id="yr">2026</span> RegBox™. All rights reserved.</p>
    <p><a href="${rel('/privacy-policy/')}">Privacy policy</a> · <a href="${rel('/tos/')}">Terms and conditions</a></p>
  </div>
</footer>

<script src="../assets/js/site.js?v=${ASSET_VERSION}" defer></script>
</body>
</html>
`;

const phead = ({ section, label, h1, lede }) => `
  <section class="phead">
    <div class="wrap">
      <ol class="crumbs">
        <li><a href="../">Home</a></li>
${section ? `        <li>${section}</li>\n` : ''}        <li aria-current="page">${label}</li>
      </ol>
      <h1>${h1}</h1>
      <p class="phead__lede">${lede}</p>
    </div>
  </section>
`;

const cta = (heading, sub) => `
  <section class="final">
    <div class="wrap final__in">
      <div>
        <p class="final__eyebrow mono">Next departure</p>
        <h2>${heading}</h2>
        <p>${sub}</p>
      </div>
      <div class="final__actions">
        <a class="btn btn--primary" href="${rel('/contact-us/')}">Request a quote</a>
        <a class="tel" href="tel:+448456123640" style="color: var(--paper);">0845 612 3640</a>
      </div>
    </div>
  </section>
`;

/* ------------------------------------------------------------------ pages -- */

const pages = [];

pages.push({
  url: '/event-registration/',
  title: 'Event Registration',
  section: 'Organisers',
  description: 'Online and onsite event registration, tracking, reporting and barcoded ID badge printing, with self-service terminals. RegBox software developed over more than twenty years.',
  body:
    phead({
      section: 'Organisers',
      label: 'Event Registration',
      h1: 'Event Registration',
      lede: 'A powerful combination of registration products and services, backed by deployment know-how, to implement complete market-ready systems and generate ROI.',
    }) + `
  <section class="section section--paper" id="how">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Onsite and online</p>
        <h2>One system, not two products bolted together</h2>
        <p class="prose">The RegBox™ all-in-one onsite registration system integrates visitor
           and delegate registration, tracking, reporting and barcoded ID badge printing in a
           range of card formats — designed to stay straightforward for desk staff under
           pressure, and to produce personalised ID badges at a fraction of the usual
           investment.</p>
      </div>
      <div class="stubs">
        <article class="stub">
          <p class="stub__no mono">01</p>
          <h3>Onsite registration</h3>
          <p>State-of-the-art event management software and data capture technology, so
             staff can register and manage visitors and generate live attendance reports at
             the desk.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">02</p>
          <h3>Online registration</h3>
          <p>Dynamically built and seamlessly integrated with your event's own site
             branding, with access to detailed demographic data reports and self-managed
             content.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">03</p>
          <h3>Self-service terminals</h3>
          <p>Fully networked terminals let attendees handle their own registration and
             collect an admission badge as they arrive.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--ink">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">RegBox™ software</p>
        <h2>Built over more than twenty years</h2>
        <p class="prose">Developed over more than twenty years and built on the Microsoft
           platform for flexibility, the software is customised to the event rather than the
           event bending to fit the software.</p>
      </div>
      <div class="creds">
        <div class="cred">
          <p class="cred__no mono">01</p>
          <h3>Lower admin costs</h3>
          <p>Reduce administrative and operational overhead across the registration
             process.</p>
        </div>
        <div class="cred">
          <p class="cred__no mono">02</p>
          <h3>Fast onsite registration</h3>
          <p>Efficient check-in built to keep a queue moving when arrivals come in
             bursts.</p>
        </div>
        <div class="cred">
          <p class="cred__no mono">03</p>
          <h3>New revenue streams</h3>
          <p>Registration data and onsite delivery create new commercial opportunities
             around the event.</p>
        </div>
      </div>
    </div>
  </section>
` + cta('Tell us about your event.', 'Size, categories, and what has to happen at the door — we’ll come back with a quote.'),
});

pages.push({
  url: '/event-deck/',
  title: 'Event Deck',
  section: 'Organisers',
  description: 'Event Deck is the RegBox web app giving live access to your event data — from pre-event marketing results through to real-time attendance and exhibitor performance.',
  body:
    phead({
      section: 'Organisers',
      label: 'Event Deck',
      h1: "Don’t leave your data in the dark.",
      lede: 'The pioneering web app that gives you the best view of your event data from RegBox.',
    }) + `
  <section class="section section--paper" id="how">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Live, not retrospective</p>
        <h2>Data while your event is still running</h2>
        <p class="prose">With Event Deck, you have live access to data being generated at your
           event: from pre-event marketing results to real-time attendance figures and
           exhibitor performance. With instant access to usable data, you can respond
           quickly to problems, feed back to sponsors, and make improvements while there is
           still time to act on them.</p>
      </div>
      <div class="stubs">
        <article class="stub">
          <p class="stub__no mono">01</p>
          <h3>Respond quickly</h3>
          <p>See what is happening while there is still time to address it, not at the
             debrief.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">02</p>
          <h3>Feed back to sponsors</h3>
          <p>Give sponsors and exhibitors evidence during the show, not weeks afterwards.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">03</p>
          <h3>Improve as you go</h3>
          <p>Put changes in place while the event is running rather than noting them for
             next year.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--ink" id="sample">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">A sample Event Deck view</p>
        <h2>What organisers actually see</h2>
        <p>A representative view for a mid-size exhibition — the panels below, not a
           drawing of them. Figures are illustrative sample data, not a live client's.
           Click a legend entry to isolate a series; hover a bar for its exact count.</p>
      </div>

      <div class="deck">
        <div class="deck__bar">
          <span class="lbl"><span class="dot" aria-hidden="true"></span>Live</span>
          <span class="id mono">Event Deck — sample event</span>
        </div>

        <div class="deck__kpis">
          <div class="deck__kpi is-accent">
            <p class="v" data-count-to="2808" data-format="comma">0</p>
            <p class="l">Total registrations to date</p>
          </div>
          <div class="deck__kpi">
            <p class="v" data-count-to="2451" data-format="comma">0</p>
            <p class="l">Visitor registrations</p>
          </div>
          <div class="deck__kpi">
            <p class="v" data-count-to="357">0</p>
            <p class="l">Exhibitor registrations</p>
          </div>
          <div class="deck__kpi">
            <p class="v" data-count-to="12">0</p>
            <p class="l">Exhibitor bookers not logged in</p>
          </div>
        </div>

        <div class="deck__panels">
          <div class="deck__col">
            <div class="deck__panel">
              <h4>Event registrations</h4>
              <p class="sub">Rolling trend, 24 Jan – 03 Feb</p>
              <div class="deck__legend">
                <button type="button" class="s1" aria-pressed="true" data-series="s1"><i aria-hidden="true"></i>Visitors</button>
                <button type="button" class="s2" aria-pressed="true" data-series="s2"><i aria-hidden="true"></i>Exhibitor badges</button>
                <button type="button" class="s3" aria-pressed="true" data-series="s3"><i aria-hidden="true"></i>Exhibitor bookers</button>
              </div>
              <div class="deck__chart-wrap">
                <svg class="deck__chart" viewBox="0 0 800 250" role="img" aria-label="Line chart: visitor registrations rise through late January to a peak around 30 January, then taper toward early February; exhibitor badges and exhibitor bookers stay comparatively flat across the same period.">
                  <line class="axis" x1="60" y1="20" x2="60" y2="220" />
                  <line class="axis" x1="60" y1="220" x2="780" y2="220" />
                  <text x="50" y="224" text-anchor="end">0</text>
                  <text x="50" y="175" text-anchor="end">125</text>
                  <text x="50" y="125" text-anchor="end">250</text>
                  <text x="50" y="75" text-anchor="end">375</text>
                  <text x="50" y="25" text-anchor="end">500</text>
                  <text class="day-label" x="60" y="240">24/01</text>
                  <text class="day-label" x="200" y="240">26/01</text>
                  <text class="day-label" x="340" y="240">28/01</text>
                  <text class="day-label" x="480" y="240">30/01</text>
                  <text class="day-label" x="620" y="240">01/02</text>
                  <text class="day-label" x="760" y="240">03/02</text>
                  <path class="s3" fill="none" stroke-width="2" d="M 60,215 L 100,218 L 140,220 L 180,218 L 220,215 L 260,212 L 300,210" />
                  <path class="s2" fill="none" stroke-width="2" d="M 60,210 L 100,215 L 140,218 L 180,215 L 220,210 L 260,205 L 300,198 L 340,190 L 380,185 L 420,188 L 460,195 L 500,200 L 540,208 L 580,210 L 620,215 L 660,218 L 700,220" />
                  <path class="s1" fill="none" stroke-width="2.5" d="M 60,200 L 100,205 L 140,210 L 180,208 L 220,195 L 260,180 L 300,160 L 340,140 L 380,120 L 420,110 L 460,125 L 500,145 L 540,165 L 580,180 L 620,190 L 660,195 L 700,205 L 740,210 L 780,215" />
                </svg>
              </div>
            </div>

            <div class="deck__panel">
              <h4>14-day visitor registration summary</h4>
              <p class="sub">Daily count, 24 Jan – 07 Feb</p>
              <div class="deck__chart-wrap">
                <svg class="deck__chart" viewBox="0 0 380 205" role="img" aria-label="Bar chart, daily visitor registrations 24 January to 7 February: 32, 96, 50, 97, 24, 14, 62, 62, 71, 24, 62, 71, 24, 16, 18 — two peaks around 25 and 27 January, tapering toward early February.">
                  <line class="axis" x1="30" y1="20" x2="30" y2="170" />
                  <line class="axis" x1="30" y1="170" x2="368" y2="170" />
                  <text x="25" y="174" text-anchor="end">0</text>
                  <text x="25" y="24" text-anchor="end">100</text>
                  <rect class="bar" x="40" y="122.0" width="16" height="48.0"><title>24 January — 32 registrations</title></rect><text class="bar-label" x="48" y="117">32</text><text class="day-label" x="48" y="185">24</text>
                  <rect class="bar" x="62" y="26.0" width="16" height="144.0"><title>25 January — 96 registrations</title></rect><text class="bar-label" x="70" y="21">96</text><text class="day-label" x="70" y="185">25</text>
                  <rect class="bar" x="84" y="95.0" width="16" height="75.0"><title>26 January — 50 registrations</title></rect><text class="bar-label" x="92" y="90">50</text><text class="day-label" x="92" y="185">26</text>
                  <rect class="bar" x="106" y="24.5" width="16" height="145.5"><title>27 January — 97 registrations</title></rect><text class="bar-label" x="114" y="19">97</text><text class="day-label" x="114" y="185">27</text>
                  <rect class="bar" x="128" y="134.0" width="16" height="36.0"><title>28 January — 24 registrations</title></rect><text class="bar-label" x="136" y="129">24</text><text class="day-label" x="136" y="185">28</text>
                  <rect class="bar" x="150" y="149.0" width="16" height="21.0"><title>29 January — 14 registrations</title></rect><text class="bar-label" x="158" y="144">14</text><text class="day-label" x="158" y="185">29</text>
                  <rect class="bar" x="172" y="77.0" width="16" height="93.0"><title>30 January — 62 registrations</title></rect><text class="bar-label" x="180" y="72">62</text><text class="day-label" x="180" y="185">30</text>
                  <rect class="bar" x="194" y="77.0" width="16" height="93.0"><title>31 January — 62 registrations</title></rect><text class="bar-label" x="202" y="72">62</text><text class="day-label" x="202" y="185">31</text>
                  <rect class="bar" x="216" y="63.5" width="16" height="106.5"><title>1 February — 71 registrations</title></rect><text class="bar-label" x="224" y="58">71</text><text class="day-label" x="224" y="185">01</text>
                  <rect class="bar" x="238" y="134.0" width="16" height="36.0"><title>2 February — 24 registrations</title></rect><text class="bar-label" x="246" y="129">24</text><text class="day-label" x="246" y="185">02</text>
                  <rect class="bar" x="260" y="77.0" width="16" height="93.0"><title>3 February — 62 registrations</title></rect><text class="bar-label" x="268" y="72">62</text><text class="day-label" x="268" y="185">03</text>
                  <rect class="bar" x="282" y="63.5" width="16" height="106.5"><title>4 February — 71 registrations</title></rect><text class="bar-label" x="290" y="58">71</text><text class="day-label" x="290" y="185">04</text>
                  <rect class="bar" x="304" y="134.0" width="16" height="36.0"><title>5 February — 24 registrations</title></rect><text class="bar-label" x="312" y="129">24</text><text class="day-label" x="312" y="185">05</text>
                  <rect class="bar" x="326" y="146.0" width="16" height="24.0"><title>6 February — 16 registrations</title></rect><text class="bar-label" x="334" y="141">16</text><text class="day-label" x="334" y="185">06</text>
                  <rect class="bar" x="348" y="143.0" width="16" height="27.0"><title>7 February — 18 registrations</title></rect><text class="bar-label" x="356" y="138">18</text><text class="day-label" x="356" y="185">07</text>
                </svg>
              </div>
            </div>
          </div>

          <div class="deck__col">
            <div class="deck__panel">
              <h4>Form completion totals</h4>
              <p class="sub">Ancillary forms, this event</p>
              <div class="deck__list">
                <div class="deck__row"><span class="name">Exhibitor badges</span><span class="val mono">164</span></div>
                <div class="deck__row"><span class="name">CDM4Exhibitors</span><span class="val mono">48</span></div>
                <div class="deck__row"><span class="name">Vehicles required</span><span class="val mono">66</span></div>
                <div class="deck__row"><span class="name">Vehicles (BUBD)</span><span class="val mono">50</span></div>
                <div class="deck__row"><span class="name">Name boards</span><span class="val mono">19</span></div>
                <div class="deck__row"><span class="name">Public</span><span class="val mono">19</span></div>
              </div>
            </div>

            <div class="deck__panel">
              <h4>Top 5 promo codes</h4>
              <p class="sub">By registrations attributed</p>
              <div class="deck__list">
                <div class="deck__row"><span class="name"><span class="rank mono">01</span>homepage</span><span class="track" aria-hidden="true"><span class="fill" style="width:100%"></span></span><span class="val mono">722</span></div>
                <div class="deck__row is-muted"><span class="name"><span class="rank mono">02</span>RAC</span><span class="track" aria-hidden="true"><span class="fill" style="width:58.6%"></span></span><span class="val mono">423</span></div>
                <div class="deck__row is-muted"><span class="name"><span class="rank mono">03</span>ecast3</span><span class="track" aria-hidden="true"><span class="fill" style="width:36.6%"></span></span><span class="val mono">264</span></div>
                <div class="deck__row is-muted"><span class="name"><span class="rank mono">04</span>faq</span><span class="track" aria-hidden="true"><span class="fill" style="width:32%"></span></span><span class="val mono">231</span></div>
                <div class="deck__row is-muted"><span class="name"><span class="rank mono">05</span>ecast1</span><span class="track" aria-hidden="true"><span class="fill" style="width:27.8%"></span></span><span class="val mono">201</span></div>
              </div>
            </div>
          </div>
        </div>

        <p class="deck__note" style="padding: 1rem 1.5rem; border-top: 1px solid var(--ink-3); font-size: var(--step--1); color: var(--muted-on-ink);">This is a
           sample view built from a real Event Deck reference, redrawn in RegBox's own
           system — not a stock dashboard illustration.</p>
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">One record</p>
        <h2>Paired with RegBox onsite services</h2>
        <p class="prose">Event Deck integrates seamlessly with your registration process —
           the same record, not a separate export. To find out more about what RegBox can
           bring to your event, including registration, the online exhibitor manual and web
           development, call us on 0845 612 3650.</p>
      </div>
    </div>
  </section>
` + cta('Want to see your event this way?', 'Tell us about the show and we’ll come back with a quote.'),
});

pages.push({
  url: '/marketing-automation/',
  title: 'Marketing Automation',
  section: 'Organisers',
  description: 'Visual campaign builder and drag-and-drop email design for event marketers — automated multi-touch campaigns, segmentation, landing pages and reporting, on one canvas.',
  body:
    phead({
      section: 'Organisers',
      label: 'Marketing Automation',
      h1: 'Marketing Automation',
      lede: 'Automated email campaigns that turn a registration into a return visit — built and sent from one visual canvas.',
    }) + `
  <section class="section section--ink" id="how">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">The platform</p>
        <h2>See the whole campaign on one canvas</h2>
        <p>Drag together triggers, decisions, actions and waits into a single visual
           flow. Build it once and every contact moves through it automatically, from
           the moment they register to the moment they walk in.</p>
      </div>

      <div class="deck">
        <div class="deck__bar">
          <span class="lbl"><span class="dot" aria-hidden="true"></span>Live</span>
          <span class="id mono">Marketing Automation — sample campaign</span>
        </div>
        <div class="ftree-wrap">
          <p class="ftree-cap">A representative pre-event nurture flow, redrawn in
             RegBox's own campaign builder — not a stock diagram. Toggle the legend to
             trace decisions, actions or conditions through it.</p>

          <ul class="ftree">
            <li>
              <div class="fnode" data-type="trigger"><span class="fnode__type mono">Trigger</span><span class="fnode__label">Registers for event</span></div>
              <ul>
                <li>
                  <div class="fnode" data-type="decision"><span class="fnode__type mono">Decision</span><span class="fnode__label">Opens confirmation email?</span></div>
                  <ul>
                    <li>
                      <div class="fnode fnode--wait" data-type="wait"><span class="fnode__label">Wait 2 days</span></div>
                      <ul>
                        <li><div class="fnode" data-type="action"><span class="fnode__type mono">Action</span><span class="fnode__label">Send exhibitor list preview</span></div></li>
                      </ul>
                    </li>
                    <li>
                      <div class="fnode fnode--wait" data-type="wait"><span class="fnode__label">Wait 3 days</span></div>
                      <ul>
                        <li>
                          <div class="fnode" data-type="condition"><span class="fnode__type mono">Condition</span><span class="fnode__label">Visited event page since?</span></div>
                          <ul>
                            <li><div class="fnode" data-type="action"><span class="fnode__type mono">Action</span><span class="fnode__label">Send reminder SMS</span></div></li>
                            <li><div class="fnode" data-type="action"><span class="fnode__type mono">Action</span><span class="fnode__label">Add to re-engagement list</span></div></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>

          <div class="deck__legend">
            <button type="button" class="s1" aria-pressed="true" data-node-type="decision"><i aria-hidden="true"></i>Decision — a contact chooses a path</button>
            <button type="button" class="s2" aria-pressed="true" data-node-type="action"><i aria-hidden="true"></i>Action — something the platform sends or updates automatically</button>
            <button type="button" class="s3" aria-pressed="true" data-node-type="condition"><i aria-hidden="true"></i>Condition — based on known contact or event data</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">The email itself</p>
        <h2>Branded emails, built by dragging blocks into place</h2>
        <p class="prose">A responsive drag-and-drop editor — headers, images, buttons and
           text blocks arranged your way, then saved as a template so the next send goes
           out in minutes, not days.</p>
      </div>

      <div class="mock">
        <div class="mock__canvas">
          <div class="mock__hero">
            <p class="mock__subject">{Event name} — your badge is ready</p>
            <p class="mock__sub">Everything you need before doors open.</p>
            <span class="mock__btn">View my badge</span>
          </div>
          <div class="mock__row"><span class="mock__ph"></span><span class="mock__ph mock__ph--sm"></span></div>
          <div class="mock__row"><span class="mock__ph mock__ph--sm"></span><span class="mock__ph"></span></div>
        </div>
        <div class="mock__blocks">
          <p class="mock__blocks-label mono">Blocks</p>
          <ul>
            <li>Hero</li>
            <li>Text</li>
            <li>Button</li>
            <li>Image</li>
            <li>Divider</li>
            <li>Social</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Built to convert</p>
        <h2>Beyond the send button</h2>
      </div>
      <div class="stubs">
        <article class="stub">
          <p class="stub__no mono">01</p>
          <h3>Segmentation &amp; targeting</h3>
          <p>Group contacts by behaviour, registration status and demographics, so the
             message matches where they actually are in the journey.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">02</p>
          <h3>Multilingual &amp; A/B tested</h3>
          <p>Test subject lines and content before a campaign goes wide, and route
             language automatically for international shows.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">03</p>
          <h3>Landing pages &amp; lead scoring</h3>
          <p>Mobile-friendly landing pages that score and nurture a lead the moment they
             land, not after the show.</p>
        </article>
      </div>
    </div>
  </section>
` + cta('Marketing your next event?', 'Tell us about the show and we’ll come back with a quote.'),
});

pages.push({
  url: '/digital-solutions/',
  title: 'Digital Solutions',
  section: 'Organisers',
  description: 'High-performance websites and marketing automation from RegBox, for global conference organisers and for growing businesses well beyond events.',
  body:
    phead({
      section: 'Organisers',
      label: 'Digital Solutions',
      h1: 'Built to Perform',
      lede: 'Great digital experiences aren’t limited to events. We build high-performance websites and marketing automation for a diverse range of industries.',
    }) + `
  <section class="section section--paper" id="how">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Custom-built</p>
        <h2>Feature-rich websites, designed to perform</h2>
        <p class="prose">Whether you are a global conference organiser or a growing
           business scaling your digital presence, we deliver custom-built websites
           designed for your specific audience — using the same team and standards as the
           registration work.</p>
      </div>
      <div class="stubs">
        <article class="stub">
          <p class="stub__no mono">01</p>
          <h3>Web design</h3>
          <p>Custom-built, high-performance websites, designed and developed rather than
             assembled from a template.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">02</p>
          <h3>Marketing automation</h3>
          <p>The same email marketing and automation platform we run for events, applied
             to businesses outside them.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--ink" id="clients">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Selected work</p>
        <h2>Portfolio</h2>
      </div>
    </div>
    <div class="cticker" style="margin-top: 2.5rem;">
      <ul class="cticker__in">
        <li><span class="n mono">01</span>CruiseTimes</li>
        <li><span class="n mono">02</span>Archventil</li>
        <li><span class="n mono">03</span>The HS Manager</li>
        <li><span class="n mono">04</span>Rinofanto</li>
        <li><span class="n mono">05</span>Millennium Steel</li>
        <li><span class="n mono">06</span>The Museums + Heritage Show</li>
        <li><span class="n mono">07</span>The Inspection Manager</li>
        <li><span class="n mono">08</span>The UK Concrete Show</li>
        <li><span class="n mono">09</span>Floodex</li>
        <li><span class="n mono">10</span>The Inventory Manager</li>
        <li><span class="n mono">11</span>Wines from Spain</li>
        <li><span class="n mono">12</span>The Ultimate Health Event</li>
        <li><span class="n mono">13</span>Short Stay Summit</li>
        <li><span class="n mono">14</span>SnackEx</li>
        <li><span class="n mono">15</span>The Bed Show</li>
        <!-- duplicated once so the marquee loop is seamless at translateX(-50%) -->
        <li aria-hidden="true"><span class="n mono">01</span>CruiseTimes</li>
        <li aria-hidden="true"><span class="n mono">02</span>Archventil</li>
        <li aria-hidden="true"><span class="n mono">03</span>The HS Manager</li>
        <li aria-hidden="true"><span class="n mono">04</span>Rinofanto</li>
        <li aria-hidden="true"><span class="n mono">05</span>Millennium Steel</li>
        <li aria-hidden="true"><span class="n mono">06</span>The Museums + Heritage Show</li>
        <li aria-hidden="true"><span class="n mono">07</span>The Inspection Manager</li>
        <li aria-hidden="true"><span class="n mono">08</span>The UK Concrete Show</li>
        <li aria-hidden="true"><span class="n mono">09</span>Floodex</li>
        <li aria-hidden="true"><span class="n mono">10</span>The Inventory Manager</li>
        <li aria-hidden="true"><span class="n mono">11</span>Wines from Spain</li>
        <li aria-hidden="true"><span class="n mono">12</span>The Ultimate Health Event</li>
        <li aria-hidden="true"><span class="n mono">13</span>Short Stay Summit</li>
        <li aria-hidden="true"><span class="n mono">14</span>SnackEx</li>
        <li aria-hidden="true"><span class="n mono">15</span>The Bed Show</li>
      </ul>
    </div>
  </section>
` + cta('Need a site that performs?', 'Tell us what you’re building and we’ll come back with a quote.'),
});

pages.push({
  url: '/online-exhibitor-manual/',
  title: 'Online Exhibitor Manual',
  section: 'Exhibitors',
  description: 'A web-based exhibitor manual with real-time reporting, email usage tracking and secure cloud storage — increasing productivity and lowering costs.',
  body:
    phead({
      section: 'Exhibitors',
      label: 'Online Exhibitor Manual',
      h1: 'Online Exhibitor Manual',
      lede: 'An easy-to-integrate web-based system giving organisers real-time reporting, email usage tracking and secure cloud backup.',
    }) + `
  <section class="section section--paper" id="how">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Why work with us</p>
        <h2>Increase productivity, lower costs</h2>
        <p class="prose">Increase your overall productivity and enhance your relationships
           with exhibitors, while improving efficiency and lowering costs.</p>
      </div>
      <div class="stubs">
        <article class="stub">
          <p class="stub__no mono">01</p>
          <h3>Real-time reporting</h3>
          <p>Simple graphical displays showing where every exhibitor has got to, without
             chasing anyone for a status.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">02</p>
          <h3>Email usage tracking</h3>
          <p>See what has been sent and opened, so a missed deadline is visible before it
             becomes a problem onsite.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">03</p>
          <h3>Cloud storage &amp; backup</h3>
          <p>Improved system security, with data held and backed up in the cloud.</p>
        </article>
      </div>
      <p class="prose" style="margin-top: 2rem;">Exhibitors sign in with their existing
         Facebook, Google or Twitter credentials rather than maintaining another
         password.</p>
    </div>
  </section>

  <section class="section section--ink">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Pricing</p>
        <h2>Quoted to your event</h2>
        <p>Pricing depends on the event — its size, exhibitor count, and what the manual
           needs to cover. Tell us about the show and we’ll quote for it.</p>
      </div>
    </div>
  </section>
` + cta('Running exhibitors this year?', 'Tell us about the show and we’ll come back with a quote.'),
});

pages.push({
  url: '/exhibitor-marketing/',
  title: 'Exhibitor Marketing',
  section: 'Exhibitors',
  description: 'Branded email invitations exhibitors send themselves, with their own dashboard and full campaign reporting. Essential £199 + VAT, Premium £249 + VAT.',
  body:
    phead({
      section: 'Exhibitors',
      label: 'Exhibitor Marketing',
      h1: 'Exhibitor Marketing',
      lede: 'Create and send your branded email invites, and generate leads before the doors open.',
    }) + `
  <section class="section section--paper" id="how">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Drive customers, strengthen your brand</p>
        <h2>Pull your own visitors to the show</h2>
        <p class="prose">A powerful marketing automation platform for exhibitors to create
           and launch pre-show email campaigns, inviting their own customers and prospects
           to register and visit their stand.</p>
      </div>
      <div class="stubs">
        <article class="stub">
          <p class="stub__no mono">01</p>
          <h3>Branded email design</h3>
          <p>Professional, mobile-friendly emails that render properly on every device
             and carry your own branding.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">02</p>
          <h3>Your own dashboard</h3>
          <p>A dedicated exhibitor account to measure and analyse campaign success with
             actionable reports.</p>
        </article>
        <article class="stub">
          <p class="stub__no mono">03</p>
          <h3>Campaign reports</h3>
          <p>Sent, failed, opens, clicks, shares, conversions and unsubscribes — the
             numbers that show whether it worked.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--ink">
    <div class="wrap">
      <div class="section__head">
        <p class="section__eyebrow">Pricing</p>
        <h2>Two plans, fully managed</h2>
      </div>
      <div class="fare">
        <article class="farecard">
          <div class="farecard__head"><h3>Essential</h3></div>
          <p class="farecard__price"><b>£199</b><span>+ VAT</span></p>
          <div class="farecard__perf perf" aria-hidden="true"></div>
          <ul>
            <li>Co-branded email design &times; 1 campaign</li>
            <li>Exhibitor dashboard</li>
            <li>Unlimited contacts</li>
            <li>Fully managed service</li>
            <li>Reports and analytics</li>
            <li>Complete automation platform</li>
          </ul>
        </article>
        <article class="farecard">
          <div class="farecard__head"><h3>Premium</h3></div>
          <p class="farecard__price"><b>£249</b><span>+ VAT</span></p>
          <div class="farecard__perf perf" aria-hidden="true"></div>
          <ul>
            <li>Co-branded email design &times; 3 campaigns</li>
            <li>Exhibitor dashboard</li>
            <li>Unlimited contacts</li>
            <li>Fully managed service</li>
            <li>Reports and analytics</li>
            <li>Complete automation platform</li>
          </ul>
        </article>
      </div>
    </div>
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'RegBox Exhibitor Marketing',
      description: 'Branded pre-show email campaigns exhibitors send themselves, with their own dashboard and campaign reporting.',
      brand: { '@type': 'Brand', name: 'RegBox' },
      offers: [
        { '@type': 'Offer', name: 'Essential', price: '199', priceCurrency: 'GBP', description: '1 campaign, unlimited contacts, fully managed service, full platform access', url: `${SITE}/exhibitor-marketing/` },
        { '@type': 'Offer', name: 'Premium', price: '249', priceCurrency: 'GBP', description: '3 campaigns, unlimited contacts, fully managed service, full platform access', url: `${SITE}/exhibitor-marketing/` },
      ],
    })}</script>
  </section>
` + cta('Exhibiting this year?', 'Get in touch and we’ll set your campaign up.'),
});

pages.push({
  url: '/contact-us/',
  title: 'Contact us',
  section: '',
  description: 'Contact RegBox for event registration systems, exhibitor manuals and lead capture. 0845 612 3640, info@regbox.co.uk, 59 Pound Street, Carshalton, Surrey, SM5 3PG.',
  body:
    phead({
      section: '',
      label: 'Contact us',
      h1: 'Contact us',
      lede: 'Interested in our services for your next event? Tell us about it and we’ll come back with a quote.',
    }) + `
  <section class="section section--paper">
    <div class="wrap">
      <div class="contact">
        <div>
          <h2 style="font-size: var(--step-2); margin-bottom: 1rem;">Request a quote</h2>
          <p class="formnote">For all enquiries, please submit the form below and we will
             be in touch. <span class="req">*</span> denotes a mandatory field.</p>

          <!-- NOT WIRED UP. A static site cannot process a submission. Point action= at a
               form service or an endpoint before this goes live, or the form will
               silently do nothing. -->
          <form method="post" action="#" novalidate>
            <div class="field">
              <label for="f-name">Your name <span class="req" aria-hidden="true">*</span></label>
              <input id="f-name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="f-company">Company or event <span class="req" aria-hidden="true">*</span></label>
              <input id="f-company" name="company" type="text" autocomplete="organization" required>
            </div>
            <div class="field">
              <label for="f-email">Email <span class="req" aria-hidden="true">*</span></label>
              <input id="f-email" name="email" type="email" autocomplete="email" required>
            </div>
            <div class="field">
              <label for="f-phone">Telephone</label>
              <input id="f-phone" name="phone" type="tel" autocomplete="tel">
            </div>
            <div class="field">
              <label for="f-interest">What can we help with?</label>
              <select id="f-interest" name="interest">
                <option>Event registration</option>
                <option>Event Deck</option>
                <option>Marketing automation</option>
                <option>Digital solutions</option>
                <option>Online exhibitor manual</option>
                <option>Exhibitor marketing</option>
                <option>Something else</option>
              </select>
            </div>
            <div class="field">
              <label for="f-msg">About your event <span class="req" aria-hidden="true">*</span></label>
              <textarea id="f-msg" name="message" required
                placeholder="Dates, expected numbers, visitor and exhibitor categories, and what has to happen at the door."></textarea>
            </div>
            <button class="btn btn--primary" type="submit">Send enquiry</button>
          </form>
        </div>

        <dl class="deets">
          <div>
            <dt>Our address</dt>
            <dd><address>59 Pound Street<br>Carshalton<br>Surrey SM5 3PG<br>United Kingdom</address></dd>
          </div>
          <div>
            <dt>Telephone</dt>
            <dd><a href="tel:+448456123640">0845 612 3640</a> &middot; <a href="tel:+448456123650">0845 612 3650</a></dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href="mailto:info@regbox.co.uk">info@regbox.co.uk</a></dd>
          </div>
          <div>
            <dt>Our working hours</dt>
            <dd>Monday to Friday, 9:00am&ndash;5:30pm<br>Saturday &amp; Sunday: closed</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
`,
});

/* ------------------------------------------------------------------ write -- */

for (const page of pages) {
  const dir = join(ROOT, page.url.replace(/^\/|\/$/g, ''));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), shell(page), 'utf8');
  console.log('wrote', page.url + 'index.html');
}

/* ----------------------------------------------------------- sitemap.xml -- */

const LASTMOD = new Date().toISOString().slice(0, 10);
const urls = ['/', ...pages.map((p) => p.url)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
await writeFile(join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log('wrote sitemap.xml');
