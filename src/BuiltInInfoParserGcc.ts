import {BuiltInInfoParser} from "./BuiltInInfoParser";

/**
 * @see https://stackoverflow.com/a/6666338
 */
export const BuiltInInfoParserGccCmd = "-xc++ -E -v - < /dev/null 2>&1";

export function makeBuiltInInfoParserGccShellArgs(exe: string) {
    return ["-c", `${exe} ${BuiltInInfoParserGccCmd}`];
}

export function makeBuiltInInfoParserGccShell() {
    return "bash";
}

export class BuiltInInfoParserGcc extends BuiltInInfoParser {
    public info(
        exe: string,
    ): {includes: string[]; defines: string[]} | undefined {
        // TODO: Windows/OSX

        const args = ["-c", `${exe} ${BuiltInInfoParserGccCmd}`];

        const query = this.runQuery(
            makeBuiltInInfoParserGccShell(),
            makeBuiltInInfoParserGccShellArgs(exe),
        );

        if (!query) {
            return undefined;
        }

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

        const match = query.stdout.match(includeregex);
        if (!match) {
            return undefined;
        }

        // Split list by newlines. Should be platform independent
        let lines = match[1].split(/\s*(?:\r|\r\n|\n)\s*/);

        // Filter out empty elements (in most cases only the last element)
        lines = lines.filter((v: string) => {
            return v !== "";
        });

        return {
            includes: lines,
            defines: [],
        };
    }
}
