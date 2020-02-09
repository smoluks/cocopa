
import { CCppPropertiesConfiguration } from './CCppPropertiesConfiguration';

export class CCppPropertiesContent
{
    configurations: CCppPropertiesConfiguration[];
    constructor(configurations: CCppPropertiesConfiguration[] = [])
    {
        this.configurations = configurations;
    }
}

