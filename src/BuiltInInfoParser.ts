/**
 * Return value of any BuiltInInfoParser.
 * Contains the includes and other data which are intrinsically
 * known to the compiler without having to specify them explicitly
 * as includes etc. on the command line.
 */
export interface IBuiltInInfo {
    includes: string[];
    defines: string[]
}

/**
 * Classes of this type query compilers about their built-in
 * include paths, defines and so on.
 */
export abstract class BuiltInInfoParser {
    private _enabled: boolean = true;

    public set enabled(e: boolean) {
        this._enabled = e;
    }
    public get enabled() {
        return this._enabled;
    }

    public abstract info(executable: string): IBuiltInInfo | undefined;
}
