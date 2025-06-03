import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { viewport } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className: clsx( 'unitone-responsive-switcher-container', [
						`unitone-responsive-switcher-container--${ viewport }`,
					] ),
				} )
			) }
		/>
	);
}
