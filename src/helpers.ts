/**
 * Escape a string such that it can be used within regular expressions.
 *
 * @param s String to be escaped.
 * @see https://stackoverflow.com/a/3561711
 */
export function regExEscape(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function removeDuplicatesFrom<T>(a: T[]) {
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }
    return a;
}

export function arraysEqual<T>(a: T[], b: T[]) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
