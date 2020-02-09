# cocopa - Compiler Command Parser
A parser to extract include directories, defines, arguments from compiler command line invokations and can extract the compiler's built-in configuration.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**This is work in progress as long you read this message - be prepared for heavy API changes**

## TODO
* Test compiler built-in extraction separately since not everybody has the exact same compiler on its system even on my system this will break as soon as arduino board packages update.  
  
* More documentation
* Make it more generic, i.e. move Arduino/IntelliSense stuff into a separate layer
  * :heavy_check_mark: move .ino file match out
  * :white_check_mark: Runner::processResults
* `npm run clean` script to clean up lib -> add to preXY to clean up before making packages
* :white_check_mark: Tool to generate stimulus and response JSON
* From vscode-arduino IntelliSense-branch:
  * :white_check_mark: X-platform support
  * :white_check_mark: Merging of parsing result and existing file content
  * :white_check_mark: Handling inexistent files and folders
  * :white_check_mark: Write configuration on change only
  * :white_check_mark: Option to backup old configurations?
  * Unit testing:
    * :heavy_check_mark: Use mocked gcc to test built-in info parser and test if it generates a valid list
    * :heavy_check_mark: Test parser for compiler built-in info 
    * :white_check_mark: Throwing arbitrary data at parser engines
    * :white_check_mark: JSON input
    * :white_check_mark: JSON output
    * :white_check_mark: Configuration merging

## Publishing
```bash
# patch, minor, major, prepatch, preminor, premajor, prerelease
npm version patch 
npm publish
```

## References
* [TypeScript package how-to](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)
