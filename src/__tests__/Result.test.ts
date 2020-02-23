import {Result} from "../Result";

test(`Result.normalize`, () => {
    const r = new Result();
    r.includes.push(
        ...["/this/path/../is//not/../normalized", "/yet/another///path/.."],
    );
    r.normalize();
    expect(r.includes).toStrictEqual(["/this/is/normalized", "/yet/another"]);
});
