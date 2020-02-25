/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */
import * as cp from "child_process";

import {stimulusRawFor} from "./common";

type ExecSyncSpyCallback = (
    c: string,
    o?: cp.ExecSyncOptionsWithStringEncoding | undefined,
) => void;

/**
 * Creates a spy on child_process spawnSync with SpawnSyncReturns<string>.
 * The spy implements a mock which returns the content of the given stimulus
 * file.
 *
 */
export function makeExecSyncSpy(
    stimulus?: {file: string; pattern?: string}[],
    onCall?: ExecSyncSpyCallback,
) {
    /*
     * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34889
     *
     * Problem with jest:
     * This is due to fs.readFile having overloads declared. When asked to retrieve parameters of an overloaded method, TS will retrieve them from the last overload because it's usually the least specific. This is not the case for fs.readFile however.
     * Note: arguments must match as we kill inference
     */
    const _execSyncMock = (
        c: string,
        o?: cp.ExecSyncOptionsWithStringEncoding | undefined,
    ) => {
        if (onCall) {
            onCall(c, o);
        }
        if (stimulus) {
            for (const s of stimulus) {
                if (!s.pattern || c.indexOf(s.pattern) >= 0) {
                    return stimulusRawFor(s.file);
                }
            }
        }
        return "";
    };

    const execSyncMock = _execSyncMock as typeof cp.execSync;
    const execSyncSpy = jest
        .spyOn(cp, "execSync")
        .mockImplementation(execSyncMock);

    return execSyncSpy;
}
