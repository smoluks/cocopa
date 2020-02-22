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
import * as fs from "fs";
import * as path from "path";
import {CCppProperties} from "../CCppProperties";
import {
    CCppPropertiesContent,
    CCppPropertiesMergeMode,
} from "../CCppPropertiesContent";
import {
    CCppPropertiesConfiguration,
    CCppPropertiesISMode,
    CCppPropertiesCStandard,
    CCppPropertiesCppStandard,
} from "../CCppPropertiesConfiguration";
import {
    makeRandomString,
    makeRandomStringArray,
    randomEnumItem,
} from "./common";

/**
 *
 * @param name Configuration name
 * @param N Number of configurations to generate
 */
function makeConf(name: string = makeRandomString(), N: number = 1) {
    const r: CCppPropertiesConfiguration[] = [];
    for (let i = 0; i < N; i++) {
        r.push(
            new CCppPropertiesConfiguration(
                makeRandomString(),
                makeRandomStringArray(),
                makeRandomStringArray(),
                makeRandomStringArray(),
                N <= 1 ? name : `${name}-${i}`,
                randomEnumItem(CCppPropertiesISMode),
                randomEnumItem(CCppPropertiesCStandard),
                randomEnumItem(CCppPropertiesCppStandard),
                makeRandomStringArray(),
            ),
        );
    }
    return r;
}

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

    ////
    // Test CCppPropertiesMergeMode.Replace

    let original = new CCppPropertiesContent(makeConf("a"));
    let other = new CCppPropertiesContent(makeConf("b"));

    expect(original.equals(other)).toBe(false);

    let res = original.merge(other, CCppPropertiesMergeMode.Replace);

    expect(res).toBe(true);
    expect(original.equals(other)).toBe(true);
    expect(original.configurations[0].name).toBe("b");

    ////
    // Test CCppPropertiesMergeMode.ReplaceSameNames
    //
    // -> configurations with same name will be merged
    // -> if any of the configurations to be merged has no
    //      name set it must be dropped

    // Test, if configuration with empty name will get dropped

    original = new CCppPropertiesContent(makeConf("a"));
    other = new CCppPropertiesContent(makeConf(""));

    expect(original.equals(other)).toBe(false);

    res = original.merge(other, CCppPropertiesMergeMode.ReplaceSameNames);

    expect(res).toBe(false);
    expect(original.equals(other)).toBe(false);

    // Test merging with valid but different name

    other.configurations[0].name = "b";
    res = original.merge(other, CCppPropertiesMergeMode.ReplaceSameNames);
    // we have now two configurations and the second configuration should be
    // the configuration we merged in
    expect(res).toBe(true);
    expect(original.configurations.length).toBe(2);
    expect(original.configurations[1].equals(other.configurations[0])).toBe(
        true,
    );

    // Test merging with valid but same name
    //   since we're using random configurations, the new "b"
    //   must be different than the "b" we created above
    other = new CCppPropertiesContent(makeConf("b"));
    expect(original.configurations[1].equals(other.configurations[0])).toBe(
        false,
    );
    res = original.merge(other, CCppPropertiesMergeMode.ReplaceSameNames);
    expect(res).toBe(true);
    expect(original.configurations[1].equals(other.configurations[0])).toBe(
        true,
    );

    ////
    // Test CCppPropertiesMergeMode.Complement
    //

    // test if it doesn't modify if source contains empty values
});

test(`CCppProperties confByName`, () => {
    const p = new CCppPropertiesContent(makeConf("my-conf", 3));

    expect(p.confByName("my-conf-X")).toBeUndefined();
    expect(p.confByName("my-conf-2")).toBeDefined();
});

// test "equals" for CCppPropertiesContent and CCppPropertiesConfiguration
