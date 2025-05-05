/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */
import {Result} from "../Result";

test(`Result.normalize`, () => {
    const r = new Result();
    r.compiler = "/my/beautiful/../compiler-g++";
    r.includes.push(
        ...["/this/path/../is//not/../normalized", "/yet/another///path/.."],
    );

    r.normalize();

    if (process.platform === "win32") {
        expect(r.compiler).toBe("\\my\\compiler-g++");
        expect(r.includes).toStrictEqual([
            "\\this\\is\\normalized",
            "\\yet\\another",
        ]);
    } else {
        expect(r.compiler).toBe("/my/compiler-g++");
        expect(r.includes).toStrictEqual([
            "/this/is/normalized",
            "/yet/another",
        ]);
    }

    // empty compiler shouldn't matter
    r.compiler = "";
    r.normalize();
    expect(r.compiler).toBe("");
});
