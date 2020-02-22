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
import {Result} from "./Result";
import {Parser} from "./Parser";

/**
 * A compiler command parser.
 * Takes compiler commands line by line and tries to find the compile command
 * for the main .ino sketch. From that it tries to extract all includes,
 * defines, options and the compiler command itself.
 *
 * TODO: Make it more generic to support other compilers than gcc
 */
export class Runner {
    private _result: Result | undefined = undefined;
    private _engines: Parser[] = [];

    /**
     * Create a compiler command parser.
     * Sets up parsing operation.
     * @param engines Parsing engines for different compilers
     */
    constructor(engines: Parser[]) {
        this._engines = engines;
    }
    /**
     * Returns the parsing result.
     * Returns undefined when the parser fails or when the
     * parser didn't run.
     */
    get result(): Result | undefined {
        return this._result;
    }
    /**
     * Resets the parser by dropping the result.
     */
    public reset() {
        this._result = undefined;
    }
    /**
     * Takes a command line and tries to parse it.
     *
     * @param line Compiler command line candidate.
     * @returns The parsing result if the command line was parsed
     * successfully. It returns undefined if no match was found or
     * parsing failed.
     */
    public parse(line: string): boolean {
        for (const engine of this._engines) {
            this._result = engine.match(line);
            if (this._result) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns a callback which can be passed on to other functions
     * to call. For instance from stdout callbacks of child processes.
     *
     * @param once If true this callback stops parsing as soon as a
     * valid result has been generated (to reduce overhead).
     */
    public callback(once: boolean = true): (line: string) => void {
        return (line: string) => {
            if (!this._result || !once) {
                this.parse(line);
            }
        };
    }
}
