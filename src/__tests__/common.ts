/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import * as fs from "fs";
import * as path from "path";

const _stimuliDir: string[] = ["src", "__tests__", "stimuli"];

export const stimuliDir = path.join(..._stimuliDir);

export function stimulusPathFor(fileName: string) {
    return path.join(..._stimuliDir, fileName);
}

export function stimulusRawFor(fileName: string) {
    return fs.readFileSync(stimulusPathFor(fileName), "utf8");
}

export function stimulusFor(fileName: string) {
    return JSON.parse(stimulusRawFor(fileName));
}

////
// Some random generators to generate random test input data
//

export function makeRandomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min)) + min;
}

export const IdCharMapDefault =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function makeid(length: number, charMap: string = IdCharMapDefault) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += charMap.charAt(makeRandomInt(0, charMap.length - 1));
    }
    return result;
}

export function makeRandomString(
    min: number = 0,
    max: number = 60,
    charMap: string = IdCharMapDefault,
) {
    return makeid(makeRandomInt(min, max), charMap);
}

export function makeRandomStringArray(
    mina: number = 0,
    maxa: number = 20,
    mins: number = 0,
    maxs: number = 60,
    charMap: string = IdCharMapDefault,
) {
    const N = makeRandomInt(mina, maxa);
    const a: string[] = [];
    for (let i = 0; i < N; i++) {
        a.push(makeRandomString(mins, maxs, charMap));
    }
    return a;
}

/**
 * Selects randomly one of the values contained in the enum
 * passed to this function.
 *
 * @param e The enum from which a random entry should be
 * selected.
 *
 * @see Inspiration for the keyof solution has been found
 *   here https://stackoverflow.com/a/55699349
 */
export function randomEnumItem<T>(e: T): T[keyof T] {
    const keys = (Object.keys(e) as unknown) as (keyof T)[];
    const key = keys[makeRandomInt(0, keys.length - 1)];
    return e[key];
}
