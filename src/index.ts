
import { Parser } from './Parser';
import { Runner } from './Runner';
import { Result } from './Result';
import { ParserGcc } from './ParserGcc';
import { CCppProperties } from './CCppProperties';
import { CCppPropertiesContent } from './CCppPropertiesContent';
import { CCppPropertiesConfiguration } from './CCppPropertiesConfiguration';

export { Runner, Result, Parser, ParserGcc, CCppProperties, CCppPropertiesContent, CCppPropertiesConfiguration };

/**
 * Escape a string such that it can be used within regular expressions.
 * 
 * @param s String to be escaped.
 * @see https://stackoverflow.com/a/3561711 <-
 * @see https://stackoverflow.com/a/6969486
 */
export function regExEscape(s: string)
{
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
