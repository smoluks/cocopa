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
