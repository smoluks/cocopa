import { spawnSync } from 'child_process';
import { Result } from './Result';
import { Parser } from './Parser';

import * as path from 'path';

/** Compiler command parsing engine for gcc compilers.
 *
 *
 */
export class ParserGcc extends Parser {
  constructor(sketch: string) {
    super();
    // TODO: windows and osx variants
    this._nomatch = [
      // make sure Arduino's not testing libraries
      /-o\s\/dev\/null/,
    ];
    this._match = [
      // make sure we're running g++
      /-g\+\+\s+/,
      // make sure we're compiling
      /\s+-c\s+/,
      // check if we're compiling the main sketch
      path.basename(sketch) + '.cpp.o',
    ];
  }
  protected parse(line: string): Result {
    const result = new Result();
    const args = line.split(/\s+/);
    for (let arg of args) {
      // drop empty arguments
      if (!arg.length) {
        continue;
      }
      // TODO:
      //   -U__STRICT_ANSI__ ?
      // unpack quoted elements like
      //
      //   "-DMBEDTLS_CONFIG_FILE=\"mbedtls/esp_config.h\""
      //   "-DARDUINO_BOARD=\"ESP32_DEV\""
      //   "-DARDUINO_VARIANT=\"doitESP32devkitV1\""
      const packed = arg.match(/^"(.+)"$/);
      if (packed) {
        arg = packed[1];
      }
      // extract defines
      const define = arg.match(/^-D(.+)/);
      if (define) {
        result.defines.push(define[1]);
        continue;
      }
      // extract includes
      const include = arg.match(/^-I(.+)/);
      if (include) {
        result.includes.push(include[1]);
        continue;
      }
      // extract the compiler executable
      const c = arg.match(/g\+\+$/);
      if (c) {
        result.compiler = arg;
        continue;
      }
      // filter out option trash
      const t = arg.match(/^-o|^-O|^-g|^-c|cpp(?:\.o){0,1}$/);
      if (t) {
        result.trash.push(arg);
        continue;
      }
      // collect options
      const o = arg.match(/^-/);
      if (o) {
        result.options.push(arg);
        continue;
      }
      // collect the rest
      result.trash.push(arg);
    }
    // Query compiler for intrinsic/built-in include paths
    if (result.compiler.length > 0) {
      // TODO: Windows
      // Spawn synchronous child process and run bash command
      // Source: https://stackoverflow.com/a/6666338
      const compilerinfocmd = `${result.compiler} -xc++ -E -v - < /dev/null 2>&1`;
      const child = spawnSync('bash', ['-c', compilerinfocmd], { encoding: 'utf8' });
      if (child.error || child.status !== 0) {
        // TODO: report the execution failure
      } else {
        // Now we look for
        //
        //   #include "..." search starts here:
        //   #include <...> search starts here:
        //      ...(include directories list)...
        //   End of search list.
        //
        // and extract the include directory list. Could be that some gcc
        // even lists something under
        //
        //   #include "..." search starts here:
        //
        // but I havn't seen it so far.
        const includeregex = /^#include\s+<\.\.\.>\ssearch\sstarts\shere\:$(.+)^End\sof\ssearch\slist\.$/ms;
        const match = child.stdout.match(includeregex);
        if (match) {
          // Split list by newlines. Should be platform independent
          let lines = match[1].split(/\s*(?:\r|\r\n|\n)\s*/);
          // Filter out empty elements (in most cases only the last element)
          lines = lines.filter((val: string) => {
            return val !== '';
          });
          // Add built-in includes to command line includes
          result.includes = [...result.includes, ...lines];
        } else {
          // TODO: issue info that include section has not been found
        }
      }
    }
    return result;
  }
}
