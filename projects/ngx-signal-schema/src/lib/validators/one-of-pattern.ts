/**
 * Escapes special characters in a string to make it safe for use within a Regular Expression.
 *
 * @param value - The raw string to be escaped.
 * @returns The escaped string.
 *
 * @deprecated This function was exported by mistake and will become internal in the next major release (v2). Do not use it directly.
 * @category deprecated
 */
function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a Regular Expression that matches any of the provided values.
 *
 * @example
 * oneOfPattern(['png', 'jpg'], { exact: true }); // returns /^(?:png|jpg)$/i
 *
 * @param values - A single string or an array of strings to match against.
 * @param options - Configuration options for the pattern generation.
 * @param options.exact - If true (default), the pattern will match the entire string.
 * @param options.caseInsensitive - If true (default), the pattern will ignore case.
 * @param options.wildcard - If true, '*' in values will be treated as '.*' (e.g., 'image/*' becomes 'image/.*').
 * @returns A RegExp object representing the combined pattern.
 *
 * @internal
 * @deprecated This function was exported by mistake and will become internal in the next major release (v2). Do not use it directly.
 * @category deprecated
 */
export function oneOfPattern(
  values: string | readonly string[],
  options?: {
    /**
     * If true (default), the pattern will match the entire string.
     */
    exact?: boolean;
    /**
     * If true (default), the pattern will be case-insensitive.
     */
    caseInsensitive?: boolean;
    /**
     * If true, '*' in values will be treated as '.*' (wildcard).
     */
    wildcard?: boolean;
  },
): RegExp {
  const {
    exact = true,
    caseInsensitive = true,
    wildcard = false,
  } = options ?? {};

  const patterns = [values]
    .flat()
    .map(value => {
      const escaped = escapeRegExp(value);

      return wildcard
        ? escaped.replaceAll('\\*', '.*')
        : escaped;
    });

  const body = patterns.join('|');

  return new RegExp(
    exact ? `^(?:${body})$` : `(?:${body})`,
    caseInsensitive ? 'i' : undefined,
  );
}
