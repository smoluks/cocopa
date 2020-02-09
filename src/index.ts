import { Parser } from './Parser';
import { Runner } from './Runner';
import { Result } from './Result';
import { ParserGcc } from './ParserGcc';
import { CCppProperties } from './CCppProperties';
import { CCppPropertiesContent } from './CCppPropertiesContent';
import { CCppPropertiesContentResult } from './CCppPropertiesContentResult';
import {
  CCppPropertiesConfiguration,
  CCppPropertiesISMode,
  CCppPropertiesCStandard,
  CCppPropertiesCppStandard,
} from './CCppPropertiesConfiguration';
import { CCppPropertiesConfigurationResult } from './CCppPropertiesConfigurationResult';

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
};

/**
 * Escape a string such that it can be used within regular expressions.
 *
 * @param s String to be escaped.
 * @see https://stackoverflow.com/a/3561711
 */
export function regExEscape(s: string) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
