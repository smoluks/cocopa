import * as fs from "fs";
import * as path from "path";
import {CCppProperties} from "../CCppProperties";
import {
    CCppPropertiesContent,
    CCppPropertiesMergeMode,
} from "../CCppPropertiesContent";
import { CCppPropertiesConfiguration, CCppPropertiesISMode, CCppPropertiesCStandard, CCppPropertiesCppStandard } from "../CCppPropertiesConfiguration";

/**
 *
 */
test(`CCppProperties write`, () => {
    const fsExistsSyncSpy = jest.spyOn(fs, "existsSync").mockReturnValue(false);
    const fsMkdirSyncSpy = jest.spyOn(fs, "mkdirSync").mockReturnValue();
    const fsWriteFileSyncSpy = jest
        .spyOn(fs, "writeFileSync")
        .mockReturnValue();

    const fakepath = path.join("this path does not exist", "fake.json");

    const p = new CCppProperties();

    // we didn't call read - content must be undefined
    expect(p.content).toBeUndefined();

    const pc = new CCppPropertiesContent();

    expect(p.changed).toBe(false);

    p.merge(pc, CCppPropertiesMergeMode.ReplaceSameNames);

    expect(p.changed).toBe(true);

    p.write(fakepath);
    expect(p.changed).toBe(false);

    expect(fsExistsSyncSpy).toHaveBeenCalledTimes(1);
    expect(fsExistsSyncSpy).toBeCalledWith(path.dirname(fakepath));

    expect(fsMkdirSyncSpy).toHaveBeenCalledTimes(1);
    expect(fsMkdirSyncSpy).toBeCalledWith(path.dirname(fakepath), {
        recursive: true,
    });

    expect(fsWriteFileSyncSpy).toHaveBeenCalledTimes(1);
    expect(fsWriteFileSyncSpy).toBeCalledWith(fakepath, p.stringyfy());

    fsExistsSyncSpy.mockClear();
    fsMkdirSyncSpy.mockClear();
    fsWriteFileSyncSpy.mockClear();
});

test(`CCppProperties merge`, () => {

    const p = new CCppProperties();

    // we didn't call read - content must be undefined
    expect(p.content).toBeUndefined();

    const cp = "compiler/path-g++";
    const ca = ["-fcompilerargs", "-Wall"];
    const ic = ["my/include/dir", "my other include/dir"];
    const df = ["FAST_MODE=1", 'VERSION="3.8.9"'];
    const nameOriginal = "original";
    const nameOther = "other";
    const im = CCppPropertiesISMode.Gcc_X64;
    const cs = CCppPropertiesCStandard.C11;
    const cpp = CCppPropertiesCppStandard.Cpp11;
    const fi: string[] = [];


    const originalConf = new CCppPropertiesConfiguration(cp, ca, ic, df, nameOriginal, im, cs, cpp, fi);
    const original = new CCppPropertiesContent([originalConf]);

    const otherConf = new CCppPropertiesConfiguration(cp, ca, ic, df, nameOther, im, cs, cpp, fi);
    const other = new CCppPropertiesContent([otherConf]);
    
    expect(original.equals(other)).toBe(false);

    original.merge(other, CCppPropertiesMergeMode.Replace);

    expect(original.equals(other)).toBe(true);
    expect(original.configurations[0].name).toBe(nameOther);

    // check if empty name gets dropped

    // check equals for CCppPropertiesContent and CCppPropertiesConfiguration
});
