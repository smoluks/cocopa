
import { Result } from './Result';
import { BuiltInInfoParser } from './BuiltInInfoParser';

/**
 * Base class for any compiler command parser engine.
 * If someone needs to write an engine: this is the base class.
 * For further inspiration take a look at the implementation of
 * CompilerCmdParserEngineGcc.
 */
export abstract class Parser {
    /**
     * This array should contain the patterns which should match on
     * a valid compiler command line to identify the compiler command.
     * To be set by the derived class.
     *
     * For performance reasons: place easy to test and frequent tests
     * first and rare/expensive cases last for better performance.
     */
    private _match: (string | RegExp)[];
    /**
     * This array should contain the patterns which should _NOT_
     * match on a valid compiler command line to identify the
     * compiler command.
     * To be set by the derived class.
     *
     * For performance reasons: place easy to test and frequent tests
     * first and rare/expensive cases last for better performance.
     */
    private _dontMatch: (string | RegExp)[];
    /**
     * 
     */
    protected _infoParser: BuiltInInfoParser | undefined;

    public get infoParser(): BuiltInInfoParser | undefined
    {
        return this._infoParser;
    }

    /**
     * 
     * @param match 
     * @param dontMatch 
     * @param infoParser 
     */
    constructor (match: (string | RegExp)[],
                 dontMatch: (string | RegExp)[],
                 infoParser?: BuiltInInfoParser | undefined)
    {
        this._match = match;
        this._dontMatch = dontMatch;
        this._infoParser = infoParser;
    }
    /**
     * The parsing function of a matched compiler command line.
     * If all conditions hold true (all _match are found and all _nomatch
     * are not found), this parsing function is invoked.
     *
     * Here the derived class has to implement its parsing magic
     * to extract the desired includes, defines, compiler flags
     * and the compiler command.
     *
     * @param line A string containing a compiler command line candidate.
     * @returns A valid parsing result in case parsing was successful
     * and undefined in case it failed fatally.
     */
    protected abstract parse(line: string): Result;
    /**
     * This function checks if the command line matches the
     * requirements given through _match and _nomatch and invokes
     * the parse function in case of a match.
     * @returns If match was found and parsing was successful
     * it returns the result else undefined.
     */
    public match(line: string): Result | undefined
    {
        // check search queries that must match
        for (const re of this._match) {
            if (line.search(re) === -1) {
                return undefined;
            }
        }

        // check search queries that mustn't match
        for (const re of this._dontMatch) {
            if (line.search(re) !== -1) {
                return undefined;
            }
        }

        const res = this.parse(line);

        // if parsing was successful, we have an info parser and it
        // is enabled: try to get compiler built-in info and append
        // it to the parsing results
        if (this._infoParser && this._infoParser.enabled &&
            res && res.compiler.length)
        {
            const nfo = this._infoParser.info(res.compiler);
            if (nfo) {
                res.includes = [... res.includes, ... nfo.includes];
                res.defines  = [... res.defines,  ... nfo.defines ];
            }
        }

        return res;
    }
}
