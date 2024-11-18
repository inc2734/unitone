import { Button, RadioControl, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { sprintf, __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

export default function ( { settings, setSettings } ) {
	const [ pages, setPages ] = useState( [] );
	const [ isCreatedHomepage, setIsCreatedHomepage ] = useState( false );
	const [ isCreatedPostsPage, setIsCreatedPostsPage ] = useState( false );
	const [ homepagePattern, setHomepagePattern ] = useState( undefined );
	const [ shouldCreatePostsPage, setShouldCreatePostsPage ] =
		useState( false );
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const loadPages = () => {
		apiFetch( {
			path: addQueryArgs( '/wp/v2/pages', { parent: 0, per_page: -1 } ),
		} ).then( ( response ) => {
			setPages( response );
		} );
	};

	async function saveSettings() {
		setSettingsSaving( true );

		const newSettings = { ...settings };

		if ( !! homepagePattern && ! isCreatedHomepage ) {
			await apiFetch( {
				path: '/unitone/v1/homepage',
				method: 'POST',
				data: { pattern: homepagePattern },
			} ).then( ( response ) => {
				if ( !! response?.ID ) {
					setIsCreatedHomepage( true );

					setPages( [
						...[
							{
								id: response.ID,
								title: { rendered: response.post_title },
							},
						],
						...pages,
					] );

					setSettings( {
						...settings,
						'page-on-front': response.ID,
					} );

					newSettings[ 'page-on-front' ] = response.ID;
				}
			} );
		}

		if ( shouldCreatePostsPage && ! isCreatedPostsPage ) {
			await apiFetch( {
				path: '/unitone/v1/posts-page',
				method: 'POST',
			} ).then( ( response ) => {
				if ( !! response?.ID ) {
					setIsCreatedPostsPage( true );

					setPages( [
						...[
							{
								id: response.ID,
								title: { rendered: response.post_title },
							},
						],
						...pages,
					] );

					setSettings( {
						...settings,
						'page-for-posts': response.ID,
					} );

					newSettings[ 'page-for-posts' ] = response.ID;
				}
			} );
		}

		await apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'show-on-front': newSettings?.[ 'show-on-front' ] ?? null,
				'page-on-front': newSettings?.[ 'page-on-front' ] ?? null,
				'page-for-posts': newSettings?.[ 'page-for-posts' ] ?? null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	}

	const resetSettings = () => {
		setSettingsSaving( true );
		setSettings( {
			...settings,
			'show-on-front': 'posts',
			'page-on-front': undefined,
			'page-for-posts': undefined,
		} );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'show-on-front': 'posts',
				'page-on-front': null,
				'page-for-posts': null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	useEffect( () => {
		loadPages();
		setIsCreatedHomepage( window.currentSettings.hasHomepage );
		setIsCreatedPostsPage( window.currentSettings.hasPostsPage );
	}, [] );

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ { '--unitone--background-color': 'white' } }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'Your Homepage Displays', 'unitone' ) }</h2>
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
							<h3>{ __( 'Homepage Type', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<RadioControl
								label={ __(
									'Your Homepage Displays',
									'unitone'
								) }
								selected={ settings?.[ 'show-on-front' ] }
								options={ [
									{
										label: __( 'Latest Posts', 'unitone' ),
										value: 'posts',
									},
									{
										label: __( 'Static Page', 'unitone' ),
										value: 'page',
									},
								] }
								onChange={ ( newSetting ) => {
									if ( 'posts' === newSetting ) {
										setHomepagePattern( undefined );
										setShouldCreatePostsPage( false );
									}
									setSettings( {
										...settings,
										'show-on-front': newSetting,
									} );
								} }
							/>
						</div>
					</div>

					{ settings?.[ 'show-on-front' ] === 'page' && (
						<>
							<div
								data-unitone-layout="with-sidebar -sidebar:left"
								style={ { '--unitone--sidebar-width': '20em' } }
							>
								<div data-unitone-layout="stack">
									<h3>{ __( 'Homepage', 'unitone' ) }</h3>
								</div>
								<div data-unitone-layout="stack">
									{ ! isCreatedHomepage && (
										<>
											<div data-unitone-layout="responsive-grid -gap:1">
												<div className="unitone-settings-preview">
													<div className="unitone-settings-preview__frame">
														<img
															src={ `${ settings.templateDirectoryUri }/App/Controller/Manager/dist/img/1.jpg` }
															alt={ __(
																'Sample 1',
																'unitone'
															) }
														/>
													</div>
													<RadioControl
														selected={
															homepagePattern
														}
														options={ [
															{
																value: 'unitone/page/homepage-1',
																label: __(
																	'Sample 1',
																	'unitone'
																),
															},
														] }
														onChange={ (
															newSetting
														) => {
															setSettings( {
																...settings,
																'page-on-front': 0,
															} );
															setHomepagePattern(
																newSetting
															);
														} }
													/>
												</div>

												<div className="unitone-settings-preview">
													<div className="unitone-settings-preview__frame">
														<img
															src={ `${ settings.templateDirectoryUri }/App/Controller/Manager/dist/img/2.jpg` }
															alt={ __(
																'Sample 2',
																'unitone'
															) }
														/>
													</div>
													<RadioControl
														selected={
															homepagePattern
														}
														options={ [
															{
																value: 'unitone/page/homepage-2',
																label: __(
																	'Sample 2',
																	'unitone'
																),
															},
														] }
														onChange={ (
															newSetting
														) => {
															setSettings( {
																...settings,
																'page-on-front': 0,
															} );
															setHomepagePattern(
																newSetting
															);
														} }
													/>
												</div>

												<div className="unitone-settings-preview">
													<div className="unitone-settings-preview__frame"></div>
													<RadioControl
														selected={
															homepagePattern
														}
														options={ [
															{
																value: 'blank',
																label: __(
																	'Blank',
																	'unitone'
																),
															},
														] }
														onChange={ (
															newSetting
														) => {
															setSettings( {
																...settings,
																'page-on-front': 0,
															} );
															setHomepagePattern(
																newSetting
															);
														} }
													/>
												</div>
											</div>

											<div className="unitone-settings-or">
												or
											</div>
										</>
									) }

									<SelectControl
										__nextHasNoMarginBottom
										label={ __(
											'Select existing page for the homepage',
											'unitone'
										) }
										value={ settings?.[ 'page-on-front' ] }
										options={ [
											...[
												{
													label: __(
														'— Select —',
														'unitone'
													),
													value: 0,
												},
											],
											...pages.map( ( page ) => {
												return {
													label:
														page?.title?.rendered ||
														sprintf(
															/* translators: %1$s: Post ID */
															__(
																`#%1$s (No title)`,
																'unitone'
															),
															page.id
														),
													value: page.id,
												};
											} ),
										] }
										onChange={ ( newSetting ) => {
											setHomepagePattern( undefined );
											setSettings( {
												...settings,
												'page-on-front': newSetting,
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
									<h3>{ __( 'Posts Page', 'unitone' ) }</h3>
								</div>
								<div data-unitone-layout="stack">
									{ ! isCreatedPostsPage && (
										<>
											<RadioControl
												selected={
													!! shouldCreatePostsPage
												}
												options={ [
													{
														value: true,
														label: __(
															'Create new page for the posts page',
															'unitone'
														),
													},
												] }
												onChange={ ( newSetting ) => {
													setSettings( {
														...settings,
														'page-for-posts': 0,
													} );
													setShouldCreatePostsPage(
														newSetting
													);
												} }
											/>

											<div className="unitone-settings-or">
												or
											</div>
										</>
									) }

									<SelectControl
										__nextHasNoMarginBottom
										label={ __(
											'Select existing page for the posts page',
											'unitone'
										) }
										value={ settings?.[ 'page-for-posts' ] }
										options={ [
											...[
												{
													label: __(
														'— Select —',
														'unitone'
													),
													value: 0,
												},
											],
											...pages.map( ( page ) => {
												return {
													label:
														page?.title?.rendered ||
														sprintf(
															/* translators: %1$s: Post ID */
															__(
																`#%1$s (No title)`,
																'unitone'
															),
															page.id
														),
													value: page.id,
												};
											} ),
										] }
										onChange={ ( newSetting ) => {
											setShouldCreatePostsPage( false );
											setSettings( {
												...settings,
												'page-for-posts': newSetting,
											} );
										} }
									/>
								</div>
							</div>
						</>
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
