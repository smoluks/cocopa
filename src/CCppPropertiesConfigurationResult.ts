/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */
import {Result, ResultCppStandard} from "./Result";
import {
    CCppPropertiesConfiguration,
    CCppPropertiesISMode,
    CCppPropertiesCStandard,
    CCppPropertiesCppStandard,
} from "./CCppPropertiesConfiguration";

/** Maps the result C++ standard to the c_cpp_properties C++ standard. */
const result2PropertiesCppStandard = new Map<
    ResultCppStandard,
    CCppPropertiesCppStandard
>([
    [ResultCppStandard.Cpp98, CCppPropertiesCppStandard.Cpp98],
    [ResultCppStandard.Cpp11, CCppPropertiesCppStandard.Cpp11],
    [ResultCppStandard.Cpp14, CCppPropertiesCppStandard.Cpp14],
    [ResultCppStandard.Cpp17, CCppPropertiesCppStandard.Cpp17],
    [ResultCppStandard.Cpp20, CCppPropertiesCppStandard.Cpp20],
]);

export class CCppPropertiesConfigurationResult extends CCppPropertiesConfiguration {
    constructor(
        result: Result,
        name: string = "",
        isMode: CCppPropertiesISMode = CCppPropertiesISMode.None,
        cStandard: CCppPropertiesCStandard = CCppPropertiesCStandard.None,
        cppStandard: CCppPropertiesCppStandard = CCppPropertiesCppStandard.None,
        forcedInclude: string[] = [],
    ) {
        const std = result2PropertiesCppStandard.get(result.cppStandard);
        if (std) {
            cppStandard = std;
        }
        super(
            result.compiler,
            result.options,
            result.includes,
            result.defines,
            name,
            isMode,
            cStandard,
            cppStandard,
            forcedInclude,
        );
    }
}
