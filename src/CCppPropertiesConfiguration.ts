import { Result } from "./Result";
/** Class representing the contents of the IntelliSense
 * c_cpp_properties.json configuration file.
 *
 * @see https://code.visualstudio.com/docs/cpp/c-cpp-properties-schema-reference
 */
export class CCppPropertiesConfiguration {
    name: string = "Arduino";
    compilerPath: string = "";
    compilerArgs: string[] = [];
    intelliSenseMode: string = "gcc-x64"; // since we're using arduino's compiler
    includePath: string[] = [];
    forcedInclude: string[] = [];
    cStandard: string = "c11";
    cppStandard: string = "c++11"; // as of 1.8.11 arduino is on C++11
    defines: string[] = [];
    constructor(result: Result) {
        this.compilerPath = result.compiler;
        this.compilerArgs = result.options;
        this.includePath = result.includes;
        this.defines = result.defines;
    }
}
