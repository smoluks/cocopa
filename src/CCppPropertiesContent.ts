import { CCppPropertiesConfiguration } from './CCppPropertiesConfiguration';
import { removeDuplicatesFrom, arraysEqual } from './helpers';

export enum CCppPropertiesMergeMode {
  /**
   * Completey erase target and overwrite it with source
   */
  Replace,
  /**
   * Overwrite configurations with the same name, insert others
   */
  ReplaceSameNames,
  /**
   * Overwrite skalar parameters within configurations of the same name
   * if the source parameter is not empty. Array parameters are merged
   * with duplicates removed.
   */
  Complement,
}

/**
 * Base class representing the top level content of the IntelliSense
 * c_cpp_properties.json configuration file,
 *
 * @see https://code.visualstudio.com/docs/cpp/c-cpp-properties-schema-reference
 *
 * **NOTE**
 *
 *  > Do not add members other than outlined in the document above for the top
 *    level c_cpp_properties since this class will be serialized to JSON.
 */
export class CCppPropertiesContent {
  /* not yet implemented
   *
   *   "env": {
   *       "myDefaultIncludePath": ["${workspaceFolder}", "${workspaceFolder}/include"],
   *       "myCompilerPath": "/usr/local/bin/gcc-7"
   *   }
   */

  configurations: CCppPropertiesConfiguration[];

  constructor(configurations: CCppPropertiesConfiguration[] = []) {
    this.configurations = configurations;
  }

  /**
   * Merge two c_cpp_properties to one.
   *
   * Configurations with empty names will be dropped
   *
   * @param other Content to be merged into this instance.
   * @returns true if orignal has been altered.
   */
  public merge(other: CCppPropertiesContent, mode: CCppPropertiesMergeMode) {
    let modified = false;

    if (mode === CCppPropertiesMergeMode.Replace) {
      if (this.configurations.length !== other.configurations.length) {
        modified = true;
      } else {
        // TODO: no one quarantees same order - how stringent do we like to be?
        for (let i = 0; i < this.configurations.length; i++) {
          if (!this.configurations[i].equals(other.configurations[i])) {
            modified = true;
            break;
          }
        }
      }
      if (modified) {
        this.configurations = other.configurations;
      }
      return modified;
    }

    for (const otherConf of other.configurations) {
      // We don't allow empty names
      if (!otherConf.name.length) {
        continue;
      }

      const idx = this.configurations.findIndex(e => e.name === otherConf.name);
      if (idx === -1) {
        this.configurations.push(otherConf);
        modified = true;
        continue;
      }

      const conf = this.configurations[idx];

      if (mode === CCppPropertiesMergeMode.ReplaceSameNames) {
        if (!conf.equals(otherConf)) {
          this.configurations.splice(idx, 1, otherConf);
          modified = true;
        }
        continue;
      }

      /* Implicit CCppPropertiesMergeMode.Complement
       *
       * -> replace scalar values if other is set
       * -> merge arrays, removing duplicates
       *
       * We don't have to check names since they are equal
       * when we're here
       *
       */

      const skalars = [
        [conf.compilerPath, otherConf.compilerPath],
        [conf.intelliSenseMode, otherConf.intelliSenseMode],
        [conf.cStandard, otherConf.cStandard],
        [conf.cppStandard, otherConf.cppStandard],
      ];
      const arrays = [
        [conf.compilerArgs, otherConf.compilerArgs],
        [conf.includePath, otherConf.includePath],
        [conf.forcedInclude, otherConf.forcedInclude],
        [conf.defines, otherConf.defines],
      ];
      skalars.forEach(([l, r]) => {
        if (r.length && r !== l) {
          l = r;
          modified = true;
        }
      });
      arrays.forEach(([l, r]) => {
        if (r.length && !arraysEqual(r, l)) {
          if (l.length) {
            l = [...l, ...r];
            removeDuplicatesFrom(l);
          } else {
            l = r;
          }
          modified = true;
        }
      });
    }

    return modified;
  }

  public copyInto(other: CCppPropertiesContent) {
    if (!other.configurations) {
      this.configurations = [];
      return;
    }

    for (const c of other.configurations) {
      const good = new CCppPropertiesConfiguration();
      good.copyInto(c);
      this.configurations.push(good);
    }
  }
}
