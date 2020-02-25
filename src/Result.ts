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
}
