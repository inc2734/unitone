/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/template-part/edit/utils/create-template-part-id.js
 */

/**
 * Generates a template part Id based on slug and theme inputs.
 *
 * @param {string} theme the template part's theme.
 * @param {string} slug  the template part's slug
 * @return {string|null} the template part's Id.
 */
export function createTemplatePartId( theme, slug ) {
	return theme && slug ? theme + '//' + slug : null;
}
