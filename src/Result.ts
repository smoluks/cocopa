
/** Data structure carrying the output from a parsed compiler command.
 * All compiler specific option prefixes are removed for includes and
 * defines.
 */
export class Result
{
    includes: string[] = [];
    defines: string[] = [];
    options: string[] = [];
    compiler: string = "";
    /** Dropped arguments like -c -Ox -o, the input and output file. */
    trash: string[] = [];
}
