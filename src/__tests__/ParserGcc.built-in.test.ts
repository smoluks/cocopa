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
import * as os from "os";
import {ParserGcc} from "../ParserGcc";
import {makeExecSyncSpy} from "./mocks";
import {gccGetBuiltInCmd, GccGetBuiltIn} from "../BuiltInInfoParserGcc";

jest.mock("child_process");
jest.mock("os");

for (const platform of ["win32", "darwin", "linux"]) {
    test(`compiler built-in info parser on ${platform}`, () => {
        const exe = "mock-g++";

        const osPlatformSpy = jest
            .spyOn(os, "platform")
            .mockReturnValue(platform as NodeJS.Platform);

        const execSyncSpy = makeExecSyncSpy([
            {
                file: "gpp.amd64.builtin.includes.stimulus.txt",
                pattern: gccGetBuiltInCmd(exe, GccGetBuiltIn.Includes),
            },
            {
                file: "gpp.amd64.builtin.defines.stimulus.txt",
                pattern: gccGetBuiltInCmd(exe, GccGetBuiltIn.Defines),
            },
        ]);

        const testFile = "test.cpp";
        const cmd = `${exe} -c -o ${testFile}.o ${testFile}`;

        const trigger = {
            match: [
                // make sure we're running g++
                /(?:^|-)g\+\+\s+/,
                // make sure we're compiling
                /\s+-c\s+/,
                // user defined match pattern
                `${testFile}.o`,
            ],
            dontmatch: [],
        };
        const p = new ParserGcc(trigger);

        expect(p.infoParser).toBeDefined();

        const result = p.match(cmd);

        if (!result) {
            fail("compiler command line did not trigger");
        }

        // Manually extracted includes and defines from stimulus
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
        const defines = [
            "__DBL_MIN_EXP__=(-1021)",
            "__MY_TYPE=unsigned long long",
            "__FLT32X_MAX_EXP__=1024",
            "__cpp_attributes=200809",
            "__UINT_LEAST16_MAX__=0xffff",
            "__ATOMIC_ACQUIRE=2",
            "__FLT128_MAX_10_EXP__=4932",
            "PLAIN_DEFINE",
            "PLAIN_DEFINE_SPACE",
            "LAST_DEFINE_NO_EOL=3",
        ];
        expect(result.compiler).toStrictEqual("mock-g++");
        expect(result.trash).toStrictEqual([
            "-c",
            "-o",
            `${testFile}.o`,
            testFile,
        ]);
        expect(result.includes).toStrictEqual(includes);
        expect(result.defines).toStrictEqual(defines);

        // once for include, once for defines
        expect(execSyncSpy).toHaveBeenCalledTimes(2);

        osPlatformSpy.mockClear();
        execSyncSpy.mockClear();
    });
}
