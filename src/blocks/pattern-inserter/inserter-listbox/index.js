/**
 * @see https://github.com/WordPress/gutenberg/blob/7cf62f7e55edab0386f01795f7217c9dc06ba032/packages/block-editor/src/components/inserter-listbox/index.js
 */

/**
 * WordPress dependencies
 */
import { Composite } from '@wordpress/components';

/**
 * Internal dependencies
 */
export { default as InserterListboxGroup } from './group';
export { default as InserterListboxRow } from './row';
export { default as InserterListboxItem } from './item';

function InserterListbox( { children } ) {
	return (
		<Composite focusShift focusWrap="horizontal" render={ <></> }>
			{ children }
		</Composite>
	);
}

export default InserterListbox;
