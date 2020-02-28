/* CoCoPa - Compiler Command Parser, a Parser to extract include directories,
 * defines, arguments and more from compiler command line invocations.
 *
 * Copyright (C) 2020 Uli Franke - Elektronik Workshop
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
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
import {Result, ResultCppStandard} from "./Result";
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
    ResultCppStandard,
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
