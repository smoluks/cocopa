import { spawnSync } from 'child_process';

/**
 * Classes of this type query compilers about their built-in
 * include paths, defines and so on.
 */
export abstract class BuiltInInfoParser
{
    private _enabled: boolean = true;

    public set enabled(e: boolean) {
        this._enabled = e;
    }
    public get enabled() {
        return this._enabled;
    }

    public abstract info(executable: string): { includes: string[]; defines: string[] } | undefined;

    /**
     * Runs a query command on the system.
     * @param cmd Command to run
     * @param args Command arguments
     * @returns The query command's result strings of stdout and stderr on success, else undefined.
     */
    protected runQuery(cmd: string, args: string[]): { stdout: string; stderr: string } | undefined {
        const child = spawnSync(cmd, args, { encoding: 'utf8' });
        if (child.error || child.status !== 0) {
            return undefined;
        }
        return {
            stdout: child.stdout,
            stderr: child.stderr,
        };
    }
}
