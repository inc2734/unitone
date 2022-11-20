/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/utils.js
 */

import { pickBy, isEmpty, isObject, mapValues } from 'lodash';

export function cleanEmptyObject( object ) {
	if ( ! isObject( object ) || Array.isArray( object ) ) {
		return object;
	}
	const cleanedNestedObjects = pickBy(
		mapValues( object, cleanEmptyObject ),
		( value ) => {
			return (
				undefined !== value &&
				null !== value &&
				false !== value &&
				'' !== value
			);
		}
	);
	return isEmpty( cleanedNestedObjects ) ? undefined : cleanedNestedObjects;
}
