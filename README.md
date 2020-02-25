# cocopa - Compiler Command Parser
A parser to extract include directories, defines, arguments from a compiler's command line invocation and its built-in configuration.

&nbsp;&nbsp;&nbsp;&nbsp;**This is work in progress as long you read this message -- be prepared for heavy API changes**

## TODO
* Write command line tool which
  * Can read the `.vscode/arduino.json` to get the main sketch and the board
  * Run the arduino build command and run the parser
  * provide a task file to vscode
* Test compiler built-in extraction separately since not everybody has the exact same compiler on its system even on my system this will break as soon as arduino board packages update.  
  
* More documentation
* :white_check_mark: `npm run clean` script to clean up lib -> add to preXY to clean up before making packages
* :white_check_mark: Tool to generate stimulus and response JSON
* Make it more generic, i.e. move Arduino/IntelliSense stuff into a separate layer/out of cocopa
  * :heavy_check_mark: move match on .ino file out of cocopa
  * :heavy_check_mark: Runner::processResults
* From vscode-arduino IntelliSense-branch:
  * :heavy_check_mark: Merging of parsing result and existing file content
  * :heavy_check_mark: Handling inexistent files and folders
  * :heavy_check_mark: Write configuration on change only
  * :heavy_check_mark: X-platform support
  * :heavy_check_mark: normalize include and other paths before returning them
  * Unit testing:
    * :heavy_check_mark: Use mocked gcc and child_process.execSync to test built-in info parser
    * :heavy_check_mark: Test parser for compiler built-in info 
    * :heavy_check_mark: Tests for compile output of all known arduino platforms (see field test)
    * :heavy_check_mark: JSON input
    * :heavy_check_mark: JSON output
    * :heavy_check_mark: Configuration merging
    * :white_check_mark: Throwing arbitrary data at parser engines
* Later:
  * option to turn built-in defines/includes on or off
  * [Migrate to ESLint](https://code.visualstudio.com/api/advanced-topics/tslint-eslint-migration)
  * Rewrite file and child process calls to be async
  * Repository/node tags

## Publishing
```bash
# patch, minor, major, prepatch, preminor, premajor, prerelease
npm version patch 
npm publish
```

## References
* [TypeScript package how-to](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)
* [Prettier](https://prettier.io/)
* [Prettier configuration](https://prettier.io/docs/en/configuration.html)
* [Node command line package](https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e)

## License
```ts
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
```
