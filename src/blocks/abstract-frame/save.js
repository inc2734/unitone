import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { src } = attributes;

	const blockProps = useBlockProps.save( {
		className: clsx( 'unitone-abstract-frame', {
			[ `unitone-abstract-frame--src:${ src }` ]: !! src,
		} ),
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'unitone-abstract-frame__body',
	} );

	return (
		<div { ...blockProps }>
			<div className="unitone-abstract-frame__filter"></div>
			<div { ...innerBlocksProps } />
		</div>
	);
}
