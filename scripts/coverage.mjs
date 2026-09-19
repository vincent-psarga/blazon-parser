/**
 * What the project covers, in a shape a later run can be compared against: how
 * many tests it holds, and how much of the armorials its parsers can read.
 *
 * The armorials are TypeScript and lean on the library's own sources, so they
 * are loaded through Vite rather than by Node alone. The project already carries
 * Vite for the demo, which spares this a build step and a second copy of the
 * armorials in some other form.
 *
 * The test count is read from the report Vitest leaves behind rather than
 * counted here: the tests are run by the workflow anyway, and counting them
 * twice would let the two answers disagree.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { createServer } from 'vite';

const TEST_REPORT = process.argv[2] ?? 'coverage/tests.json';
const OUTPUT = process.argv[3] ?? 'coverage/coverage.json';

const coverage = {
  tests: testsIn(TEST_REPORT),
  armorials: await armorialCoverage(),
};

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify(coverage, null, 2)}\n`);
console.log(`Coverage written to ${OUTPUT}:`);
console.log(
  `  ${coverage.tests} tests · ${coverage.armorials.read} of ${coverage.armorials.total} blazons read (${coverage.armorials.percentage}%)`
);

function testsIn(path) {
  let report;
  try {
    report = JSON.parse(readFileSync(path, 'utf8'));
  } catch (cause) {
    throw new Error(
      `No test report at ${path}. Run: npm test -- --reporter=default --reporter=json --outputFile.json=${path}`,
      { cause }
    );
  }
  return report.numTotalTests;
}

async function armorialCoverage() {
  // Middleware mode with no config file: nothing is served and nothing of the
  // demo's own build is wanted, only Vite's reading of TypeScript.
  const vite = await createServer({
    configFile: false,
    logLevel: 'warn',
    server: { middlewareMode: true },
    appType: 'custom',
  });
  try {
    const { EnglishBlazonParser, FrenchBlazonParser, readArmorial } =
      await vite.ssrLoadModule('/src/index.ts');
    const { ARMORIALS } = await vite.ssrLoadModule('/demo/armorials/index.ts');

    // An armorial names the tongue it is written in, and is read by the parser
    // of that tongue: read by the other, every entry would refuse.
    const parsers = { french: new FrenchBlazonParser(), english: new EnglishBlazonParser() };
    const armorials = ARMORIALS.map((armorial) => {
      const { read, total } = readArmorial(armorial, parsers[armorial.language]);
      return {
        slug: armorial.slug,
        name: armorial.name,
        read,
        total,
        percentage: percentage(read, total),
      };
    });

    const read = sum(armorials.map((armorial) => armorial.read));
    const total = sum(armorials.map((armorial) => armorial.total));
    return { read, total, percentage: percentage(read, total), each: armorials };
  } finally {
    await vite.close();
  }
}

/**
 * A share, to one decimal. The demo rounds to a whole percent, which reads
 * better on a page; a tenth is kept here so that a handful of entries won over
 * a large armorial still shows as a change rather than as standing still.
 */
function percentage(read, total) {
  return total === 0 ? 0 : Math.round((read / total) * 1000) / 10;
}

function sum(numbers) {
  return numbers.reduce((running, one) => running + one, 0);
}
