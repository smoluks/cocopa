import {Result} from "../Result";

test(`Result.normalize`, () => {
    const r = new Result();
    r.compiler = "/my/beautiful/../compiler-g++";
    r.includes.push(
        ...["/this/path/../is//not/../normalized", "/yet/another///path/.."],
    );
    r.normalize();
    expect(r.compiler).toBe("/my/compiler-g++");
    expect(r.includes).toStrictEqual(["/this/is/normalized", "/yet/another"]);

    // empty compiler shouldn't matter
    r.compiler = "";
    r.normalize();
    expect(r.compiler).toBe("");
});
