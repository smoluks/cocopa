import { ParserGcc } from '../ParserGcc';
import { makeSpawnSyncSpy } from './mocks';

test(`compiler built-in info parser`, () => {
  const spawnSyncSpy = makeSpawnSyncSpy('gpp.amd64.builtin.stimulus.txt');

  const testFile = 'test.cpp';
  const p = new ParserGcc([`${testFile}.o`]);

  expect(p.infoParser).toBeDefined();

  const cmd = `mock-g++ -c -o ${testFile}.o ${testFile}`;
  const match = p.match(cmd);

  if (!match) {
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
  expect(match.compiler).toStrictEqual('mock-g++');
  expect(match.trash).toStrictEqual(['-c', '-o', `${testFile}.o`, testFile]);
  expect(match.includes).toStrictEqual(includes);

  spawnSyncSpy.mockClear();
});
