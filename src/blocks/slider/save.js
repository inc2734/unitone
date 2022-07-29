import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					style: {},
					'data-unitone-layout': classnames( 'slider', {} ),
				} )
			) }
		/>
	);
}
