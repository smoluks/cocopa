
import { Result } from './Result';
import { Parser } from './Parser';
import { BuiltInInfoParserGcc } from './BuiltInInfoParserGcc';

/**
 *  Compiler command parsing engine for gcc compilers.
 *
 *
 */
export class ParserGcc extends Parser
{
    /**
     * 
     */
    constructor(matchPattern: (string | RegExp)[] = [],
                dontMatchPattern: (string | RegExp)[] = [])
    {
        super(
            [
                // make sure we're running g++
                /(?:^|-)g\+\+\s+/,
                // make sure we're compiling
                /\s+-c\s+/,
                // user defined match pattern
                ...matchPattern,
            ],
            dontMatchPattern,
            new BuiltInInfoParserGcc(),
        );        
    }
    protected parse(line: string): Result
    {
        const result = new Result();

        for (let arg of line.split(/\s+/)) {

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
            const c = arg.match(/(?:^|-)g\+\+$/);
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

        return result;
    }
}
