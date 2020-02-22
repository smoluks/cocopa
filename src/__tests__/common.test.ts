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
import {makeRandomInt} from "./common";

/**
 * Tests the random number generation.
 */
test(`makeRandomInt`, () => {
    const MIN = 0;
    const MAX = 10;
    const REPETITIONS = (MAX - MIN + 1) * 1000;
    let max = MIN;
    let min = MAX;
    for (let i = 0; i < REPETITIONS; i++) {
        const v = makeRandomInt(MIN, MAX);
        expect(v).toBeLessThanOrEqual(MAX);
        expect(v).toBeGreaterThanOrEqual(MIN);
        max = v > max ? v : max;
        min = v < min ? v : min;
    }
    // Note: on rare occasions this can fail - it's random
    // but if it fails multiple times we have a range problem.
    // make sure that the number of iterations is high enough
    // such that the probability of the highest and lowest value
    // is pretty much 1.
    // For 1100 iterations with 0 .. 10 we have a probability of
    // 1100 / 11 = 100 -> if evenly distributed we should get
    // around 100 hits for the highest and lowest value
    expect(min).toBe(MIN);
    expect(max).toBe(MAX);
});
