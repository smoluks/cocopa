import * as fs from 'fs';
import * as path from 'path';

import { Runner } from '../Runner';
import { ParserGcc } from '../ParserGcc';

const stimuliDir = './src/__tests__/stimuli';

for (const stimFileName of fs.readdirSync(stimuliDir)) {
  if (!stimFileName.startsWith('in.')) {
    continue;
  }

  // load stimulus
  const sf = fs.readFileSync(path.join(stimuliDir, stimFileName), 'utf8');
  const stimulus = JSON.parse(sf) as { name: string; infile: string; ccmd: string };

  test(`parsing ${stimulus.name}`, () => {
    // load expected response
    const sfnp = stimFileName.match(/in\.(.+\.json)/);
    if (!sfnp) {
      fail(`could not parse stimulus "${stimFileName}" to generate expected response file name`);
    }
    const respFileName = `out.${sfnp[1]}`;
    const rf = fs.readFileSync(path.join(stimuliDir, respFileName), 'utf8');
    const response = JSON.parse(rf) as {
      includes: string[];
      defines: string[];
      options: string[];
      compiler: string;
      trash: string[];
    };

    const gpp = new ParserGcc(stimulus.infile);
    const p = new Runner([gpp]);

    // make sure this stimulus triggers the parser
    expect(p.parse(stimulus.ccmd)).toBe(true);

    // a matching vector must result in a result
    if (!p.result) {
      fail('successful parsing must produce a result.');
    } else {
      expect(p.result.compiler).toStrictEqual(response.compiler);
      expect(p.result.includes).toStrictEqual(response.includes);
      expect(p.result.defines).toStrictEqual(response.defines);
      expect(p.result.options).toStrictEqual(response.options);
      expect(p.result.trash).toStrictEqual(response.trash);
    }

    // test result...

    // test parser reset
    p.reset();
    expect(p.result).toBeUndefined();
  });
} /* files */

// TODO: test compiler built-in extraction separately
// since not everybody has the exact same compiler on its system
// even on my system this will break as soon as arduino board
// packages update.
// Use generic gcc instead and test if it generates a valid list

// test call back variant
// test call back variant
// test for ignores
