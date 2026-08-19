/* ============================================================================
   BBSS — Faculty roster re-scraper  (browser console snippet)

   Rebuilds the DATA array for widgets/biochem-faculty/widget.html from the
   department's own people page. Nothing to install — you run it in your
   browser's developer console.

   HOW TO RUN
   1. Open  https://biochem.healthsci.mcmaster.ca/people/  and stay on the
      "Faculty" tab (the one that's selected when the page loads).
   2. Open the console:  Mac  ⌥⌘J   /   Windows  Ctrl+Shift+J
      If the console warns about pasting, type  allow pasting  and press Enter.
   3. Paste this whole file, press Enter.
   4. Read the ADDED / REMOVED summary and the ⚠ REVIEW list it prints.
   5. The new DATA array is on your clipboard. In widget.html, replace
      everything between  // ==== DATA START ====  and  // ==== DATA END ====
      with what you pasted.

   THIS DRAFTS, YOU CONFIRM. The department page crams job titles, degrees and
   research areas into one freeform block, so the rules below are best-effort.
   Always skim the output before shipping it.
   ============================================================================ */
(function () {
  'use strict';

  // ---- CUSTOMIZE: the roster currently in widget.html -----------------------
  // Only used to print an ADDED / REMOVED diff. Set to [] to skip the diff.
  var CURRENT = [
    'Sara Andres', 'Mick Bhatia', 'Russell Bishop', 'Eric Brown', 'Lori Burrows',
    'Brian Coombes', 'Cameron Currie', 'Monica De Paoli', 'Radhey Gupta', 'Hong Han',
    'Katie Houlahan', 'Lindsay Kalan', 'Yingfu Li', 'Michelle MacDonald',
    'Lesley MacNeil', 'Nathan Magarvey', 'Jakob Magolan', 'Lindsey Marmont',
    'Andrew McArthur', 'Matthew Miller', 'Caitlin Mullarkey', 'Jonathan Schertzer',
    'Deborah Sloboda', 'Jon Stokes', 'Bernardo Trigatti', 'Ray Truant', 'Felicia Vulcu',
    'John Whitney', 'Dawit Wolday', 'Gerard Wright', 'Daniel Yang', 'Boris Zhorov'
  ];

  // Must match IMG_BASE in widget.html — photo paths are stored relative to it.
  var IMG_BASE = 'https://biochem.healthsci.mcmaster.ca/wp-content/uploads/';

  // The people page is a set of Bootstrap tabs. #tab-content-ov is "Faculty";
  // Staff / Associate Faculty / Joint Members live in sibling panes we ignore.
  var PANE = '#tab-content-ov';

  // ---- line classification --------------------------------------------------
  // Degrees and training history — never shown in the widget.
  var EDUCATION = /^(ph\.?\s*d|m\.?\s*d\b|m\.?sc|b\.?sc|d\.?v\.?m|dphil|hbsc|post-?doc\w*|postdoctoral|fellow|residency|diploma)/i;
  // Appointments and honorifics — these belong in `subtitle`, not `research`.
  var ROLE = /^(scientific director|executive director|associate director|director|associate member|joint appointment|cross-?appointment|adjunct|canada research chair|endowed|associate chair|assistant dean|chair)\b/i;
  // Filler the page prints when someone has no research areas listed.
  var FILLER = /^(biochemistry and biomedical sciences|department of biochemistry.*)$/i;

  // ---- helpers --------------------------------------------------------------
  function clean(s) {
    return String(s).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Split an element's innerHTML on <br>, strip tags, return non-empty lines.
  function lines(el) {
    if (!el) return [];
    var scratch = document.createElement('div');
    return el.innerHTML.split(/<br\s*\/?>/i).map(function (chunk) {
      scratch.innerHTML = chunk;
      return clean(scratch.textContent);
    }).filter(Boolean);
  }

  // Quote a value the way widget.html does: single quotes, unless the value
  // contains an apostrophe (e.g. "Crohn's Disease"), then double quotes.
  function q(s) {
    s = String(s == null ? '' : s);
    if (s.indexOf("'") !== -1 && s.indexOf('"') === -1) return '"' + s + '"';
    return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }

  // ---- scrape ---------------------------------------------------------------
  var pane = document.querySelector(PANE);
  if (!pane) {
    console.error(
      '[BBSS] Could not find the Faculty tab (' + PANE + ').\n' +
      'Are you on https://biochem.healthsci.mcmaster.ca/people/ ?\n' +
      'If the page was redesigned, the selectors in this snippet need updating.'
    );
    return;
  }

  var cards = pane.querySelectorAll('.card.card-shadow');
  if (!cards.length) {
    console.error('[BBSS] Found the Faculty tab but no people cards in it. The page markup has changed.');
    return;
  }

  var people = [];
  var review = [];

  Array.prototype.forEach.call(cards, function (card) {
    var nameEl = card.querySelector('h3.card-title');
    if (!nameEl) return;
    var name = clean(nameEl.textContent);

    // Bold block: job title on line 1, chair/admin roles on the lines after it.
    var titleLines = lines(card.querySelector('p.mb-0 strong') || card.querySelector('.card-text strong'));
    var title = titleLines.shift() || '';
    var subtitle = titleLines.slice();

    // Small block: degrees + appointments + research areas, all mixed together.
    var research = [];
    lines(card.querySelector('p.small')).forEach(function (line) {
      if (EDUCATION.test(line) || FILLER.test(line)) return;      // drop
      if (ROLE.test(line)) {                                       // -> subtitle
        subtitle.push(line);
        review.push(name + ': moved to subtitle → "' + line + '"');
        return;
      }
      research.push(line);
    });

    if (research.length > 1) {
      review.push(name + ': ' + research.length + ' research lines merged → "' + research.join('; ') + '"');
    }

    var mail = card.querySelector('a[href^="mailto:"]');
    var img = card.querySelector('img');
    var src = '';
    if (img) {
      // Plain src normally; fall back to a lazy-loading attribute or the first
      // srcset candidate if the theme ever starts deferring images.
      src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src.indexOf(IMG_BASE) !== 0 && img.getAttribute('srcset')) {
        src = img.getAttribute('srcset').split(',')[0].trim().split(/\s+/)[0];
      }
    }
    if (src && src.indexOf(IMG_BASE) !== 0) {
      review.push(name + ': photo is not under IMG_BASE → ' + src);
    }

    people.push({
      name: name,
      title: title,
      subtitle: subtitle.join('; '),
      research: research.join('; '),
      email: mail ? mail.getAttribute('href').replace(/^mailto:/i, '').trim() : '',
      img: src.replace(IMG_BASE, '')
    });
  });

  // ---- format ---------------------------------------------------------------
  var out = 'var DATA = [\n' + people.map(function (p) {
    return '    { name: ' + q(p.name) +
           ', title: ' + q(p.title) +
           ', subtitle: ' + q(p.subtitle) +
           ', research: ' + q(p.research) +
           ', email: ' + q(p.email) +
           ', img: ' + q(p.img) + ' }';
  }).join(',\n') + '\n  ];';

  // ---- report ---------------------------------------------------------------
  var names = people.map(function (p) { return p.name; });
  var added = names.filter(function (n) { return CURRENT.indexOf(n) === -1; });
  var removed = CURRENT.filter(function (n) { return names.indexOf(n) === -1; });

  console.log('%c[BBSS] Faculty scrape complete', 'font-weight:bold');
  console.log('Found ' + people.length + ' faculty on the page (widget.html currently has ' + CURRENT.length + ').');
  if (CURRENT.length) {
    console.log('ADDED:   ' + (added.join(', ') || '(none)'));
    console.log('REMOVED: ' + (removed.join(', ') || '(none)'));
  }
  if (review.length) {
    console.warn('⚠ REVIEW these rows before shipping (' + review.length + '):');
    review.forEach(function (r) { console.warn('   ' + r); });
  }
  var missing = people.filter(function (p) { return !p.email || !p.img; });
  if (missing.length) {
    console.warn('⚠ Missing email or photo: ' + missing.map(function (p) { return p.name; }).join(', '));
  }

  console.log(out);

  // ---- clipboard ------------------------------------------------------------
  try {
    if (typeof copy === 'function') {         // Chrome / Edge / Safari console helper
      copy(out);
      console.log('%c✓ Copied to clipboard.', 'color:#1E5B1A;font-weight:bold');
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(out).then(function () {
        console.log('%c✓ Copied to clipboard.', 'color:#1E5B1A;font-weight:bold');
      });
    } else {
      throw new Error('no clipboard');
    }
  } catch (e) {
    console.log('Clipboard unavailable — select the array printed above and copy it manually.');
  }
})();
