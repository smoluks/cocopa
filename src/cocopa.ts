#!/usr/bin/env node

/**
 * COCOPA CLI
 */

import chalk, {Chalk} from "chalk";

import {existsSync, readFileSync, writeFileSync} from "fs";
import {relative, resolve} from "path";
//import { compile } from 'gitignore-parser';
import program from "commander";
//import glob from 'glob';
const pkg = require("../package.json");

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

export const logBuilder = (options: CocopaOptions, errorLog = false) => (
    logConstructor: LogConstructor,
) => {
    if (!options.silent) {
        if (errorLog || options.stdout) {
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

let sourceFiles = []; /*sourceFilesInput.reduce<string[]>((files, file) => {
    if (glob.hasMagic(file)) {
      files.push(...glob.sync(file));
    } else {
      files.push(file);
    }
  
    return files;
  }, []);
  */

if (sourceFiles.length > 1) {
    log(chalk =>
        chalk.yellow(
            `More than one file matched your input, results will be concatenated in stdout`,
        ),
    );
} else if (sourceFiles.length === 0) {
    log(chalk => chalk.yellow(`No files matched your input`));
    process.exit(0);
}

if (options.stripEmbedComment && !options.stdout) {
    errorLog(chalk =>
        chalk.red(
            `If you use the --strip-embed-comment flag, you must use the --stdout flag and redirect the result to your destination file, otherwise your source file(s) will be rewritten and comment source is lost.`,
        ),
    );
    process.exit(1);
}

if (options.verify) {
    log(chalk => chalk.blue(`Verifying...`));
} else if (options.dryRun) {
    log(chalk => chalk.blue(`Doing a dry run...`));
} else if (options.stdout) {
    log(chalk => chalk.blue(`Outputting to stdout...`));
} else {
    log(chalk => chalk.blue(`Embedding...`));
}
