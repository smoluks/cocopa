# cocopa - Compiler Command Parser
A parser to extract include directories, defines, arguments from compiler command line invokations and can extract the compiler's built-in configuration.

## TODO
* Test compiler built-in extraction separately since not everybody has the exact same compiler on its system even on my system this will break as soon as arduino board packages update.  
  
  Use the generic gcc instead and test if it generates a valid list
* More documentation
* Tool to generate stimulus and response JSON
* Make it more generic, i.e. move Arduino stuff into a separate layer

## Publishing
```bash
# patch, minor, major, prepatch, preminor, premajor, prerelease
npm version patch 
npm publish
```

## References
* [TypeScript package how-to](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)
