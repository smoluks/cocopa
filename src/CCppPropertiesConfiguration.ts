export enum CCppPropertiesISMode {
  None = '',
  Gcc_X64 = 'gcc-x64',
}

export enum CCppPropertiesCStandard {
  None = '',
  C99 = 'c99',
  C11 = 'c11',
}

export enum CCppPropertiesCppStandard {
  None = '',
  Cpp98 = 'c++98',
  Cpp11 = 'c++11',
  Cpp14 = 'c++14',
  Cpp17 = 'c++17',
}

/**
 * Base class representing the contents of the IntelliSense
 * c_cpp_properties.json configuration file.
 *
 * @see https://code.visualstudio.com/docs/cpp/c-cpp-properties-schema-reference
 */
export class CCppPropertiesConfiguration {
  // Note: Member names must not be changed since they represent
  // JSON field names
  name: string;
  compilerPath: string;
  compilerArgs: string[];
  intelliSenseMode: string;
  includePath: string[];
  forcedInclude: string[];
  cStandard: string;
  cppStandard: string;
  defines: string[];

  constructor(
    compilerPath: string = '',
    compilerArgs: string[] = [],
    includePath: string[] = [],
    defines: string[] = [],
    name: string = '',
    isMode: CCppPropertiesISMode = CCppPropertiesISMode.None,
    cStandard: CCppPropertiesCStandard = CCppPropertiesCStandard.None,
    cppStandard: CCppPropertiesCppStandard = CCppPropertiesCppStandard.None,
    forcedInclude: string[] = [],
  ) {
    this.name = name;
    this.compilerPath = compilerPath;
    this.compilerArgs = compilerArgs;
    this.intelliSenseMode = isMode;
    this.includePath = includePath;
    this.forcedInclude = forcedInclude;
    this.cStandard = cStandard;
    this.cppStandard = cppStandard;
    this.defines = defines;
  }
}
