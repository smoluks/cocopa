import * as fs from 'fs';
import { CCppProperties } from '../CCppProperties';
import { CCppPropertiesContent, CCppPropertiesMergeMode } from '../CCppPropertiesContent';

test(`CCppProperties write`, () => {
  const fsExistsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
  const fsMkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockReturnValue();
  const fsWriteFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue();

  const fakepath = 'this path does not exist';
  const p = new CCppProperties();

  // we didn't call read - content must be undefined
  expect(p.content).toBeUndefined();

  const pc = new CCppPropertiesContent();

  expect(p.changed).toBe(false);

  p.merge(pc, CCppPropertiesMergeMode.ReplaceSameNames);

  expect(p.changed).toBe(true);

  p.write(fakepath);

  expect(p.changed).toBe(false);

  expect(fsExistsSyncSpy).toHaveBeenCalledTimes(1);
  expect(fsMkdirSyncSpy).toHaveBeenCalledTimes(1);
  expect(fsWriteFileSyncSpy).toHaveBeenCalledTimes(1);

  fsExistsSyncSpy.mockClear();
  fsMkdirSyncSpy.mockClear();
  fsWriteFileSyncSpy.mockClear();
});
