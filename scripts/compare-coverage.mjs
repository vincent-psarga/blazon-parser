/**
 * What moved between two coverage readings, written as Markdown for a run's
 * summary.
 *
 * The tables are padded to their widest cell and their numbers ranged right, so
 * that the report is as readable in a run's raw log as it is once rendered: the
 * log is where a reader meets it first.
 *
 * The comparison is against another run rather than against a threshold: these
 * figures are evidence of where the parser stands, not a bar it must clear, so
 * the report never fails a run. A reading nothing can be compared against is the
 * ordinary state of a first run, and says so plainly.
 */
import { readFileSync } from 'node:fs';

const BASELINE = process.argv[2] ?? 'baseline/coverage.json';
const CURRENT = process.argv[3] ?? 'current/coverage.json';
/** What the baseline was taken from, for whoever wonders what "before" means. */
const AGAINST = process.env.BASELINE_LABEL || 'the previous run';

/** Where a figure is not to be had, rather than being nought. */
const NONE = '—';

const current = read(CURRENT);
if (current === undefined) {
  console.log('## Coverage\n\nNo coverage was measured in this run.');
  process.exit(0);
}

const baseline = read(BASELINE);

console.log(baseline === undefined ? 'Nothing to compare against' : `Compared against ${AGAINST}.`);
console.log('\n## Coverage\n');
console.log(measures());
console.log('\n### Armorials\n');
console.log(armorials());

function read(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return undefined;
  }
}

/** The two counts the run is judged by, each against what it was. */
function measures() {
  const measure = (name, before, after) => [
    name,
    `${after}`,
    ...(baseline === undefined ? [] : [signed(after - before), relative(before, after)]),
  ];
  return table(
    [
      { title: 'Measure' },
      { title: 'Count', ranged: 'right' },
      ...(baseline === undefined
        ? []
        : [
            { title: 'Change', ranged: 'right' },
            { title: 'Change %', ranged: 'right' },
          ]),
    ],
    [
      measure('Tests', baseline?.tests, current.tests),
      measure('Blazons read', baseline?.armorials.read, current.armorials.read),
    ]
  );
}

/**
 * Each armorial and the share of it the parser reads. The share is what an
 * armorial has to say: the count behind it means nothing without the total, and
 * two armorials are of quite different sizes.
 */
function armorials() {
  return table(
    [
      { title: 'Armorial' },
      { title: 'Coverage', ranged: 'right' },
      ...(baseline === undefined ? [] : [{ title: 'Change', ranged: 'right' }]),
    ],
    rows().map(({ name, was, now }) => [
      name,
      now === undefined ? NONE : `${now.percentage}%`,
      ...(baseline === undefined ? [] : [shift(was, now)]),
    ])
  );
}

/**
 * Every armorial either reading knows, in the order the current one gives them,
 * with any the baseline had and this run has not kept after them. An armorial
 * added or dropped is a change worth seeing rather than a row to hide.
 */
function rows() {
  const were = new Map((baseline?.armorials.each ?? []).map((one) => [one.slug, one]));
  const kept = new Set(current.armorials.each.map((one) => one.slug));
  return [
    ...current.armorials.each.map((one) => ({ name: one.name, was: were.get(one.slug), now: one })),
    ...[...were.values()]
      .filter((one) => !kept.has(one.slug))
      .map((one) => ({ name: one.name, was: one, now: undefined })),
  ];
}

function shift(was, now) {
  if (was === undefined) {
    return 'new';
  }
  if (now === undefined) {
    return 'gone';
  }
  return `${signed(difference(was.percentage, now.percentage))}%`;
}

/** A change told as a share of what there was, which nothing at all cannot be. */
function relative(before, after) {
  return before === 0 ? NONE : `${signed(difference(0, ((after - before) / before) * 100))}%`;
}

function difference(before, after) {
  // A tenth is as fine as these readings are, so rounding here keeps a figure
  // that merely lost its last bit of float from reading as a change.
  return Math.round((after - before) * 10) / 10;
}

/**
 * A change, signed even where it is nought: a column of changes is read down,
 * and a bare 0 among the signed ones would read as some other kind of answer.
 * Negative nought is nought, and takes the same plus as the rest.
 */
function signed(moved) {
  return moved < 0 ? `${moved}` : `+${moved === 0 ? 0 : moved}`;
}

/**
 * A Markdown table with every column widened to its widest cell. Text is ranged
 * left and figures right, which is what lets a column of them be read down.
 */
function table(columns, rows) {
  const widths = columns.map((column, at) =>
    Math.max(column.title.length, ...rows.map((row) => row[at].length))
  );
  const rule = columns.map(({ ranged }, at) =>
    ranged === 'right' ? `${'-'.repeat(widths[at] - 1)}:` : '-'.repeat(widths[at])
  );
  const line = (cells) =>
    `| ${cells.map((cell, at) => ranged(cell, widths[at], columns[at].ranged)).join(' | ')} |`;
  return [
    line(columns.map(({ title }) => title)),
    `| ${rule.join(' | ')} |`,
    ...rows.map(line),
  ].join('\n');
}

function ranged(cell, width, side) {
  return side === 'right' ? cell.padStart(width) : cell.padEnd(width);
}
