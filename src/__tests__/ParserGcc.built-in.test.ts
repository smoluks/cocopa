import * as cp from "child_process";
import {ParserGcc} from "../ParserGcc";
import {makeSpawnSyncSpy} from "./mocks";
import {
    makeBuiltInInfoParserGccShell,
    makeBuiltInInfoParserGccShellArgs,
} from "../BuiltInInfoParserGcc";

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
