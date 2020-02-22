/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
