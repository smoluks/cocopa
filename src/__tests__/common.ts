import * as fs from 'fs';
import * as path from 'path';

const _stimuliDir: string[] = ['src', '__tests__', 'stimuli'];

export const stimuliDir = path.join(..._stimuliDir);

export function stimulusPathFor(fileName: string) {
  return path.join(..._stimuliDir, fileName);
}

export function stimulusRawFor(fileName: string) {
  return fs.readFileSync(stimulusPathFor(fileName), 'utf8');
}

export function stimulusFor(fileName: string) {
  return JSON.parse(stimulusRawFor(fileName));
}
