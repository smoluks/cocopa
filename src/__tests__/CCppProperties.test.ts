import * as fs from "fs";
import * as path from "path";
import {CCppProperties} from "../CCppProperties";
import {
    CCppPropertiesContent,
    CCppPropertiesMergeMode,
} from "../CCppPropertiesContent";

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
