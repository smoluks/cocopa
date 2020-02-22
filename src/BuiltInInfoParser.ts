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
/**
 * Return value of any BuiltInInfoParser.
 * Contains the includes and other data which are intrinsically
 * known to the compiler without having to specify them explicitly
 * as includes etc. on the command line.
 */
export interface IBuiltInInfo {
    includes: string[];
    defines: string[];
}

/**
 * Classes of this type query compilers about their built-in
 * include paths, defines and so on.
 */
export abstract class BuiltInInfoParser {
    private _enabled: boolean = true;

    public set enabled(e: boolean) {
        this._enabled = e;
    }
    public get enabled() {
        return this._enabled;
    }

    public abstract info(executable: string): IBuiltInInfo | undefined;
}
