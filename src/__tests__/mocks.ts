import * as cp from "child_process";

import {stimulusRawFor} from "./common";

type SpawnSyncSpyCallback = (
    command: string,
    args?: ReadonlyArray<string>,
    options?: cp.SpawnSyncOptionsWithStringEncoding,
) => void;

/**
 * Creates a spy on child_process spawnSync with SpawnSyncReturns<string>.
 * The spy implements a mock which returns the content of the given stimulus
 * file.
 *
 */
export function makeSpawnSyncSpy(
    stimulusFile: string,
    onCall?: SpawnSyncSpyCallback,
) {
    /*
     * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34889
     *
     * Problem with jest:
     * This is due to fs.readFile having overloads declared. When asked to retrieve parameters of an overloaded method, TS will retrieve them from the last overload because it's usually the least specific. This is not the case for fs.readFile however.
     * Note: arguments must match as we kill inference
     */
    const _spawnSyncMock = (
        command: string,
        args?: ReadonlyArray<string>,
        options?: cp.SpawnSyncOptionsWithStringEncoding,
    ) => {
        if (onCall) {
            onCall(command, args, options);
        }
        const stdout = stimulusRawFor(stimulusFile);

        return {
            error: undefined,
            output: [""],
            pid: 0,
            signal: "",
            status: 0,
            stderr: "",
            stdout: stdout,
        } as cp.SpawnSyncReturns<string>;
    };

    const spawnSyncMock = _spawnSyncMock as typeof cp.spawnSync;
    const spawnSyncSpy = jest
        .spyOn(cp, "spawnSync")
        .mockImplementation(spawnSyncMock);

    return spawnSyncSpy;
}
