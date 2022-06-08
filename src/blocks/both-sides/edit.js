import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'both-sides',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: 'all',
		template: [
			[ 'unitone/both-sides-content' ],
			[ 'unitone/both-sides-content' ],
		],
	} );

	return <div { ...innerBlocksProps } />;
}
