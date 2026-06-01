import clsx from 'clsx';

import { useBlockProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { type, direction, size } = attributes;

	return (
		<div
			{ ...useBlockProps.save( {
				'data-unitone-layout': 'divider-wrapper',
			} ) }
		>
			<div
				data-unitone-layout={ clsx(
					'divider',
					type && `-type:${ type }`,
					direction && `-direction:${ direction }`
				) }
				style={ {
					'--unitone--divider-size': size || undefined,
				} }
			/>
		</div>
	);
}
