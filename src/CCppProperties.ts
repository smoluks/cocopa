import * as fs from 'fs';
import * as path from 'path';

import { CCppPropertiesContent, CCppPropertiesMergeMode } from './CCppPropertiesContent';
import { CCppPropertiesConfiguration } from '.';

export class CCppProperties {
  private _content: CCppPropertiesContent | undefined = undefined;
  private _changed: boolean = false;

  public get content(): CCppPropertiesContent | undefined {
    return this._content;
  }

  public get changed() {
    return this._changed;
  }

  public read(pPath: string) {
    if (!fs.existsSync(pPath)) {
      return false;
    }
    const propFileContentPlain = fs.readFileSync(pPath, 'utf8');
    // NOTE: in JSON backslashes are escaped to \\\\
    const loadedProps = JSON.parse(propFileContentPlain) as CCppPropertiesContent;

    // make sure everything is defined

    if (!loadedProps) {
      return false;
    }

    this._content = new CCppPropertiesContent();
    this._content.copyInto(loadedProps);
    this._changed = false;

    return true;
  }

  public merge(properties: CCppPropertiesContent, mode: CCppPropertiesMergeMode) {
    // if no previous properties have been loaded, merging
    // is trivial for all merge modes
    if (!this._content) {
      this._content = properties;
      this._changed = true;
      return true;
    }

    // empty names will be dropped
    this._changed = this._content.merge(properties, mode);

    return this._changed;
  }

  public write(pPath: string) {
    // NOTE: in JSON backslashes are escaped to \\\\
    // TODO:
    //  * write file only if modified
    if (this._content && this._changed) {
      // create properties folder in case it does not exist
      const propFolder = path.dirname(pPath);
      if (!fs.existsSync(propFolder)) {
        fs.mkdirSync(propFolder, { recursive: true });
      }

      // erase empty elements ("" and []) to keep JSON clean?

      const content = JSON.stringify(this._content, null, 4);
      fs.writeFileSync(pPath, content);

      this._changed = false;
      return true;
    }
    return false;
  }
}
