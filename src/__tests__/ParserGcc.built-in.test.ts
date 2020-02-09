import { ParserGcc } from '../ParserGcc';
import { makeSpawnSyncSpy } from './mocks';

test(`compiler built-in info parser`, () => {
  const spawnSyncSpy = makeSpawnSyncSpy('gpp.amd64.builtin.stimulus.txt');

  const testFile = 'test.cpp';
  const match = [
        // make sure we're running g++
        /(?:^|-)g\+\+\s+/,
        // make sure we're compiling
        /\s+-c\s+/,
        // user defined match pattern
        `${testFile}.o`
  ];
  const p = new ParserGcc(match);

  expect(p.infoParser).toBeDefined();

  const cmd = `mock-g++ -c -o ${testFile}.o ${testFile}`;
  const result = p.match(cmd);

  if (!result) {
    fail('compiler command line did not trigger');
  }

  const includes = [
    '/usr/include/c++/7',
    '/usr/include/x86_64-linux-gnu/c++/7',
    '/usr/include/c++/7/backward',
    '/usr/lib/gcc/x86_64-linux-gnu/7/include',
    '/usr/local/include',
    '/usr/lib/gcc/x86_64-linux-gnu/7/include-fixed',
    '/usr/include/x86_64-linux-gnu',
    '/usr/include',
  ];
  expect(result.compiler).toStrictEqual('mock-g++');
  expect(result.trash).toStrictEqual(['-c', '-o', `${testFile}.o`, testFile]);
  expect(result.includes).toStrictEqual(includes);

  spawnSyncSpy.mockClear();
});
