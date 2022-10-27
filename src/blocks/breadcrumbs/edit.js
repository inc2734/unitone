import { useBlockProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';

import ServerSideRender from '@wordpress/server-side-render';

export default function ( { attributes } ) {
	return (
		<div { ...useBlockProps() }>
			<Disabled>
				<ServerSideRender
					block="unitone/breadcrumbs"
					attributes={ attributes }
				/>
			</Disabled>
		</div>
	);
}
