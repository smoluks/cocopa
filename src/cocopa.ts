#!/usr/bin/env node
/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

// This is a CLI - therefore allowing console.log
// tslint:disable:no-console

/**
 * COCOPA CLI
 */

import chalk, {Chalk} from "chalk";

import {existsSync, readFileSync, writeFileSync} from "fs";
import {relative, resolve} from "path";
// import { compile } from 'gitignore-parser';
import program from "commander";
// import glob from 'glob';

const pkgraw = readFileSync("../package.json", {encoding: "utf8"});
const pkg = JSON.parse(pkgraw);

program
    .version(pkg.version)
    .arguments("[...files]")
    .option(
        "--verify",
        `Verify that running embedme would result in no changes. Useful for CI`,
    )
    .option("--dry-run", `Run embedme as usual, but don't write`)
    .option(
        "--source-root [directory]",
        `Directory your source files live in in order to shorten the comment line in code fence`,
    )
    .option("--silent", `No console output`)
    .option(
        "--stdout",
        `Output resulting file to stdout (don't rewrite original)`,
    )
    .option(
        "--strip-embed-comment",
        `Remove the comments from the code fence. *Must* be run with --stdout flag`,
    )
    .parse(process.argv);

export interface CocopaOptions {
    sourceRoot: string;
    dryRun: boolean;
    verify: boolean;
    silent: boolean;
    stdout: boolean;
    stripEmbedComment: boolean;
}

const {args: sourceFilesInput} = program;

const options: CocopaOptions = (program as unknown) as CocopaOptions;

// this somewhat convoluted type to generate logs is due to the requirement to be able to log colours to both stdout,
// and stderr, so the appropriate chalk instance has to be injected.
type LogConstructor = (chalk: Chalk) => string;

export const logBuilder = (opts: CocopaOptions, errLog = false) => (
    logConstructor: LogConstructor,
) => {
    if (!opts.silent) {
        if (errLog || opts.stdout) {
            // as we're putting the resulting file out of stdout, we redirect the logs to stderr so they can still be seen,
            // but won't be piped
            console.error(logConstructor(chalk.stderr));
        } else {
            console.log(logConstructor(chalk));
        }
    }
};

const log = logBuilder(options);
const errorLog = logBuilder(options, true);

const sourceFiles = []; /*sourceFilesInput.reduce<string[]>((files, file) => {
    if (glob.hasMagic(file)) {
      files.push(...glob.sync(file));
    } else {
      files.push(file);
    }
  
    return files;
  }, []);
  */

if (sourceFiles.length > 1) {
    log(clk =>
        clk.yellow(
            `More than one file matched your input, results will be concatenated in stdout`,
        ),
    );
} else if (sourceFiles.length === 0) {
    log(clk => clk.yellow(`No files matched your input`));
    process.exit(0);
}

if (options.stripEmbedComment && !options.stdout) {
    errorLog(clk =>
        clk.red(
            `If you use the --strip-embed-comment flag, you must use the --stdout flag and redirect the result to your destination file, otherwise your source file(s) will be rewritten and comment source is lost.`,
        ),
    );
    process.exit(1);
}

if (options.verify) {
    log(clk => clk.blue(`Verifying...`));
} else if (options.dryRun) {
    log(clk => clk.blue(`Doing a dry run...`));
} else if (options.stdout) {
    log(clk => clk.blue(`Outputting to stdout...`));
} else {
    log(clk => clk.blue(`Embedding...`));
}
