/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */
import {Result} from "./Result";
import {CCppPropertiesConfigurationResult} from "./CCppPropertiesConfigurationResult";
import {CCppPropertiesContent} from "./CCppPropertiesContent";
import {
    CCppPropertiesISMode,
    CCppPropertiesCStandard,
    CCppPropertiesCppStandard,
} from "./CCppPropertiesConfiguration";

export class CCppPropertiesContentResult extends CCppPropertiesContent {
    constructor(
        result: Result,
        name: string = "",
        isMode: CCppPropertiesISMode = CCppPropertiesISMode.None,
        cStandard: CCppPropertiesCStandard = CCppPropertiesCStandard.None,
        cppStandard: CCppPropertiesCppStandard = CCppPropertiesCppStandard.None,
        forcedInclude: string[] = [],
    ) {
        const c = new CCppPropertiesConfigurationResult(
            result,
            name,
            isMode,
            cStandard,
            cppStandard,
            forcedInclude,
        );
        super([c]);
    }
}
