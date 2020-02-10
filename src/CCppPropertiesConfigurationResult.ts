import {Result} from "./Result";
import {
    CCppPropertiesConfiguration,
    CCppPropertiesISMode,
    CCppPropertiesCStandard,
    CCppPropertiesCppStandard,
} from "./CCppPropertiesConfiguration";

export class CCppPropertiesConfigurationResult extends CCppPropertiesConfiguration {
    constructor(
        result: Result,
        name: string = "",
        isMode: CCppPropertiesISMode = CCppPropertiesISMode.None,
        cStandard: CCppPropertiesCStandard = CCppPropertiesCStandard.None,
        cppStandard: CCppPropertiesCppStandard = CCppPropertiesCppStandard.None,
        forcedInclude: string[] = [],
    ) {
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
