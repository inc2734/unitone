import { pick } from 'lodash';

import apiFetch from '@wordpress/api-fetch';

import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

export default function ( { settings } ) {
	const [ remotePatternsSaving, setRemotePatternsSaving ] = useState( false );

	const resetRemotePattenrsCache = () => {
		setRemotePatternsSaving( true );
		apiFetch( {
			path: '/unitone/v1/remote-block-patterns',
			method: 'DELETE',
			data: pick( settings, 'license-key' ),
		} ).then( () => {
			setRemotePatternsSaving( false );
		} );
	};

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ {
				'--unitone--background-color': 'white',
			} }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'Pattern Library', 'unitone' ) }</h2>
				<div
					data-unitone-layout="stack -divider:stripe -gap:2"
					style={ {
						'--unitone--divider-color':
							'var(--unitone--color--light-gray)',
					} }
				>
					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ {
							'--unitone--sidebar-width': '20em',
						} }
					>
						<div>
							<h3>{ __( 'Cache', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<p>
								<span
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: %1$s: <a>, %2$s: </a>
											__(
												'If the license key is valid, patterns from %1$sthe pattern library%2$s can be used.',
												'unitone'
											),
											'<a href="https://unitone.2inc.org/unitone-patterns/" target="_blank">',
											'</a>'
										),
									} }
								/>
								{ __(
									'Pattern data retrieved from the pattern library is cached for a certain period of time to speed up operation, so new patterns may not be reflected immediately.',
									'unitone'
								) }
								{ __(
									'To force reacquisition of the latest pattern data, click the button below.',
									'unitone'
								) }
							</p>

							<div>
								<Button
									variant="primary"
									onClick={ resetRemotePattenrsCache }
									disabled={ remotePatternsSaving }
								>
									{ __(
										'Retrieve patterns from the pattern library',
										'unitone'
									) }
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
