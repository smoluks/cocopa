import { CCppPropertiesConfiguration } from './CCppPropertiesConfiguration';
import { Result } from './Result';

export class CCppPropertiesContent {
  configurations: CCppPropertiesConfiguration[];

  constructor(result: Result) {
    this.configurations = [new CCppPropertiesConfiguration(result)];
  }
}
