import { Button, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { published, Icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { BACKGROUNDS } from '../../../../../../src/blocks/abstract-background/constant';

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const saveSettings = () => {
		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'generated-featured-image-aspect-ratio':
					settings?.[ 'generated-featured-image-aspect-ratio' ] ??
					null,
				'generated-thumbnail-background':
					settings?.[ 'generated-thumbnail-background' ] ?? null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( true );
		setSettings( {
			...settings,
			'generated-featured-image-aspect-ratio':
				defaultSettings[ 'generated-featured-image-aspect-ratio' ],
			'generated-thumbnail-background':
				defaultSettings[ 'generated-thumbnail-background' ],
		} );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'generated-featured-image-aspect-ratio': null,
				'generated-thumbnail-background': null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ {
				'--unitone--background-color': 'white',
				'--unitone--color': '#111',
			} }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'Generated Thumbnail', 'unitone' ) }</h2>
				<div
					data-unitone-layout="stack -divider:stripe -gap:2"
					style={ {
						'--unitone--divider-color':
							'var(--unitone--color--light-gray)',
					} }
				>
					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ { '--unitone--sidebar-width': '20em' } }
					>
						<div data-unitone-layout="stack">
							<h3>{ __( 'Featured Image', 'unitone' ) }</h3>
						</div>
						<div>
							<SelectControl
								__nextHasNoMarginBottom
								label={ __( 'Aspect Ratio', 'unitone' ) }
								help={ __(
									'The aspect ratio for featured images generated based on post title.',
									'unitone'
								) }
								value={
									settings?.[
										'generated-featured-image-aspect-ratio'
									]
								}
								options={ [
									{ label: '4:3', value: '4:3' },
									{ label: '16:9', value: '16:9' },
								] }
								onChange={ ( newSetting ) => {
									setSettings( {
										...settings,
										'generated-featured-image-aspect-ratio':
											newSetting,
									} );
								} }
							/>
						</div>
					</div>

					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ { '--unitone--sidebar-width': '20em' } }
					>
						<div data-unitone-layout="stack">
							<h3>{ __( 'Background', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<div data-unitone-layout="stack -gap:-2">
								<div
									style={ {
										display: 'grid',
										gap: '1rem',
										gridTemplateColumns:
											'repeat(auto-fit, minmax(160px, 1fr))',
									} }
								>
									{ [
										{
											label: __( 'Default', 'unitone' ),
											value: '',
										},
										...BACKGROUNDS,
									].map( ( background, i ) => (
										<Button
											key={ i }
											onClick={ () =>
												setSettings( {
													...settings,
													'generated-thumbnail-background':
														background.value,
												} )
											}
											style={ {
												position: 'relative',
												display: 'flex',
												height: 'auto',
												padding: 0,
											} }
										>
											{ !! background.src ? (
												<img
													src={ background.src }
													alt={ background.label }
												/>
											) : (
												<div
													aria-label={
														background.label
													}
													style={ {
														backgroundColor: '#eee',
														height: '100%',
														width: '100%',
													} }
												/>
											) }
											{ settings?.[
												'generated-thumbnail-background'
											] === background.value && (
												<div
													style={ {
														position: 'absolute',
														inset: '4px auto auto 4px',
														display: 'flex',
														background: '#000',
														borderRadius: '100%',
													} }
												>
													<Icon
														icon={ published }
														style={ {
															fill: '#47f654',
														} }
													/>
												</div>
											) }
										</Button>
									) ) }
								</div>
							</div>
						</div>
					</div>
				</div>

				<div data-unitone-layout="cluster -gap:-1">
					<Button
						variant="primary"
						onClick={ saveSettings }
						disabled={ settingsSaving }
					>
						{ __( 'Save Settings', 'unitone' ) }
					</Button>

					<Button
						variant="secondary"
						onClick={ resetSettings }
						disabled={ settingsSaving }
					>
						{ __( 'Reset All Settings', 'unitone' ) }
					</Button>
				</div>
			</div>
		</div>
	);
}
