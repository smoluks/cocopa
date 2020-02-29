# cocopa - Compiler Command Parser
A parser to extract include directories, defines, arguments from a compiler's command line invocation and its built-in configuration.

&nbsp;&nbsp;&nbsp;&nbsp;**This is work in progress as long you read this message -- be prepared for heavy API changes**

## TODO
* More documentation
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
```
CoCoPa - Compiler Command Parser, a Parser to extract include directories,
defines, arguments and more from compiler command line invocations.

Copyright (C) 2020 Uli Franke - Elektronik Workshop

All rights reserved.

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
