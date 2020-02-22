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
import {
    arraysEqual,
    getTriggerFor,
    getTriggerForArduinoGcc,
    IParserTrigger,
    lineSplitRegEx,
    TriggerTarget,
    regExEscape,
    removeDuplicatesFrom,
} from "./helpers";
import {Parser} from "./Parser";
import {Runner} from "./Runner";
import {Result} from "./Result";
import {ParserGcc} from "./ParserGcc";
import {CCppProperties} from "./CCppProperties";
import {
    CCppPropertiesContent,
    CCppPropertiesMergeMode,
} from "./CCppPropertiesContent";
import {CCppPropertiesContentResult} from "./CCppPropertiesContentResult";
import {
    CCppPropertiesConfiguration,
    CCppPropertiesISMode,
    CCppPropertiesCStandard,
    CCppPropertiesCppStandard,
} from "./CCppPropertiesConfiguration";
import {CCppPropertiesConfigurationResult} from "./CCppPropertiesConfigurationResult";

export {
    Runner,
    Result,
    Parser,
    ParserGcc,
    CCppProperties,
    CCppPropertiesContent,
    CCppPropertiesContentResult,
    CCppPropertiesConfiguration,
    CCppPropertiesConfigurationResult,
    CCppPropertiesISMode,
    CCppPropertiesCStandard,
    CCppPropertiesCppStandard,
    CCppPropertiesMergeMode,
    arraysEqual,
    IParserTrigger,
    getTriggerFor,
    getTriggerForArduinoGcc,
    TriggerTarget,
    lineSplitRegEx,
    regExEscape,
    removeDuplicatesFrom,
};
