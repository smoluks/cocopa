/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */
import * as path from "path";
import {fsstat, findFileIn} from "./helpers";

/**
 * Data structure carrying the output from a parsed compiler command.
 * All compiler specific option prefixes are removed for includes and
 * defines.
 */
export class Result {
    includes: string[] = [];
    defines: string[] = [];
    options: string[] = [];
    compiler: string = "";
    /** Dropped arguments like -c -Ox -o, the input and output file. */
    trash: string[] = [];

    /**
     * Normalize all paths which are: include paths and the path of the
     * compiler executable.
     * Removes empty include paths if any.
     */
    public normalize() {
        if (this.compiler) {
            this.compiler = path.normalize(this.compiler);
        }
        const res: string[] = [];
        for (const i of this.includes) {
            if (i) {
                res.push(path.normalize(i));
            }
        }
        this.includes = res;
    }

    /**
     * Tests for invalid include paths and removes them.
     */
    async cleanup() {
        const incl: string[] = [];
        for (const d of this.includes) {
            try {
                const s = await fsstat(d);
                if (s.isDirectory()) {
                    incl.push(d);
                }
            } catch (e) {
                continue;
            }
        }
        this.includes = incl;
    }

    /**
     * Finds file in include paths.
     * @param file File to be found.
     * @param options Options to control the search.
     * If stopOnFirst is true, the search returns the first match (default).
     * If stopOnFirst is false, the search returns an array with all matches.
     * @returns The full paths of the files found.
     */
    async findFile(
        file: string,
        options: {stopOnFirst: boolean} = {stopOnFirst: true},
    ) {
        const res: string[] = [];
        for (const i of this.includes) {
            for (const p of await findFileIn(i, file, options)) {
                res.push(path.join(p, file));
                if (options && options.stopOnFirst && res.length > 0) {
                    return res;
                }
            }
        }
        return res;
    }
}
