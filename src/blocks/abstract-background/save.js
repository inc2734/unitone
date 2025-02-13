import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { src } = attributes;

	const blockProps = useBlockProps.save( {
		className: clsx( 'unitone-abstract-background', {
			[ `unitone-abstract-background--src:${ src }` ]: !! src,
		} ),
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'unitone-abstract-background__body',
	} );

	return (
		<div { ...blockProps }>
			<div className="unitone-abstract-background__filter"></div>
			<div { ...innerBlocksProps } />
		</div>
	);
}
