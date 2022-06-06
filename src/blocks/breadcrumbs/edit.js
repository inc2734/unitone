import { Disabled } from '@wordpress/components';

import ServerSideRender from '@wordpress/server-side-render';

export default function ( { attributes } ) {
	return (
		<Disabled>
			<ServerSideRender
				block="unitone/breadcrumbs"
				attributes={ attributes }
			/>
		</Disabled>
	);
}
