import { makeRandomInt } from "./common";


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
        max = v > max ? v : max ;
        min = v < min ? v : min ;
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
