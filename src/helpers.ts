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
import * as os from "os";

/**
 * Escape a string such that it can be used within regular expressions.
 *
 * @param s String to be escaped.
 * @see https://stackoverflow.com/a/3561711
 */
export function regExEscape(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function removeDuplicatesFrom<T>(a: T[]) {
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }
    return a;
}

export function arraysEqual<T>(a: T[], b: T[]) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export function lineSplitRegEx() {
    return /\s*(?:\r|\r\n|\n)\s*/;
}

/**
 * A trigger is a set of matches and don't-matches which will identify the
 * actual compiler command line the parser then should parse.
 */
export interface IParserTrigger {
    match: (string | RegExp)[];
    dontmatch: (string | RegExp)[];
}

export enum TriggerTarget {
    /** Arduino IDE with gcc based compilers. */
    ArduinoGpp,
}

/**
 * Get a trigger for a specific target.
 * @param target The kind of (development) environment the trigger should be
 * retrieved for.
 * @param platform The platform (OS) this trigger will operate on.
 */
export function getTriggerFor(
    target: TriggerTarget,
    platform?: string,
): IParserTrigger {
    let matchPattern: (string | RegExp)[] = [];
    let dontMatchPattern: (string | RegExp)[] = [];

    if (!platform) {
        platform = os.platform();
    }

    switch (target) {
        case TriggerTarget.ArduinoGpp:
            matchPattern = [
                // make sure we're running g++
                /(?:^|-)g\+\+"{0,1}\s+/,
                // make sure we're compiling
                /\s+-c\s+/,
                // trigger parser when compiling the main sketch
                /-o\s+"{0,1}(?:\\"|[^"])+\.ino\.cpp\.o"{0,1}/,
            ];
            dontMatchPattern =
                platform !== "win32" ? [/-o\s\/dev\/null/] : [/-o\snul/];
            break;
    }

    return {
        match: matchPattern,
        dontmatch: dontMatchPattern,
    };
}

/**
 * Get the trigger for a gcc-based Arduino environment to trigger on the
 * sketch compilation compiler command.
 * @param sketch Path to the sketch to be compiled ('verified' or 'uploaded')
 * @param platform Operating system string as returned by os.platform(). If not
 * provided, it will be retrieved internally.
 */
export function getTriggerForArduinoGcc(sketch: string, platform?: string) {
    // trigger parser when compiling the main sketch
    // /-o\s+"{0,1}(?:\\"|[^"])+\.ino\.cpp\.o"{0,1}/,

    const dotcpp = sketch.endsWith(".ino") ? ".cpp" : "";
    sketch = `-o\\s+"{0,1}?(?:\\"|[^"])*?${regExEscape(
        sketch,
    )}${dotcpp}\\.o"{0,1}?`;

    const trigger = getTriggerFor(TriggerTarget.ArduinoGpp, platform);

    trigger.match.push(sketch);
    return trigger;
}
