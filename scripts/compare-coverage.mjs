/**
 * What moved between two coverage readings, written as Markdown for a run's
 * summary.
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

const current = read(CURRENT);
if (current === undefined) {
  console.log('## Coverage\n\nNo coverage was measured in this run.');
  process.exit(0);
}

const baseline = read(BASELINE);
console.log('## Coverage\n');
console.log(
  `**${current.tests} tests** · **${current.armorials.read} of ${current.armorials.total} blazons** read across the armorials (${current.armorials.percentage}%)\n`
);

if (baseline === undefined) {
  console.log('Nothing to compare against');
  process.exit(0);
}

console.log(`Compared against ${AGAINST}.\n`);
console.log('| Measure | Before | After | Change |');
console.log('| --- | ---: | ---: | ---: |');
console.log(
  `| Tests | ${baseline.tests} | ${current.tests} | ${change(baseline.tests, current.tests)} |`
);
console.log(
  `| Blazons read | ${tally(baseline.armorials)} | ${tally(current.armorials)} | ${shift(baseline.armorials, current.armorials)} |`
);

console.log('\n### Armorials\n');
console.log('| Armorial | Before | After | Change |');
console.log('| --- | ---: | ---: | ---: |');
for (const { name, was, now } of armorials()) {
  console.log(`| ${name} | ${tally(was)} | ${tally(now)} | ${shift(was, now)} |`);
}

function read(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return undefined;
  }
}

/**
 * Every armorial either reading knows, in the order the current one gives them,
 * with any the baseline had and this run has not kept after them. An armorial
 * added or dropped is a change worth seeing rather than a row to hide.
 */
function armorials() {
  const was = new Map(baseline.armorials.each.map((one) => [one.slug, one]));
  const rows = current.armorials.each.map((one) => ({
    name: one.name,
    was: was.get(one.slug),
    now: one,
  }));
  const kept = new Set(current.armorials.each.map((one) => one.slug));
  const dropped = baseline.armorials.each
    .filter((one) => !kept.has(one.slug))
    .map((one) => ({ name: one.name, was: one, now: undefined }));
  return [...rows, ...dropped];
}

function tally(reading) {
  return reading === undefined
    ? '—'
    : `${reading.read} / ${reading.total} (${reading.percentage}%)`;
}

function shift(was, now) {
  if (was === undefined) {
    return 'new';
  }
  if (now === undefined) {
    return 'gone';
  }
  const blazons = difference(was.read, now.read);
  const points = difference(was.percentage, now.percentage);
  return blazons === 0 && points === 0 ? '—' : `${signed(blazons)} (${signed(points)} pts)`;
}

function change(before, after) {
  const moved = difference(before, after);
  return moved === 0 ? '—' : signed(moved);
}

function difference(before, after) {
  // A tenth is as fine as the readings are, so rounding here keeps a percentage
  // that merely lost its last bit of float from reading as a change.
  return Math.round((after - before) * 10) / 10;
}

function signed(moved) {
  return moved > 0 ? `+${moved}` : `${moved}`;
}
