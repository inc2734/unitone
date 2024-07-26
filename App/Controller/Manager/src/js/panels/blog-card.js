import { Button, RadioControl } from '@wordpress/components';

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
				'wp-oembed-blog-card-style':
					settings?.[ 'wp-oembed-blog-card-style' ] ?? null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( true );
		setSettings( {
			...settings,
			'wp-oembed-blog-card-style':
				defaultSettings[ 'wp-oembed-blog-card-style' ],
		} );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'wp-oembed-blog-card-style': null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	const BlogCard = ( { value } ) => (
		<>
			{ 'default' !== value && null != value && (
				<link
					rel="stylesheet"
					href={ `${ window.currentSettings.templateDirectoryUri }/dist/css/wp-oembed-blog-card/${ value }.css` }
				/>
			) }

			<figure className="wp-block-embed is-type-rich is-provider-wp-oembed-blog-card wp-block-embed-wp-oembed-blog-card">
				<div className="wp-block-embed__wrapper">
					<div
						className="wp-oembed-blog-card"
						style={ {
							'--wp--preset--color--unitone-accent':
								settings?.[ 'accent-color' ],
							'--wp--preset--color--unitone-text':
								settings?.styles?.color?.text,
							'--wp--preset--color--unitone-text-alt':
								settings?.styles?.color?.background,
						} }
					>
						<span>
							<div className="wp-oembed-blog-card__figure">
								<img
									decoding="async"
									src={ `${ window.currentSettings.templateDirectoryUri }/dist/img/stocksnap_lgg8nat9jy.jpg` }
									alt=""
								/>
							</div>
							<div className="wp-oembed-blog-card__body">
								<div className="wp-oembed-blog-card__content">
									<div className="wp-oembed-blog-card__title">
										unitone ブロック – WordPress テーマ
										unitone
									</div>
									<div className="wp-oembed-blog-card__description">
										美しいタイポグラフィと自由なレイアウトをノーコードで。
									</div>
								</div>
								<div className="wp-oembed-blog-card__domain">
									<img
										decoding="async"
										className="wp-oembed-blog-card__favicon"
										src="https://unitone.2inc.org/wp-content/uploads/2022/11/site-logo-100x100.png"
										alt=""
									/>
									<span className="wp-oembed-blog-card__domain-text">
										unitone.2inc.org
									</span>
								</div>
							</div>
						</span>
					</div>
				</div>
			</figure>
		</>
	);

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ { '--unitone--background-color': 'white' } }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'Blog Card', 'unitone' ) }</h2>
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
							<h3>{ __( 'Style', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<div data-unitone-layout="stack -gap:-2">
								<RadioControl
									selected={
										settings?.[
											'wp-oembed-blog-card-style'
										]
									}
									options={ [
										{
											label: __( 'Default', 'unitone' ),
											value: 'default',
										},
										{
											label: __(
												'Background color (Accent color)',
												'unitone'
											),
											value: 'bgcolor-accent',
										},
										{
											label: __(
												'Border (Accent color)',
												'unitone'
											),
											value: 'border-accent',
										},
										{
											label: __( 'Dark', 'unitone' ),
											value: 'dark',
										},
										{
											label: __( 'Media', 'unitone' ),
											value: 'media',
										},
										{
											label: __( 'Simple', 'unitone' ),
											value: 'simple',
										},
									] }
									onChange={ ( newSetting ) =>
										setSettings( {
											...settings,
											'wp-oembed-blog-card-style':
												newSetting,
										} )
									}
								/>
							</div>

							<div data-unitone-layout="-root:typography">
								<div data-unitone-layout="-typography:em">
									<BlogCard
										value={
											settings?.[
												'wp-oembed-blog-card-style'
											]
										}
									/>
								</div>
							</div>
						</div>
					</div>
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
