import { Button, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const saveSettings = () => {
		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'enabled-custom-templates':
					settings?.[ 'enabled-custom-templates' ] ?? null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( true );
		setSettings( {
			...settings,
			'enabled-custom-templates':
				defaultSettings[ 'enabled-custom-templates' ],
		} );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'enabled-custom-templates': null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	const customTemplates = settings?.customTemplates ?? [];
	const usingCustomTemplates = settings?.usingCustomTemplates ?? [];
	const enabledCustomTemplates =
		settings?.[ 'enabled-custom-templates' ] ?? [];

	// @todo Wouldn't it be better to get the post type information and generate the array dynamically?
	const customTemplatesForPosts = customTemplates.filter(
		( customTemplate ) => customTemplate.postTypes.includes( 'post' )
	);
	const customTemplatesForPages = customTemplates.filter(
		( customTemplate ) => customTemplate.postTypes.includes( 'page' )
	);
	const customTemplatesForProducts = customTemplates.filter(
		( customTemplate ) => customTemplate.postTypes.includes( 'product' )
	);

	const postTypesWithCustomTemplates = [
		{
			label: __( 'Posts', 'unitone' ),
			customTemplates: customTemplatesForPosts,
		},
		{
			label: __( 'Pages', 'unitone' ),
			customTemplates: customTemplatesForPages,
		},
		{
			label: __( 'Products', 'unitone' ),
			customTemplates: customTemplatesForProducts,
		},
	];

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ { '--unitone--background-color': 'white' } }
		>
			<div data-unitone-layout="stack -gap:2">
				<div data-unitone-layout="stack -gap:-1">
					<h2>{ __( 'Custom Templates', 'unitone' ) }</h2>
					<p style={ { '--unitone--font-size': '-1' } }>
						{ __(
							'Activate the custom template you wish to use. You cannot deactivate a custom template that is already in use.',
							'unitone'
						) }
					</p>
				</div>
				<div
					data-unitone-layout="stack -divider:stripe -gap:2"
					style={ {
						'--unitone--divider-color':
							'var(--unitone--color--light-gray)',
					} }
				>
					{ postTypesWithCustomTemplates.map(
						( postTypeWithCustomTemplates ) =>
							!! postTypeWithCustomTemplates?.customTemplates &&
							0 <
								postTypeWithCustomTemplates?.customTemplates
									?.length && (
								<div
									key={ postTypeWithCustomTemplates.label }
									data-unitone-layout="with-sidebar -sidebar:left"
									style={ {
										'--unitone--sidebar-width': '20em',
									} }
								>
									<div data-unitone-layout="stack">
										<h3>
											{
												postTypeWithCustomTemplates.label
											}
										</h3>
									</div>
									<div
										data-unitone-layout="responsive-grid -gap:-1"
										style={ {
											'--unitone--column-min-width':
												'400px',
										} }
									>
										{ postTypeWithCustomTemplates.customTemplates.map(
											( customTemplate ) => {
												const onChange = ( enable ) => {
													let newEnabledCustomTemplates =
														enable
															? [
																	...enabledCustomTemplates,
																	customTemplate.name,
															  ]
															: enabledCustomTemplates.filter(
																	( v ) =>
																		v !==
																		customTemplate.name
															  );
													newEnabledCustomTemplates =
														[
															...new Set(
																newEnabledCustomTemplates
															),
														];

													setSettings( {
														...settings,
														'enabled-custom-templates':
															newEnabledCustomTemplates,
													} );
												};

												return (
													<ToggleControl
														__nextHasNoMarginBottom
														key={
															customTemplate.name
														}
														label={
															customTemplate.title
														}
														checked={ enabledCustomTemplates.includes(
															customTemplate.name
														) }
														disabled={ usingCustomTemplates.includes(
															customTemplate.name
														) }
														onChange={ onChange }
														style={ {
															marginBottom: '0px',
														} }
													/>
												);
											}
										) }
									</div>
								</div>
							)
					) }
				</div>
				<div data-unitone-layout="cluster">
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
