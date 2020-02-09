
import * as fs from 'fs';
import * as path from 'path';

import { CCppPropertiesContent } from './CCppPropertiesContent';

export class CCppProperties
{
    private _content: CCppPropertiesContent | undefined = undefined;
    private _changed: boolean = false;

    public get content(): CCppPropertiesContent | undefined
    {
        return this._content;
    }

    public get changed()
    {
        return this._changed;
    }

    public read(pPath: string)
    {
        if (!fs.existsSync(pPath)) {
            return false;
        }
        const propFileContentPlain = fs.readFileSync(pPath, 'utf8');
        // NOTE: in JSON backslashes are escaped to \\\\
        this._content = JSON.parse(propFileContentPlain) as CCppPropertiesContent;
        this._changed = false;
        return true;
    }
    public merge(properties: CCppPropertiesContent)
    {
        // TODO:
        //  * merge with existing configuration if desired
        //  * check if contents changed after merging
        //
        this._changed = true;
        this._content = properties;
        
        return this._changed;
    }
    public write(pPath: string)
    {
        // NOTE: in JSON backslashes are escaped to \\\\
        // TODO:
        //  * write file only if modified
        if (this._content && this._changed) {

            // create properties folder in case it does not exist
            const propFolder = path.dirname(pPath);
            if (!fs.existsSync(propFolder)) {
                fs.mkdirSync(propFolder, {recursive: true});
            }

            const content = JSON.stringify(this._content, null, 4);
            fs.writeFileSync(pPath, content);

            this._changed = false;
            return true;
        }
        return false
    }
}
