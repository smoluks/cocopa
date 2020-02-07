
import * as fs from "fs";

import { Result } from "./Result";
import { CCppPropertiesContent } from "./CCppPropertiesContent";

export class CCppProperties {
    proppath: string;
    propFileContent: CCppPropertiesContent | undefined;
    constructor(proppath: string) {
        this.proppath = proppath;
        this.propFileContent = undefined;
    }
    public read() {
        if (!fs.existsSync(this.proppath)) {
            return;
        }
        const propFileContentPlain = fs.readFileSync(this.proppath, "utf8");
        // NOTE: in JSON backslashes are escaped to \\\\
        this.propFileContent = JSON.parse(propFileContentPlain) as CCppPropertiesContent;
    }
    public merge(result: Result) {
        const pc = new CCppPropertiesContent(result);
        // TODO:
        //  * merge with existing configuration if desired
        //  * check if contents changed after merging
        //
        this.propFileContent = pc;
    }
    public write() {
        // NOTE: in JSON backslashes are escaped to \\\\
        // TODO:
        //  * check if path exists, create if necessary
        //  * write file only if modified
        if (this.propFileContent) {
            const content = JSON.stringify(this.propFileContent, null, 4);
            fs.writeFileSync(this.proppath, content);
        }
    }
}
