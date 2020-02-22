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
import * as cp from "child_process";
import {ParserGcc} from "../ParserGcc";
import {makeSpawnSyncSpy} from "./mocks";
import {
    makeBuiltInInfoParserGccShell,
    makeBuiltInInfoParserGccShellArgs,
} from "../BuiltInInfoParserGcc";

// todo: mock os.platform to test windows implementation

test(`compiler built-in info parser`, () => {
    const exe = "mock-g++";

    const gccCallCallback = (
        command: string,
        args?: ReadonlyArray<string>,
        options?: cp.SpawnSyncOptionsWithStringEncoding,
    ) => {
        expect(command).toBe(makeBuiltInInfoParserGccShell());
        if (!args) {
            fail("this must not happen!");
        }
        expect(args.length).toBe(2);
        expect(args).toStrictEqual(makeBuiltInInfoParserGccShellArgs(exe));
    };

    const spawnSyncSpy = makeSpawnSyncSpy(
        "gpp.amd64.builtin.stimulus.txt",
        gccCallCallback,
    );

    const testFile = "test.cpp";
    const cmd = `${exe} -c -o ${testFile}.o ${testFile}`;

    const match = [
        // make sure we're running g++
        /(?:^|-)g\+\+\s+/,
        // make sure we're compiling
        /\s+-c\s+/,
        // user defined match pattern
        `${testFile}.o`,
    ];
    const p = new ParserGcc(match);

    expect(p.infoParser).toBeDefined();

    const result = p.match(cmd);

    if (!result) {
        fail("compiler command line did not trigger");
    }

    // Manually extracted includes from stimulus
    const includes = [
        "/usr/include/c++/7",
        "/usr/include/x86_64-linux-gnu/c++/7",
        "/usr/include/c++/7/backward",
        "/usr/lib/gcc/x86_64-linux-gnu/7/include",
        "/usr/local/include",
        "/usr/lib/gcc/x86_64-linux-gnu/7/include-fixed",
        "/usr/include/x86_64-linux-gnu",
        "/usr/include",
    ];
    expect(result.compiler).toStrictEqual("mock-g++");
    expect(result.trash).toStrictEqual(["-c", "-o", `${testFile}.o`, testFile]);
    expect(result.includes).toStrictEqual(includes);

    spawnSyncSpy.mockClear();
});
