import { Result } from './Result';

/** Base class for any compiler command parser engine.
 * If someone needs to write an engine: this is the base class.
 * For further inspiration take a look at the implementation of
 * CompilerCmdParserEngineGcc.
 */
export abstract class Parser {
  /** This array should contain the patterns which should match on
   * a valid compiler command line to identify the compiler command.
   * To be set by the derived class.
   *
   * For performance reasons: place easy to test and frequent tests
   * first and rare/expensive cases last for better performance.
   */
  protected _match: (string | RegExp)[] = [];
  /** This array should contain the patterns which should _NOT_
   * match on a valid compiler command line to identify the
   * compiler command.
   * To be set by the derived class.
   *
   * For performance reasons: place easy to test and frequent tests
   * first and rare/expensive cases last for better performance.
   */
  protected _nomatch: (string | RegExp)[] = [];
  /** The parsing function of a matched compiler command line.
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
  /** This function checks if the command line matches the
   * requirements given through _match and _nomatch and invokes
   * the parse function in case of a match.
   * @returns If match was found and parsing was successful
   * it returns the result else undefined.
   */
  public match(line: string): Result | undefined {
    // check search queries that must match
    for (const re of this._match) {
      if (line.search(re) === -1) {
        return undefined;
      }
    }
    // check search queries that mustn't match
    for (const re of this._nomatch) {
      if (line.search(re) !== -1) {
        return undefined;
      }
    }
    return this.parse(line);
  }
}
