import * as path from "path";
import * as fs from "fs";
import {stimulusRawFor, stimulusPathFor, stimuliDir} from "./common";
import {lineSplitRegEx} from "../BuiltInInfoParserGcc";
import {ParserGcc} from "../ParserGcc";
import {Runner} from "../Runner";
import {fail} from "assert";

const fieldDir = "field";
const platformLinux = "linux";
const platformOsx = "osx";
const platformWin = "win";
const findInoCppO = /-o\s+\S+\.ino\.cpp\.o/;

for (const file of fs.readdirSync(path.join(stimuliDir, fieldDir))) {
    test(`field data: ${file}`, () => {
        let platform: string;
        let matchPattern: (string | RegExp)[] = [];
        let dontMatchPattern: (string | RegExp)[] = [];

        if (file.startsWith(`${platformLinux}.`)) {
            platform = platformLinux;
        } else if (file.startsWith(`${platformOsx}.`)) {
            platform = platformOsx;
        } else if (file.startsWith(`${platformWin}.`)) {
            platform = platformWin;
        } else {
            fail(`unknown test vector ${file}`);
        }

        const stimulus = stimulusRawFor(path.join(fieldDir, file));
        const lines = stimulus.split(lineSplitRegEx());

        if (platform === platformLinux || platform === platformOsx) {
            matchPattern = [
                // make sure we're running g++
                /(?:^|-)g\+\+\s+/,
                // make sure we're compiling
                /\s+-c\s+/,
                // trigger parser when compiling the main sketch
                findInoCppO,
            ];
            dontMatchPattern = [
                // make sure Arduino's not testing libraries
                /-o\s\/dev\/null/,
            ];
        }
        const gpp = new ParserGcc(matchPattern, dontMatchPattern);

        // we can not run foreign compilers here
        gpp.infoParser ? (gpp.infoParser.enabled = false) : null;

        const runner = new Runner([gpp]);
        const cb = runner.callback();

        lines.forEach(line => {
            cb(line);
        });

        const result = runner.result;

        if (!result) {
            fail("no compiler invocation found");
        }

        expect(result.includes.length).toBeGreaterThan(0);
        expect(result.defines.length).toBeGreaterThan(0);
        expect(result.options.length).toBeGreaterThan(0);
        expect(result.compiler.length).toBeGreaterThan(0);
    });
}

/*
    const result = gpp.match(input);

    if (!result) {
        fail("failed to parse Ben Zeeman's compiler invocation")
    }

    const content = new CCppPropertiesContentResult(result,
        "Arduino",
        CCppPropertiesISMode.Gcc_X64,
        CCppPropertiesCStandard.C11,
        // as of 1.8.11 arduino is on C++11
        CCppPropertiesCppStandard.Cpp11);

    const pPath = 'delme.json';
    const prop = new CCppProperties();
//        prop.read();
    prop.merge(content, CCppPropertiesMergeMode.ReplaceSameNames);
    if (prop.write(pPath)) {
        //arduinoChannel.info("IntelliSense configuration updated.");
    } else {
        //arduinoChannel.info("IntelliSense configuration already up to date.");
    }
*/
